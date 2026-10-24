/**
 * Intelligent Azure CLI & PowerShell Command Validator
 * Handles flag permutations, quotes, line continuation backticks, short flags, and case differences.
 */

// Mapping of common short flags to standard long flags
const FLAG_ALIASES = {
  '-g': '--resource-group',
  '-n': '--name',
  '-l': '--location',
  '-o': '--output',
  '-s': '--subscription',
  '-r': '--registry',
  '-i': '--image',
  '-t': '--image',
  '-w': '--workspace',
  '-f': '--follow',
  '-y': '--yes',
  '--rg': '--resource-group',
  '--write-enable': '--write-enabled'
};

/**
 * Clean and standardize raw command input
 */
export function normalizeCommandText(cmd) {
  if (!cmd) return '';
  return cmd
    .replace(/`\s*[\r\n]+/g, ' ') // Remove PowerShell backtick line continuations
    .replace(/\\\s*[\r\n]+/g, ' ') // Remove Bash backslash line continuations
    .replace(/[\r\n]+/g, ' ')     // Convert remaining newlines to space
    .replace(/\s+/g, ' ')         // Collapse multiple spaces into one
    .replace(/(^|\s)-([a-zA-Z]{2,}[a-zA-Z0-9\-]*)/g, '$1--$2') // Auto-repair single-dash long flags (e.g. -use-device-code eaten by Vietnamese IME)
    .trim();
}

/**
 * Parse a command string into components:
 * - assignmentVar (if any, like "$PRINCIPAL_ID =" or "$env:ACR_NAME =")
 * - program & verbs (like "az acr create")
 * - options (flags and their values)
 * - positional arguments
 */
export function parseCliCommand(rawCmd) {
  const normalized = normalizeCommandText(rawCmd);
  if (!normalized) return null;

  let cmdToParse = normalized;
  let assignment = null;

  // Check for variable assignment: e.g. $PRINCIPAL_ID = az ... or $env:ACR_NAME = ...
  const assignMatch = cmdToParse.match(/^(\$[a-zA-Z0-9_:]+)\s*=\s*(.*)$/);
  if (assignMatch) {
    assignment = assignMatch[1];
    cmdToParse = assignMatch[2].trim();
  }

  // Tokenize considering single and double quotes
  const tokens = [];
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  let match;
  while ((match = regex.exec(cmdToParse)) !== null) {
    // match[0] has quotes if matched quotes, match[1] double quotes content, match[2] single quotes content
    const token = match[1] !== undefined ? match[1] : (match[2] !== undefined ? match[2] : match[0]);
    tokens.push(token);
  }

  if (tokens.length === 0) return null;

  const baseWords = [];
  const flags = {};
  const positionals = [];

  let i = 0;
  // Collect program and verbs until first flag or argument
  while (i < tokens.length && !tokens[i].startsWith('-') && !tokens[i].startsWith('$env:')) {
    // If it's a known CLI command or dot-sourcing
    baseWords.push(tokens[i]);
    i++;
    // Usually az + service + subservice + action has 2 to 4 words
    if (baseWords[0] === 'az' && baseWords.length >= 4) {
      break;
    }
  }

  // Parse flags & parameters
  while (i < tokens.length) {
    const token = tokens[i];
    if (token.startsWith('-')) {
      let canonicalFlag = FLAG_ALIASES[token] || token;
      // Auto-correct single-dash long flags (e.g. -use-device-code caused by Vietnamese IME eating a dash)
      if (canonicalFlag.startsWith('-') && !canonicalFlag.startsWith('--') && canonicalFlag.length > 2) {
        canonicalFlag = '-' + canonicalFlag;
      }
      // Check if next token is a value or another flag
      const nextToken = tokens[i + 1];
      if (nextToken !== undefined && !nextToken.startsWith('-')) {
        flags[canonicalFlag] = nextToken;
        i += 2;
      } else {
        // Boolean flag (e.g., --is-linux, --no-logs)
        flags[canonicalFlag] = true;
        i += 1;
      }
    } else {
      positionals.push(token);
      i += 1;
    }
  }

  return {
    raw: normalized,
    assignment,
    base: baseWords.join(' ').toLowerCase(),
    flags,
    positionals
  };
}

/**
 * Compare expected flag value with user value, supporting literal placeholders
 * e.g. <app-name>, <rg>, <port>, <VAR_NAME>, <registry>/<repo>@sha256:<digest>
 */
function matchesExpectedValue(expectedVal, userVal) {
  const cleanExp = String(expectedVal).replace(/^["']|["']$/g, '').toLowerCase().trim();
  const cleanUser = String(userVal).replace(/^["']|["']$/g, '').toLowerCase().trim();

  if (cleanExp === cleanUser) {
    return true;
  }

  // Handle generic single placeholder e.g. <app-name>, <rg>, <port>, <var_name>, <revision-name>, <env-name>, <digest>
  if (/^<[a-zA-Z0-9_\-]+>$/.test(cleanExp)) {
    // User provided any non-empty identifier that doesn't start with '-'
    return cleanUser.length > 0 && !cleanUser.startsWith('-');
  }

  // Handle composite image digest placeholder: <registry>/<repo>@sha256:<digest>
  if (cleanExp.includes('@sha256:')) {
    if (cleanUser.includes('@sha256:') || cleanUser === cleanExp) {
      return true;
    }
  }

  // Handle composite env var placeholder: <var_name>=<value>
  if (cleanExp.includes('=')) {
    if (cleanUser.includes('=') || cleanUser === cleanExp) {
      return true;
    }
  }

  // Handle shell variables like $WORKSPACE_ID vs $env:WORKSPACE_ID or literal GUID
  if (cleanExp.startsWith('$')) {
    if (cleanUser.startsWith('$') || /^[0-9a-fA-F-]{36}$/.test(cleanUser)) {
      return true;
    }
  }

  // Handle queries with placeholder inside like ContainerAppConsoleLogs_CL | where ContainerAppName_s == '<app-name>'
  if (cleanExp.includes('<') && cleanExp.includes('>')) {
    const regexPattern = '^' + cleanExp
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/<[^>]+>/g, '[a-zA-Z0-9_\\-$.:]+')
      + '$';
    try {
      const reg = new RegExp(regexPattern, 'i');
      if (reg.test(cleanUser)) {
        return true;
      }
    } catch {
      // fallback
    }
  }

  return false;
}

/**
 * Validate a user command against an expected command definition
 */
export function validateCommand(userInput, challenge) {
  const cleanedInput = normalizeCommandText(userInput);
  const expectedNormalized = normalizeCommandText(challenge.expectedCommand);

  if (!cleanedInput) {
    return {
      isValid: false,
      message: 'Vui lòng nhập câu lệnh của bạn vào terminal.'
    };
  }

  // Exact match shortcut
  if (cleanedInput.toLowerCase() === expectedNormalized.toLowerCase()) {
    return { isValid: true, message: 'Chính xác hoàn hảo! Chuẩn cú pháp Azure CLI.' };
  }

  // Check defined aliases if any
  if (challenge.aliases && challenge.aliases.length > 0) {
    for (const alias of challenge.aliases) {
      if (cleanedInput.toLowerCase() === normalizeCommandText(alias).toLowerCase()) {
        return { isValid: true, message: 'Chính xác! Câu lệnh hợp lệ.' };
      }
    }
  }

  // Parse both commands
  const userParsed = parseCliCommand(cleanedInput);
  const expectedParsed = parseCliCommand(expectedNormalized);

  if (!userParsed || !expectedParsed) {
    return { isValid: false, message: 'Không thể phân tích cú pháp câu lệnh.' };
  }

  // Check variable assignment
  if (expectedParsed.assignment) {
    if (!userParsed.assignment) {
      return {
        isValid: false,
        message: `Bạn cần gán kết quả vào biến ${expectedParsed.assignment} (ví dụ: \`${expectedParsed.assignment} = ...\`).`
      };
    }
    if (userParsed.assignment.toLowerCase() !== expectedParsed.assignment.toLowerCase()) {
      return {
        isValid: false,
        message: `Tên biến chưa chính xác: cần gán vào \`${expectedParsed.assignment}\`, hiện tại là \`${userParsed.assignment}\`.`
      };
    }
  }

  // Check base command / verb
  if (userParsed.base !== expectedParsed.base) {
    // If user forgot 'az'
    if (!userParsed.base.startsWith('az') && expectedParsed.base.startsWith('az')) {
      return {
        isValid: false,
        message: 'Câu lệnh phải bắt đầu bằng từ khóa `az` (Azure CLI).'
      };
    }
    return {
      isValid: false,
      message: `Nhóm lệnh hoặc hành động chưa đúng. Bạn đã nhập: \`${userParsed.base}\`, kỳ vọng: \`${expectedParsed.base}\`.`
    };
  }

  // Check expected flags
  for (const [flag, expectedVal] of Object.entries(expectedParsed.flags)) {
    if (!(flag in userParsed.flags)) {
      // Check if user entered a single-dash letter prefix caused by Vietnamese IME eating a dash (e.g. -u instead of --use-device-code)
      if (flag.startsWith('--')) {
        const shortPrefix = '-' + flag.charAt(2);
        if (shortPrefix in userParsed.flags) {
          return {
            isValid: false,
            message: `Bạn đang nhập \`${shortPrefix}\`. Có vẻ bộ gõ tiếng Việt (UniKey/EVKey) đã vô tình xóa mất 1 dấu \`-\` khi bạn gõ \`${flag}\`. Hãy nhấn phím <kbd>Tab ↹</kbd> hoặc click vào gợi ý token bên trái để hoàn tất câu lệnh nhé!`
          };
        }
      }

      return {
        isValid: false,
        message: `Bạn đang thiếu tham số quan trọng: \`${flag}\`.`
      };
    }

    const userVal = userParsed.flags[flag];

    // Boolean flag comparison
    if (typeof expectedVal === 'boolean') {
      if (userVal !== expectedVal) {
        return {
          isValid: false,
          message: `Cờ \`${flag}\` phải được thiết lập là \`${expectedVal}\`.`
        };
      }
    } else {
      // String value comparison (strip outer quotes and support placeholders)
      if (!matchesExpectedValue(expectedVal, userVal)) {
        return {
          isValid: false,
          message: `Giá trị của cờ \`${flag}\` chưa khớp. Bạn nhập: \`${userVal}\`, kỳ vọng: \`${expectedVal}\`.`
        };
      }
    }
  }

  // Check unexpected extra flags
  const expectedFlagKeys = Object.keys(expectedParsed.flags);
  const extraFlags = Object.keys(userParsed.flags).filter(f => !expectedFlagKeys.includes(f));
  if (extraFlags.length > 0) {
    return {
      isValid: false,
      message: `Câu lệnh có tham số không cần thiết: \`${extraFlags.join(', ')}\`.`
    };
  }

  return {
    isValid: true,
    message: 'Chính xác! Bạn đã nắm vững cú pháp câu lệnh này.'
  };
}

import React, { useState } from "react";
import { LEVELS, CHALLENGES } from "../data/challenges";
import { validateCommand } from "../utils/commandValidator";

export default function Terminal() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [inputCommand, setInputCommand] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const levelChallenges = CHALLENGES.filter((c) => c.level === currentLevel);
  const currentChallenge = levelChallenges[currentChallengeIndex] || levelChallenges[0];

  const handleLevelChange = (lvlId) => {
    setCurrentLevel(lvlId);
    setCurrentChallengeIndex(0);
    setInputCommand("");
    setFeedback(null);
    setShowHint(false);
  };

  const handleSelectChallenge = (idx) => {
    setCurrentChallengeIndex(idx);
    setInputCommand("");
    setFeedback(null);
    setShowHint(false);
  };

  const handleExecute = (e) => {
    e.preventDefault();
    if (!inputCommand.trim() || !currentChallenge) return;

    const result = validateCommand(inputCommand, currentChallenge);
    setFeedback(result);

    setHistory((prev) => [
      ...prev,
      {
        cmd: inputCommand,
        isValid: result.isValid,
        message: result.message,
        simulated: result.isValid ? currentChallenge.simulatedOutput : null,
      },
    ]);

    if (result.isValid) {
      setInputCommand("");
    }
  };

  const currentLevelObj = LEVELS.find((l) => l.id === currentLevel) || LEVELS[0];

  return (
    <div className="terminal-practice-component">
      {/* Level Selector Bar */}
      <div className="levels-navbar" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
        {LEVELS.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => handleLevelChange(lvl.id)}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: currentLevel === lvl.id ? lvl.color : "#333",
              background: currentLevel === lvl.id ? `${lvl.color}22` : "#161b22",
              color: currentLevel === lvl.id ? lvl.color : "#8b949e",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span>{lvl.icon}</span> {lvl.name}
          </button>
        ))}
      </div>

      {/* Challenge Navigator Pills */}
      <div className="challenge-pills-bar" style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {levelChallenges.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => handleSelectChallenge(idx)}
            style={{
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              border: idx === currentChallengeIndex ? "1px solid #00d2ff" : "1px solid #30363d",
              background: idx === currentChallengeIndex ? "#00d2ff22" : "#0d1117",
              color: idx === currentChallengeIndex ? "#00d2ff" : "#8b949e",
              cursor: "pointer",
            }}
          >
            Bài {idx + 1}
          </button>
        ))}
      </div>

      {currentChallenge && (
        <div className="challenge-box" style={{ background: "#161b22", borderRadius: "10px", padding: "18px", border: "1px solid #30363d", marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", background: "#388bfd22", color: "#58a6ff", padding: "2px 8px", borderRadius: "4px" }}>
              {currentChallenge.category}
            </span>
            <span style={{ fontSize: "12px", color: "#8b949e" }}>Độ khó: {currentChallenge.difficulty}</span>
          </div>

          <h3 style={{ margin: "0 0 8px 0", color: "#f0f6fc", fontSize: "18px" }}>{currentChallenge.title}</h3>
          <p style={{ margin: "0 0 14px 0", color: "#c9d1d9", lineHeight: "1.6" }}>{currentChallenge.mission}</p>

          {/* Quick Token Suggestions */}
          {currentChallenge.tokens && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
              {currentChallenge.tokens.map((token, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputCommand((prev) => (prev ? `${prev} ${token}` : token))}
                  style={{
                    fontFamily: "monospace",
                    fontSize: "11px",
                    padding: "3px 8px",
                    background: "#21262d",
                    border: "1px solid #30363d",
                    borderRadius: "4px",
                    color: "#79c0ff",
                    cursor: "pointer",
                  }}
                >
                  +{token}
                </button>
              ))}
            </div>
          )}

          {/* Hint Trigger */}
          <div style={{ marginBottom: "12px" }}>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              style={{ background: "transparent", border: "none", color: "#e3b341", fontSize: "13px", cursor: "pointer", padding: 0 }}
            >
              💡 {showHint ? "Ẩn gợi ý" : "Xem gợi ý"}
            </button>
            {showHint && currentChallenge.hints && (
              <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", color: "#d29922", fontSize: "13px" }}>
                {currentChallenge.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Interactive Command Line Terminal */}
      <div
        className="terminal-shell"
        style={{
          background: "#0d1117",
          border: "1px solid #30363d",
          borderRadius: "8px",
          overflow: "hidden",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <div
          className="terminal-header"
          style={{ background: "#161b22", padding: "8px 12px", borderBottom: "1px solid #30363d", display: "flex", gap: "6px" }}
        >
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56", display: "inline-block" }}></span>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e", display: "inline-block" }}></span>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f", display: "inline-block" }}></span>
          <span style={{ marginLeft: "8px", fontSize: "12px", color: "#8b949e" }}>PowerShell (Azure CLI Sandbox)</span>
        </div>

        <div className="terminal-body" style={{ padding: "14px", minHeight: "160px" }}>
          {history.map((item, idx) => (
            <div key={idx} style={{ marginBottom: "12px" }}>
              <div style={{ color: "#79c0ff" }}>
                <span style={{ color: "#7ee787" }}>PS &gt; </span>
                {item.cmd}
              </div>
              <div style={{ color: item.isValid ? "#7ee787" : "#ff7b72", fontSize: "13px", marginTop: "4px" }}>
                {item.isValid ? "✓ " : "✗ "}
                {item.message}
              </div>
              {item.simulated && (
                <pre style={{ background: "#161b22", padding: "10px", borderRadius: "6px", color: "#c9d1d9", fontSize: "12px", overflowX: "auto" }}>
                  {item.simulated}
                </pre>
              )}
            </div>
          ))}

          {/* Prompt line */}
          <form onSubmit={handleExecute} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#7ee787" }}>PS &gt;</span>
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              placeholder="Nhập câu lệnh az hoặc PowerShell tại đây..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#f0f6fc",
                fontFamily: "inherit",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#238636",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 14px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Chạy Lệnh ↵
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

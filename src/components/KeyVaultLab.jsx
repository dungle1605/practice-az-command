import React, { useState } from "react";
import {
  KEYVAULT_CATEGORIES,
  KEYVAULT_OPERATIONS,
  ARCHITECTURE_MATRIX,
  RBAC_ROLES_GUIDE,
  INITIAL_SIMULATOR_CONFIG
} from "../data/appConfigData";

export default function KeyVaultLab() {
  const [activeSubTab, setActiveSubTab] = useState("catalog"); // "catalog" | "architecture" | "simulator"
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Simulator state
  const [currentLabel, setCurrentLabel] = useState("Production"); // "\0", "Staging", "Production"
  const [sentinelVersion, setSentinelVersion] = useState(1);
  const [resolveKeyVault, setResolveKeyVault] = useState(true);
  const [simulatorLogs, setSimulatorLogs] = useState([
    `[${new Date().toLocaleTimeString()}] [INIT] App booted. Loaded unlabelled settings (\\0) as base defaults.`,
    `[${new Date().toLocaleTimeString()}] [STACK] Applied label 'Production' overrides: OpenAI:Model -> 'gpt-4o', Pipeline:BatchSize -> '200'`,
    `[${new Date().toLocaleTimeString()}] [KEYVAULT] Resolved Key Vault Reference 'OpenAI:ApiKey' via Entra ID SecretClient.`,
    `[${new Date().toLocaleTimeString()}] [READY] Sentinel watchdog active on key 'Sentinel' (Revision: 1). Zero-downtime dynamic refresh ready.`
  ]);
  const [simulatedBatchSize, setSimulatedBatchSize] = useState(200);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredOperations = KEYVAULT_OPERATIONS.filter((op) => {
    const matchesCategory = selectedCategory === "all" || op.category === selectedCategory;
    const matchesSearch =
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.cliCommand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.pythonEquivalent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBumpSentinel = () => {
    const nextVer = sentinelVersion + 1;
    const newBatch = simulatedBatchSize === 200 ? 500 : 200;
    setSentinelVersion(nextVer);
    setSimulatedBatchSize(newBatch);
    const time = new Date().toLocaleTimeString();
    setSimulatorLogs((prev) => [
      `[${time}] [STORE] Admin updated 'Pipeline:BatchSize' -> '${newBatch}' (label: Production)`,
      `[${time}] [STORE] Admin bumped 'Sentinel' -> '${nextVer}' in Azure App Configuration Store`,
      ...prev.slice(0, 8)
    ]);
  };

  const handleTriggerRefresh = () => {
    setIsRefreshing(true);
    const time = new Date().toLocaleTimeString();
    setTimeout(() => {
      setIsRefreshing(false);
      setSimulatorLogs((prev) => [
        `[${time}] [PROVIDER] provider.refresh() invoked. Sentinel check passed: Revision is ${sentinelVersion}.`,
        `[${time}] [DYNAMIC RELOAD] ✅ Config reloaded atomically! Pipeline:BatchSize is now ${simulatedBatchSize}. App DID NOT restart.`,
        ...prev.slice(0, 8)
      ]);
    }, 400);
  };

  // Compute live active configuration based on label and options
  const getComputedConfig = () => {
    const base = { ...INITIAL_SIMULATOR_CONFIG.defaultSettings };
    base["Sentinel"] = String(sentinelVersion);

    if (currentLabel === "Production") {
      Object.assign(base, INITIAL_SIMULATOR_CONFIG.productionOverrides);
      base["Pipeline:BatchSize"] = String(simulatedBatchSize);
    } else if (currentLabel === "Staging") {
      Object.assign(base, INITIAL_SIMULATOR_CONFIG.stagingOverrides);
    }

    if (resolveKeyVault) {
      base["OpenAI:ApiKey"] = INITIAL_SIMULATOR_CONFIG.resolvedKeyVaultSecrets["https://kv-ai200-prod.vault.azure.net/secrets/openai-api-key"];
    } else {
      base["OpenAI:ApiKey"] = "[Key Vault Ref: Unresolved (secretId: https://...)]";
    }

    return base;
  };

  const activeConfig = getComputedConfig();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/50 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🔐</span>
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Azure Key Vault & App Configuration Specialist Lab
              </h2>
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Level 12 • Secrets, Labels & Dynamic Refresh
              </span>
            </div>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Thực hành cấu hình bảo mật tập trung cho giải pháp AI: Tách biệt quản lý cấu hình phân tầng (<strong>Label Stacking</strong>) trong <strong>Azure App Configuration</strong> và bí mật nhạy cảm (API Keys, Connection Strings) trong <strong>Azure Key Vault</strong> chuẩn RBAC Data Plane, hỗ trợ <strong>Sentinel Dynamic Refresh</strong> không cần restart ứng dụng.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/60 self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab("catalog")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === "catalog"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              📋 Danh Mục Thao Tác
            </button>
            <button
              onClick={() => setActiveSubTab("architecture")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === "architecture"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              ⚖️ Ma Trận Kiến Trúc & RBAC
            </button>
            <button
              onClick={() => setActiveSubTab("simulator")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeSubTab === "simulator"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              🔄 Mô Phỏng Sentinel Refresh
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: OPERATIONS CATALOG */}
      {activeSubTab === "catalog" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
              {KEYVAULT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <input
                type="text"
                placeholder="Tìm lệnh CLI, SDK, role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Operations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredOperations.map((op) => (
              <div
                key={op.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all shadow-lg hover:shadow-emerald-950/20 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {op.title}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${op.badgeColor}`}
                    >
                      {op.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{op.summary}</p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="text-purple-400 font-semibold">Quyền RBAC:</span>
                    <code className="bg-slate-950 px-2 py-0.5 rounded text-purple-300 border border-purple-900/40">
                      {op.rbacRole}
                    </code>
                  </div>

                  {/* Azure CLI Command */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-cyan-400 flex items-center gap-1">
                        <span>⚡</span> Azure CLI Command
                      </span>
                      <button
                        onClick={() => handleCopy(op.cliCommand, `${op.id}-cli`)}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedId === `${op.id}-cli` ? (
                          <span className="text-emerald-400 font-bold">✓ Đã chép</span>
                        ) : (
                          "Sao chép"
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-950/90 rounded-lg p-3 font-mono text-[11px] text-cyan-300 border border-slate-800/80 overflow-x-auto">
                      <code>{op.cliCommand}</code>
                    </div>
                  </div>

                  {/* Python SDK Equivalent */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-amber-400 flex items-center gap-1">
                        <span>🐍</span> Python SDK Equivalent
                      </span>
                      <button
                        onClick={() => handleCopy(op.pythonEquivalent, `${op.id}-py`)}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        {copiedId === `${op.id}-py` ? (
                          <span className="text-emerald-400 font-bold">✓ Đã chép</span>
                        ) : (
                          "Sao chép"
                        )}
                      </button>
                    </div>
                    <pre className="bg-slate-950/90 rounded-lg p-3 font-mono text-[11px] text-amber-200/90 border border-slate-800/80 overflow-x-auto whitespace-pre-wrap">
                      {op.pythonEquivalent}
                    </pre>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400/90 flex items-start gap-1.5">
                  <span className="mt-0.5">💡</span>
                  <span><strong>AI-200 Best Practice:</strong> {op.bestPractice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ARCHITECTURE & RBAC MATRIX */}
      {activeSubTab === "architecture" && (
        <div className="space-y-8">
          {/* Comparison Matrix */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>⚖️</span> So Sánh 4 Phương Pháp Quản Lý Cấu Hình & Bí Mật
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Lựa chọn kiến trúc tối ưu giữa Azure App Configuration, Key Vault, App Service Settings và tệp .env cục bộ.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="p-3">Tiêu chí</th>
                    <th className="p-3 text-sky-400">Azure App Configuration</th>
                    <th className="p-3 text-emerald-400">Azure Key Vault</th>
                    <th className="p-3 text-purple-400">App Service / ACA Settings</th>
                    <th className="p-3 text-rose-400">Local .env File</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-normal">
                  {ARCHITECTURE_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-white whitespace-nowrap">{row.feature}</td>
                      <td className="p-3 text-sky-200/90">{row.appConfig}</td>
                      <td className="p-3 text-emerald-200/90">{row.keyVault}</td>
                      <td className="p-3 text-purple-200/90">{row.appSettings}</td>
                      <td className="p-3 text-rose-300/90">{row.localEnv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RBAC Data Plane Guide */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🛡️</span> Bảng Vai Trò Phân Quyền Microsoft Entra ID RBAC Chuẩn
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Các vai trò Data Plane bắt buộc gán cho kỹ sư vận hành và Managed Identity của ứng dụng lúc runtime.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="p-3">Tên vai trò (Role Name)</th>
                    <th className="p-3">Phạm vi (Scope)</th>
                    <th className="p-3">Quyền hạn (Permissions)</th>
                    <th className="p-3">Đối tượng gán quyền (Target Identity)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {RBAC_ROLES_GUIDE.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-emerald-400 font-sans">{r.role}</td>
                      <td className="p-3 text-slate-400">{r.scope}</td>
                      <td className="p-3 text-slate-200 font-sans">{r.permissions}</td>
                      <td className="p-3 text-purple-300 font-sans">{r.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Two Security Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <span>🛡️</span> Soft-Delete & Purge Protection
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mọi Key Vault trên Azure hiện nay đều được <strong>bật sẵn Soft-Delete</strong> (lưu giữ 90 ngày). Nếu vô tình xóa vault, bạn có thể phục hồi bằng lệnh <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded">az keyvault recover</code>. Khi kích hoạt thêm <strong>Purge Protection</strong>, không ai (kể cả Subscription Owner) có thể xóa vĩnh viễn kho bí mật trước khi hết thời gian 90 ngày, loại bỏ hoàn toàn nguy cơ tấn công tống tiền Ransomware.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <span>⚡</span> In-Memory Caching & Phòng Ngừa Lỗi 429 Throttling
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Azure Key Vault áp dụng giới hạn số lượng giao dịch nghiêm ngặt (service limits). Việc ứng dụng gọi API Key Vault trên mỗi HTTP request của khách hàng sẽ nhanh chóng gây ra lỗi <strong>HTTP 429 Too Many Requests</strong>. Giải pháp chuẩn AI-200 là cache secret trong bộ nhớ RAM (TTL 30 - 300 giây) hoặc sử dụng <strong>Azure App Configuration Provider</strong> tự động giải mã và cache.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: INTERACTIVE SENTINEL REFRESH SIMULATOR */}
      {activeSubTab === "simulator" && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🔄</span> Trình Mô Phỏng Sentinel Dynamic Refresh & Label Stacking
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Trải nghiệm cách <strong>Label Stacking</strong> xếp đè cấu hình môi trường và cách <strong>Sentinel Key</strong> kích hoạt nạp lại cấu hình nguyên tử mà không cần khởi động lại container!
              </p>
            </div>

            {/* Interactive Control Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              {/* Label Selector */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                  🏷️ Môi Trường (Label Filter):
                </label>
                <div className="flex gap-2">
                  {["\\0 (Default)", "Staging", "Production"].map((lbl) => {
                    const clean = lbl.includes("Default") ? "\\0" : lbl;
                    return (
                      <button
                        key={lbl}
                        onClick={() => setCurrentLabel(clean)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          currentLabel === clean
                            ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                            : "bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {lbl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Key Vault Toggle */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-medium">
                  🔗 Giải Mã Key Vault Reference:
                </label>
                <button
                  onClick={() => setResolveKeyVault(!resolveKeyVault)}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    resolveKeyVault
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/50"
                      : "bg-slate-900 text-slate-400 border border-slate-800"
                  }`}
                >
                  <span>{resolveKeyVault ? "✅ Đang bật (Resolved)" : "❌ Đang tắt (Unresolved)"}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-end gap-2">
                <button
                  onClick={handleBumpSentinel}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-all shadow-md shadow-amber-600/20"
                >
                  ⚡ Sửa Setting & Tăng Sentinel ({sentinelVersion})
                </button>
                <button
                  onClick={handleTriggerRefresh}
                  disabled={isRefreshing}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isRefreshing ? "Đang reload..." : "🔄 provider.refresh()"}
                </button>
              </div>
            </div>

            {/* Side-by-side Configuration & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration Dictionary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>📦</span> Active In-Memory Configuration (Python Dictionary)
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    Label: {currentLabel}
                  </span>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs border border-slate-800/80 space-y-2 max-h-80 overflow-y-auto">
                  {Object.entries(activeConfig).map(([k, v]) => (
                    <div
                      key={k}
                      className={`flex items-start justify-between p-2 rounded ${
                        k === "Sentinel"
                          ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                          : k === "OpenAI:ApiKey"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                          : "bg-slate-900/60 border border-slate-850 text-slate-300"
                      }`}
                    >
                      <span className="font-bold text-sky-400">{k}</span>
                      <span className="font-mono text-right ml-4 text-[11px] break-all">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Execution Logs Terminal */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span>💻</span> Runtime Dynamic Refresh Console Log
                </span>

                <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs border border-slate-800/80 h-80 overflow-y-auto flex flex-col justify-end space-y-1.5 text-slate-400">
                  {simulatorLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={`text-[11px] leading-relaxed ${
                        log.includes("DYNAMIC RELOAD")
                          ? "text-emerald-400 font-semibold"
                          : log.includes("Sentinel bumped")
                          ? "text-amber-300"
                          : log.includes("KEYVAULT")
                          ? "text-cyan-300"
                          : "text-slate-400"
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useState } from "react";
import {
  REDIS_CATEGORIES,
  REDIS_COMMANDS,
  REDIS_EVICTION_POLICIES,
  REDIS_VS_POSTGRES_VECTOR
} from "../data/redisCommands";

export default function RedisLab() {
  const [activeSubTab, setActiveSubTab] = useState("commands"); // "commands" | "comparison" | "simulator"
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Simulator state
  const [simulatorIndex, setSimulatorIndex] = useState(0);
  const [customCommand, setCustomCommand] = useState(REDIS_COMMANDS[0].command);
  const [simulatorOutput, setSimulatorOutput] = useState(REDIS_COMMANDS[0].simulatedOutput);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStats, setExecutionStats] = useState({
    latencyMs: "0.18",
    dataStructure: "String / TLS Socket",
    memoryUsage: "48 bytes"
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCommands = REDIS_COMMANDS.filter((cmd) => {
    const matchesCategory = selectedCategory === "all" || cmd.category === selectedCategory;
    const matchesSearch =
      cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.pythonEquivalent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectSimulatorPreset = (idx) => {
    setSimulatorIndex(idx);
    const item = REDIS_COMMANDS[idx];
    setCustomCommand(item.command);
    setSimulatorOutput(item.simulatedOutput);

    // Dynamic stats based on command type
    if (item.id === "redis-ft-search-knn" || item.id === "redis-ft-search-hybrid") {
      setExecutionStats({ latencyMs: "0.82", dataStructure: "RediSearch HNSW Index", memoryUsage: "12.50 MB" });
    } else if (item.id === "redis-ft-create-vector-index") {
      setExecutionStats({ latencyMs: "1.45", dataStructure: "HNSW Vector Schema (Dim: 8)", memoryUsage: "2.10 MB" });
    } else if (item.id === "redis-publish-event") {
      setExecutionStats({ latencyMs: "0.12", dataStructure: "Pub/Sub Bus (3 Listeners)", memoryUsage: "0 bytes (Ephemeral)" });
    } else if (item.id === "redis-hset-product" || item.id === "redis-hgetall-product") {
      setExecutionStats({ latencyMs: "0.25", dataStructure: "Hash (product:101)", memoryUsage: "320 bytes" });
    } else if (item.id === "redis-unlink-async") {
      setExecutionStats({ latencyMs: "0.08", dataStructure: "Async Background Deallocation", memoryUsage: "-640 bytes" });
    } else {
      setExecutionStats({ latencyMs: "0.15", dataStructure: "Key-Value / Session", memoryUsage: "64 bytes" });
    }
  };

  const handleSimulateRun = () => {
    setIsExecuting(true);
    setSimulatorOutput("Executing on Azure Managed Redis (Enterprise E10, Port 10000 TLS)...");
    setTimeout(() => {
      setIsExecuting(false);
      const current = REDIS_COMMANDS[simulatorIndex];
      setSimulatorOutput(current.simulatedOutput || "OK");
    }, 380);
  };

  return (
    <div className="redis-lab-component" style={{ color: "#c9d1d9" }}>
      {/* Sub-tab Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #30363d",
          paddingBottom: "12px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveSubTab("commands")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeSubTab === "commands" ? "#e03131" : "#161b22",
              color: activeSubTab === "commands" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            📚 Cẩm Nang Lệnh Redis & RediSearch
          </button>
          <button
            onClick={() => setActiveSubTab("comparison")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeSubTab === "comparison" ? "#e03131" : "#161b22",
              color: activeSubTab === "comparison" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ⚖️ So Sánh Kiến Trúc & Eviction
          </button>
          <button
            onClick={() => setActiveSubTab("simulator")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeSubTab === "simulator" ? "#e03131" : "#161b22",
              color: activeSubTab === "simulator" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            🧪 Redis Simulator & KNN Search
          </button>
        </div>

        <div style={{ fontSize: "12px", color: "#8b949e", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#fa5252" }}></span>
          Azure Managed Redis • Port 10000 TLS • RediSearch 2.8+
        </div>
      </div>

      {/* VIEW 1: COMMANDS CATALOG */}
      {activeSubTab === "commands" && (
        <div>
          {/* Search & Category Filter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Tìm kiếm lệnh Redis CLI, Python, HSET, TTL, PSUBSCRIBE, RediSearch KNN, UNLINK..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 16px",
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "8px",
                color: "#f0f6fc",
                fontSize: "14px",
                outline: "none",
              }}
            />

            {/* Category Pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {REDIS_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: selectedCategory === cat.id ? "1px solid #e03131" : "1px solid #30363d",
                    background: selectedCategory === cat.id ? "rgba(224, 49, 49, 0.25)" : "#161b22",
                    color: selectedCategory === cat.id ? "#ff8787" : "#8b949e",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {filteredCommands.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: "10px",
                  padding: "18px 20px",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: 700, color: "#f0f6fc" }}>
                      {item.title}
                    </h3>
                    <div style={{ fontSize: "13px", color: "#8b949e" }}>{item.summary}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleCopy(item.command, `${item.id}-cli`)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #30363d",
                        background: copiedId === `${item.id}-cli` ? "#238636" : "#21262d",
                        color: copiedId === `${item.id}-cli` ? "#ffffff" : "#c9d1d9",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {copiedId === `${item.id}-cli` ? "✓ Đã chép" : "📋 Chép Redis CLI"}
                    </button>
                    <button
                      onClick={() => handleCopy(item.pythonEquivalent, `${item.id}-py`)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #30363d",
                        background: copiedId === `${item.id}-py` ? "#238636" : "#21262d",
                        color: copiedId === `${item.id}-py` ? "#ffffff" : "#c9d1d9",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {copiedId === `${item.id}-py` ? "✓ Đã chép" : "🐍 Chép Python"}
                    </button>
                  </div>
                </div>

                {/* Redis CLI Syntax */}
                <div style={{ fontSize: "12px", color: "#ff8787", fontWeight: 600, marginTop: "10px" }}>
                  🔴 Cú pháp Redis CLI:
                </div>
                <pre
                  style={{
                    background: "#0d1117",
                    border: "1px solid #21262d",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    color: "#ff8787",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "13px",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.5",
                    margin: "6px 0 12px 0",
                  }}
                >
                  <code>{item.command}</code>
                </pre>

                {/* Python SDK Equivalent */}
                <div style={{ fontSize: "12px", color: "#79c0ff", fontWeight: 600 }}>
                  🐍 Triển khai tương đương trong Python (redis-py + redis-entraid):
                </div>
                <pre
                  style={{
                    background: "#0d1117",
                    border: "1px solid #21262d",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    color: "#7ee787",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "12px",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.5",
                    margin: "6px 0 12px 0",
                  }}
                >
                  <code>{item.pythonEquivalent}</code>
                </pre>

                {/* Parameters Explanation */}
                {item.parameters && item.parameters.length > 0 && (
                  <div style={{ marginTop: "10px", fontSize: "12px", background: "#0d1117", padding: "10px 14px", borderRadius: "6px", border: "1px solid #21262d" }}>
                    <div style={{ fontWeight: 700, color: "#c9d1d9", marginBottom: "6px" }}>⚙️ Giải thích tham số:</div>
                    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 14px" }}>
                      {item.parameters.map((p, idx) => (
                        <React.Fragment key={idx}>
                          <span style={{ color: "#d2a8ff", fontFamily: "monospace", fontWeight: 600 }}>{p.name}</span>
                          <span style={{ color: "#8b949e" }}>{p.desc}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exam Tip */}
                {item.examTip && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      background: "rgba(224, 49, 49, 0.15)",
                      border: "1px solid rgba(224, 49, 49, 0.3)",
                      color: "#ffa8a8",
                      fontSize: "12px",
                      lineHeight: "1.5",
                    }}
                  >
                    {item.examTip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: COMPARISON MATRIX */}
      {activeSubTab === "comparison" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Section A: RediSearch vs Postgres pgvector */}
          <div style={{ background: "#161b22", borderRadius: "10px", border: "1px solid #30363d", padding: "20px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "17px", color: "#f0f6fc", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚔️</span> So Sánh Vector Search: RediSearch vs PostgreSQL pgvector
            </h3>
            <p style={{ fontSize: "13px", color: "#8b949e", margin: "0 0 16px 0", lineHeight: "1.5" }}>
              Hiểu rõ thời điểm nên chọn Azure Managed Redis (RediSearch) so với Azure Database for PostgreSQL (pgvector) trong kiến trúc Microsoft AI-200.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#21262d", borderBottom: "2px solid #30363d" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", color: "#f0f6fc", width: "24%" }}>Đặc tính</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", color: "#ff8787", width: "38%" }}>🔴 Azure Managed Redis (RediSearch)</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", color: "#79c0ff", width: "38%" }}>🐘 Azure PostgreSQL (pgvector)</th>
                  </tr>
                </thead>
                <tbody>
                  {REDIS_VS_POSTGRES_VECTOR.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid #21262d",
                        background: idx % 2 === 0 ? "#161b22" : "#0d1117",
                      }}
                    >
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#d2a8ff" }}>{row.dimension}</td>
                      <td style={{ padding: "10px 14px", color: "#c9d1d9", lineHeight: "1.4" }}>{row.redis}</td>
                      <td style={{ padding: "10px 14px", color: "#8b949e", lineHeight: "1.4" }}>{row.postgres}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: Redis Eviction Policies */}
          <div style={{ background: "#161b22", borderRadius: "10px", border: "1px solid #30363d", padding: "20px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "17px", color: "#f0f6fc", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🧹</span> Các Chiến Lược Giải Phóng Bộ Nhớ (Maxmemory Eviction Policies)
            </h3>
            <p style={{ fontSize: "13px", color: "#8b949e", margin: "0 0 16px 0", lineHeight: "1.5" }}>
              Khi Azure Managed Redis đạt giới hạn RAM tối đa, chính sách eviction quyết định khóa nào sẽ bị thanh trừng để nhường chỗ cho dữ liệu mới.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
              {REDIS_EVICTION_POLICIES.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: "8px",
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ color: "#ff8787", fontWeight: 700, fontSize: "14px", marginBottom: "6px", fontFamily: "monospace" }}>
                    {p.policy}
                  </div>
                  <div style={{ fontSize: "12px", color: "#c9d1d9", marginBottom: "8px", lineHeight: "1.4" }}>
                    {p.description}
                  </div>
                  <div style={{ fontSize: "11px", color: "#7ee787", background: "rgba(46, 160, 67, 0.15)", padding: "4px 8px", borderRadius: "4px" }}>
                    🎯 Phù hợp: {p.bestFor}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SIMULATOR & KNN SEARCH */}
      {activeSubTab === "simulator" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Header Controls */}
          <div style={{ background: "#161b22", borderRadius: "10px", border: "1px solid #30363d", padding: "18px" }}>
            <div style={{ marginBottom: "12px", fontWeight: 700, fontSize: "14px", color: "#f0f6fc" }}>
              1. Chọn Mẫu Kịch Bản Redis (Presets):
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {REDIS_COMMANDS.slice(0, 8).map((cmd, idx) => (
                <button
                  key={cmd.id}
                  onClick={() => handleSelectSimulatorPreset(idx)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: simulatorIndex === idx ? "1px solid #e03131" : "1px solid #30363d",
                    background: simulatorIndex === idx ? "#e03131" : "#0d1117",
                    color: simulatorIndex === idx ? "#ffffff" : "#c9d1d9",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cmd.title.split(". ")[1] || cmd.title}
                </button>
              ))}
              {/* Add RediSearch presets */}
              {[9, 10, 11, 12].map((idx) => {
                const cmd = REDIS_COMMANDS[idx];
                return (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelectSimulatorPreset(idx)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: simulatorIndex === idx ? "1px solid #e03131" : "1px solid #30363d",
                      background: simulatorIndex === idx ? "#e03131" : "#0d1117",
                      color: simulatorIndex === idx ? "#ffffff" : "#c9d1d9",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    ⭐ {cmd.title.split(". ")[1] || cmd.title}
                  </button>
                );
              })}
            </div>

            {/* Command Editor */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "#8b949e", fontWeight: 600 }}>Câu lệnh Redis CLI thực thi:</span>
                <span style={{ fontSize: "11px", color: "#fa5252" }}>Cluster: myredis.eastus.redisenterprise.cache.azure.net:10000 (TLS)</span>
              </div>
              <textarea
                value={customCommand}
                onChange={(e) => setCustomCommand(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#0d1117",
                  border: "1px solid #30363d",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#ff8787",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            {/* Run Button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={handleSimulateRun}
                disabled={isExecuting}
                style={{
                  padding: "10px 24px",
                  borderRadius: "6px",
                  background: isExecuting ? "#495057" : "#e03131",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: isExecuting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.15s ease",
                }}
              >
                {isExecuting ? "Đang gửi lệnh TLS..." : "▶️ Chạy Lệnh Mô Phỏng (Execute)"}
              </button>

              <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
                <div>
                  <span style={{ color: "#8b949e" }}>Độ trễ: </span>
                  <span style={{ color: "#7ee787", fontWeight: 700 }}>{executionStats.latencyMs} ms</span>
                </div>
                <div>
                  <span style={{ color: "#8b949e" }}>Cấu trúc: </span>
                  <span style={{ color: "#d2a8ff", fontWeight: 700 }}>{executionStats.dataStructure}</span>
                </div>
                <div>
                  <span style={{ color: "#8b949e" }}>Ước tính RAM: </span>
                  <span style={{ color: "#ff8787", fontWeight: 700 }}>{executionStats.memoryUsage}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Console Output */}
          <div style={{ background: "#0d1117", borderRadius: "10px", border: "1px solid #30363d", overflow: "hidden" }}>
            <div
              style={{
                background: "#161b22",
                padding: "8px 14px",
                borderBottom: "1px solid #30363d",
                fontSize: "12px",
                fontWeight: 600,
                color: "#8b949e",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56" }}></span>
                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }}></span>
                <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", background: "#27c93f" }}></span>
                <span style={{ marginLeft: "8px" }}>redis-cli -h myredis.eastus.redisenterprise.cache.azure.net -p 10000 --tls</span>
              </div>
              <span style={{ fontSize: "11px", color: "#2ea043" }}>● CONNECTED</span>
            </div>
            <pre
              style={{
                margin: 0,
                padding: "16px",
                fontFamily: "'Fira Code', monospace",
                fontSize: "13px",
                color: "#7ee787",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap",
                minHeight: "140px",
              }}
            >
              <code>{simulatorOutput}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}


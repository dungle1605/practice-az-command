import React, { useState } from "react";
import {
  INTEGRATION_CATEGORIES,
  INTEGRATION_OPERATIONS,
  SERVICE_BUS_VS_EVENT_GRID_VS_REDIS,
  DURABLE_WORKFLOW_PATTERNS
} from "../data/backendServicesData";

export default function BackendIntegrationLab() {
  const [activeSubTab, setActiveSubTab] = useState("catalog"); // "catalog" | "architecture" | "simulator"
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Simulator state
  const [simulatorPresetIndex, setSimulatorPresetIndex] = useState(0);
  const [simulatorCommand, setSimulatorCommand] = useState(INTEGRATION_OPERATIONS[0].cliCommand);
  const [simulatorOutput, setSimulatorOutput] = useState(INTEGRATION_OPERATIONS[0].simulatedOutput);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStats, setExecutionStats] = useState({
    latencyMs: "12.4",
    protocol: "AMQP 1.0 (Service Bus)",
    guarantee: "At-least-once (Peek-Lock)",
    state: "Queued"
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredOperations = INTEGRATION_OPERATIONS.filter((op) => {
    const matchesCategory = selectedCategory === "all" || op.category === selectedCategory;
    const matchesSearch =
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.cliCommand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.pythonEquivalent.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectSimulatorPreset = (idx) => {
    setSimulatorPresetIndex(idx);
    const item = INTEGRATION_OPERATIONS[idx];
    setSimulatorCommand(item.cliCommand);
    setSimulatorOutput(item.simulatedOutput);

    // Compute realistic messaging stats
    if (item.category === "servicebus") {
      if (item.id === "sb-dead-letter" || item.id === "sb-inspect-dlq") {
        setExecutionStats({ latencyMs: "8.2", protocol: "AMQP 1.0 (DLQ Subqueue)", guarantee: "Poison Isolated", state: "Dead-Lettered" });
      } else {
        setExecutionStats({ latencyMs: "12.4", protocol: "AMQP 1.0 (TLS Encrypted)", guarantee: "At-least-once (Peek-Lock)", state: "Completed" });
      }
    } else if (item.category === "eventgrid") {
      setExecutionStats({ latencyMs: "18.5", protocol: "HTTP/2 CloudEvents v1.0", guarantee: "At-least-once (Pull Queue)", state: "Acknowledged" });
    } else if (item.category === "durable") {
      setExecutionStats({ latencyMs: "45.0", protocol: "Durable Task Framework", guarantee: "Exactly-once execution with replay", state: "WaitingApproval / Succeeded" });
    } else if (item.category === "mcp") {
      setExecutionStats({ latencyMs: "15.8", protocol: "Server-Sent Events (SSE)", guarantee: "Synchronous Tool Invocation", state: "Tool Discovered" });
    }
  };

  const handleSimulateRun = () => {
    setIsExecuting(true);
    setSimulatorOutput("Dispatching request to Azure Backend Integration Engine...");
    setTimeout(() => {
      setIsExecuting(false);
      const current = INTEGRATION_OPERATIONS[simulatorPresetIndex];
      setSimulatorOutput(current.simulatedOutput || "Operation completed successfully.");
    }, 420);
  };

  return (
    <div className="backend-integration-lab-component" style={{ color: "#c9d1d9" }}>
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
            onClick={() => setActiveSubTab("catalog")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeSubTab === "catalog" ? "#8957e5" : "#161b22",
              color: activeSubTab === "catalog" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            📚 Cẩm Nang Tích Hợp (15 Kỹ thuật Cốt lõi)
          </button>
          <button
            onClick={() => setActiveSubTab("architecture")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeSubTab === "architecture" ? "#8957e5" : "#161b22",
              color: activeSubTab === "architecture" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ⚖️ So Sánh Kiến Trúc & 5 Durable Patterns
          </button>
          <button
            onClick={() => setActiveSubTab("simulator")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeSubTab === "simulator" ? "#8957e5" : "#161b22",
              color: activeSubTab === "simulator" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            🧪 Message Bus & HITL Simulator
          </button>
        </div>

        <div style={{ fontSize: "12px", color: "#8b949e", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#a371f7" }}></span>
          Service Bus • Event Grid CloudEvents • Durable Functions • MCP Server
        </div>
      </div>

      {/* VIEW 1: CATALOG OF OPERATIONS */}
      {activeSubTab === "catalog" && (
        <div>
          {/* Search & Category Filter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Tìm kiếm Service Bus, Dead-Letter, Peek-Lock, CloudEvents, Durable Fan-out, HITL, MCP Tool..."
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
              {INTEGRATION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: selectedCategory === cat.id ? "1px solid #8957e5" : "1px solid #30363d",
                    background: selectedCategory === cat.id ? "rgba(137, 87, 229, 0.25)" : "#161b22",
                    color: selectedCategory === cat.id ? "#d2a8ff" : "#8b949e",
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
            {filteredOperations.map((item) => (
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
                      onClick={() => handleCopy(item.cliCommand, `${item.id}-cli`)}
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
                      {copiedId === `${item.id}-cli` ? "✓ Đã chép" : "📋 Chép CLI"}
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

                {/* Azure CLI Syntax */}
                <div style={{ fontSize: "12px", color: "#d2a8ff", fontWeight: 600, marginTop: "10px" }}>
                  ⚡ Cú pháp Azure CLI tương ứng:
                </div>
                <pre
                  style={{
                    background: "#0d1117",
                    border: "1px solid #21262d",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    color: "#d2a8ff",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "13px",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.5",
                    margin: "6px 0 12px 0",
                  }}
                >
                  <code>{item.cliCommand}</code>
                </pre>

                {/* Python SDK Implementation */}
                <div style={{ fontSize: "12px", color: "#79c0ff", fontWeight: 600 }}>
                  🐍 Triển khai trong Python (azure-servicebus / azure-eventgrid / durable-functions):
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
                    <div style={{ fontWeight: 700, color: "#c9d1d9", marginBottom: "6px" }}>⚙️ Giải thích thuộc tính & cơ chế:</div>
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
                      background: "rgba(137, 87, 229, 0.15)",
                      border: "1px solid rgba(137, 87, 229, 0.3)",
                      color: "#d2a8ff",
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

      {/* VIEW 2: ARCHITECTURE COMPARISON & PATTERNS */}
      {activeSubTab === "architecture" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Section A: Comparison Table */}
          <div style={{ background: "#161b22", borderRadius: "10px", border: "1px solid #30363d", padding: "20px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "17px", color: "#f0f6fc", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚔️</span> So Sánh Ba Hạ Tầng Tin Nhắn: Service Bus vs Event Grid vs Redis Pub/Sub
            </h3>
            <p style={{ fontSize: "13px", color: "#8b949e", margin: "0 0 16px 0", lineHeight: "1.5" }}>
              Tiêu chuẩn lựa chọn giải pháp trao đổi thông điệp trong kỳ thi Microsoft AI-200.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#21262d", borderBottom: "2px solid #30363d" }}>
                    <th style={{ padding: "10px 14px", textAlign: "left", color: "#f0f6fc", width: "22%" }}>Tiêu chí</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", color: "#d2a8ff", width: "26%" }}>📬 Azure Service Bus</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", color: "#79c0ff", width: "26%" }}>⚡ Azure Event Grid</th>
                    <th style={{ padding: "10px 14px", textAlign: "left", color: "#ff8787", width: "26%" }}>🔴 Azure Managed Redis</th>
                  </tr>
                </thead>
                <tbody>
                  {SERVICE_BUS_VS_EVENT_GRID_VS_REDIS.map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: "1px solid #21262d",
                        background: idx % 2 === 0 ? "#161b22" : "#0d1117",
                      }}
                    >
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#f0f6fc" }}>{row.feature}</td>
                      <td style={{ padding: "10px 14px", color: "#d2a8ff", lineHeight: "1.4" }}>{row.serviceBus}</td>
                      <td style={{ padding: "10px 14px", color: "#79c0ff", lineHeight: "1.4" }}>{row.eventGrid}</td>
                      <td style={{ padding: "10px 14px", color: "#ff8787", lineHeight: "1.4" }}>{row.redisPubSub}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: 5 Durable Functions Workflow Patterns */}
          <div style={{ background: "#161b22", borderRadius: "10px", border: "1px solid #30363d", padding: "20px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "17px", color: "#f0f6fc", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🔄</span> 5 Mô Hình Điều Phối Bền Vững (Durable Functions Workflow Patterns) Cho AI
            </h3>
            <p style={{ fontSize: "13px", color: "#8b949e", margin: "0 0 16px 0", lineHeight: "1.5" }}>
              Cách thiết kế luồng công việc AI tự động phục hồi trạng thái sau sự cố mà không tốn chi phí CPU rảnh rỗi.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
              {DURABLE_WORKFLOW_PATTERNS.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: "8px",
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ color: "#d2a8ff", fontWeight: 700, fontSize: "14px", marginBottom: "6px" }}>
                    {p.pattern}
                  </div>
                  <div style={{ fontSize: "12px", color: "#c9d1d9", marginBottom: "8px", lineHeight: "1.4" }}>
                    {p.description}
                  </div>
                  <div style={{ fontSize: "11px", color: "#7ee787", background: "rgba(46, 160, 67, 0.15)", padding: "5px 8px", borderRadius: "4px" }}>
                    🎯 Áp dụng AI: {p.aiScenario}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: INTERACTIVE SIMULATOR */}
      {activeSubTab === "simulator" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Header Controls */}
          <div style={{ background: "#161b22", borderRadius: "10px", border: "1px solid #30363d", padding: "18px" }}>
            <div style={{ marginBottom: "12px", fontWeight: 700, fontSize: "14px", color: "#f0f6fc" }}>
              1. Chọn Kịch Bản Mô Phỏng Backend (Integration Presets):
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {INTEGRATION_OPERATIONS.map((op, idx) => (
                <button
                  key={op.id}
                  onClick={() => handleSelectSimulatorPreset(idx)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: simulatorPresetIndex === idx ? "1px solid #8957e5" : "1px solid #30363d",
                    background: simulatorPresetIndex === idx ? "#8957e5" : "#0d1117",
                    color: simulatorPresetIndex === idx ? "#ffffff" : "#c9d1d9",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {op.title.split(". ")[1] || op.title}
                </button>
              ))}
            </div>

            {/* Command Editor */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "#8b949e", fontWeight: 600 }}>Thao tác CLI / REST Endpoint thực thi:</span>
                <span style={{ fontSize: "11px", color: "#a371f7" }}>Môi trường mô phỏng tích hợp backend chuẩn AI-200</span>
              </div>
              <textarea
                value={simulatorCommand}
                onChange={(e) => setSimulatorCommand(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#0d1117",
                  border: "1px solid #30363d",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#d2a8ff",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            {/* Run Button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <button
                onClick={handleSimulateRun}
                disabled={isExecuting}
                style={{
                  padding: "10px 24px",
                  borderRadius: "6px",
                  background: isExecuting ? "#495057" : "#8957e5",
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
                {isExecuting ? "Đang truyền tải thông điệp..." : "▶️ Chạy Mô Phỏng Thông Điệp (Dispatch)"}
              </button>

              <div style={{ display: "flex", gap: "16px", fontSize: "12px", flexWrap: "wrap" }}>
                <div>
                  <span style={{ color: "#8b949e" }}>Độ trễ: </span>
                  <span style={{ color: "#7ee787", fontWeight: 700 }}>{executionStats.latencyMs} ms</span>
                </div>
                <div>
                  <span style={{ color: "#8b949e" }}>Giao thức: </span>
                  <span style={{ color: "#79c0ff", fontWeight: 700 }}>{executionStats.protocol}</span>
                </div>
                <div>
                  <span style={{ color: "#8b949e" }}>Cam kết: </span>
                  <span style={{ color: "#d2a8ff", fontWeight: 700 }}>{executionStats.guarantee}</span>
                </div>
                <div>
                  <span style={{ color: "#8b949e" }}>Trạng thái: </span>
                  <span style={{ color: "#ff8787", fontWeight: 700 }}>{executionStats.state}</span>
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
                <span style={{ marginLeft: "8px" }}>Integration Message Bus & Workflow Console</span>
              </div>
              <span style={{ fontSize: "11px", color: "#2ea043" }}>● BROKER ACTIVE</span>
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

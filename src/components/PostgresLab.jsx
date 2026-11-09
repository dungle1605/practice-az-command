import React, { useState } from "react";
import {
  POSTGRES_CATEGORIES,
  POSTGRES_QUERIES,
  POSTGRES_INDEX_COMPARISON,
  POSTGRES_OPERATOR_MATRIX
} from "../data/postgresQueries";

export default function PostgresLab() {
  const [activeSubTab, setActiveSubTab] = useState("commands"); // "commands" | "comparison" | "simulator"
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Simulator state
  const [simulatorQueryIndex, setSimulatorQueryIndex] = useState(0);
  const [customSql, setCustomSql] = useState(POSTGRES_QUERIES[0].sql);
  const [simulatorOutput, setSimulatorOutput] = useState(POSTGRES_QUERIES[0].simulatedOutput);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStats, setExecutionStats] = useState({
    timeMs: "0.24",
    scanType: "Index Scan",
    recall: "99.2%"
  });

  const handleCopy = (sql, id) => {
    navigator.clipboard.writeText(sql);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQueries = POSTGRES_QUERIES.filter((q) => {
    const matchesCategory = selectedCategory === "all" || q.category === selectedCategory;
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.sql.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectSimulatorPreset = (idx) => {
    setSimulatorQueryIndex(idx);
    const item = POSTGRES_QUERIES[idx];
    setCustomSql(item.sql);
    setSimulatorOutput(item.simulatedOutput);

    // Compute realistic stats based on query type
    if (item.id === "pg-explain-baseline") {
      setExecutionStats({ timeMs: "246.12", scanType: "Seq Scan (100k rows)", recall: "100% (Exact)" });
    } else if (item.id === "pg-explain-indexed" || item.id === "pg-hnsw-tune-search") {
      setExecutionStats({ timeMs: "3.25", scanType: "Index Scan (HNSW)", recall: "99.4%" });
    } else if (item.id === "pg-ivfflat-tune-probes") {
      setExecutionStats({ timeMs: "18.20", scanType: "Index Scan (IVFFlat)", recall: "96.0%" });
    } else if (item.id === "pg-hybrid-btree") {
      setExecutionStats({ timeMs: "1.51", scanType: "Bitmap Index Scan (B-tree + Vector)", recall: "99.8%" });
    } else {
      setExecutionStats({ timeMs: "0.85", scanType: "DDL / DML", recall: "N/A" });
    }
  };

  const handleSimulateRun = () => {
    setIsExecuting(true);
    setSimulatorOutput("Executing query on Azure Database for PostgreSQL Flexible Server...");
    setTimeout(() => {
      setIsExecuting(false);
      const current = POSTGRES_QUERIES[simulatorQueryIndex];
      setSimulatorOutput(current.simulatedOutput || "Query executed successfully.");
    }, 450);
  };

  return (
    <div className="postgres-lab-component" style={{ color: "#c9d1d9" }}>
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
              background: activeSubTab === "commands" ? "#336791" : "#161b22",
              color: activeSubTab === "commands" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            📚 Cẩm Nang SQL & pgvector
          </button>
          <button
            onClick={() => setActiveSubTab("comparison")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeSubTab === "comparison" ? "#336791" : "#161b22",
              color: activeSubTab === "comparison" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ⚖️ Ma Trận So Sánh (HNSW vs IVFFlat)
          </button>
          <button
            onClick={() => setActiveSubTab("simulator")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: activeSubTab === "simulator" ? "#336791" : "#161b22",
              color: activeSubTab === "simulator" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            🧪 SQL Simulator & EXPLAIN ANALYZE
          </button>
        </div>

        <div style={{ fontSize: "12px", color: "#8b949e", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#2ea043" }}></span>
          PostgreSQL 16 • pgvector 0.7.0 • Entra ID Auth
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
              placeholder="🔍 Tìm kiếm câu lệnh SQL, HNSW, IVFFlat, <=>, EXPLAIN, Checkpoint..."
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
              {POSTGRES_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: selectedCategory === cat.id ? "1px solid #336791" : "1px solid #30363d",
                    background: selectedCategory === cat.id ? "rgba(51, 103, 145, 0.25)" : "#161b22",
                    color: selectedCategory === cat.id ? "#58a6ff" : "#8b949e",
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
            {filteredQueries.map((item) => (
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
                  <button
                    onClick={() => handleCopy(item.sql, item.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid #30363d",
                      background: copiedId === item.id ? "#238636" : "#21262d",
                      color: copiedId === item.id ? "#ffffff" : "#c9d1d9",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {copiedId === item.id ? "✓ Đã chép" : "📋 Sao chép SQL"}
                  </button>
                </div>

                {/* SQL Code Block */}
                <pre
                  style={{
                    background: "#0d1117",
                    border: "1px solid #21262d",
                    borderRadius: "8px",
                    padding: "14px",
                    color: "#79c0ff",
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "13px",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.5",
                    margin: "12px 0",
                  }}
                >
                  <code>{item.sql}</code>
                </pre>

                {/* Parameters Explanation */}
                {item.parameters && item.parameters.length > 0 && (
                  <div style={{ marginTop: "10px", fontSize: "12px", background: "#0d1117", padding: "10px 14px", borderRadius: "6px", border: "1px solid #21262d" }}>
                    <div style={{ fontWeight: 700, color: "#c9d1d9", marginBottom: "6px" }}>⚙️ Giải thích tham số:</div>
                    {item.parameters.map((p, idx) => (
                      <div key={idx} style={{ marginBottom: "4px", color: "#8b949e" }}>
                        <code style={{ color: "#ff7b72", background: "#161b22", padding: "2px 6px", borderRadius: "4px" }}>{p.name}</code>: {p.desc}
                      </div>
                    ))}
                  </div>
                )}

                {/* AI-200 Exam Tip */}
                {item.examTip && (
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      background: "rgba(56, 139, 253, 0.1)",
                      borderLeft: "3px solid #388bfd",
                      padding: "8px 12px",
                      borderRadius: "0 6px 6px 0",
                      color: "#79c0ff",
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

      {/* VIEW 2: ARCHITECTURE COMPARISON */}
      {activeSubTab === "comparison" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* Table 1: Index Type Comparison */}
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "10px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "17px", fontWeight: 700, color: "#f0f6fc" }}>
              🌐 So sánh Toàn diện: Seq Scan vs IVFFlat vs HNSW
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#8b949e" }}>
              Hiểu rõ sự đánh đổi giữa thời gian build, dung lượng RAM, tốc độ truy vấn và độ chính xác (Recall) trong kỳ thi AI-200.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #30363d", background: "#0d1117" }}>
                    <th style={{ padding: "12px 14px", color: "#f0f6fc" }}>Đặc tính</th>
                    <th style={{ padding: "12px 14px", color: "#f85149" }}>Quét tuần tự (Seq Scan)</th>
                    <th style={{ padding: "12px 14px", color: "#d29922" }}>IVFFlat (lists = 100)</th>
                    <th style={{ padding: "12px 14px", color: "#3fb950" }}>HNSW (m=16, ef_c=64)</th>
                  </tr>
                </thead>
                <tbody>
                  {POSTGRES_INDEX_COMPARISON.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #21262d", background: idx % 2 === 0 ? "transparent" : "#161b22" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#c9d1d9" }}>{row.feature}</td>
                      <td style={{ padding: "12px 14px", color: "#8b949e" }}>{row.seqScan}</td>
                      <td style={{ padding: "12px 14px", color: "#8b949e" }}>{row.ivfflat}</td>
                      <td style={{ padding: "12px 14px", color: "#7ee787", fontWeight: 500 }}>{row.hnsw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Distance Operators */}
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "10px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "17px", fontWeight: 700, color: "#f0f6fc" }}>
              📐 Ba Toán tử Đo Khoảng cách Vector trong pgvector
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#8b949e" }}>
              Cú pháp toán tử, lớp toán tử (Operator Class) khi tạo index và ngữ cảnh áp dụng thực tế.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #30363d", background: "#0d1117" }}>
                    <th style={{ padding: "12px 14px", color: "#f0f6fc" }}>Toán tử</th>
                    <th style={{ padding: "12px 14px", color: "#f0f6fc" }}>Tên khoảng cách</th>
                    <th style={{ padding: "12px 14px", color: "#f0f6fc" }}>Miền giá trị</th>
                    <th style={{ padding: "12px 14px", color: "#f0f6fc" }}>Operator Class</th>
                    <th style={{ padding: "12px 14px", color: "#f0f6fc" }}>Khuyến nghị sử dụng</th>
                  </tr>
                </thead>
                <tbody>
                  {POSTGRES_OPERATOR_MATRIX.map((op, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #21262d", background: idx % 2 === 0 ? "transparent" : "#161b22" }}>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: "15px", color: "#58a6ff", fontWeight: 700 }}>{op.operator}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#f0f6fc" }}>{op.name}</td>
                      <td style={{ padding: "12px 14px", color: "#8b949e" }}>{op.range}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <code style={{ color: "#ff7b72", background: "#0d1117", padding: "2px 6px", borderRadius: "4px" }}>{op.opClass}</code>
                      </td>
                      <td style={{ padding: "12px 14px", color: "#c9d1d9" }}>{op.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SQL SIMULATOR */}
      {activeSubTab === "simulator" && (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" }}>
          {/* Preset Selector */}
          <aside style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#8b949e", marginBottom: "8px", fontWeight: 700 }}>
              🧪 Kịch bản Thực thi Lab
            </div>
            {POSTGRES_QUERIES.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => handleSelectSimulatorPreset(idx)}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: simulatorQueryIndex === idx ? "1px solid #336791" : "1px solid transparent",
                  background: simulatorQueryIndex === idx ? "#0d1117" : "transparent",
                  color: simulatorQueryIndex === idx ? "#58a6ff" : "#c9d1d9",
                  fontSize: "13px",
                  fontWeight: simulatorQueryIndex === idx ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {q.title}
              </button>
            ))}
          </aside>

          {/* Execution & Output Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Editor Area */}
            <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "10px", padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#f0f6fc" }}>
                  💻 SQL Query Editor (PostgreSQL 16):
                </div>
                <button
                  onClick={handleSimulateRun}
                  disabled={isExecuting}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "6px",
                    border: "none",
                    background: isExecuting ? "#21262d" : "#238636",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: isExecuting ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {isExecuting ? "Đang xử lý..." : "▶ Chạy Thực Thi (Simulate)"}
                </button>
              </div>

              <textarea
                value={customSql}
                onChange={(e) => setCustomSql(e.target.value)}
                rows={8}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#0d1117",
                  border: "1px solid #21262d",
                  borderRadius: "6px",
                  color: "#79c0ff",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "13px",
                  padding: "12px",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: "1.5",
                }}
              />
            </div>

            {/* Performance Metric Badge Bar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", padding: "12px" }}>
                <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase" }}>Thời gian thực thi (Latency)</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: parseFloat(executionStats.timeMs) > 100 ? "#f85149" : "#3fb950" }}>
                  {executionStats.timeMs} ms
                </div>
              </div>
              <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", padding: "12px" }}>
                <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase" }}>Chiến lược quét (Scan Type)</div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#f0f6fc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {executionStats.scanType}
                </div>
              </div>
              <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "8px", padding: "12px" }}>
                <div style={{ fontSize: "11px", color: "#8b949e", textTransform: "uppercase" }}>Độ thu hồi ước lượng (Recall)</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#58a6ff" }}>
                  {executionStats.recall}
                </div>
              </div>
            </div>

            {/* Output Console */}
            <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "10px", padding: "16px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#f0f6fc", marginBottom: "8px" }}>
                📟 PostgreSQL Console & Execution Plan:
              </div>
              <pre
                style={{
                  background: "#0d1117",
                  border: "1px solid #21262d",
                  borderRadius: "6px",
                  padding: "14px",
                  color: "#c9d1d9",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "12.5px",
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.45",
                  minHeight: "160px",
                }}
              >
                {simulatorOutput}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useState } from "react";
import { CHEATSHEET_SECTIONS } from "../data/cheatsheet";

export default function Cheatsheet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredSections = CHEATSHEET_SECTIONS.map((sec) => {
    const matchingItems = sec.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...sec, matchingItems };
  }).filter((sec) => sec.matchingItems.length > 0);

  return (
    <div className="cheatsheet-component" style={{ color: "#c9d1d9" }}>
      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Tìm kiếm câu lệnh, cờ tham số (--image, -o tsv, sessionpool, secret...)..."
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
      </div>

      {/* Sections List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {filteredSections.map((sec) => (
          <div
            key={sec.id}
            style={{
              background: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span
                style={{
                  background: "#1f6feb22",
                  color: "#58a6ff",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {sec.badge}
              </span>
              <h3 style={{ margin: 0, fontSize: "17px", color: "#f0f6fc" }}>{sec.title}</h3>
            </div>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#8b949e" }}>{sec.summary}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {sec.matchingItems.map((item, idx) => {
                const uniqueKey = `${sec.id}-${idx}`;
                return (
                  <div
                    key={uniqueKey}
                    style={{
                      background: "#0d1117",
                      border: "1px solid #21262d",
                      borderRadius: "8px",
                      padding: "14px",
                    }}
                  >
                    <div style={{ fontWeight: 600, color: "#f0f6fc", marginBottom: "4px", fontSize: "14px" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "13px", color: "#8b949e", marginBottom: "10px" }}>{item.desc}</div>

                    {/* Code box */}
                    <div
                      style={{
                        position: "relative",
                        background: "#161b22",
                        border: "1px solid #30363d",
                        borderRadius: "6px",
                        padding: "12px",
                      }}
                    >
                      <pre
                        style={{
                          margin: 0,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "13px",
                          color: "#79c0ff",
                          overflowX: "auto",
                        }}
                      >
                        {item.code}
                      </pre>
                      <button
                        onClick={() => handleCopy(item.code, uniqueKey)}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: copiedIndex === uniqueKey ? "#238636" : "#21262d",
                          color: "#f0f6fc",
                          border: "1px solid #30363d",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "11px",
                          cursor: "pointer",
                        }}
                      >
                        {copiedIndex === uniqueKey ? "Đã chép ✓" : "Sao chép"}
                      </button>
                    </div>

                    {item.note && (
                      <div style={{ fontSize: "12px", color: "#e3b341", marginTop: "8px" }}>
                        💡 <em>{item.note}</em>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

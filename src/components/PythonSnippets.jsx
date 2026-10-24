import React, { useState } from "react";
import { pythonSnippets } from "../data/pythonSnippets";

export default function PythonSnippets() {
  const [selected, setSelected] = useState(pythonSnippets[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!selected) return;
    const blob = new Blob([selected.code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selected.filename || "snippet.py";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="python-snippets-container"
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: "20px",
        minHeight: "560px",
        color: "#c9d1d9",
      }}
    >
      {/* Sidebar: Snippets selector */}
      <aside
        style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#8b949e", marginBottom: "8px", fontWeight: 700 }}>
          🐍 Python AI-200 Snippets
        </div>
        {pythonSnippets.map((snippet) => {
          const isActive = selected?.id === snippet.id;
          return (
            <button
              key={snippet.id}
              onClick={() => setSelected(snippet)}
              style={{
                textAlign: "left",
                padding: "10px 14px",
                borderRadius: "8px",
                border: isActive ? "1px solid #00d2ff" : "1px solid transparent",
                background: isActive ? "#00d2ff1a" : "#0d1117",
                color: isActive ? "#58a6ff" : "#c9d1d9",
                cursor: "pointer",
                fontWeight: isActive ? 600 : 400,
                fontSize: "13px",
                transition: "all 0.15s ease",
              }}
            >
              <div>{snippet.title}</div>
              <span style={{ fontSize: "11px", color: "#8b949e" }}>{snippet.category}</span>
            </button>
          );
        })}
      </aside>

      {/* Main Content: Code viewer */}
      <main
        style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "10px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selected ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <h2 style={{ margin: "0 0 6px 0", color: "#f0f6fc", fontSize: "18px" }}>{selected.title}</h2>
                <p style={{ margin: 0, color: "#8b949e", fontSize: "13px", lineHeight: "1.5" }}>{selected.description}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? "#238636" : "#21262d",
                    color: "#f0f6fc",
                    border: "1px solid #30363d",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {copied ? "✓ Đã chép" : "📋 Sao chép"}
                </button>
                <button
                  onClick={handleDownload}
                  style={{
                    background: "#21262d",
                    color: "#79c0ff",
                    border: "1px solid #30363d",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  💾 Tải file .py
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <span
                style={{
                  background: "#388bfd22",
                  color: "#58a6ff",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {selected.category}
              </span>
              {selected.filename && (
                <span style={{ marginLeft: "8px", fontSize: "12px", color: "#8b949e", fontFamily: "monospace" }}>
                  📁 {selected.filename}
                </span>
              )}
            </div>

            {/* Code Block */}
            <div
              style={{
                flex: 1,
                background: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "8px",
                padding: "16px",
                overflowX: "auto",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "13px",
                lineHeight: "1.6",
                color: "#e6edf3",
              }}
            >
              <pre style={{ margin: 0 }}>
                <code>{selected.code}</code>
              </pre>
            </div>
          </>
        ) : (
          <div style={{ color: "#8b949e", textAlign: "center", marginTop: "40px" }}>Chọn một snippet để xem chi tiết.</div>
        )}
      </main>
    </div>
  );
}
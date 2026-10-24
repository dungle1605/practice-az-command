import { useState } from "react";
import { yamlSnippets } from "../data/yamlSnippets";

const CATEGORY_COLORS = {
  "Workload":      { bg: "#1f6feb22", color: "#58a6ff" },
  "Networking":    { bg: "#0d419d22", color: "#79c0ff" },
  "Configuration": { bg: "#2ea04322", color: "#56d364" },
  "Scaling":       { bg: "#9e6a0322", color: "#e3b341" },
  "Full Stack":    { bg: "#6e40c922", color: "#bc8cff" },
};

export default function YamlSnippets() {
  const [selected, setSelected] = useState(yamlSnippets[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selected.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selected.code], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selected.filename || "manifest.yaml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const catStyle = CATEGORY_COLORS[selected.category] || { bg: "#30363d", color: "#c9d1d9" };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: "20px",
        minHeight: "560px",
        color: "#c9d1d9",
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "10px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#8b949e",
            marginBottom: "10px",
            fontWeight: 700,
          }}
        >
          ☸️ YAML Manifests — AKS
        </div>
        {yamlSnippets.map((snippet) => {
          const isActive = selected?.id === snippet.id;
          const cs = CATEGORY_COLORS[snippet.category] || { bg: "#30363d", color: "#c9d1d9" };
          return (
            <button
              key={snippet.id}
              onClick={() => setSelected(snippet)}
              style={{
                textAlign: "left",
                padding: "10px 14px",
                borderRadius: "8px",
                border: isActive ? `1px solid ${cs.color}55` : "1px solid transparent",
                background: isActive ? `${cs.color}18` : "#0d1117",
                color: isActive ? cs.color : "#c9d1d9",
                cursor: "pointer",
                fontWeight: isActive ? 600 : 400,
                fontSize: "13px",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ marginBottom: "3px" }}>{snippet.title}</div>
              <span
                style={{
                  fontSize: "10px",
                  background: cs.bg,
                  color: cs.color,
                  padding: "1px 7px",
                  borderRadius: "10px",
                  fontWeight: 600,
                }}
              >
                {snippet.category}
              </span>
            </button>
          );
        })}
      </aside>

      {/* ── Main Content ── */}
      <main
        style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "10px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: "0 0 6px 0", color: "#f0f6fc", fontSize: "18px" }}>{selected.title}</h2>
            <p style={{ margin: 0, color: "#8b949e", fontSize: "13px", lineHeight: "1.5" }}>{selected.description}</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
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
                transition: "background 0.15s",
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
              💾 Tải .yaml
            </button>
          </div>
        </div>

        {/* Meta badges */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span
            style={{
              background: catStyle.bg,
              color: catStyle.color,
              padding: "3px 10px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {selected.category}
          </span>
          {selected.filename && (
            <span style={{ fontSize: "12px", color: "#8b949e", fontFamily: "monospace" }}>
              📁 {selected.filename}
            </span>
          )}
        </div>

        {/* Code block */}
        <div
          style={{
            flex: 1,
            background: "#0d1117",
            border: "1px solid #30363d",
            borderRadius: "8px",
            padding: "16px",
            overflowX: "auto",
            overflowY: "auto",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            lineHeight: "1.65",
            color: "#e6edf3",
          }}
        >
          <pre style={{ margin: 0, textAlign: "left", whiteSpace: "pre" }}>
            <code>{selected.code}</code>
          </pre>
        </div>
      </main>
    </div>
  );
}
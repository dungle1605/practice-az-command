import React, { useState } from "react";
import Terminal from "./components/Terminal";
import Cheatsheet from "./components/Cheatsheet";
import PythonSnippets from "./components/PythonSnippets";
import YamlSnippets from "./components/YamlSnippets";

function App() {
  const [activeTab, setActiveTab] = useState("terminal");

  return (
    <div
      className="az-master-app"
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#c9d1d9",
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
        padding: "24px 32px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #30363d",
          paddingBottom: "18px",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>⚡</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 800, color: "#f0f6fc", letterSpacing: "-0.5px" }}>
              AZ-COMMAND <span style={{ color: "#00d2ff" }}>MASTER</span>
            </h1>
            <div style={{ fontSize: "12px", color: "#8b949e" }}>
              Microsoft AI-200 • Azure CLI, AKS, Dynamic Sessions & Cosmos DB Vector Search
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: "flex", gap: "8px", background: "#161b22", padding: "4px", borderRadius: "10px", border: "1px solid #30363d", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("terminal")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "terminal" ? "#0078d4" : "transparent",
              color: activeTab === "terminal" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ⚡ Thực Hành CLI
          </button>
          <button
            onClick={() => setActiveTab("cheatsheet")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "cheatsheet" ? "#0078d4" : "transparent",
              color: activeTab === "cheatsheet" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            📖 Cẩm Nang Tra Cứu
          </button>
          <button
            onClick={() => setActiveTab("python")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "python" ? "#0078d4" : "transparent",
              color: activeTab === "python" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            🐍 Python Snippets
          </button>
          <button
            onClick={() => setActiveTab("yaml")}
            style={{
              padding: "8px 18px",
              borderRadius: "8px",
              border: "none",
              background: activeTab === "yaml" ? "#0078d4" : "transparent",
              color: activeTab === "yaml" ? "#ffffff" : "#8b949e",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            📄 YAML Manifests
          </button>
        </nav>
      </header>

      {/* Main View Area */}
      <main>
        {activeTab === "terminal" && <Terminal />}
        {activeTab === "cheatsheet" && <Cheatsheet />}
        {activeTab === "python" && <PythonSnippets />}
        {activeTab === "yaml" && <YamlSnippets />}
      </main>
    </div>
  );
}

export default App;
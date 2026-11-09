import React, { useState, useMemo } from "react";
import { CHEATSHEET_SECTIONS } from "../data/cheatsheet";

export const CHEATSHEET_TOPICS = [
  {
    id: "all",
    name: "🌟 Tất cả chủ đề",
    badgeColor: "#58a6ff",
    bgActive: "#0078d4",
    desc: "Toàn bộ 13 phần cẩm nang tra cứu và mẹo phòng thi AI-200",
    sectionIds: [
      "exam-tips-spotlight",
      "level-1-setup",
      "level-2-acr",
      "level-3-appservice",
      "level-4-rbac",
      "level-5-sidecar",
      "level-6-containerapps",
      "level-7-aks",
      "level-8-cosmosdb-vector",
      "level-9-postgresql",
      "level-10",
      "level-11",
      "level-12",
    ],
  },
  {
    id: "exam-tips",
    name: "⭐ Mẹo Thi AI-200",
    badgeColor: "#d29922",
    bgActive: "#b08800",
    desc: "4 Nguyên tắc vàng, cờ tham số quan trọng & mẹo phòng thi cốt lõi",
    sectionIds: ["exam-tips-spotlight"],
  },
  {
    id: "containers-platform",
    name: "🐳 Container & Nền Tảng",
    badgeColor: "#388bfd",
    bgActive: "#1f6feb",
    desc: "Azure CLI, ACR Tasks, App Service, RBAC Identity & Sidecar (Levels 1 - 5)",
    sectionIds: [
      "level-1-setup",
      "level-2-acr",
      "level-3-appservice",
      "level-4-rbac",
      "level-5-sidecar",
    ],
  },
  {
    id: "microservices-k8s",
    name: "☁️ Container Apps & AKS",
    badgeColor: "#bc8cff",
    bgActive: "#8957e5",
    desc: "Microservices ACA, Dynamic Sessions Sandbox, KQL & Kubernetes AKS (Levels 6 - 7)",
    sectionIds: ["level-6-containerapps", "level-7-aks"],
  },
  {
    id: "databases-vector",
    name: "🧠 CSDL & Vector Search",
    badgeColor: "#f78166",
    bgActive: "#da3633",
    desc: "Cosmos DB NoSQL, PostgreSQL pgvector & Azure Managed Redis RediSearch (Levels 8 - 10)",
    sectionIds: ["level-8-cosmosdb-vector", "level-9-postgresql", "level-10"],
  },
  {
    id: "backend-integration",
    name: "⚡ Backend & AI Workflows",
    badgeColor: "#a371f7",
    bgActive: "#8957e5",
    desc: "Service Bus Queues/Topics, Event Grid CloudEvents Pull, Durable Functions & MCP Server (Level 11)",
    sectionIds: ["level-11"],
  },
  {
    id: "security-appconfig",
    name: "🔐 Bảo Mật & App Config",
    badgeColor: "#34d399",
    bgActive: "#059669",
    desc: "Key Vault Secrets, RBAC Data Plane, App Config Label Stacking & Sentinel Dynamic Refresh (Level 12)",
    sectionIds: ["level-12"],
  },
];

export default function Cheatsheet() {
  const [activeTopic, setActiveTopic] = useState("all");
  const [selectedSubLevel, setSelectedSubLevel] = useState("all"); // "all" | specific sectionId
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleSectionCollapse = (secId) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [secId]: !prev[secId],
    }));
  };

  const handleTopicChange = (topicId) => {
    setActiveTopic(topicId);
    setSelectedSubLevel("all");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Find current topic config
  const currentTopic = useMemo(
    () => CHEATSHEET_TOPICS.find((t) => t.id === activeTopic) || CHEATSHEET_TOPICS[0],
    [activeTopic]
  );

  // Sections that belong to the active topic
  const topicSections = useMemo(() => {
    return CHEATSHEET_SECTIONS.filter((sec) =>
      currentTopic.sectionIds.includes(sec.id)
    );
  }, [currentTopic]);

  // Compute total commands count per topic for badges
  const topicCounts = useMemo(() => {
    const counts = {};
    for (const t of CHEATSHEET_TOPICS) {
      const total = CHEATSHEET_SECTIONS.filter((s) =>
        t.sectionIds.includes(s.id)
      ).reduce((sum, s) => sum + s.items.length, 0);
      counts[t.id] = total;
    }
    return counts;
  }, []);

  // Filter sections by search and sub-level
  const filteredSections = useMemo(() => {
    return topicSections
      .filter((sec) => {
        if (selectedSubLevel === "all") return true;
        return sec.id === selectedSubLevel;
      })
      .map((sec) => {
        const matchingItems = sec.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        return { ...sec, matchingItems };
      })
      .filter((sec) => (sec.matchingItems ? sec.matchingItems.length > 0 : false));
  }, [topicSections, selectedSubLevel, searchTerm]);

  // Count total visible commands
  const totalVisibleCommands = filteredSections.reduce(
    (sum, s) => sum + s.matchingItems.length,
    0
  );

  const toggleCollapseAll = () => {
    const areAllCollapsed = filteredSections.every((s) => collapsedSections[s.id]);
    const newState = {};
    filteredSections.forEach((s) => {
      newState[s.id] = !areAllCollapsed;
    });
    setCollapsedSections(newState);
  };

  return (
    <div className="cheatsheet-component" style={{ color: "#c9d1d9", position: "relative" }}>
      {/* =========================================================================
          STICKY PINNED HEADER: Position Sticky at top: 0 with Frosted Glass Effect
          Giúp thanh tab luôn cố định ở đầu màn hình khi cuộn chuột qua danh sách dài
          ========================================================================= */}
      <div
        className="cheatsheet-sticky-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(13, 17, 23, 0.94)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid #30363d",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
          marginLeft: "-32px",
          marginRight: "-32px",
          paddingLeft: "32px",
          paddingRight: "32px",
          paddingTop: "12px",
          paddingBottom: "14px",
          marginBottom: "20px",
        }}
      >
        {/* ROW 1: TOPIC TABS & UTILITY CONTROLS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          {/* Main Topic Tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            {CHEATSHEET_TOPICS.map((topic) => {
              const isActive = activeTopic === topic.id;
              const count = topicCounts[topic.id] || 0;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleTopicChange(topic.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: isActive ? `1px solid ${topic.badgeColor}` : "1px solid #30363d",
                    background: isActive ? topic.bgActive : "#161b22",
                    color: isActive ? "#ffffff" : "#c9d1d9",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    boxShadow: isActive ? "0 2px 10px rgba(0,0,0,0.4)" : "none",
                  }}
                >
                  <span>{topic.name}</span>
                  <span
                    style={{
                      background: isActive ? "rgba(255,255,255,0.25)" : "#21262d",
                      color: isActive ? "#ffffff" : "#8b949e",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions (Scroll Top & Collapse All) */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={toggleCollapseAll}
              title="Thu gọn hoặc mở rộng toàn bộ các phân mục"
              style={{
                background: "#21262d",
                border: "1px solid #30363d",
                color: "#c9d1d9",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.15s ease",
              }}
            >
              Thu gọn / Mở rộng
            </button>
            <button
              onClick={scrollToTop}
              title="Cuộn mượt mà về đầu trang"
              style={{
                background: "#21262d",
                border: "1px solid #30363d",
                color: "#58a6ff",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.15s ease",
              }}
            >
              <span>⬆</span> Lên đầu
            </button>
          </div>
        </div>

        {/* ROW 2: SUB-LEVEL PILLS & COMPACT SEARCH BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        >
          {/* Sub-level Filter Pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center", flex: "1 1 auto" }}>
            <span style={{ fontSize: "11px", color: "#8b949e", fontWeight: 700, marginRight: "4px" }}>
              CẤP ĐỘ:
            </span>
            <button
              onClick={() => setSelectedSubLevel("all")}
              style={{
                padding: "4px 10px",
                borderRadius: "14px",
                border: selectedSubLevel === "all" ? "1px solid #58a6ff" : "1px solid #30363d",
                background: selectedSubLevel === "all" ? "rgba(88, 166, 255, 0.25)" : "#0d1117",
                color: selectedSubLevel === "all" ? "#58a6ff" : "#8b949e",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Tất cả ({topicSections.reduce((acc, s) => acc + s.items.length, 0)})
            </button>

            {topicSections.map((sec) => {
              const isSelected = selectedSubLevel === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSubLevel(sec.id)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "14px",
                    border: isSelected ? "1px solid #58a6ff" : "1px solid #30363d",
                    background: isSelected ? "rgba(88, 166, 255, 0.25)" : "#0d1117",
                    color: isSelected ? "#58a6ff" : "#8b949e",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {sec.badge}: {sec.title.split(": ")[1] || sec.title} ({sec.items.length})
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div style={{ minWidth: "260px", flex: "0 1 320px" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Lọc lệnh (--image, -o tsv, redis...)..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "6px 12px",
                background: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: "6px",
                color: "#f0f6fc",
                fontSize: "12px",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTENT AREA: Sections List
          ========================================================================= */}
      {filteredSections.length === 0 ? (
        <div
          style={{
            background: "#161b22",
            borderRadius: "10px",
            border: "1px solid #30363d",
            padding: "50px 20px",
            textAlign: "center",
            color: "#8b949e",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔍</div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#f0f6fc", marginBottom: "6px" }}>
            Không tìm thấy câu lệnh phù hợp
          </div>
          <div style={{ fontSize: "13px" }}>
            Hãy thử tìm bằng từ khóa khác hoặc chuyển sang tab <strong>🌟 Tất cả chủ đề</strong>.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredSections.map((sec) => {
            const isCollapsed = !!collapsedSections[sec.id];
            return (
              <div
                key={sec.id}
                id={sec.id}
                style={{
                  background: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: "10px",
                  padding: "18px 20px",
                  transition: "all 0.15s ease",
                  scrollMarginTop: "140px", // Đảm bảo cuộn không bị che khuất bởi sticky header
                }}
              >
                {/* Section Header */}
                <div
                  onClick={() => toggleSectionCollapse(sec.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
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
                    <h3 style={{ margin: 0, fontSize: "16px", color: "#f0f6fc" }}>{sec.title}</h3>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#8b949e",
                        background: "#0d1117",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        border: "1px solid #30363d",
                      }}
                    >
                      {sec.matchingItems.length} lệnh
                    </span>
                  </div>

                  <div style={{ color: "#8b949e", fontSize: "13px", fontWeight: 600 }}>
                    {isCollapsed ? "▼ Mở rộng" : "▲ Thu gọn"}
                  </div>
                </div>

                {!isCollapsed && (
                  <>
                    <p style={{ margin: "10px 0 16px 0", fontSize: "13px", color: "#8b949e" }}>
                      {sec.summary}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
                            <div
                              style={{
                                fontWeight: 600,
                                color: "#f0f6fc",
                                marginBottom: "4px",
                                fontSize: "14px",
                              }}
                            >
                              {item.title}
                            </div>
                            <div style={{ fontSize: "13px", color: "#8b949e", marginBottom: "10px" }}>
                              {item.desc}
                            </div>

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
                                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                  fontSize: "13px",
                                  color: "#79c0ff",
                                  overflowX: "auto",
                                  textAlign: "left",
                                  whiteSpace: "pre-wrap",
                                  lineHeight: "1.45",
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
                                  fontWeight: 600,
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
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FLOATING QUICK JUMP TO TOP BUTTON */}
      <button
        onClick={scrollToTop}
        title="Lên đầu trang"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 99,
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "#0078d4",
          color: "#ffffff",
          border: "none",
          boxShadow: "0 4px 14px rgba(0, 120, 212, 0.5)",
          fontSize: "18px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
      >
        ▲
      </button>
    </div>
  );
}

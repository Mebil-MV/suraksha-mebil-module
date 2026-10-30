import { useState, useEffect } from "react";

export interface AnimationItem {
  id: number;
  title: string;
  category: string;
  phase: string;
  fileName: string;
  relativePath: string;
  publicUrl: string;
  fileSizeBytes: number;
}

export default function AwarenessCatalog() {
  const [animations, setAnimations] = useState<AnimationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeAnimation, setActiveAnimation] = useState<AnimationItem | null>(null);

  useEffect(() => {
    fetch("/awareness-animations/manifest.json")
      .then((res) => res.json())
      .then((data: AnimationItem[]) => {
        setAnimations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load awareness animations manifest", err);
        setLoading(false);
      });
  }, []);

  const categories = Array.from(new Set(animations.map((a) => a.category))).sort();

  const filtered = animations.filter((item) => {
    const matchesCat = categoryFilter === "all" || item.category === categoryFilter;
    const matchesPhase = phaseFilter === "all" || item.phase.includes(phaseFilter);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.fileName.toLowerCase().includes(q);

    return matchesCat && matchesPhase && matchesSearch;
  });

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading Awareness Simulations...</div>;
  }

  return (
    <div className="awareness-catalog-container" style={{ padding: "20px 0" }}>
      {/* Search & Filter Header */}
      <div
        className="catalog-controls card"
        style={{
          background: "#121c2b",
          border: "1px solid #1e314b",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search simulations by disaster or keyword (e.g. Earthquake, Evacuation, Flood)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#09111c",
            border: "1px solid #1e314b",
            color: "#fff",
            fontSize: "1rem",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>DISASTER:</span>
          <button
            onClick={() => setCategoryFilter("all")}
            className={`btn btn-sm ${categoryFilter === "all" ? "btn-primary" : "btn-outline"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn btn-sm ${categoryFilter === cat ? "btn-primary" : "btn-outline"}`}
              style={{ fontSize: "0.8rem" }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>RESPONSE PHASE:</span>
          {["all", "Before", "During", "After"].map((ph) => (
            <button
              key={ph}
              onClick={() => setPhaseFilter(ph)}
              className={`btn btn-sm ${phaseFilter === ph ? "btn-primary" : "btn-outline"}`}
              style={{ fontSize: "0.8rem", textTransform: "capitalize" }}
            >
              {ph}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Simulation Cards */}
      <div
        className="catalog-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "18px",
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            className="card"
            style={{
              background: "#101a2b",
              border: "1px solid #1e314b",
              borderRadius: "12px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: "#18283d",
                    color: "#38bdf8",
                  }}
                >
                  {item.category}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: item.phase.includes("Before")
                      ? "rgba(59, 130, 246, 0.2)"
                      : item.phase.includes("During")
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(16, 185, 129, 0.2)",
                    color: item.phase.includes("Before")
                      ? "#60a5fa"
                      : item.phase.includes("During")
                      ? "#f87171"
                      : "#34d399",
                  }}
                >
                  {item.phase}
                </span>
              </div>
              <h4 style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 600, lineHeight: 1.4 }}>{item.title}</h4>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => setActiveAnimation(item)}
              >
                ▶ Run Simulation
              </button>
              <a
                href={encodeURI(item.publicUrl)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                Popout ↗
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Modal Player */}
      {activeAnimation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 99999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
          onClick={() => setActiveAnimation(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1050px",
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "16px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "14px 20px",
                background: "#1e293b",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ color: "#fff", fontSize: "1.1rem", margin: 0 }}>{activeAnimation.title}</h3>
              <button
                onClick={() => setActiveAnimation(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.6rem",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>
            <div style={{ width: "100%", height: "600px", background: "#000" }}>
              <iframe
                src={encodeURI(activeAnimation.publicUrl)}
                style={{ width: "100%", height: "100%", border: "none" }}
                title={activeAnimation.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

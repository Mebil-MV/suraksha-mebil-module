import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

export default function GoBagGamePage() {
  const navigate = useNavigate();
  const { lang } = useI18n();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 40px)", margin: "-20px" }}>
      {/* Top Bar with Return Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          background: "#0c1520",
          borderBottom: "1px solid #1e314b",
          color: "#e2e8f0",
        }}
      >
        <button
          onClick={() => navigate("/game")}
          className="btn btn-outline btn-sm"
          style={{ borderColor: "#334155", color: "#e2e8f0" }}
        >
          {lang === "hi" ? "← गेम्स आर्केड पर वापस" : "← Back to Games Arcade"}
        </button>
        <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#38bdf8" }}>
          🎒 {lang === "hi" ? "कमरे से किट पैक करें • गो-बैग चुनौती" : "Suraksha · Pack the Room (Go-Bag Challenge)"}
        </span>
        <button
          onClick={() => window.open("/games/go-bag/index.html", "_blank")}
          className="btn btn-sm btn-primary"
          style={{ background: "#38bdf8", color: "#08202b", fontWeight: 600 }}
        >
          {lang === "hi" ? "पूर्ण स्क्रीन ↗" : "Fullscreen ↗"}
        </button>
      </div>

      {/* Main Game iFrame */}
      <iframe
        title="Suraksha Pack Your Go-Bag Game"
        src="/games/go-bag/index.html"
        style={{
          width: "100%",
          flex: 1,
          border: "none",
          background: "#090e17",
        }}
      />
    </div>
  );
}

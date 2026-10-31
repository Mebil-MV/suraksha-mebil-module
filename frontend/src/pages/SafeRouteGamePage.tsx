import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

export default function SafeRouteGamePage() {
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
          background: "#111c25",
          borderBottom: "1px solid #405354",
          color: "#edf1e5",
        }}
      >
        <button
          onClick={() => navigate("/game")}
          className="btn btn-outline btn-sm"
          style={{ borderColor: "#61746c", color: "#edf1e5" }}
        >
          {lang === "hi" ? "← गेम्स आर्केड पर वापस" : "← Back to Games Arcade"}
        </button>
        <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#9dd9ae" }}>
          🗺️ {lang === "hi" ? "सुरक्षित रास्ता खोजें • बाढ़ निकासी सिमुलेशन" : "Suraksha • Safe Route Navigator"}
        </span>
        <button
          onClick={() => window.open("/games/safe-route/index.html", "_blank")}
          className="btn btn-sm btn-primary"
          style={{ background: "#9dd9ae", color: "#172d27", fontWeight: 600 }}
        >
          {lang === "hi" ? "पूर्ण स्क्रीन ↗" : "Fullscreen ↗"}
        </button>
      </div>

      {/* Main Game iFrame */}
      <iframe
        title="Suraksha Safe Route Navigator"
        src="/games/safe-route/index.html"
        style={{
          width: "100%",
          flex: 1,
          border: "none",
          background: "#111c25",
        }}
      />
    </div>
  );
}

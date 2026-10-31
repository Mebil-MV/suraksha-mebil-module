import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";

export default function GamePage() {
  const navigate = useNavigate();
  const { lang } = useI18n();

  const games = [
    {
      id: "safe-route",
      title: lang === "hi" ? "सुरक्षित रास्ता खोजक (Safe Route Navigator)" : "Safe Route Navigator",
      category: lang === "hi" ? "बाढ़ एवं तूफान निकासी" : "Flood & Storm Evacuation",
      icon: "🗺️",
      badge: lang === "hi" ? "नया • इंटरैक्टिव सिमुलेशन" : "NEW • Interactive Canvas",
      badgeColor: "#9dd9ae",
      description:
        lang === "hi"
          ? "बाढ़ और तूफान के दौरान घर से सुरक्षित आश्रय तक सूखा रास्ता बनाएं। नियंत्रण कक्ष से सड़क रिपोर्ट मांगें, खुले मैनहोल व टूटे बिजली के तारों से बचें और मौसम बदलने पर रास्ता बदलें।"
          : "Plan an evacuation route from HOME to the hilltop SHELTER. Request control room updates, avoid downed power lines & submerged open manholes, and adapt to rising water levels.",
      features: [
        lang === "hi" ? "3 गतिशील मौसम चरण (बारिश, बढ़ता पानी, गंभीर तूफान)" : "3 dynamic storm phases with evolving closures",
        lang === "hi" ? "नियंत्रण कक्ष से लाइव सड़क जांच रिपोर्ट" : "Live control-room road survey reports",
        lang === "hi" ? "द्विभाषी आवाज और उपशीर्षक" : "Full bilingual voice and subtitle support",
      ],
      path: "/games/safe-route",
      popout: "/games/safe-route/index.html",
      btnText: lang === "hi" ? "▶ मिशन शुरू करें" : "▶ Play Navigator",
    },
    {
      id: "go-bag",
      title: lang === "hi" ? "अपना गो-बैग पैक करें (Pack Your Go-Bag)" : "Pack Your Go-Bag Challenge",
      category: lang === "hi" ? "आपातकालीन किट तैयारी" : "Emergency Kit Preparation",
      icon: "🎒",
      badge: lang === "hi" ? "नया • 60-सेकंड टाइमर" : "NEW • 60s Timed Challenge",
      badgeColor: "#38bdf8",
      description:
        lang === "hi"
          ? "आपात स्थिति में केवल 60 सेकंड के भीतर जरूरी वस्तुएं पैक करें! 6 किग्रा वजन सीमा और 8 आइटम स्लॉट का ध्यान रखें। विलासिता की फालतू चीजें पैक करने पर अंक कटेंगे।"
          : "Pack essential emergency supplies into your survival backpack under 60 seconds. Manage strict 6 kg weight limits and 8 item slots while avoiding heavy non-essentials.",
      features: [
        lang === "hi" ? "60s समयबद्ध चुनौती और अभ्यास मोड" : "60s Timed challenge or untimed practice mode",
        lang === "hi" ? "वजन और स्लॉट क्षमता भौतिकी" : "Weight (kg) and item slot capacity mechanics",
        lang === "hi" ? "किट मास्टर बैज अनलॉकिंग" : "Kit Master badge & readiness XP unlocks",
      ],
      path: "/games/go-bag",
      popout: "/games/go-bag/index.html",
      btnText: lang === "hi" ? "▶ बैग पैक करें" : "▶ Pack Bag",
    },
    {
      id: "flood-game",
      title: lang === "hi" ? "बाढ़ से बचाव (Flood Survival Escape)" : "Flood Survival Escape",
      category: lang === "hi" ? "रात की बाढ़ निर्णय श्रृंखला" : "Night Flash Flood Decisions",
      icon: "🌊",
      badge: lang === "hi" ? "निर्णय शाखा" : "Decision Branching",
      badgeColor: "#60a5fa",
      description:
        lang === "hi"
          ? "आधी रात को अचानक बाढ़ का पानी घर में घुस जाता है। सही फैसले लें: खिलौने समेटने में समय न गंवाएं, छत पर शरण लें और बचाव दल को लाल कपड़े से संकेत दें।"
          : "Water enters your home in the middle of the night. Make split-second survival decisions: move to the roof, avoid swimming in rapid floodwater, and signal for helicopter rescue.",
      features: [
        lang === "hi" ? "चरणबद्ध निर्णय वृक्ष" : "Step-by-step branching decision trees",
        lang === "hi" ? "हेलीकॉप्टर बचाव एनीमेशन" : "Helicopter rescue and sprite animations",
        lang === "hi" ? "जीवन रक्षक सुरक्षा पाठ" : "Life-saving educational consequence feedback",
      ],
      path: "/flood-game",
      btnText: lang === "hi" ? "▶ बाढ़ से बचें" : "▶ Escape Flood",
    },
    {
      id: "quiz-game",
      title: lang === "hi" ? "आपदा परिदृश्य क्विज़ (Hazard Scenarios)" : "Disaster Hazard Scenarios",
      category: lang === "hi" ? "दृश्य सिमुलेशन क्विज़" : "Visual Simulation Quiz",
      icon: "⚡",
      badge: lang === "hi" ? "SVG सिमुलेशन" : "SVG Simulations",
      badgeColor: "#fbbf24",
      description:
        lang === "hi"
          ? "भूकंप, सुनामी, आग और बवंडर के दृश्य परिदृश्यों में अपनी सजगता परखें। सही उत्तर देकर अंक कमाएं और ऑडियो सहायता का लाभ उठाएं।"
          : "Test your situational awareness during animated earthquake tremors, receding tsunami shorelines, and smoke corridors. Earn points with instant voice narration.",
      features: [
        lang === "hi" ? "एनिमेटेड भूकंप और सुनामी दृश्य" : "Animated SVG earthquakes, smoke & tsunamis",
        lang === "hi" ? "वॉइस ऑडियो सहायता (TTS)" : "Integrated Text-to-Speech audio readout",
        lang === "hi" ? "तैयारी स्तर अपग्रेड" : "Readiness profile point increments",
      ],
      path: "/quiz",
      btnText: lang === "hi" ? "▶ क्विज़ शुरू करें" : "▶ Start Scenarios",
    },
  ];

  return (
    <div className="game-arcade-page" style={{ padding: "10px 0 40px" }}>
      {/* Header */}
      <div
        className="arcade-header card"
        style={{
          background: "linear-gradient(135deg, #101a2b 0%, #0d1522 100%)",
          border: "1px solid #1e314b",
          borderRadius: "16px",
          padding: "30px 24px",
          marginBottom: "30px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        }}
      >
        <span style={{ fontSize: "2.8rem" }}>🎮</span>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 700, margin: "10px 0 8px", color: "#fff" }}>
          {lang === "hi" ? "सुरक्षा • आपदा उत्तरजीविता गेम्स आर्केड" : "Suraksha • Disaster Survival Games Arcade"}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "680px", margin: "0 auto" }}>
          {lang === "hi"
            ? "आपात स्थितियों के लिए अपने निर्णय और तैयारी को परखें। इंटरैक्टिव गेम्स खेलें, निकासी मार्ग सीखें और सुरक्षा अंक कमाएं!"
            : "Master life-saving emergency instincts through interactive simulations. Plan safe evacuation routes, pack emergency kits, and earn Readiness XP!"}
        </p>
      </div>

      {/* Grid of Games */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "24px",
        }}
      >
        {games.map((g) => (
          <div
            key={g.id}
            className="card game-card"
            style={{
              background: "#121c2b",
              border: "1px solid #1e314b",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "2.2rem" }}>{g.icon}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    background: "rgba(56, 189, 248, 0.12)",
                    color: g.badgeColor,
                    border: `1px solid ${g.badgeColor}40`,
                  }}
                >
                  {g.badge}
                </span>
              </div>

              <span style={{ fontSize: "0.8rem", color: "#38bdf8", fontWeight: 600, textTransform: "uppercase" }}>
                {g.category}
              </span>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "6px 0 12px", color: "#fff" }}>
                {g.title}
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: "16px" }}>
                {g.description}
              </p>

              <div style={{ background: "#09111c", padding: "12px", borderRadius: "10px", marginBottom: "20px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase" }}>
                  {lang === "hi" ? "प्रमुख विशेषताएं:" : "Key Highlights:"}
                </span>
                <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.4 }}>
                  {g.features.map((feat, i) => (
                    <li key={i} style={{ marginBottom: "4px" }}>{feat}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: "10px 16px", fontWeight: 600 }}
                onClick={() => navigate(g.path)}
              >
                {g.btnText}
              </button>
              {g.popout && (
                <button
                  className="btn btn-outline"
                  title="Open Fullscreen in New Tab"
                  onClick={() => window.open(g.popout, "_blank")}
                  style={{ padding: "10px 14px" }}
                >
                  ↗
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

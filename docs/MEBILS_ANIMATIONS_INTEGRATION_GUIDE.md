# 📚 Mebil's Community Awareness & Disaster Survival Animations: Integration Guide
> **Prepared for:** Aryan (Platform Architecture, Full-Stack Development & Integration)  
> **Author:** Mebil (Community Mobilization, Preparedness & Recovery Module)  
> **Platform:** Suraksha Disaster Preparedness Platform  

---

## 🌟 1. Executive Summary

As part of **Mebil's Community Mobilization & Preparedness Module**, this suite delivers **49 standalone, interactive HTML5 Canvas & Vector disaster preparedness simulations** covering **11 disaster domains** across all critical disaster response phases (**Before, During, and After**).

All animation assets have been systematically structured inside `frontend/public/awareness-animations/` and documented with a machine-readable `manifest.json`, an interactive standalone test gallery, and a drop-in React component.

---

## 📁 2. File Organization & Asset Location

Because these simulations use complex HTML5 Canvas 2D engines, procedural particle loops, and Web Speech Synthesis, they are placed directly in Vite's public asset directory:

```
frontend/public/awareness-animations/
├── manifest.json                                      <- Complete machine-readable metadata index
├── index.html                                         <- Interactive preview gallery & search engine
│
├── Building guids resist earth quake and cyclones/    <- 8 structural & architectural safety guides
├── Cold wave frost/                                   <- 7 winter survival & hypothermia prevention guides
│   ├── before/
│   └── During/
├── Cyclon/                                            <- Cyclone readiness procedures
├── Earth quake/                                       <- 5 seismic safety simulations
│   ├── Before/
│   ├── During/
│   └── After/
├── Emergency kit/                                     <- 2 emergency backpack & disability kit guides
├── FIre awanesss/                                     <- 3 school & domestic fire evacuation guides
│   ├── Before/
│   ├── During/
│   └── After/
├── Flood/                                             <- 5 flash flood & family night rescue simulations
│   └── does and donts/
│       ├── Before/
│       ├── During/
│       │   └── Flood_family/                          <- (index.html + family-flood.js)
│       └── After/
├── Heat wave/                                         <- 4 extreme summer & heat stroke guides
├── landslide/                                         <- 13 slope liquefaction, terrain & drainage guides
│   ├── does  and donts/
│   │   ├── Before/
│   │   ├── During/
│   │   └── After/
│   └── For media/
├── snake bite/                                        <- 1 emergency envenomation first aid guide
│   └── does&donts/
└── Storm hazard/                                      <- 1 severe gale wind & falling branch hazard guide
    └── does and donts/
        └── During/
```

> **Why this structure is optimal for Aryan's React architecture:**  
> Files in `frontend/public/` are served statically by Vite without going through the Webpack/Vite bundler. This prevents canvas memory leaks, audio context conflicts, and React re-render collisions. They can be embedded seamlessly using native `<iframe>` tags or loaded dynamically via the provided `AwarenessCatalog` component.

---

## ⚡ 3. How to Integrate into the React App

### Option A: Using the Drop-in React Component (`<AwarenessCatalog />`)

A pre-built, responsive React catalog has been created at [`frontend/src/components/AwarenessCatalog.tsx`](file:///c:/Users/ACER/disaster-preparedness-project/frontend/src/components/AwarenessCatalog.tsx).

It automatically fetches `/awareness-animations/manifest.json`, renders search and filter pills by Category and Response Phase, and provides a fullscreen modal player for the user.

**Usage:**
```tsx
import AwarenessCatalog from "../components/AwarenessCatalog";

export default function PreparednessPage() {
  return (
    <div className="preparedness-page">
      <h1>Community Preparedness Hub</h1>
      {/* Drop-in awareness simulation catalog */}
      <AwarenessCatalog />
    </div>
  );
}
```

---

### Option B: Embedding Any Single Animation Directly

To embed any specific simulation on a dedicated page (e.g., Flood, Landslide, or Earthquake tab), use a standard responsive `<iframe>`:

```tsx
<div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "12px", overflow: "hidden" }}>
  <iframe
    src="/awareness-animations/landslide/does%20%20and%20donts/During/During%20a%20Landslide_%20Survival%20PSA.html"
    title="Landslide Survival PSA"
    style={{ width: "100%", height: "100%", border: "none" }}
    allow="autoplay"
  />
</div>
```

---

## 📊 4. Master Catalog & Disaster Index

| Category | Count | Phases Covered | Key Topics & Technical Features |
| :--- | :---: | :--- | :--- |
| **Landslide** | 13 | Before, During, After, Media | Soil liquefaction, deforestation impact, drainage clearing, safe zone identification, early warning cracks. |
| **Building Guides (Earthquake & Cyclone)** | 8 | General Structural | Wall openings, building length/angles/elevation/shapes, open ground storeys, liquefaction foundations, high flood level (HFL). |
| **Cold Wave & Frost** | 7 | Before, During | Safe indoor heating, hypothermia prevention, dressing layers, livestock & pet care, winter first aid. |
| **Earthquake** | 5 | Before, During, After | Drop-Cover-Hold on, structural hazards, utility gas/electric shutoff, post-quake evacuation. |
| **Flood** | 5 | Before, During, After | Nighttime family evacuation to upper floors, emergency backpack collection, post-flood sanitation. |
| **Heat Wave** | 4 | General Health | Heat stroke first aid, hydration protocols, protecting children and pets, outdoor worker safety. |
| **Fire Awareness** | 3 | Before, During, After | School fire evacuation protocols, smoke inhalation avoidance (crawl low), fire extinguishers. |
| **Emergency Kit** | 2 | Before | Standard disaster go-bag inventory, specialized disability emergency kit supplies. |
| **Storm Hazard** | 1 | During | Wind gale forces, tree collapse hazards, high-voltage line severance. |
| **Snake Bite** | 1 | During First Aid | Anti-venom protocols, pressure bandaging, critical dos and don'ts. |

---

## 🛠 5. Machine-Readable Metadata (`manifest.json`)

Located at: [`frontend/public/awareness-animations/manifest.json`](file:///c:/Users/ACER/disaster-preparedness-project/frontend/public/awareness-animations/manifest.json)

Every item follows this clean schema:
```json
{
  "id": 1,
  "title": "During a Landslide: Survival PSA",
  "category": "landslide",
  "phase": "During",
  "fileName": "During a Landslide_ Survival PSA.html",
  "relativePath": "landslide/does  and donts/During/During a Landslide_ Survival PSA.html",
  "publicUrl": "/awareness-animations/landslide/does  and donts/During/During a Landslide_ Survival PSA.html",
  "fileSizeBytes": 24696
}
```

Aryan can consume this JSON directly in any React component or backend API endpoint to dynamically render disaster education cards, filter by user location, or award quiz points.

---

## 🧪 6. Testing & Previewing

Aryan and team members can test the entire catalog locally:
1. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
2. Open the interactive animation tester in the browser:  
   👉 **`http://localhost:5173/awareness-animations/index.html`**

---

*This guide ensures Aryan has everything required for seamless, conflict-free integration.*

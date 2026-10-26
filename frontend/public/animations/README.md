# 🎬 Suraksha Disaster Preparedness — Master Animation Library

This directory houses the complete collection of visual and interactive animations developed for the **Suraksha Disaster Preparedness Platform**, systematically categorized with proper labeling, standalone source files, and live previews.

---

## 📁 Directory Structure & File Index

```
animations/
├── README.md                              <- Full documentation & architecture overview
├── index.html                             <- Master showcase gallery & interactive launcher
│
├── 01-city-flood-canvas/                  <- Multi-layer Canvas 2D Procedural Flood Simulation
│   ├── index.html                         <- Standalone 16:9 interactive canvas player
│   ├── animation.js                       <- Complete procedural JS animation engine
│   └── styles.css                         <- Glassmorphism player & dark/light theme CSS
│
├── 02-landslide-narrator/                 <- Landslide & Hillside Soil Liquefaction Simulation
│   ├── index.html                         <- Landslide simulation with dynamic narrator
│   └── landslide-presenter.js             <- Optional external narrator module
│
├── 03-family-flood-rescue/                <- Narrative Evacuation Simulation
│   ├── index.html                         <- Full simulation with family climbing upstairs
│   └── family-flood.js                    <- Procedural character animation logic
│
├── 04-tree-storm-hazard/                  <- Wind Dynamics & Tree Hazard Simulation
│   └── index.html                         <- Physics canvas for wind storms & falling branches
│
├── 05-disaster-vector-svgs/               <- SMIL Keyframe Vector Animations (Zero-Dependency)
│   ├── 01-earthquake-shaking.svg          <- Seismic waves, building faults, falling debris
│   ├── 02-rising-flood-waters.svg         <- Downpour rain, wave surface morphing, water climb
│   ├── 03-fire-smoke-corridor.svg         <- Carbon monoxide rolling smoke & flame flicker
│   ├── 04-tornado-cyclone.svg             <- Rotating cyclone funnel, 360° debris, lightning
│   └── 05-tsunami-ocean-wave.svg          <- Receding ocean seabed & building tsunami wall
│
└── 06-flood-game-css-sprites/             <- CSS Keyframe Interactive Game Sprites
    ├── index.html                         <- Live interactive preview with state controls
    └── game-animations.css                <- Helicopter hover, waving kid, water ripple styles
```

---

## 🏷️ Animation Modules & Technical Labels

### 1. `01-city-flood-canvas/` (Procedural Canvas 2D Flood Simulation)
* **Technology:** Vanilla JavaScript (ES6+), HTML5 `<canvas>`, CSS Variables
* **Key Mechanisms:**
  * **3-Depth Parallax Engine:** Generates procedurally seeded background (`far`), midground (`mid`), and foreground (`near`) city skylines with building types, window grids, and antenna warning lights.
  * **Dynamic Timeline Director:** 20-second cinematic progression (Wide Shot `t=0s` $\rightarrow$ Pan across district `t=6s` $\rightarrow$ Push-in zoom on inhabited house `t=14.5s`).
  * **Atmospheric Physics:** Superposed sinusoidal water surface waves ($y = A \cdot \sum \sin(\omega x \pm \phi)$), buoyant debris tilting along the wave surface gradient, rain streaks, and probabilistic lightning bolts with luminance grading.
* **How to run:** Double-click `01-city-flood-canvas/index.html` to open in any web browser.

### 2. `02-landslide-narrator/` (Hillside Landslide & Soil Liquefaction)
* **Technology:** HTML5 Canvas, Web Speech Synthesis API
* **Key Mechanisms:**
  * Shows hillside deforestation leaving soil vulnerable to severe torrential rainfall.
  * Models soil mass displacement down the slope burying valley buildings.
  * Synchronized speech narrator explaining disaster mechanics step-by-step.
* **How to run:** Open `02-landslide-narrator/index.html`.

### 3. `03-family-flood-rescue/` (Family Rescue & Emergency Checklist)
* **Technology:** HTML5 Canvas, Procedural Character Animation
* **Key Mechanisms:**
  * Narrative animation of a family evacuating during a nighttime flash flood.
  * Parents guide children upstairs away from rising floor floodwaters.
  * Collects an emergency kit checklist: drinking water, canned food, mobile phones, flashlight, and whistle.
* **How to run:** Open `03-family-flood-rescue/index.html`.

### 4. `04-tree-storm-hazard/` (Tree Storm & Wind Velocity Hazard)
* **Technology:** HTML5 Canvas 2D Aerodynamic Physics
* **Key Mechanisms:**
  * Demonstrates structural wind stress on trees, branch snapping, and flying debris during extreme gales.
  * Highlights why sheltering under trees or parking vehicles beneath large branches during storms is dangerous.
* **How to run:** Open `04-tree-storm-hazard/index.html`.

### 5. `05-disaster-vector-svgs/` (Standalone Animated Vector SVGs)
* **Technology:** SVG 1.1 + SMIL Keyframe `<animate>` and `<animateTransform>`
* **Features:**
  * Fully self-contained — no external dependencies, zero JavaScript required.
  * Crisp infinite vector scaling at any screen DPI.
  * Can be embedded anywhere via `<img>`, `<object>`, inline JSX, or as background images.
* **Files:**
  1. `01-earthquake-shaking.svg`: Foundation seismic waveforms and tumbling structural fragments.
  2. `02-rising-flood-waters.svg`: Oscillating water surface morphing with torrential downpour.
  3. `03-fire-smoke-corridor.svg`: Billowing turbulent smoke layers over an orange combustion gradient.
  4. `04-tornado-cyclone.svg`: Point-morphed cyclonic funnel with debris orbiting in 360°.
  5. `05-tsunami-ocean-wave.svg`: Tsunami shoreline warning showing the dramatic withdrawal of the sea.

### 6. `06-flood-game-css-sprites/` (CSS Keyframe Sprites)
* **Technology:** Pure CSS3 Keyframes (`@keyframes`) & CSS Transitions
* **Features:**
  * Lightweight UI animation for interactive gamified decision scenarios.
  * Sprites include:
    * Helicopter hover vibration (`@keyframes heliHover`)
    * Character arm waving & flag flutter (`@keyframes waveArm`, `@keyframes flagFlutter`)
    * Dynamic smooth hydraulic water level transitions (`transition: height 1s`).
* **How to run:** Open `06-flood-game-css-sprites/index.html` to toggle between disaster scenarios.

---

## 🌐 Quick Browser Access

You can open the **Master Showcase Gallery** directly:
* Local file path: [`animations/index.html`](index.html)
* When the Vite server is running: `http://localhost:5173/animations/`

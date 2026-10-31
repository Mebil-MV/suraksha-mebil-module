# Suraksha • Safe Route Navigator

A self-contained HTML/CSS/JavaScript evacuation planning game, styled after the supplied Canvas flood PSA references: faceted buildings and trees, muted green/blue scenery, rain, water ripples, warm safety markers and bilingual narration.

## Run
1. Extract this ZIP.
2. Open `index.html` in Chrome, Edge or Firefox. No dependency installation, internet connection, API key or build step is required.
3. Press Start mission.

If your browser restricts local files, open a terminal in this folder:

    python -m http.server 8000

On Windows, `py -m http.server 8000` is an alternative. Open http://localhost:8000 and stop the server with Ctrl+C.

## How to play
- Start at the orange family marker. Draw along connected road junctions to the green hilltop shelter. Tap adjacent junctions on mobile; drag with a pointer; or use the directional buttons.
- Keyboard: focus the map, then use arrow keys. Backspace or ↶ removes the last segment.
- Use Request road reports to reveal hidden hazards through the simulated control room. Unverified grey '?' roads cannot be crossed before a report. You do not walk into water to inspect them.
- Open manholes are initially hidden by an unverified road marker. Reports reveal the flooded drain and close that road. Other surveyed roads become dry in this fictional model only.
- Blue flooded roads, downed-cable roads and open-drain roads are blocked. Filling underpasses are closed from the beginning: racing rising water earns no reward.
- Press Guide the family after reaching the shelter with your planned route.
- Storm phase 2 begins after 12 simulated seconds; phase 3 after 26. Underpasses fill further and additional electrical closures appear. New hazards affect the route while the family is moving.
- If a new closure intersects your journey, movement stops, the orange marker stays at the preceding safe junction, and you can draw a detour. Do not keep drawing from HOME after moving.
- Pause freezes both the simulation and movement. Switching browser tabs automatically pauses. Resume manually.
- Complete three different missions to unlock Flood Navigator. Every mission remains solvable in every storm phase.

## Scoring
Each mission starts at 100 points. Attempting to add a hazardous/unverified road costs 5 points, capped at 30. Finishing without requesting reports deducts 10 points. The minimum successful score is 50. There is no speed bonus and no penalty for pausing or taking a safe detour. Only improvement over a mission's previous best earns new local XP; total XP from this game is capped at 300. Replaying does not farm points.

Progress is stored in localStorage under `suraksha-safe-route-v1`, separately from the earlier Go-Bag game. This is browser-local progress, not authenticated Suraksha profile progress. Private browsing or clearing site data can remove it. Hindi voice availability depends on installed OS/browser voices; written Hindi is included regardless.

## Safety model and limits
This is an educational game, not routing software. Entire hazardous edges are excluded, not just the pictured cable or drain. Never use map distances here to estimate real electrical exclusion zones. Unknown roads remain unavailable until a fictional official report. The game has a deliberately simplified road-only world; real emergency information may be incomplete, and a safe route may not exist. Follow local authorities, evacuation orders and designated routes. Do not enter floodwater, bypass barricades, approach fallen lines, or delay real evacuation to play.

If a closure appears mid-segment, the simulation resets the family to the previous safe junction without depicting a crossing or injury. This is a teaching abstraction, not a real-world instruction to retrace a hazardous road. Seek official assistance when safe evacuation is unavailable.

Safety references:
- https://www.cdc.gov/floods/safety/floodwater-after-a-disaster-or-emergency-safety.html
- https://www.weather.gov/safety/flood-turn-around-dont-drown
- https://www.cdc.gov/natural-disasters/response/what-to-do-protect-yourself-from-electrical-hazards.html

## Embed in Suraksha React/Vite
Copy `index.html` to `frontend/public/games/safe-route/index.html`.
A direct link can point to `/games/safe-route/index.html`.

Or create `frontend/src/pages/SafeRouteGame.tsx`:

```tsx
export default function SafeRouteGame() {
  return (
    <iframe
      title="Suraksha Safe Route Navigator"
      src="/games/safe-route/index.html"
      style={{ width: '100%', height: '100dvh', border: 0 }}
    />
  );
}
```

Import this component in App.tsx. If your app already uses React Router, add within its existing Routes:

```tsx
<Route path="/games/safe-route" element={<SafeRouteGame />} />
```

Run the app using its existing commands, normally `npm install` and `npm run dev`, from frontend. Use the Vite URL printed in the terminal.

This deliverable is a standalone Canvas game, not a native React rewrite. Its bilingual strings live in `I18N`; for full native integration, migrate them into en.json/hi.json and use the existing useI18n hook. It does not call the backend: no game-completion POST endpoint was provided. Real profile XP requires an authenticated, server-validated, idempotent completion endpoint. Never use editable localStorage scores as authoritative leaderboard data.

## Source map
All code is in index.html:
- `I18N`: English/Hindi copy.
- `missionConfigs`: starts, destinations and hazard road edges.
- `hazard`: road availability and storm transitions.
- `planNode`, `guide`, `update`: planning and movement state machine.
- `draw`: faceted map, road hazards, family and weather.

## Validation
JavaScript syntax checked. Automated logic checks with a simulated DOM verified every mission in every storm phase, safe completion, route adjacency, hazard blocking, unknown/manhole handling, undo, pause, Hindi UI, dynamic stop/reroute and XP bounds. The map was rendered using a Canvas engine and visually inspected. A real browser/device interaction test remains to be done.

## Optional solution hints
These dry routes remain available through all storm phases. A node ID is row*6+column on the 5-row, 6-column map.
- Mission 1: 24 → 18 → 12 → 6 → 0 → 1 → 2 → 3 → 4 → 5.
- Mission 2: 29 → 23 → 17 → 11 → 5 → 4 → 3 → 2 → 1 → 0.
- Mission 3: 25 → 24 → 18 → 12 → 6 → 0 → 1 → 2 → 3 → 4 → 5.

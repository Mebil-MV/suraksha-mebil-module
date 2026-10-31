# Suraksha: Pack Your Go-Bag

## Run immediately
Open index.html in Chrome, Edge or Firefox. No installation, internet or API key is required. Narration uses available browser/OS voices; Hindi voice availability varies.

If your browser restricts local files, open a terminal in this folder and run:

    python -m http.server 8000

Then visit http://localhost:8000. On Windows, try `py -m http.server 8000` if `python` is unavailable. Stop with Ctrl+C.

## Play
Choose English or Hindi, select timed challenge or untimed practice, and press Start. Tap/click a card to pack or remove it. Desktop drag-and-drop is also available. Pack eight essentials within 6 kg and eight item slots. Finish manually or wait for the timer. The timer continues if you switch tabs.

Eight essentials yield 100 points; each selected luxury item deducts 15. The score cannot be negative. Kit Master unlocks at 100. The bag capacities and weights are illustrative game mechanics, not a sufficient real-world emergency kit. See Ready.gov/kit and adapt to local official guidance and household needs.

## Local progress
The best score, Kit Master badge and XP are saved in localStorage under `suraksha-go-bag-v1`. Only improvement over the previous best earns new XP, so replay farming is prevented. Maximum XP from this one game is 100. Rank thresholds match the project brief: 0–100, 101–300, 301–600, 601+. Higher ranks need other games in the eventual shared profile. No community leaderboard is fabricated.

## Add to existing Suraksha React/Vite app
1. Copy index.html to frontend/public/games/go-bag/index.html.
2. Link to `/games/go-bag/index.html` from your app. Or add this component at frontend/src/pages/GoBagGame.tsx:

```tsx
export default function GoBagGame() {
  return (
    <iframe
      title="Suraksha Go-Bag Game"
      src="/games/go-bag/index.html"
      style={{ width: '100%', height: '100dvh', border: 0 }}
    />
  );
}
```

3. If your app already uses React Router, import the component into App.tsx and add inside its existing Routes:

```tsx
<Route path="/games/go-bag" element={<GoBagGame />} />
```

4. From frontend, run your existing dependency install and dev scripts, normally:

    npm install
    npm run dev

Open the URL Vite prints, then /games/go-bag. No new dependency is required by this game.

## Backend integration boundary
This is a complete standalone vanilla HTML/CSS/JavaScript implementation, embedded in React through an iframe. It has its own bilingual dictionary; it does not yet use Suraksha's useI18n hook or shared JSON translations. It does not award backend profile points. The brief lists no POST game-score endpoint, so none is guessed or called. For native integration, move the UI into React, move `texts` into en.json/hi.json, and implement an authenticated server-authoritative completion endpoint with unique per-user game achievements and transactional XP awards. Do not trust localStorage or client-supplied scores for a public leaderboard.

## Files
index.html contains all source, styles, item definitions and game logic. Edit the supplies array to change items; update both language entries together. No downloaded assets or external libraries are used.

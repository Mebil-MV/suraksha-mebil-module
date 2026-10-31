# Suraksha — Pack the Room

A mobile-first emergency go-bag game. Explore an illustrated living room, choose useful supplies, and slide them into the backpack.

## Play on a phone
Open the hosted game link in your phone's browser. Choose English or Hindi, select the 60-second challenge or untimed practice, then press Start.

1. Hold an object and slide your finger to the backpack.
2. Release over the backpack to pack it. The object disappears from the room.
3. Alternatively, tap an object, then tap the backpack or the Pack button. This also supports keyboard controls.
4. Tap Look inside to see the bag. Tap a packed item to return it to the room.
5. Finish packing to see your score and an explanation for every essential you packed or missed.

The timer continues while reading help, inspecting the bag, or using another tab. Replays shuffle the objects around the room. Practice has no timer.

## Run the downloaded source
Unzip this archive and open `suraksha-go-bag/index.html` in a modern browser. All art, styling, text, and game logic are embedded in this single file; the game needs no external packages, fonts, image downloads, API keys, or internet connection. The external guidance link requires internet. Optional instruction narration depends on installed browser/device voices. Hindi text is always included; Hindi narration requires a Hindi voice installed on the device.

If opening local HTML is inconvenient on your phone, serve the folder on a computer on the same trusted Wi-Fi:

    python -m http.server 8000 --bind 0.0.0.0

On Windows, use `py` instead of `python` when needed. Open `http://YOUR_COMPUTER_LAN_IP:8000` on the phone. Allow local-network access to the server if your firewall asks. Stop with Ctrl+C. Alternatively, use the provided hosted link.

## Game rules
There are 12 objects in the room: 8 essentials and 4 distractions. The bag holds 8 objects and up to 6 kg. These limits and weights are teaching mechanics, not real kit recommendations.

Each packed essential earns 12.5 points; each low-priority item deducts 15. The essential subtotal is rounded to an integer, penalties are subtracted, and the score is clamped at zero. A perfect bag earns 100 points and the Kit Master badge. The eight essentials weigh 4.8 kg in this game, so a perfect kit always fits.

Personal best, badge, and XP use the existing `suraksha-go-bag-v1` browser storage key. Only improvement over your previous best earns new XP; this game's lifetime XP maximum is 100. If storage is blocked, the game still runs and retains progress during the visit. This is a local score, not a server-verified leaderboard.

## Accessibility and mobile controls
- Pointer Events handle mouse, pen, and touch dragging; HTML desktop-only drag-and-drop is not used.
- Finger movement on objects does not scroll the room; normal swiping elsewhere scrolls the page.
- Tap-select + tap-bag is an alternative to dragging.
- Keyboard: Tab to an object and press Enter or Space. Focus moves to the Pack button; activate it to pack.
- Bag dialogs support keyboard navigation and Escape to close.
- English/Hindi text, status announcements, visible focus states, and reduced-motion support are included.
- Timer uses a deadline rather than tick counting; expired rounds cannot accept new items.
- Reloading restarts the current round; best score and badge remain when browser storage is available.

## Integrate with the Suraksha app
Copy `index.html` into `frontend/public/games/go-bag/index.html` in your existing React/Vite project. Link to `/games/go-bag/index.html` or embed it:

```tsx
export default function GoBagGame() {
  return (
    <iframe
      title="Suraksha — Pack the Room"
      src="/games/go-bag/index.html"
      style={{ width: '100%', height: '100dvh', border: 0 }}
    />
  );
}
```

No new application dependency is needed. This standalone version does not call the Suraksha backend, award shared profile XP, or use the app's i18n hook. Add a server-authoritative score endpoint if you later connect real rewards or leaderboards.

## Safety content
This is an introductory packing exercise, not a complete household supply checklist. In an actual emergency, follow local official guidance and do not delay evacuation to collect belongings. Plan household supplies, personal medicines, emergency contacts, accessibility needs, and infant/pet needs in advance. One illustrated bottle is only part of a water plan. Choose ready-to-eat food and provide any necessary opener.

Reference: https://www.ready.gov/kit
Checklist: https://www.ready.gov/sites/default/files/2024-05/ready_supply-kit-checklist.pdf

## Source
`index.html` contains the complete editable source. `supplies` contains names, weights, essential flags, and explanations; `texts` contains the bilingual UI; `positions` controls the room locations. All illustrations are inline SVG.

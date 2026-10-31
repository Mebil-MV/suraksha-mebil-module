# Suraksha Quiz Pack

Quizzes for the Suraksha safety animations: **49 animations, 173 questions** (151 multiple choice, 22 true/false). Every question and every explanation comes from what the animation itself says (narration, captions and on-screen text), so a learner who watched the animation can answer it.

## Give this to Antigravity

1. Unzip this pack into your app's repository (or attach it to the Antigravity chat).
2. Paste this prompt:

> Read `suraksha_quiz_pack/ANTIGRAVITY_INTEGRATION.md` and follow it. Before changing code, inspect the repo, tell me which framework you found and where animations are listed and played, and propose a short plan. Then add a quiz for each animation using `suraksha_quiz_pack/data/quiz_bank.json`. Do not edit the animation HTML files.

## What's inside

| Path | Purpose |
|---|---|
| `data/quiz_bank.json` | The quiz data. Source of truth. |
| `data/quiz_bank.schema.json` | JSON Schema for validating the data. |
| `ANTIGRAVITY_INTEGRATION.md` | Spec for the agent: data contract, UX, scoring, mapping table, acceptance checks. |
| `reference/quiz_player.html` | Working quiz UI with the data embedded. Double-click to preview. Shows the intended behaviour. |
| `review/quiz_bank_readable.md` | Every question with the correct answer marked, for proofreading. |

## Coverage

| Hazard | Animations | Questions |
|---|---|---|
| Earthquake | 5 | 20 |
| Safe Building & Site Selection | 8 | 25 |
| Landslide | 13 | 44 |
| Flood | 5 | 18 |
| Heat Wave | 4 | 16 |
| Cold Wave | 7 | 25 |
| School Fire | 3 | 10 |
| Emergency Kit | 2 | 8 |
| Snake Bite | 1 | 4 |
| Storm | 1 | 3 |

## Things to know

- **Two animation files are empty (0 bytes), so they have no quiz:** `Building guids…/safesite.html` and `Cyclon/cyclon_prepardness_dos.html`. When you have the real files, send them and I'll add the quizzes.
- **Have a domain expert review the first-aid items** (heat stroke, snake bite, frostbite, children in heat) before release. The questions only restate the animations, but the animations are the source of truth, so any error there carries over.
- **Hindi:** the animations support Hindi subtitles, but this pack is English only. The integration guide describes a `quiz_bank.hi.json` format that reuses the same IDs, so Hindi can be added without changing code.
- **Landslide media animations** mention US bodies (American Red Cross, National Flood Insurance Program). The quiz wording is generic ("flood insurance programme"), but you may want to localise those animations for Indian users.
- Answer positions are shuffled and fixed in the data (A to D are evenly spread), so the app does not need to shuffle.

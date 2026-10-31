# Integration guide: Suraksha quizzes

Audience: the coding agent (Antigravity). Goal: after a learner watches a safety animation, let them take a short quiz about it, see instant feedback and a result, and have their best score remembered.

## 0. Before you write code

1. Inspect the repo. Report the framework, language, router, state management, and how the animation HTML files are loaded (iframe, WebView, asset import, etc.).
2. Find where the animations are listed and where one is played.
3. Propose a short plan and wait for approval if anything is ambiguous.

Follow the app's existing conventions (structure, styling, naming, tests). Do not introduce a new framework for this feature.

## 1. Hard rules

- **Do not edit the animation HTML/JS files.** They are self-contained canvas animations. Launch the quiz from the app's own UI.
- **Do not hardcode questions in components.** Load them from `data/quiz_bank.json` (copy it into the app's assets/data folder and import or fetch it).
- **Do not rewrite question text, options, `correctIndex` or explanations.** If you find a mistake, report it instead of silently changing it.
- Must work offline once installed. No network calls for quizzes.

## 2. Data contract

`data/quiz_bank.json` (validate with `data/quiz_bank.schema.json`):

```
{
  "schemaVersion": "1.0", "language": "en",
  "defaults": { "passingScorePercent": 60, "shuffleQuestions": false, "shuffleOptions": false,
                "showExplanationAfterEachQuestion": true },
  "hazards":    [ { "id", "name", "description", "animationIds": [..] } ],
  "animations": [ { "animationId", "title", "hazard", "phase": "before|during|after|general",
                    "animationSource": "<path in Suraksha_Animations.zip>",
                    "questions": [ { "id", "type": "single_choice|true_false",
                                     "question", "options": [..], "correctIndex", "explanation" } ] } ]
}
```

- `single_choice` has 4 options; `true_false` has `["True","False"]`.
- `correctIndex` is the 0-based index of the correct option. Option order is already shuffled in the data; keep it as is.
- `animationId` is the stable key. Question ids are `<animationId>-q<n>` and are stable. Use them for stored progress.

## 3. Linking each animation to its quiz

Each quiz has `animationSource`, the path of the source file inside `Suraksha_Animations.zip`. The app's copy may have been renamed, moved or flattened. Match in this order:

1. Exact match on `animationSource`.
2. Match on the file name only, normalised: lowercase, strip a trailing ` (1)`, and remove non-alphanumerics.
3. If still unmatched, list the animation in your report. Do not guess.

Also report any animation in the app that has no quiz, and any quiz whose animation is not in the app. A full mapping table is in section 8.

## 4. UX requirements

Entry points
- On each animation's screen, add a clear **"Test yourself"** button (plain label, not an icon only). Show it at all times. If the app can detect that playback finished, also highlight it then.
- Optional: on each hazard screen, show a quiz badge per animation with the learner's best score.

Quiz flow (see `reference/quiz_player.html` for a working version)
1. One question per screen with "Question X of N" and a progress bar.
2. Options are large tap targets (min 48px height).
3. On selection, lock the options immediately and show:
   - the correct option marked with a ✓ and a green style,
   - a wrong choice marked with a ✗ and a red style,
   - a feedback box with "Correct." or "Not quite." followed by the `explanation`.
   Never rely on colour alone.
4. A "Next question" button (becomes "See result" on the last question).
5. Result screen: score as "X of N", pass/fail using `defaults.passingScorePercent`, a **Review** list of missed questions with the correct answer and explanation, and buttons **Try again** and **Back to animations**.
6. A failed result should encourage re-watching the animation (offer a "Watch again" button that opens that animation).

Accessibility
- Full keyboard and screen reader support: visible focus, move focus to the question text on each new question, announce feedback with an `aria-live="polite"` region.
- Respect reduced-motion and dark mode settings the app already supports.
- Keep text readable at large system font sizes; children and older adults use this app.

## 5. Persistence

Store per-animation best score (percentage) and last attempt date, using the app's existing storage mechanism. Do not store anything personal. Provide one function to read and one to write so the storage backend can change later.

## 6. Optional: hazard-level challenge

If it fits the app, add a **hazard quiz** per hazard: pick 1 question at random from each animation of that hazard (cap 10), using the same quiz screens. Do this only after section 4 is done.

## 7. Adding Hindi later

Keep all UI strings in the app's existing i18n system. For Hindi content, a file `quiz_bank.hi.json` can use the **same structure and the same ids** with translated `title`, `question`, `options`, `explanation`. Keep `correctIndex` and option order identical. Load the file that matches the app language and fall back to English.

## 8. Acceptance checklist

- [ ] Every animation in the app that has an entry below shows a working "Test yourself" flow.
- [ ] All 173 questions render; no text is cut off on a 360px-wide screen.
- [ ] Correct and incorrect feedback appears immediately and includes the explanation.
- [ ] Result screen score, pass/fail, review list, retry and back all work.
- [ ] Best score persists across app restarts.
- [ ] Works offline.
- [ ] Keyboard and screen reader pass through the whole flow.
- [ ] A unit test loads `quiz_bank.json`, checks every `correctIndex` is in range, ids are unique, and every `animationSource` maps to a file in the app (or is listed as unmatched).
- [ ] A short report lists unmatched animations/quizzes and any content issues you noticed.

## 9. Animation → quiz mapping

| Animation ID | Hazard | Phase | Source file in Suraksha_Animations.zip | Qs |
|---|---|---|---|---|
| `eq-before` | earthquake | before | `Earth quake/Before/before_the_earthquake.html` | 4 |
| `eq-during` | earthquake | during | `Earth quake/During/During an Earthquake.html` | 4 |
| `eq-outdoors` | earthquake | during | `Earth quake/During/Earthquake Safety PSA.html` | 4 |
| `eq-after` | earthquake | after | `Earth quake/After/Earthquake Safety_ After the Quake.html` | 4 |
| `eq-utilities` | earthquake | after | `Earth quake/After/Earthquake Safety_ Utilities & Family Plan.html` | 4 |
| `bld-angles` | building | before | `Building guids resist earth quake and cyclones/earthquake_safety_building_angles.html` | 3 |
| `bld-elevation` | building | before | `Building guids resist earth quake and cyclones/earthquake_safety_building_elevation.html` | 3 |
| `bld-length` | building | before | `Building guids resist earth quake and cyclones/earthquake_safety_building_length.html` | 3 |
| `bld-shapes` | building | before | `Building guids resist earth quake and cyclones/earthquake_safety_building_shapes.html` | 3 |
| `bld-open-ground` | building | before | `Building guids resist earth quake and cyclones/earthquake_safety_open_ground_storeys (1).html` | 3 |
| `bld-wall-openings` | building | before | `Building guids resist earth quake and cyclones/earthquake_safety_wall_openings.html` | 3 |
| `bld-flood-hfl` | building | before | `Building guids resist earth quake and cyclones/flood_safety_above_hfl.html` | 3 |
| `bld-liquefaction` | building | before | `Building guids resist earth quake and cyclones/soil_safety_liquefaction.html` | 4 |
| `ls-before-risk` | landslide | before | `landslide/does  and donts/Before/landslide_before_the_slide (1).html` | 4 |
| `ls-rainfall` | landslide | before | `landslide/does  and donts/Before/Before_intense_rainfall.html` | 3 |
| `ls-drainage` | landslide | before | `landslide/does  and donts/Before/Drainage_cleaning.html` | 3 |
| `ls-ready-reckoner` | landslide | before | `landslide/does  and donts/Before/Landslide Ready Reckoner.html` | 3 |
| `ls-safe-zones` | landslide | before | `landslide/does  and donts/Before/Landslide Safe Zones.html` | 3 |
| `ls-tree-cutting` | landslide | before | `landslide/does  and donts/Before/Tree_cutting .html` | 3 |
| `ls-warning-signs-visual` | landslide | during | `landslide/does  and donts/During/During_indicaitons.html` | 3 |
| `ls-warning-signs` | landslide | during | `landslide/does  and donts/During/landslide_indications.html` | 4 |
| `ls-imminent` | landslide | during | `landslide/does  and donts/During/Imminent Landslide Steps.html` | 3 |
| `ls-during` | landslide | during | `landslide/does  and donts/During/During a Landslide_ Survival PSA.html` | 4 |
| `ls-after` | landslide | after | `landslide/does  and donts/After/After a Landslide_ Survival PSA.html` | 4 |
| `ls-media-education` | landslide | general | `landslide/For media/Landslide Media & Community Education.html` | 4 |
| `ls-media-community` | landslide | general | `landslide/For media/After_Landslide Community Education PSA.html` | 3 |
| `flood-before` | flood | before | `Flood/does and donts/Before/before_flooding (1).html` | 3 |
| `flood-warning` | flood | during | `Flood/does and donts/During/flood_warning_actions.html` | 4 |
| `flood-evacuation` | flood | during | `Flood/does and donts/During/evacuation_protocols (1).html` | 4 |
| `flood-family` | flood | during | `Flood/does and donts/During/Flood_family/index.html` | 3 |
| `flood-post` | flood | after | `Flood/does and donts/After/post_flood_sheltering_safety.html` | 4 |
| `heat-stroke` | heat_wave | during | `Heat wave/heat_stroke_first_aid.html` | 4 |
| `heat-outdoor` | heat_wave | during | `Heat wave/outdoor_worker_safety.html` | 4 |
| `heat-pets` | heat_wave | during | `Heat wave/pet_heat_safety.html` | 4 |
| `heat-children` | heat_wave | during | `Heat wave/protecting_children_in_heat (1).html` | 4 |
| `cw-before-prep` | cold_wave | before | `Cold wave frost/before/Cold Wave Preparation & Prevention.html` | 3 |
| `cw-before-heating` | cold_wave | before | `Cold wave frost/before/1Cold Wave PSA_ Preparation & Safe Indoor Heating.html` | 3 |
| `cw-dressing` | cold_wave | during | `Cold wave frost/During/Dressing & Personal Protection – Cold Wave PSA.html` | 4 |
| `cw-home-animals` | cold_wave | during | `Cold wave frost/During/Home Safety & Animal Care PSA.html` | 4 |
| `cw-health-diet` | cold_wave | during | `Cold wave frost/During/2coldwave.html` | 4 |
| `cw-diet-immunity` | cold_wave | during | `Cold wave frost/During/diet_immunity_hidden_dangers.html` | 3 |
| `cw-first-aid` | cold_wave | during | `Cold wave frost/During/first-aid-psa.html` | 4 |
| `fire-before` | fire | before | `FIre awanesss/Before/School Fire Awareness & Prevention PSA (1).html` | 3 |
| `fire-during` | fire | during | `FIre awanesss/During/school_fire_evacuation_safety.html` | 4 |
| `fire-after` | fire | after | `FIre awanesss/After/school_fire.html` | 3 |
| `kit-complete` | emergency_kit | before | `Emergency kit/emergency_kit_complete.html` | 4 |
| `kit-disability` | emergency_kit | before | `Emergency kit/disability_emergency_kit.html` | 4 |
| `snake-first-aid` | snake_bite | during | `snake bite/does&donts/Snake Bite First Aid PSA.html` | 4 |
| `storm-tree` | storm | during | `Storm hazard/does and donts/During/under_tree.html` | 3 |

Not covered (empty source files, no content to base a quiz on): `Building guids resist earth quake and cyclones/safesite.html`, `Cyclon/cyclon_prepardness_dos.html`.

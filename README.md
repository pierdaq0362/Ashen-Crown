# The Ashen Crown

A narrative strategy game that runs in the browser. You read, choose, run a small realm between battles, and fight turn-based battles on a grid. What you decide in the story changes who fights beside you and what you face.

**Chapter One: Cinders at the Gate** (v0.2) is playable start to finish. The king is dead, the Ember that kept the dead asleep has gone out, and you hold a ruined keep and a sealed vault. Every decision now gets an aftermath scene, trust and Standing have real effects, and a Goal line under the header always tells you what you are working towards.

**Chapter Two** follows from the Vault choice, in three tracks: Seal (*The Grey Hand*), Relight (*The Answer*) and Touch (*The Sleepers*, in the sci-fi pack), each shaped by the faction you backed.

The final choice in the Vault and the faction you backed are saved as story flags (`ch1_seal`, `ch1_relight`, `ch1_veil`, `path_loyalist`, `path_rebel`, `path_independent`), which Chapter Two builds on. See `docs/story-bible.md`. There are three battles, two realm councils, four companions, three factions to side with, and several endings. One ending crosses into a sci-fi prototype pack, to show how the world can grow past fantasy.

No build step and no dependencies. It is plain HTML, CSS and JavaScript.

## Play it

**On your computer:** open `index.html` in a browser.

Autosave uses the browser's local storage. Some browsers don't keep it for pages opened straight from disk. If "Continue" is missing after you reload, serve the folder instead:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

You can always keep progress by hand with **Menu → Export save**, and bring it back with **Import save**.

**On GitHub Pages (a link you can open anywhere):**

```sh
cd ashen-crown
git init -b main
git add .
git commit -m "The Ashen Crown: first playable chapter"
git remote add origin https://github.com/pierdaq0362/ashen-crown.git
git push -u origin main
```

Create the empty `ashen-crown` repository on GitHub first. Then open **Settings → Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`. After a minute the game is at `https://pierdaq0362.github.io/ashen-crown/`.

To jump straight into the sci-fi prototype pack, add `?pack=scifi` to the address.

## How it plays

**Story.** Scenes of text with choices. Choices can cost resources, need a companion or a background, change trust, and set story flags that later scenes and battles check.

**Council.** Between battles you get three actions: muster levies, barricade the gate, scout, drill the garrison, hold a feast, collect the tithe, and so on. A random event may interrupt. Whatever you prepared shows up in the next battle, and the battle intro lists it, so you can see what each choice bought. Conversation actions (sit with Ansel, walk with Isolde...) open a short scene; the second conversation with each companion needs Trust 4.

**Trust and Standing.** Each companion earns battle perks at Trust 4 and 7 (see Journal → Company). Standing has named tiers (Reviled to Beloved, see Journal → Realm) that change musters, volunteers, desertions, who will ally with you and how the epilogue reads.

**Battle.** Grid-based and deterministic: there are no dice, and the preview shows the exact damage and the counterattack before you commit.

| Rule | Detail |
| --- | --- |
| Damage | attack − defence − terrain defence − brace, never below 1 |
| Counterattack | The defender hits back if it survives and the attacker is inside its range |
| Ranged units | Hit 2 tiles away (some 2–3). A ranged unit attacking an adjacent target loses 1 damage |
| Terrain | Forest and high ground: +1 defence, cost 2 to enter. Ruins and altars: +1 defence. Ash drifts: cost 2. Walls, water, barricades and standing stones block |
| Skills | Shield Wall (+2 defence), Mend (heal 6), Cinderburst (area damage). Each has a cooldown |
| Levels | Each won battle levels your company. Companions gain 2 max HP per level, and +1 attack from level 3 |
| Wounded | A companion who falls is wounded: they start the next battle at 60% HP |
| Objectives | Defeat everyone, survive N turns, or get a named unit to a tile |
| Story mode | Title-screen option: your side gets +30% HP, enemies get −1 attack |

If you lose a battle you can retry it, or accept the defeat and let the story go on with the consequences.

## Project layout

```
index.html        the page
css/style.css     all styling
js/battle.js      grid battle rules and AI (no DOM)
js/engine.js      story, flags, councils, saves (no DOM)
js/ui.js          screens and input (the only file that touches the page)
data/fantasy.js   the fantasy world: units, actions, councils, battles, codex
data/ch1-*.js     Chapter One's scenes (keep, banners, companion conversations)
data/ch2-*.js     Chapter Two: shared world, Seal, Relight and (sci-fi) Veil tracks
data/scifi.js     the sci-fi prototype pack
tests/            content validator and playthrough simulator (Node)
```

The rules never mention a specific story. All content is data in `data/`, so a new chapter or a new setting is a new file, not a code change.

## Writing your own content

A pack is one object registered as `AC.packs.<id>`. Copy `data/scifi.js` as a starting point (it is the smallest) and add a `<script>` tag for your file in `index.html`.

### Scenes

```js
my_scene: {
  title: 'The Gate', mood: 'night',          // mood: night | snow | fire | court | vault
  enter: [{ res: { gold: 2 } }],             // effects that run when the scene starts
  text: [
    'A paragraph. {name} is the player’s name. *italic* and **bold** work.',
    { if: 'metIsolde', t: 'Only shown when the flag is set.' },
  ],
  choices: [
    { t: 'Open the gate.', go: 'next_scene' },
    { t: 'Pay the toll.', cost: { gold: 2 }, tip: 'Shown under the choice', fx: [{ set: 'paidToll' }], go: 'toll_scene' },
    { t: 'Persuade them.', if: 'bg_envoy', go: 'persuade' },                 // hidden unless true
    { t: 'Break it down.', need: { trust: 'dunstan', gte: 3 },                 // shown but disabled unless true
      needText: 'Dunstan must trust you more.', go: 'break' },
  ],
}
```

**Aftermath.** Give a choice `reply: ['paragraph', { if: 'flag', t: '...' }]` plus `go`, and the player sees the reply (with the effect chips) before continuing to `go`. Use it on every choice that does something.

Chapters can live in their own files: `AC.addTo('fantasy', { scenes: {...}, battles: {...} })`, with a `<script>` tag after `fantasy.js`. A council action may carry `go` (a side scene; return with `'@council'`), `need`/`needText` and `max`. Companions take `bonds: [{ at: 4, hp: 4, text: '...' }]` (`hp atk def move power cooldown`).

A scene needs exactly one way forward: `choices`, `next: 'scene_id'`, `battle`, `council`, or `end: true`.

A `go` or `next` can be a scene id, `'@return'` (back to wherever the council sent you), `'@council'` (back to the council after a side scene), or a list of `{ if, go }` branches where the first true one wins (the last can omit `if`).

### Conditions (`if`, `need`)

| Form | Meaning |
| --- | --- |
| `'flag'`, `'!flag'` | flag is set, or isn't |
| `['a', 'b']` | all of them |
| `{ any: [...] }`, `{ all: [...] }`, `{ not: c }` | combine conditions |
| `{ res: 'gold', gte: 2 }` | resource compare (`gte` `gt` `lte` `lt` `eq`) |
| `{ trust: 'dunstan', gte: 3 }` | companion trust, 0 to 10 |
| `{ n: 'counter', gte: 2 }` | numeric counter made with `inc` |
| `{ has: 'isolde' }` | companion is in your party |
| `{ visited: 'scene_id' }`, `{ wounded: 'dunstan' }` | scene seen, companion wounded |

### Effects (`fx`, `enter`)

`{ res: { gold: -2 } }` · `{ set: 'flag' }` or `{ set: ['a','b'] }` · `{ unset: 'flag' }` · `{ inc: { counter: 1 } }` · `{ trust: { maren: 1 } }` · `{ join: 'isolde' }` · `{ leave: 'isolde' }` · `{ chron: 'A line for the Journal' }` · `{ day: 1 }` · `{ level: 1 }` · `{ bg: 'soldier' }` · `{ when: cond, then: [...], else: [...] }` · `{ travel: { pack: 'scifi', scene: 'wake' } }` · `{ goal: 'Text for the Goal line' }` (empty text clears it)

### Councils and actions

```js
councils: { winter: { title: 'The Winter Council', ap: 2, draws: 2,
  actions: ['muster', 'fortify'],
  pool: [ { scene: 'evt_reeve', priority: true, once: true }, { scene: 'evt_refugees', weight: 3 } ],
  then: 'gate_prelude' } },
actions: { fortify: { name: 'Barricade the Gate', icon: '🧱', desc: 'Shown on the card.',
  cost: { gold: 2 }, fx: [{ set: 'fortified' }], result: 'Line for the council log.' } },
```

`draws` is how many events from `pool` fire when the council ends. Priority events go first. An action can carry `if`, and `max` (uses per council).

### Battles

```js
battles: { gate: {
  name: 'The North Gate', intro: 'Shown before the fight.',
  map: [ 'ff..ff', '#.X..#', ... ],            // every row must be the same width
  start: [[4, 4], [5, 5]],                     // where your units begin; companions first, then levies
  roster: ['dunstan', 'ansel'],                 // companions who fight here, if in your party
  win:  { type: 'rout' },                      // or { type: 'survive', turns: 6 } or { type: 'reach', unit: 'ansel', tiles: [[4, 0]] }
  lose: { unitDies: 'ansel', turnLimit: 14 }, // optional
  units: [ { type: 'raider', at: [4, 2], ai: 'hold' } ],
  reinforcements: [ { turn: 3, at: [[4, 0]], units: ['wight'], note: 'Shown in the log.' } ],
  modifiers: [ { if: 'fortified', note: 'Shown in the intro.', do: [ { terrain: [4, 3, 'b'] } ] } ],
} }
```

Map characters: `.` open, `f` forest, `^` high ground, `r` ruins, `,` ash, `#` wall, `~` water, `b` barricade, `X` objective, `s` standing stone, `a` altar. A pack can add its own under `terrain`.

Modifier operations (`do`): `addUnit`, `terrain: [x, y, char]`, `buff: { side, type, atk, def, move, hp }`, `removeUnits: { side, type, n }`, `winTurns`, `dropWave: <turn>`. A unit entry takes `type`, `at`, `side` (`enemy` by default, or `ally` / `player`), `ai`, `name`, `role` and `stats`.

Enemy `ai`: `aggressive` (default) charges, `hold` waits until you get close, `stand` never moves.

### Units and companions

```js
knight: { name: 'Knight', glyph: '🛡️', hp: 22, atk: 6, def: 3, move: 3,
  range: [1, 1], tags: ['mounted'], bonusVs: { mounted: 2 },
  skill: { name: 'Shield Wall', kind: 'brace', power: 2, cooldown: 1, desc: 'Shown on the unit card.' } },
// skill kinds: 'brace' (self), 'heal' (range), 'burst' (range + radius)
```

A companion is `{ name, unit, glyph, trust, blurb }` and maps to a unit type. Use the same companion ids across packs and they carry over when you `travel`.

## Tests

Needs Node 18 or newer. No installs.

```sh
node tests/validate.js        # broken routes, unknown units, bad maps, unreachable scenes, stacked units
node tests/sim.js 1000        # plays the whole game 1000 times; reports crashes, endings and battle win-rates
EASY=1 node tests/sim.js 1000 # the same in Story mode
CH2=seal node tests/sim.js 500 # jump straight into Chapter Two (seal | relight | veil)
```

Run `validate.js` after every content edit. It catches typos that would otherwise only show up when a player reaches that scene.

## Known limits

- **Balance is measured by a bot, not by people.** In simulation the gate fight is won about 80% of the time, Barrow Night is a lower-stakes breather, and the Vault stair is the hard climax. The bot is clumsier than a person at escorting Ansel, so real players should do better, but expect to tune it after playing.
- A game saved during a battle restarts that battle when loaded.
- Enemy AI is a one-turn heuristic: it focuses weak targets and favours cover, but it doesn't plan ahead.
- There is no audio and no custom art. Units are emoji and the board is CSS.
- Saves from before v0.2 cannot be loaded (the story changed); start a new game.
- Chapters One and Two are written. Chapter Two has not been playtested by hand yet. The sci-fi pack is a short prototype: one council, one battle.

## Ideas for what next

- Chapter Two: the station in orbit, with Heartfire as a character and the companions reshaped by what they did in Chapter One.
- Carry choices across chapters, so the Vault ending changes the opening of the next one.
- More unit types and a second skill per companion.
- Sound: a few synthesized cues with the Web Audio API.

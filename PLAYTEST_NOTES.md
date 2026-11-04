# Playtest notes

Luigi's notes from playing the game. Logged first, fixed later in batches.
Status: open / fixed. All six items below were addressed in v0.2 and are awaiting Luigi's replay.

## Addressed in v0.2 (please re-check in play)

### 1. Story beats resolve too abruptly (Day 2, the Tax-Reeve's visit)
- **What happened:** Chose "Let the rebuilt wall speak for you" (soldier background, rebuilt rampart). The game moved straight on to the next event with no resolution and no dialogue.
- **What Luigi wants:** More fleshed-out story. Moments like this should play out (what the Reeve says back, how Maren and the others react, what it costs or earns) before the story moves on.
- **Cause:** In `data/fantasy.js`, every choice in `evt_reeve` ends with `go: '@return'`, so it skips straight to the next event. The only trace is a one-line Journal entry and the resource chips.
- **Probably the same problem elsewhere (to check when fixing):**
  - the other council events: `evt_refugees`, `evt_ashfall`, `evt_peddler`
  - the barrow-night events: `evt_aldous`, `evt_sirene`, `evt_hettie`
  - the "Taking Stock" scenes (`stock_walls`, `stock_granary`, `stock_village`), which bounce straight back to the menu
  - possibly the Kell decisions and the opening choices
- **Idea for the fix (not started, to confirm with Luigi):** Give each choice its own short aftermath scene: a bit of dialogue, a reaction from the companions, and a consequence. Branch by background or flag where it matters, then continue. Likely a shared "aftermath" pattern so it isn't hand-written from scratch every time.

### 2. Decisions feel meaningless; no visible impact (after finishing Chapter One)
- Same root as #1. Fix: every choice gets an aftermath screen (dialogue plus consequence), and effects are shown.

### 3. Companion trust does nothing
- The numbers go up and nothing happens. Wanted: trust should amount to something.
- Plan: trust-gated conversations (council action), battle bonuses at trust 4 and 7, companions weigh in at the vault decision, and the epilogue reflects who stayed.

### 4. Standing does nothing
- Plan: named tiers with explanations, real effects (levies, volunteers, desertions, who answers the call), and mention in the epilogue.

### 5. Story is confusing, with missing pieces (e.g. "I sealed the vault. And so what now?")
- Likes the intrigue and the mystery. Wants it fleshed out.
- Plan: a visible Goal line; a clear reason the player was chosen; the Ember's nature seeded before the vault; a night-watch scene after the gate that lays out what is known; companions' counsel before the final choice; an epilogue that resolves threads and says what comes next.

### 6. Cast: three women in the main supporting roles; names forgettable (except Isolde)
- Plan: castellan becomes a man (Ser Dunstan Garrow), healer becomes an old man (Brother Ansel Wick). Isolde and Kell stay.

## Planned
- Chapter Two, branching on the Vault choice (seal / relight / touch) and the faction. See docs/story-bible.md.

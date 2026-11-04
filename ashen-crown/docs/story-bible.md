# The Ashen Crown: story bible

Working reference so the cast, facts and branching stay consistent. Edit it as the story grows.

## Campaign structure (Luigi's design)
- **The Vault choice in Chapter One sets the track** for Chapter Two and onwards:
  - **Seal** → the political/mystery track. The Ember stays dead; the war and the hunt for the Grey Hand drive the story.
  - **Relight** → the Answer track. The ward returns, but the light was a call, and it was answered.
  - **Touch** → the Veil track. Sci-fi (Cold Orbit).
- **The faction you backed** (Regent / Duchess / Marchers) is the second axis. It decides who your allies and enemies are, who holds the capital, and what each later chapter asks of you.
- Trust, Standing, companion fates and key flags carry across chapters.
- Tracks are separate files so each can grow on its own. A chapter is a data file registered with `AC.addTo('fantasy', { scenes, battles, ... })`.

## The cast
| Who | Role | Voice |
| --- | --- | --- |
| **Ser Dunstan Garrow** (he) | Castellan of Cindervale, 60s, 30 years in Orrin's service | Short sentences, gallows humour, hides hurt behind duty |
| **Brother Ansel Wick** (he) | Ember-priest and archivist, 70s, keeper of the last spark | Precise, gentle, funny by accident, corrects small errors |
| **Isolde Fenn** (she) | Poacher and tracker from Lower Cinder; niece of Hettie Rook | Dry, practical, distrusts crowns, loyal once earned |
| **Kell Ashworth** (she) | Ashborn, 19; raider sent to die at the gate | Guarded, quick, hot-tempered, tired of being used |

Others: Captain **Aldous Venn** (Regent's captain, tired, honest), Dame **Sirene Ashgrove** (the Duchess's champion, courteous, unshakeable), **Hettie Rook** (Marcher elder, Isolde's aunt), Tax-Reeve **Corvin Hale**, steward **Piet**, miller **Brann**, peddler **Odo**.
The Regent's chamberlain, **Lucan Vey**, wears grey gloves. He is the **Grey Hand**.

## Facts the player should always be able to follow
1. King Orrin died. The **Ember**, a flame in the crown's heart-stone, went out. It warded the roads and kept the barrows quiet.
2. Without it, ash falls and the **dead walk**.
3. Orrin ordered the player (who asked him for nothing) to **hold Cindervale and let no one through the Vault**.
4. **Ansel carries the last spark** of the Ember. It is the key to the Vault door.
5. **Cindervale was built as a lid** over the Vault. The barrows run in a line like lamps along a road: the Ember was a **beacon**, not a fire.
6. The **Ashborn** are drawn to the Vault and sicken as the Ember fades.
7. Someone sold Cindervale's wall plans to both sides: seal of a **closed grey hand** (the Regent's chamberlain's office).
8. In the Vault: the **Veil-stone**. Orrin's journal: it called, something answered, and "someone must decide what it is".

## Factions (what each wants, said plainly)
- **Regent Thorne**: order. Wants the Crown's agents inside the Vault. Frightened and competent.
- **Duchess Ysmay** (Pale Banner): the throne by blood. Says the Ember was her family's gift and she will relight it. Her mages use the Ashborn as fuel.
- **The Marchers**: to be left alone and for the dead to stay put.

## Goal line (shown in the HUD)
Prologue: reach Cindervale and learn what the king left. → Prepare Cindervale. → Hold the north gate. → Find out what the raiders wanted. → Choose who stands beside you. → Hold Barrow Night. → Decide who passes the stair. → Reach the Vault door. → Decide the fate of the Veil-stone.

## Mechanics that must matter
- **Trust** (0 to 10): conversations (council action), battle bonds at 4 and 7, counsel at the Vault, who stays after the chapter.
- **Standing**: tiers (Reviled, Distrusted, Unknown, Respected, Trusted, Beloved) with effects: muster bonus, volunteers, desertions, who answers the call, the epilogue.
- **Every choice has an aftermath** (`reply`): dialogue plus consequence before the story moves on.

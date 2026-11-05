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


## The truth underneath (as of Chapter Two)
- **Cindervale Station** is a colony ship in orbit; its mind is the **Heartfire**. Aldmere is the surface colony, seeded from it three hundred years ago. The settlers forgot.
- The **Ember** was the Heartfire's beacon on the surface, a shard of its heart (the **Veil-stone**) sent down in the first landing. It called for the **Lantern Fleet** to come and find the road.
- The barrows are **lamps** along that road. The **Ashborn** carry a sliver of the same spark; they sicken when the beacon fails.
- **Orrin put out the Ember himself** with the ring, because it called. He ordered the Vault held, and made **Lucan Vey** run the **Quiet Office** to keep the three powers distrusting one another.
- Something **answered**: the Fleet. It is not simply a rescue. Its **Lampbearers** (Marshal Auren Vael) treat Aldmere as a lost colony to bring home; the Admiral is harder.

## Chapter Two (three tracks, faction as second axis)
| Track (Vault choice) | Title | Shape | Ends with |
| --- | --- | --- | --- |
| Seal (`ch1_seal`) | The Grey Hand | Spring council, Stonebridge Ford (protect Ansel; if lost he is taken), road to Highmere (arrival differs by faction), the Chamberlain's Tower, Vey's choice (expose / Dunstan decides / turn him / free) | A new blue star in the north: the call was only muffled |
| Relight (`ch1_relight`) | The Answer | Warm spring, lamp-line lights nightly, the Last Lamp (rivals try to take it), the Lampbearers land; welcome / bargain (trial) / refuse (battle) | The Fleet's Admiral is coming at first snow |
| Touch (`ch1_veil`) | The Sleepers (Cold Orbit) | Heartfire explains, expedition from Aldmere steps through the stone (by faction), cryo deck vs the Quiet Watch, wake the Commander / let them sleep / ask the Heartfire | The Fleet approaches; a second, older signal exists |

Faction axis in Chapter Two: Regent (Aldous Venn, Under-Secretary Pell), Duchess (Sirene, a herald; her line descends from the Fleet's officers), Marchers (Hettie, Bryn). Each track has a faction-specific event, arrival and allies.

Chapter Two flags to build on in Chapter Three: `ch2_seal_done`, `ch2_relight_done`, `ch2_veil_done`; Seal: `c2_vey_exposed|dead|recruited|free|escaped`, `c2_ansel_taken`, `c2_blade_*`; Relight: `c2_welcome`, `c2_bargain`, `c2_refuse`, `c2_lampfall_won|lost`, `c2_chartered`, `c2_steward`, `c2_stone_given`; Veil: `c2v_woke|slept|asked`, `c2v_welcomed|held|sent`.

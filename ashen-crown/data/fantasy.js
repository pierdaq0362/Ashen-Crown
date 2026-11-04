/* The Ashen Crown: the fantasy world (rules-level data).
 * Scenes live in the chapter files (data/ch1-*.js). See README, "Writing your own content".
 * Text supports {name} / {title} and *emphasis*. Use ’ and “ ” for typographic quotes.
 */
(function () {
  const AC = (globalThis.AC = globalThis.AC || {});
  AC.packs = AC.packs || {};

  AC.packs.fantasy = {
    id: 'fantasy',
    title: 'The Ashen Crown',
    subtitle: 'Chapter One: Cinders at the Gate',
    blurb: 'The Ember is out and the dead are walking. You hold a ruined keep and a dying king’s last order. What you decide between battles shapes who stands beside you in them.',
    start: 'prologue',
    defaultTitle: 'Warden',

    resources: {
      gold: { name: 'Gold', icon: '🪙', start: 4, desc: 'Pays for masons, mustering and favours.' },
      grain: { name: 'Grain', icon: '🌾', start: 5, desc: 'Feeds the garrison and anyone sheltering with you.' },
      levies: { name: 'Levies', icon: '🔱', start: 3, max: 12, desc: 'Spearmen who fight beside you. Some will not come back.' },
      standing: {
        name: 'Standing', icon: '👑', start: 0, min: -5, max: 10,
        desc: 'What the people of the north think of you. It decides who answers when you call.',
        tiers: [
          { at: -5, name: 'Reviled', text: 'The hamlets hide their grain, and levies slip away at night.' },
          { at: -2, name: 'Distrusted', text: 'Levies desert when you are not looking, and the clans will not parley.' },
          { at: 0, name: 'Unknown', text: 'A stranger with a title. Nobody owes you anything yet.' },
          { at: 1, name: 'Respected', text: 'The Marchers will hear you out.' },
          { at: 3, name: 'Trusted', text: 'Mustering brings more spears, and hamlet volunteers stand on your wall and carry torches in the dark.' },
          { at: 6, name: 'Beloved', text: 'The north will follow you, and tell stories about you afterwards.' },
        ],
      },
    },
    levy: { res: 'levies', unit: 'levy', bonusFlag: 'trained', bonus: { atk: 1 } },

    backgrounds: {
      soldier: { title: 'Warden', fx: [{ res: { levies: 2 } }] },
      scholar: { title: 'Warden', fx: [{ res: { grain: 2 } }] },
      envoy: { title: 'Warden', fx: [{ res: { gold: 3, standing: 1 } }] },
    },

    /* Trust bonds: perks a companion earns as their trust in you grows (0 to 10). */
    companions: {
      dunstan: {
        name: 'Ser Dunstan Garrow', unit: 'knight', glyph: '🛡️', trust: 2,
        blurb: 'Castellan of Cindervale. Thirty years in a dead king’s service, eleven of them in this ruin, and no intention of stopping.',
        bonds: [
          { at: 4, hp: 4, text: 'fights as if the gate were his own (+4 HP).' },
          { at: 7, cooldown: -1, text: 'can raise Shield Wall every turn.' },
        ],
      },
      ansel: {
        name: 'Brother Ansel Wick', unit: 'cleric', glyph: '🕯️', trust: 2,
        blurb: 'Ember-priest and archivist, seventy-odd years old and ink to the elbows. Carries the last spark of the Ember in a lantern.',
        bonds: [
          { at: 4, hp: 3, text: 'his hands steady (+3 HP).' },
          { at: 7, power: 3, text: 'Mend heals 3 more.' },
        ],
      },
      isolde: {
        name: 'Isolde Fenn', unit: 'archer', glyph: '🏹', trust: 1,
        blurb: 'Poacher and tracker from Lower Cinder. Distrusts crowns and tax-collectors equally.',
        bonds: [
          { at: 4, atk: 1, text: 'shoots straighter (+1 attack).' },
          { at: 7, move: 1, text: 'moves like a deer (+1 move).' },
        ],
      },
      kell: {
        name: 'Kell Ashworth', unit: 'mage', glyph: '🔥', trust: 1,
        blurb: 'An Ashborn raider whose eyes burn like banked coals. Nineteen, and tired of being used.',
        bonds: [
          { at: 4, power: 1, text: 'Cinderburst hits harder.' },
          { at: 7, cooldown: -1, text: 'Cinderburst recharges a turn sooner.' },
        ],
      },
    },

    units: {
      levy: { name: 'Levy Spearman', glyph: '🗡️', hp: 10, atk: 4, def: 1, move: 3, bonusVs: { mounted: 2 }, desc: 'Cheap, brave, replaceable. Strong against horsemen.' },
      militia: { name: 'Militia Archer', glyph: '🏹', hp: 8, atk: 4, def: 0, move: 3, range: [1, 2], desc: 'A hamlet hunter with an old bow.' },
      knight: { name: 'Knight', glyph: '🛡️', hp: 22, atk: 6, def: 3, move: 3, desc: 'Heavy armour. Holds a line.', skill: { name: 'Shield Wall', kind: 'brace', power: 2, cooldown: 1, desc: '+2 defence until your next turn.' } },
      cleric: { name: 'Ember-priest', glyph: '🕯️', hp: 14, atk: 3, def: 1, move: 3, desc: 'Frail, but the light mends flesh.', skill: { name: 'Mend', kind: 'heal', power: 6, range: [0, 2], cooldown: 1, desc: 'Heal an ally within 2 tiles (or yourself) for 6.' } },
      archer: { name: 'Ranger', glyph: '🏹', hp: 13, atk: 6, def: 1, move: 4, range: [1, 2], desc: 'Shoots 2 tiles away. Point-blank shots lose 1 damage.' },
      mage: { name: 'Ashborn Mage', glyph: '🔥', hp: 10, atk: 4, def: 0, move: 3, range: [1, 2], desc: 'Burns from within.', skill: { name: 'Cinderburst', kind: 'burst', power: 5, range: [2, 3], radius: 1, cooldown: 2, desc: 'Fire at a tile 2–3 away; hits every enemy within 1 of it.' } },

      raider: { name: 'Raider', glyph: '🪓', hp: 12, atk: 6, def: 1, move: 4, desc: 'Axe-wielding skirmisher.' },
      raider_archer: { name: 'Raider Bowman', glyph: '🏹', hp: 9, atk: 5, def: 0, move: 3, range: [1, 2], desc: 'Fragile, but hurts at range.' },

      wight: { name: 'Ash-wight', glyph: '💀', hp: 12, atk: 5, def: 1, move: 3, tags: ['undead'], desc: 'A barrow-dead thing, grey with ash.' },
      hound: { name: 'Ash-hound', glyph: '🐺', hp: 7, atk: 5, def: 0, move: 5, tags: ['undead'], desc: 'Fast, and hungry.' },
      caller: { name: 'Grave-caller', glyph: '👻', hp: 8, atk: 5, def: 0, move: 3, range: [2, 3], tags: ['undead'], desc: 'Hurls grave-cold from 2–3 tiles away. Fragile, and cannot strike an adjacent target.' },
      vault_guard: { name: 'Ember-Warden', glyph: '🗿', hp: 14, atk: 5, def: 2, move: 2, tags: ['undead'], desc: 'An armoured shape that was set to guard the stair, long ago.' },

      pale_knight: { name: 'Pale Banner Knight', glyph: '🐎', hp: 16, atk: 7, def: 3, move: 3, tags: ['mounted'], desc: 'The Duchess’s heavy horse, dismounted on the stair. Levies hit them harder.' },
      pale_archer: { name: 'Pale Banner Bowman', glyph: '🏹', hp: 10, atk: 6, def: 0, move: 3, range: [1, 2] },
      pale_champion: { name: 'Pale Champion', glyph: '⚜️', hp: 22, atk: 7, def: 3, move: 3, desc: 'White-enamelled mail, no mercy.' },

      regent_pike: { name: 'Regent’s Pikeman', glyph: '🔱', hp: 14, atk: 5, def: 2, move: 3, bonusVs: { mounted: 2 } },
      regent_xbow: { name: 'Regent’s Crossbow', glyph: '🎯', hp: 10, atk: 7, def: 0, move: 3, range: [2, 3], desc: 'Hits hard from 2–3 tiles but cannot shoot adjacent targets.' },
      regent_captain: { name: 'Regent’s Captain', glyph: '⚔️', hp: 20, atk: 7, def: 3, move: 3 },

      marcher: { name: 'Marcher Hunter', glyph: '🏹', hp: 11, atk: 6, def: 0, move: 4, range: [1, 2], desc: 'A Greywood clan hunter.' },
    },

    /* ----- council actions (realm management) ----- */
    actions: {
      muster: { name: 'Muster the Levies', icon: '🔱', desc: 'Call spearmen from the hamlets. +3 levies, and +1 more if the people trust you (Standing 3+).', cost: { gold: 2 }, fx: [{ res: { levies: 3 } }, { when: { res: 'standing', gte: 3 }, then: [{ res: { levies: 1 } }] }], result: 'The muster-horn sounds in the hamlets, and spears answer.' },
      scout: { name: 'Scout the North Pass', icon: '🦅', desc: 'Watch the pass. You will not be surprised, and the vanguard will be thinned.', cost: { grain: 1 }, fx: [{ set: 'scoutedPass' }], result: 'Riders slip into the Greywood to watch the pass.' },
      fortify: { name: 'Barricade the Gate', icon: '🧱', desc: 'Timber and carts narrow the north gate to a single gap.', cost: { gold: 2 }, fx: [{ set: 'fortified' }], result: 'Carts and timber are dragged across the north gate.' },
      feast: { name: 'Hold a Hearth-Feast', icon: '🍲', desc: '+1 Standing, and every companion trusts you a little more.', cost: { grain: 2 }, fx: [{ res: { standing: 1 } }, { trust: { dunstan: 1, ansel: 1, isolde: 1, kell: 1 } }], result: 'A full table in a cold hall. Faces soften around the fire.' },
      tithe: { name: 'Collect the Tithe', icon: '📜', desc: '+2 gold, but the hamlets will mutter (−1 Standing).', fx: [{ res: { gold: 2, standing: -1 } }], result: 'The reeve’s men go door to door. Coin comes in; goodwill goes out.' },
      forage: { name: 'Forage the Greywood', icon: '🌲', desc: '+2 grain (+1 more if Isolde guides you).', fx: [{ res: { grain: 2 } }, { when: { has: 'isolde' }, then: [{ res: { grain: 1 } }] }], result: 'Hunters return with game and winter roots.' },
      train: { name: 'Drill the Garrison', icon: '🥋', desc: 'Your levies hit harder in every battle from now on (+1 attack).', cost: { gold: 1 }, if: '!trained', fx: [{ set: 'trained' }], result: 'Dunstan drills the levies until they stop flinching.' },
      consecrate: { name: 'Consecrate the Barrow-Ground', icon: '🧂', desc: 'Salt and iron around the altar: your company takes 1 less damage on Barrow Night.', cost: { grain: 1 }, fx: [{ set: 'ritualPrepared' }], result: 'Ansel walks the field with salt and iron nails, murmuring.' },
      scout_barrows: { name: 'Scout the Barrow-Field', icon: '🔭', desc: 'Isolde marks where the dead will rise. One whole wave will not come.', cost: { grain: 1 }, if: [{ has: 'isolde' }, '!clanLore'], fx: [{ set: 'scoutedBarrows' }], result: 'Isolde walks the barrow-field at dusk and chalks the soft ground.' },

      /* Conversations: the first is open to all; the second needs Trust 4. Each opens a scene, then the council resumes. */
      talk_dunstan: { name: 'Share a quiet hour with Dunstan', icon: '🛡️', desc: 'Your castellan. What he tells you depends on how far he trusts you.', if: [{ has: 'dunstan' }, '!talk_dunstan_2'], need: { any: ['!talk_dunstan_1', { trust: 'dunstan', gte: 4 }] }, needText: 'Dunstan needs to trust you more before he says the rest (Trust 4+).', go: [{ if: 'talk_dunstan_1', go: 'talk_dunstan_2' }, { go: 'talk_dunstan_1' }] },
      talk_ansel: { name: 'Sit with Brother Ansel', icon: '🕯️', desc: 'The old archivist and the last spark of the Ember.', if: [{ has: 'ansel' }, '!talk_ansel_2'], need: { any: ['!talk_ansel_1', { trust: 'ansel', gte: 4 }] }, needText: 'Ansel needs to trust you more before he says the rest (Trust 4+).', go: [{ if: 'talk_ansel_1', go: 'talk_ansel_2' }, { go: 'talk_ansel_1' }] },
      talk_isolde: { name: 'Walk the ridge with Isolde', icon: '🏹', desc: 'The poacher who knows the Greywood.', if: [{ has: 'isolde' }, '!talk_isolde_2'], need: { any: ['!talk_isolde_1', { trust: 'isolde', gte: 4 }] }, needText: 'Isolde needs to trust you more before she says the rest (Trust 4+).', go: [{ if: 'talk_isolde_1', go: 'talk_isolde_2' }, { go: 'talk_isolde_1' }] },
      talk_kell: { name: 'Find Kell in the cold yard', icon: '🔥', desc: 'The Ashborn girl who will not sleep.', if: [{ has: 'kell' }, '!talk_kell_2'], need: { any: ['!talk_kell_1', { trust: 'kell', gte: 4 }] }, needText: 'Kell needs to trust you more before she says the rest (Trust 4+).', go: [{ if: 'talk_kell_1', go: 'talk_kell_2' }, { go: 'talk_kell_1' }] },
    },

    councils: {
      winter: {
        title: 'The Winter Council', ap: 3, draws: 2,
        actions: ['muster', 'scout', 'fortify', 'feast', 'tithe', 'forage', 'train', 'talk_dunstan', 'talk_ansel', 'talk_isolde'],
        pool: [
          { scene: 'evt_reeve', priority: true, once: true },
          { scene: 'evt_refugees', weight: 3, once: true },
          { scene: 'evt_ashfall', weight: 2, once: true },
          { scene: 'evt_peddler', weight: 2, once: true },
        ],
        then: 'gate_prelude',
      },
      barrow: {
        title: 'The Barrow Council', ap: 3,
        actions: ['muster', 'consecrate', 'scout_barrows', 'feast', 'forage', 'train', 'talk_dunstan', 'talk_ansel', 'talk_isolde', 'talk_kell'],
        pool: [
          { scene: 'evt_aldous', priority: true, if: 'path_loyalist', once: true },
          { scene: 'evt_sirene', priority: true, if: 'path_rebel', once: true },
          { scene: 'evt_hettie', priority: true, if: 'path_independent', once: true },
        ],
        then: 'barrow_prelude',
      },
    },

    /* ----- battles ----- */
    battles: {
      gate: {
        name: 'The North Gate',
        intro: 'Raiders without a banner hit Cindervale at dusk. Hold the gate and break them.',
        map: [
          'ffff..ffff',
          'ff......ff',
          'f..,..,..f',
          '####..####',
          '#^.r..r.^#',
          '#........#',
          '#.f....f.#',
          '#........#',
          '##########',
        ],
        start: [[4, 4], [5, 5], [3, 5], [6, 5], [4, 5], [5, 4], [3, 4], [6, 4], [2, 5], [7, 5], [4, 6], [5, 6]],
        roster: ['dunstan', 'ansel', 'isolde'],
        maxLevies: 5,
        win: { type: 'rout' },
        units: [
          { type: 'raider', at: [4, 2] }, { type: 'raider', at: [5, 2] },
          { type: 'raider', at: [3, 1] }, { type: 'raider', at: [6, 1] },
          { type: 'raider_archer', at: [2, 2] }, { type: 'raider_archer', at: [7, 2] },
          { type: 'mage', at: [4, 0], name: 'The Ashborn Captain' },
        ],
        modifiers: [
          { if: 'fortified', note: 'Your barricade narrows the gate to a single gap.', do: [{ terrain: [4, 3, 'b'] }] },
          { if: 'scoutedPass', note: 'Your scouts thinned the raiders’ vanguard before dusk.', do: [{ removeUnits: { type: 'raider', n: 1 } }, { removeUnits: { type: 'raider_archer', n: 1 } }] },
          { if: 'wallsRepaired', note: 'The rebuilt rampart lets two militia archers cover the gate.', do: [{ addUnit: { type: 'militia', at: [1, 4], side: 'player' } }, { addUnit: { type: 'militia', at: [8, 4], side: 'player' } }] },
          { if: { res: 'standing', gte: 3 }, note: 'Your good name brings a hamlet volunteer to the wall.', do: [{ addUnit: { type: 'levy', at: [4, 7], side: 'player', name: 'Hamlet Volunteer' } }] },
          { if: 'trained', note: 'Dunstan’s drilling shows: your levies strike harder.', do: [] },
          { if: { res: 'standing', lte: -2 }, note: 'Distrust costs you: two levies slipped away in the night.', do: [{ removeUnits: { side: 'player', type: 'levy', n: 2 } }] },
        ],
      },

      barrows: {
        name: 'Barrow Night',
        intro: 'Ansel must hold the altar-light until the moon sets. If he falls, the rite fails. He cannot move; everything else is up to you.',
        map: [
          ',,,,,s,,,,,',
          ',.f.....f.,',
          ',..s...s..,',
          ',.........,',
          ',..s.a.s..,',
          ',.........,',
          ',..s...s..,',
          ',.f.....f.,',
          ',,,,,s,,,,,',
        ],
        start: [[5, 3], [4, 4], [6, 4], [5, 5], [4, 3], [6, 3], [4, 5], [6, 5], [2, 4], [8, 4]],
        roster: ['dunstan', 'isolde', 'kell', 'ansel'],
        fixed: { ansel: { at: [5, 4], immobile: true } },
        maxLevies: 4,
        win: { type: 'survive', turns: 6 },
        lose: { unitDies: 'ansel' },
        winText: 'The moon sets. The rite is done.',
        units: [
          { type: 'wight', at: [4, 0] }, { type: 'wight', at: [6, 0] }, { type: 'wight', at: [4, 8] },
          { type: 'hound', at: [0, 4] }, { type: 'hound', at: [10, 4] },
        ],
        reinforcements: [
          { turn: 2, at: [[4, 0], [0, 4]], units: ['wight', 'hound', 'caller'], note: 'More dead claw up out of the mounds, and something behind them begins to chant.' },
          { turn: 3, at: [[6, 8], [10, 4]], units: ['wight', 'wight'], note: 'The southern barrows split open.' },
          { turn: 4, at: [[4, 0], [6, 0], [0, 4]], units: ['hound', 'hound', 'caller'], note: 'A howling wave from the north.' },
          { turn: 5, at: [[4, 8], [6, 8]], units: ['wight', 'caller'], note: 'The last of the barrows give up their dead.' },
          { turn: 6, at: [[4, 0], [6, 8], [0, 4]], units: ['wight', 'hound', 'hound'], note: 'As the moon sinks, the dead make one last rush.' },
        ],
        modifiers: [
          { if: 'path_loyalist', note: 'The Regent’s pikemen hold the left flank.', do: [{ addUnit: { type: 'regent_pike', at: [3, 3], side: 'ally' } }, { addUnit: { type: 'regent_pike', at: [3, 5], side: 'ally' } }, { addUnit: { type: 'regent_xbow', at: [7, 3], side: 'ally' } }] },
          { if: 'path_rebel', note: 'The Pale Banner’s knights ride out against the dead.', do: [{ addUnit: { type: 'pale_knight', at: [3, 3], side: 'ally' } }, { addUnit: { type: 'pale_knight', at: [7, 5], side: 'ally' } }, { addUnit: { type: 'pale_archer', at: [3, 5], side: 'ally' } }] },
          { if: 'path_independent', note: 'Marcher hunters melt among the standing stones.', do: [{ addUnit: { type: 'marcher', at: [3, 3], side: 'ally' } }, { addUnit: { type: 'marcher', at: [7, 3], side: 'ally' } }, { addUnit: { type: 'marcher', at: [3, 5], side: 'ally' } }, { addUnit: { type: 'marcher', at: [7, 5], side: 'ally' } }] },
          { if: { any: ['scoutedBarrows', 'clanLore'] }, note: 'You know where the dead will rise: one wave never comes.', do: [{ dropWave: 3 }] },
          { if: 'ritualPrepared', note: 'Salt and iron ring the altar: your company fights with steadier hands.', do: [{ buff: { side: 'player', def: 1 } }] },
          { if: { res: 'standing', gte: 3 }, note: 'Villagers from Lower Cinder bring torches and hold the north stair.', do: [{ addUnit: { type: 'levy', at: [4, 2], side: 'player', name: 'Hamlet Torch-bearer' } }, { addUnit: { type: 'levy', at: [6, 2], side: 'player', name: 'Hamlet Torch-bearer' } }] },
          { if: { trust: 'ansel', gte: 4 }, note: 'Ansel trusts you: his hands are steady, and the rite will finish a turn early.', do: [{ winTurns: -1 }] },
        ],
      },

      vault: {
        name: 'The Vault Stair',
        intro: 'Get Ansel to the Vault door at the top of the stair. He carries the last spark of the Ember, the only key. If he falls, everything is lost.',
        map: [
          '####X####',
          '#.......#',
          '#.#...#.#',
          '#.......#',
          '#..r.r..#',
          '#.#...#.#',
          '#.......#',
          '#.f...f.#',
          '#.......#',
          '#.......#',
          '#########',
        ],
        start: [[4, 9], [3, 9], [5, 9], [2, 8], [6, 8], [3, 8], [4, 8], [5, 8], [2, 9], [6, 9]],
        roster: ['ansel', 'dunstan', 'isolde', 'kell'],
        maxLevies: 3,
        win: { type: 'reach', unit: 'ansel', tiles: [[4, 0]] },
        lose: { unitDies: 'ansel', turnLimit: 14 },
        winText: 'Ansel reaches the Vault door.',
        units: [
          { type: 'vault_guard', at: [2, 4], ai: 'hold' },
          { type: 'vault_guard', at: [6, 4], ai: 'hold' },
        ],
        modifiers: [
          { if: 'enemy_pale', note: 'The Pale Banner holds the stair, with their champion at the top.', do: [
            { addUnit: { type: 'pale_knight', at: [4, 6], ai: 'hold' } },
            { addUnit: { type: 'pale_archer', at: [1, 3], ai: 'hold' } }, { addUnit: { type: 'pale_archer', at: [7, 3], ai: 'hold' } },
            { addUnit: { type: 'pale_champion', at: [4, 2], ai: 'hold', name: 'Dame Sirene' } },
          ] },
          { if: 'enemy_regent', note: 'The Regent’s men hold the stair, with Captain Aldous at the top.', do: [
            { addUnit: { type: 'regent_pike', at: [4, 6], ai: 'hold' } },
            { addUnit: { type: 'regent_xbow', at: [1, 1], ai: 'hold' } }, { addUnit: { type: 'regent_xbow', at: [7, 1], ai: 'hold' } },
            { addUnit: { type: 'regent_captain', at: [4, 3], ai: 'hold', name: 'Captain Aldous' } },
          ] },
          { if: 'enemy_both', note: 'Both claimants have sent men. They are wary of each other, which helps a little.', do: [
            { addUnit: { type: 'pale_knight', at: [3, 6], ai: 'hold' } }, { addUnit: { type: 'pale_archer', at: [1, 3], ai: 'hold' } },
            { addUnit: { type: 'regent_xbow', at: [7, 3], ai: 'hold' } },
          ] },
          { if: 'ally_regent', note: 'Regent’s pikemen fight beside you.', do: [{ addUnit: { type: 'regent_pike', at: [1, 8], side: 'ally' } }, { addUnit: { type: 'regent_pike', at: [7, 8], side: 'ally' } }] },
          { if: 'ally_pale', note: 'Pale Banner knights fight beside you.', do: [{ addUnit: { type: 'pale_knight', at: [1, 8], side: 'ally' } }, { addUnit: { type: 'pale_knight', at: [7, 8], side: 'ally' } }] },
          { if: 'ally_clans', note: 'The Marchers fight beside you.', do: [{ addUnit: { type: 'marcher', at: [1, 8], side: 'ally' } }, { addUnit: { type: 'marcher', at: [7, 8], side: 'ally' } }, { addUnit: { type: 'marcher', at: [1, 9], side: 'ally' } }] },
          { if: 'clanPact', note: 'The clan pact brings a fourth hunter.', do: [{ addUnit: { type: 'marcher', at: [7, 9], side: 'ally' } }] },
          { if: 'won_barrows', note: 'The rekindled light in Ansel’s lantern strengthens your company.', do: [{ buff: { side: 'player', hp: 2 } }] },
        ],
      },
    },

    codex: [
      { title: 'The Ember', if: 'seenPrologue', text: 'A flame in the crown’s heart-stone that burned three hundred years without fuel or smoke. It warded the roads, quieted the barrows and held the long dark at bay. It went out the night King Orrin died. Ansel carries the last spark of it.' },
      { title: 'Cindervale', if: 'seenArrival', text: 'A black-stone keep on the northern ridge above the Greywood, half in ruin. It has always been a punishment posting. Nobody remembers why it was built so deep.' },
      { title: 'The Vault', if: 'seenArrival', text: 'A sealed stair beneath Cindervale’s great hall. King Orrin’s last order: hold it, and let no one through. The spark in Ansel’s lantern leans toward its door, and he believes it is the only key.' },
      { title: 'The Ashborn', if: 'kellCaptured', text: 'Those born after the Ember dimmed carry a spark behind their eyes and a cough that never clears. They are drawn to the Vault, like moths. The Pale Banner has been using them.' },
      { title: 'The Grey Hand', if: 'grey_hand', text: 'Someone sold Cindervale’s wall plans to both sides. The wax seal is a closed hand in grey: the mark of the Regent’s chamberlain’s office. Whoever uses it has a foot in both camps.' },
      { title: 'The Barrows', if: 'barrowsLit', text: 'The barrow-mounds run north in a line like lamps along a road. The Ember was never a fire. It was a beacon, and the barrows were its lamps.' },
      { title: 'The Regent’s Hand', if: 'defiedRegent', text: 'Lord Regent Thorne’s tax-collectors, spearmen and clerks. Orderly, well-funded, and always one step behind a rumour. You turned their reeve away.' },
      { title: 'The Regent’s Hand', if: 'sworeRegent', text: 'Lord Regent Thorne’s tax-collectors, spearmen and clerks. You swore to them. They remember.' },
      { title: 'The Pale Banner', if: { not: { any: ['path_loyalist', 'path_rebel', 'path_independent'] } }, text: 'Duchess Ysmay of Greywater claims the throne by blood. Her champion, Dame Sirene Ashgrove, rides in white-enamelled mail.' },
      { title: 'The Pale Banner', if: 'path_loyalist', text: 'Duchess Ysmay of Greywater claims the throne by blood. Her champion, Dame Sirene Ashgrove, rides in white-enamelled mail, and her knights are now your enemies.' },
      { title: 'The Pale Banner', if: 'path_rebel', text: 'Duchess Ysmay of Greywater claims the throne by blood. Her champion, Dame Sirene Ashgrove, is now your ally. For now.' },
      { title: 'The Pale Banner', if: 'path_independent', text: 'Duchess Ysmay of Greywater claims the throne by blood. Her champion, Dame Sirene Ashgrove, wants what lies under your keep.' },
      { title: 'The Marchers', if: { visited: 'act3_open' }, text: 'The Greywood clans have lived at the edge of the ash for three generations. They want nothing from any crown except to be left alone, and for the dead to stay put.' },
      { title: 'The Veil-stone', if: { visited: 'vault_win' }, text: 'A shard of dark glass that hangs in the air. It hums when Ansel’s lantern is near, and shows a map that is not of any country.' },
    ],
  };
})();

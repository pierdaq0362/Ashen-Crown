/* The Ashen Crown — Chapter One: Cinders at the Gate (fantasy pack).
 *
 * Everything the game knows about this world is data in this file.
 * See README.md ("Writing your own content") for the schema.
 * Text supports {name} / {title} and *emphasis*. Use ’ and “ ” for typographic quotes.
 */
(function () {
  const AC = (globalThis.AC = globalThis.AC || {});
  AC.packs = AC.packs || {};

  // After the fight at the gate (won or lost), Isolde may still need to find you.
  const AFTER_GATE = [{ if: { not: { has: 'isolde' } }, go: 'isolde_returns' }, { go: 'act3_open' }];

  AC.packs.fantasy = {
    id: 'fantasy',
    title: 'The Ashen Crown',
    subtitle: 'Chapter One — Cinders at the Gate',
    start: 'prologue',
    defaultTitle: 'Warden',

    resources: {
      gold: { name: 'Gold', icon: '🪙', start: 4 },
      grain: { name: 'Grain', icon: '🌾', start: 5 },
      levies: { name: 'Levies', icon: '🔱', start: 3, max: 12 },
      standing: { name: 'Standing', icon: '👑', start: 0, min: -5, max: 10 },
    },
    levy: { res: 'levies', unit: 'levy', bonusFlag: 'trained', bonus: { atk: 1 } },

    backgrounds: {
      soldier: { title: 'Warden', fx: [{ res: { levies: 2 } }] },
      scholar: { title: 'Warden', fx: [{ res: { grain: 2 } }] },
      envoy: { title: 'Warden', fx: [{ res: { gold: 3, standing: 1 } }] },
    },

    companions: {
      maren: { name: 'Ser Maren Voss', unit: 'knight', glyph: '🛡️', trust: 2, blurb: 'Castellan of Cindervale. Thirty years in a dead king’s service, and not ready to stop.' },
      tamsin: { name: 'Tamsin Quill', unit: 'cleric', glyph: '🕯️', trust: 2, blurb: 'Ember-priest and archivist. Keeper of a very small, very steady blue flame.' },
      isolde: { name: 'Isolde Fenn', unit: 'archer', glyph: '🏹', trust: 1, blurb: 'Poacher, tracker, born in the Greywood. Distrusts crowns and tax-collectors equally.' },
      kell: { name: 'Kell Ashworth', unit: 'mage', glyph: '🔥', trust: 1, blurb: 'An Ashborn raider whose eyes burn like banked coals. Nineteen. Tired of being used.' },
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
      muster: { name: 'Muster the Levies', icon: '🔱', desc: 'Call spearmen from the hamlets. +3 levies.', cost: { gold: 2 }, fx: [{ res: { levies: 3 } }], result: 'The muster-horn sounds in the hamlets. Three more spears answer.' },
      scout: { name: 'Scout the North Pass', icon: '🦅', desc: 'Watch the pass. You will not be surprised, and the vanguard will be thinned.', cost: { grain: 1 }, fx: [{ set: 'scoutedPass' }], result: 'Riders slip into the Greywood to watch the pass.' },
      fortify: { name: 'Barricade the Gate', icon: '🧱', desc: 'Timber and carts narrow the north gate to a single gap.', cost: { gold: 2 }, fx: [{ set: 'fortified' }], result: 'Carts and timber are dragged across the north gate.' },
      feast: { name: 'Hold a Hearth-Feast', icon: '🍲', desc: '+1 Standing and your companions trust you a little more.', cost: { grain: 2 }, fx: [{ res: { standing: 1 } }, { trust: { maren: 1, tamsin: 1, isolde: 1, kell: 1 } }], result: 'A full table in a cold hall. Faces soften around the fire.' },
      tithe: { name: 'Collect the Tithe', icon: '📜', desc: '+2 gold, but the hamlets will mutter (−1 Standing).', fx: [{ res: { gold: 2, standing: -1 } }], result: 'The reeve’s men go door to door. Coin comes in; goodwill goes out.' },
      forage: { name: 'Forage the Greywood', icon: '🌲', desc: '+2 grain (+1 more if Isolde guides you).', fx: [{ res: { grain: 2 } }, { when: { has: 'isolde' }, then: [{ res: { grain: 1 } }] }], result: 'Hunters return with game and winter roots.' },
      train: { name: 'Drill the Garrison', icon: '🥋', desc: 'Your levies hit harder in every battle from now on (+1 attack).', cost: { gold: 1 }, if: '!trained', fx: [{ set: 'trained' }], result: 'Maren drills the levies until they stop flinching.' },
      consecrate: { name: 'Consecrate the Barrow-Ground', icon: '🧂', desc: 'Salt and iron around the altar: your company takes 1 less damage in the Barrow Night.', cost: { grain: 1 }, fx: [{ set: 'ritualPrepared' }], result: 'Tamsin walks the field with salt and iron nails, murmuring.' },
      scout_barrows: { name: 'Scout the Barrow-Field', icon: '🔭', desc: 'Isolde marks where the dead will rise. One whole wave will not come.', cost: { grain: 1 }, if: [{ has: 'isolde' }, '!clanLore'], fx: [{ set: 'scoutedBarrows' }], result: 'Isolde walks the barrow-field at dusk and chalks the soft ground.' },
    },

    councils: {
      winter: {
        title: 'The Winter Council', ap: 2, draws: 2,
        actions: ['muster', 'scout', 'fortify', 'feast', 'tithe', 'forage', 'train'],
        pool: [
          { scene: 'evt_reeve', priority: true, once: true },
          { scene: 'evt_refugees', weight: 3, once: true },
          { scene: 'evt_ashfall', weight: 2, once: true },
          { scene: 'evt_peddler', weight: 2, once: true },
        ],
        then: 'gate_prelude',
      },
      barrow: {
        title: 'The Barrow Council', ap: 2,
        actions: ['muster', 'consecrate', 'scout_barrows', 'feast', 'forage', 'train'],
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
        roster: ['maren', 'tamsin', 'isolde'],
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
          { if: 'trained', note: 'Maren’s drilling shows: your levies strike harder.', do: [] },
        ],
      },

      barrows: {
        name: 'Barrow Night',
        intro: 'Tamsin must hold the altar-light until the moon sets. If she falls, the rite fails. She cannot move; everything else is up to you.',
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
        roster: ['maren', 'isolde', 'kell', 'tamsin'],
        fixed: { tamsin: { at: [5, 4], immobile: true } },
        maxLevies: 4,
        win: { type: 'survive', turns: 6 },
        lose: { unitDies: 'tamsin' },
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
          { if: { trust: 'tamsin', gte: 4 }, note: 'Tamsin trusts you: her hands are steady, and the rite will finish a turn early.', do: [{ winTurns: -1 }] },
        ],
      },

      vault: {
        name: 'The Vault Stair',
        intro: 'Get Tamsin to the Vault door at the top of the stair. If she falls, everything is lost.',
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
        roster: ['tamsin', 'maren', 'isolde', 'kell'],
        maxLevies: 3,
        win: { type: 'reach', unit: 'tamsin', tiles: [[4, 0]] },
        lose: { unitDies: 'tamsin', turnLimit: 14 },
        winText: 'Tamsin reaches the Vault door.',
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
          { if: 'won_barrows', note: 'The rekindled light in Tamsin’s lantern strengthens your company.', do: [{ buff: { side: 'player', hp: 2 } }] },
        ],
      },
    },

    codex: [
      { title: 'Cindervale', if: 'v_walls', text: 'A black-stone keep on the northern ridge above the Greywood, half in ruin. It has been a punishment posting for as long as anyone remembers. No one remembers why it was built so deep.' },
      { title: 'The Ember', if: 'seenPrologue', text: 'The flame in the crown’s heart-stone burned three hundred years without fuel. It warded roads, quieted barrows and made the Kingdom’s hearths a little warmer. It went out the night King Orrin died. Tamsin suspects it was never fire.' },
      { title: 'The Ashborn', if: 'kellCaptured', text: 'Those born after the Ember dimmed carry a spark behind their eyes and a cough that never quite clears. Kell says the sickness is why the Pale Banner wants the Vault.' },
      { title: 'The Regent’s Hand', if: 'defiedRegent', text: 'Lord Regent Thorne’s tax-collectors, spearmen and clerks. Orderly, well-funded, and always one step behind a rumour.' },
      { title: 'The Regent’s Hand', if: 'sworeRegent', text: 'Lord Regent Thorne’s tax-collectors, spearmen and clerks. You swore to them. They remember.' },
      { title: 'The Pale Banner', if: 'path_loyalist', text: 'Duchess Ysmay of Greywater claims the throne by blood. Her champion, Dame Sirene Ashgrove, rides in white-enamelled mail.' },
      { title: 'The Pale Banner', if: 'path_rebel', text: 'Duchess Ysmay of Greywater claims the throne by blood. Her champion, Dame Sirene Ashgrove, is now your ally. For now.' },
      { title: 'The Pale Banner', if: 'path_independent', text: 'Duchess Ysmay of Greywater claims the throne by blood. Her champion, Dame Sirene Ashgrove, wants something under your keep.' },
      { title: 'The Marchers', if: { visited: 'act3_open' }, text: 'The Greywood clans have lived at the edge of the ash for three generations. They want nothing from any crown except to be left alone.' },
      { title: 'The Vault', if: { visited: 'vault_prelude' }, text: 'A sealed chamber under Cindervale’s great hall, a hundred and one steps below. King Orrin’s last decree: hold it, and let no one through.' },
      { title: 'The Veil-stone', if: { visited: 'vault_win' }, text: 'A shard of dark glass that hangs in the air. It hums when Tamsin’s lantern is near, and shows a map that is not of any country.' },
    ],

    scenes: {
      /* ======================= PROLOGUE ======================= */
      prologue: {
        title: 'The Night the Ember Died', mood: 'night',
        enter: [{ set: 'seenPrologue' }],
        text: [
          'Ten nights ago, King Orrin the Unbroken died in the Winter Court at Highmere, and the Ember went out.',
          'It had burned in the crown’s heart-stone for three hundred years: warding the roads, quieting the barrows, holding the long dark at arm’s length. When the king drew his last breath it guttered, and every hearth in Aldmere flickered with it. Now ash falls from clear skies, and on the northern barrow-fields the dead have begun to walk.',
          'No heir was named. Lord Regent Thorne holds the capital. Duchess Ysmay of Greywater has raised the Pale Banner and calls the throne hers by blood. And from the king’s sickbed came one final decree, sealed with his own ring and addressed to {name}: *Take Cindervale. Hold it. Let no one through the Vault.*',
          'You do not know what is in the Vault. Everyone who has heard of the decree thinks it is a punishment. Cindervale is a ruin on the edge of the world.',
        ],
        choices: [{ t: 'Ride north.', go: 'background' }],
      },

      background: {
        title: 'Before the Decree', mood: 'night',
        text: ['The road north is long, and there is time to think. Before the decree, who were you?'],
        choices: [
          { t: 'A soldier. A sworn blade of the Border Guard.', tip: 'You know walls, drills and what a hard winter does to a garrison. +2 levies.', fx: [{ bg: 'soldier' }, { chron: 'You came to Cindervale as a soldier of the Border Guard.' }], go: 'arrival' },
          { t: 'A scholar. A reader in the King’s Archive.', tip: 'You know old tongues, older oaths, and where the buried things in books are buried. +2 grain.', fx: [{ bg: 'scholar' }, { chron: 'You came to Cindervale as a scholar from the King’s Archive.' }], go: 'arrival' },
          { t: 'An envoy. A voice at the Regent’s table.', tip: 'You know what people want, what they say, and the price of both. +3 gold, +1 Standing.', fx: [{ bg: 'envoy' }, { chron: 'You came to Cindervale as an envoy from the Regent’s court.' }], go: 'arrival' },
        ],
      },

      /* ======================= ARRIVAL ======================= */
      arrival: {
        title: 'Cindervale', mood: 'snow',
        enter: [
          { join: 'maren' }, { join: 'tamsin' },
          { when: 'bg_soldier', then: [{ trust: { maren: 1 } }] },
          { when: 'bg_scholar', then: [{ trust: { tamsin: 1 } }] },
          { day: 1 },
        ],
        text: [
          'Cindervale squats on a ridge above the Greywood, a keep of black stone with half its teeth missing. Snow lies on the battlements and ash lies on the snow.',
          'A woman in a battered knight’s cloak meets you at the gate and does not smile. **Ser Maren Voss**, castellan, thirty years in the old king’s service. “The decree arrived before you did,” she says. “So did the ash. I’d call that an omen, if I believed in omens.”',
          'Beside her stands a thin, ink-stained figure holding a lantern whose flame burns small, blue, and perfectly steady. “**Tamsin Quill**. Ember-priest, archivist, and for ten nights the only person in this keep who has been awake.” She looks at the sealed stair behind the great hall, and then at you. “I was hoping someone would tell me what the king wanted kept down there.”',
          { if: 'bg_soldier', t: 'Maren’s eyes go over your boots, your hands, the way you stand. “Soldier,” she says, and it sounds almost like approval.' },
          { if: 'bg_scholar', t: 'Tamsin stares at the ink on your cuff. “Archive-trained. Thank the Ember.”' },
          { if: 'bg_envoy', t: 'Maren notes your good gloves. “Court,” she says, as though naming a disease.' },
        ],
        choices: [{ t: 'Take stock of Cindervale.', go: 'stock' }],
      },

      stock: {
        title: 'Taking Stock', mood: 'snow',
        text: ['Maren lays the keep’s troubles out like a hand of bad cards: the walls, the granary, the hamlet beneath the ridge. There is time to look into two of them before the council must meet.'],
        choices: [
          { t: 'Walk the walls with Maren.', if: '!v_walls', go: 'stock_walls' },
          { t: 'Count the granary with the steward.', if: '!v_granary', go: 'stock_granary' },
          { t: 'Go down to the hamlet.', if: '!v_village', go: 'stock_village' },
          { t: 'Enough. Call the council.', if: { n: 'stock', gte: 2 }, go: 'council1' },
        ],
      },

      stock_walls: {
        title: 'The North Wall', mood: 'snow',
        enter: [{ set: 'v_walls' }, { inc: { stock: 1 } }],
        text: [
          'The north wall faces the Greywood and the pass beyond it. The rampart over the gate has collapsed into the courtyard; the stones are all still there, lying in drifts of snow.',
          '“Two good archers on that wall-walk are worth ten spearmen in the yard,” Maren says. “Fix the rampart and I can put the militia on it. Two gold in mortar and carters.”',
        ],
        choices: [
          { t: 'Pay two gold for masons.', cost: { gold: 2 }, fx: [{ set: 'wallsRepaired' }, { trust: { maren: 1 } }, { chron: 'You had the north rampart rebuilt.' }], go: 'stock' },
          { t: 'Show the garrison how to reseat the stones yourself.', if: 'bg_soldier', tip: 'Soldier background', fx: [{ set: 'wallsRepaired' }, { trust: { maren: 2 } }, { chron: 'You rebuilt the north rampart with the garrison, stone by stone.' }], go: 'stock' },
          { t: 'Leave it. Gold is scarcer than stone.', go: 'stock' },
        ],
      },

      stock_granary: {
        title: 'The Granary', mood: 'snow',
        enter: [{ set: 'v_granary' }, { inc: { stock: 1 } }],
        text: [
          'The granary is a cold stone room with more rat-droppings than grain. The steward, a nervous man named Piet, shows you the count: five sacks, a long winter, and a garrison that has not been paid since autumn.',
        ],
        choices: [
          { t: 'Ration the garrison.', tip: '+1 grain, Maren will not like it', fx: [{ res: { grain: 1 } }, { trust: { maren: -1 } }, { set: 'rationed' }], go: 'stock' },
          { t: 'Requisition grain from the hamlet.', tip: '+3 grain, −1 Standing', fx: [{ res: { grain: 3, standing: -1 } }, { set: 'requisitioned' }, { chron: 'You requisitioned grain from the hamlet.' }], go: 'stock' },
          { t: 'Buy grain from the miller.', cost: { gold: 2 }, tip: '+3 grain, +1 Standing', fx: [{ res: { grain: 3, standing: 1 } }], go: 'stock' },
          { t: 'Have Tamsin search the chapel records for old stores.', if: 'bg_scholar', tip: 'Scholar: +3 grain', fx: [{ res: { grain: 3 } }, { trust: { tamsin: 1 } }, { chron: 'You found a forgotten root cellar in the old chapel records.' }], go: 'stock' },
        ],
      },

      stock_village: {
        title: 'Lower Cinder', mood: 'snow',
        enter: [{ set: 'v_village' }, { inc: { stock: 1 } }],
        text: [
          'The hamlet of Lower Cinder is nine chimneys, six of them smoking. The people watch you from doorways. In the square, a lean woman with a poacher’s hands sits in the stocks, glaring at the sky as if it owed her money.',
          '“Isolde Fenn,” says the reeve. “Took a deer from the king’s wood. Third time. The king is dead, so nobody’s sure whose law to use.”',
        ],
        choices: [
          { t: 'Free her. “The king’s wood has no king.”', fx: [{ join: 'isolde' }, { trust: { isolde: 2 } }, { res: { standing: 1 } }, { set: 'freedIsolde' }, { chron: 'You freed Isolde Fenn from the stocks of Lower Cinder.' }], go: 'stock' },
          { t: 'Talk the reeve into releasing her to your custody.', if: 'bg_envoy', tip: 'Envoy background', fx: [{ join: 'isolde' }, { trust: { isolde: 1 } }, { res: { standing: 1 } }, { set: 'talkedIsolde' }, { chron: 'You talked the reeve into releasing Isolde Fenn to you.' }], go: 'stock' },
          { t: 'Fine her two gold and let her work it off.', fx: [{ join: 'isolde' }, { res: { gold: 2 } }, { set: 'finedIsolde' }, { chron: 'You fined Isolde Fenn and took her into your company.' }], go: 'stock' },
          { t: 'Leave her in the stocks. Order is order.', fx: [{ set: 'isoldeSpurned' }], go: 'stock' },
        ],
      },

      council1: {
        title: 'The Winter Council', mood: 'fire', council: 'winter',
        text: [
          'The council meets in the great hall around a table with one leg shorter than the others. Maren, Tamsin and the steward wait for your orders.',
          { if: { has: 'isolde' }, t: 'Isolde has attached herself to the corner by the fire, sharpening an arrowhead and listening to everything.' },
          'You cannot do everything. Choose where the keep’s little strength goes.',
        ],
      },

      /* ======================= WINTER EVENTS ======================= */
      evt_reeve: {
        title: 'The Tax-Reeve', mood: 'court',
        text: [
          'On the third day a column comes up the ridge road under the Regent’s gold and black: twelve spears, a clerk on a mule, and **Tax-Reeve Corvin Hale** in a fur-trimmed coat that has never known mud.',
          '“By order of Lord Regent Thorne,” he announces, “Cindervale owes three years’ arrears, three gold in coin, and its Warden an oath of fealty to the Regent’s Hand. The Regent will have order in the north.”',
          { if: 'bg_envoy', t: 'You know Corvin. He is not stupid; he is frightened, and he has a longer leash than he lets on.' },
        ],
        choices: [
          { t: 'Pay three gold and swear the oath.', cost: { gold: 3 }, tip: '−1 Standing, Maren will not like it', fx: [{ set: 'sworeRegent' }, { res: { standing: -1 } }, { trust: { maren: -1 } }, { chron: 'You swore to the Regent’s Hand to quiet the Tax-Reeve.' }], go: '@return' },
          { t: 'Bargain: one gold now, the rest “when the roads clear”.', if: 'bg_envoy', cost: { gold: 1 }, tip: 'Envoy background', fx: [{ set: 'regentStalled' }, { chron: 'You talked the Tax-Reeve into leaving with one gold and a promise.' }], go: '@return' },
          { t: 'Let the rebuilt wall speak for you.', if: ['bg_soldier', 'wallsRepaired'], tip: 'Soldier background', fx: [{ set: 'defiedRegent' }, { res: { standing: 1 } }, { trust: { maren: 1 } }, { chron: 'You walked the Regent’s Tax-Reeve along the rebuilt wall until he went pale.' }], go: '@return' },
          { t: 'Refuse. “Cindervale answers to Cindervale.”', fx: [{ set: 'defiedRegent' }, { res: { standing: 1 } }, { trust: { maren: 1, isolde: 1 } }, { chron: 'You turned the Regent’s Tax-Reeve away from the gate.' }], go: '@return' },
        ],
      },

      evt_refugees: {
        title: 'Refugees', mood: 'snow',
        text: [
          'A line of people trudges out of the snow: farmers from Greywater, children wrapped in sacking. They say the Pale Banner is taking grain for the Duchess’s army, and the Regent’s men are taking the rest.',
        ],
        choices: [
          { t: 'Shelter them in the keep.', cost: { grain: 2 }, tip: '+1 levy, +1 Standing', fx: [{ res: { levies: 1, standing: 1 } }, { chron: 'You gave shelter to refugees from Greywater.' }], go: '@return' },
          { t: 'Give them one meal and send them south.', cost: { grain: 1 }, go: '@return' },
          { t: 'Turn them away.', tip: '−1 Standing, Tamsin and Maren disapprove', fx: [{ res: { standing: -1 } }, { trust: { tamsin: -1, maren: -1 } }], go: '@return' },
        ],
      },

      evt_ashfall: {
        title: 'Ashfall', mood: 'night',
        text: [
          'Ash falls all night, soft as wool. By morning the courtyard is grey, and the sentries report that something stood at the treeline until dawn: a person-shaped thing, patient, facing the keep.',
          'Tamsin sets her small blue lantern on the table, and the flame leans toward the north.',
        ],
        choices: [
          { t: 'Ask Tamsin what she knows about the Ember.', go: 'evt_ashfall_lore' },
          { t: 'Double the night watch.', cost: { grain: 1 }, tip: 'Maren approves', fx: [{ set: 'doubledWatch' }, { trust: { maren: 1 } }], go: '@return' },
        ],
      },
      evt_ashfall_lore: {
        title: 'What the Archive Remembers', mood: 'night',
        enter: [{ set: 'loreEmber' }, { trust: { tamsin: 1 } }],
        text: [
          '“The Ember was a ward,” Tamsin says. “Now there is nothing between the barrows and the living but the dark.”',
          '“The records say Orrin’s grandfather found the heart-stone in a crater, still warm. We always assumed it was fire. But it never burned anything. It never smoked.” She turns the lantern slowly. “I think it was never *ours*.”',
        ],
        next: '@return',
      },

      evt_peddler: {
        title: 'The Peddler', mood: 'snow',
        text: [
          'A peddler named Odo wanders up the ridge in a cart pulled by an ox older than the kingdom, offering lamp-oil, salt, a crate of crossbow bolts, and a sack of grain that is “definitely not stolen”.',
        ],
        choices: [
          { t: 'Buy the grain.', cost: { gold: 2 }, tip: '+3 grain', fx: [{ res: { grain: 3 } }], go: '@return' },
          { t: 'Buy the bolts for Isolde.', if: { has: 'isolde' }, cost: { gold: 1 }, tip: 'Isolde will be delighted', fx: [{ trust: { isolde: 2 } }], go: '@return' },
          { t: 'Pay him in conversation: ask for news.', fx: [{ set: 'heardWar' }], go: '@return' },
        ],
      },

      /* ======================= THE GATE ======================= */
      gate_prelude: {
        title: 'Dusk', mood: 'fire',
        text: [
          'Dusk, the fifth day. The horn on the north wall sounds twice: riders on the Greywood road, many, without a banner.',
          { if: 'scoutedPass', t: 'Your scouts reported them hours ago, and the garrison has had time to arm.' },
          { if: '!scoutedPass', t: 'It comes without warning. Half the garrison is still at supper.' },
          { if: 'fortified', t: 'Carts and timber choke the north gate down to a single gap, and Maren has put her best men behind it.' },
          { if: 'wallsRepaired', t: 'The rebuilt rampart bristles with militia bows.' },
          { if: { has: 'isolde' }, t: 'Isolde takes the ruined stair two steps at a time, strings her bow without being told, and grins like a wolf. “Finally.”' },
          'Maren hands you a spear you did not ask for. “Warden,” she says. “They should learn the name.”',
        ],
        choices: [{ t: 'To the gate!', go: 'gate_battle' }],
      },
      gate_battle: { title: 'The North Gate', mood: 'fire', battle: 'gate', win: 'gate_win', lose: 'gate_lose', text: [] },

      gate_win: {
        title: 'Dawn at the Gate', mood: 'snow',
        enter: [{ res: { gold: 2 } }, { set: 'kellCaptured' }, { chron: 'The raiders broke against the north gate of Cindervale.' }, { day: 1 }],
        text: [
          'The raiders break. The last of them, a young woman in a scorched grey cloak who threw fire from her bare hands, goes down at the foot of the gate with ash steaming from her sleeves.',
          'She is alive. Her eyes are the colour of embers: not red, *lit*, as though something behind them were burning. Tamsin kneels beside her and goes very still. “Ashborn,” she whispers. “I thought they were a story.”',
          'She wears no banner, but there is a pale ribbon sewn inside her collar. The Pale Banner’s colour.',
        ],
        next: 'kell_fate',
      },

      gate_lose: {
        title: 'The Gate Falls', mood: 'fire',
        enter: [{ res: { grain: -1, standing: -1 } }, { set: 'gateLost' }, { chron: 'The north gate fell. Cindervale burned, and the raiders took what they could carry.' }, { day: 1 }],
        text: [
          'The gate gives. The raiders pour through, burn the stable and the granary roof, strip the armoury of whatever they can carry, and are gone by moonrise with a wagon of your grain. They leave only ash and a pale ribbon snagged on the gatepost.',
          'You are alive, and so is the keep. Maren has a broken arm and a very short temper.',
        ],
        next: AFTER_GATE,
      },

      kell_fate: {
        title: 'The Captive', mood: 'court',
        text: [
          'By dawn the prisoner is awake, chained to a bench in the guardroom, watching the door like a cornered cat. The garrison wants her hanged. Tamsin wants her *studied*. Maren wants to know what she knows.',
        ],
        choices: [
          { t: 'Send the guards out and talk to her.', go: 'kell_talk' },
          { t: 'Lock her in the cellar and decide later.', fx: [{ set: 'kellHeld' }], go: AFTER_GATE },
          { t: 'Hang her at dawn as a raider.', tip: 'Tamsin will not forgive this', fx: [{ set: 'kellExecuted' }, { trust: { tamsin: -3, isolde: -1 } }, { chron: 'You hanged the Ashborn raider at dawn.' }], go: 'kell_hanged' },
        ],
      },
      kell_hanged: {
        title: 'The Rope', mood: 'night',
        text: ['The rope is quick. Nobody speaks. Tamsin does not come to supper for two days. Maren says, to no one, that it was a soldier’s justice, and it sounds like she is trying to believe it.'],
        next: AFTER_GATE,
      },

      kell_talk: {
        title: 'Across the Table', mood: 'court',
        text: [
          'You send the guards out and sit across from her. Up close she is younger than you thought, nineteen perhaps, and the lit eyes are tired and wary.',
          '“Go on,” she says. “Ask. Everyone asks.”',
        ],
        choices: [
          { t: 'Offer her bread and your name.', cost: { grain: 1 }, go: 'kell_truth' },
          { t: 'Recite the Archive’s oldest verse about the Ashborn.', if: 'bg_scholar', tip: 'Scholar background', go: 'kell_truth' },
          { t: '“You were sent here to die, weren’t you?”', if: 'bg_envoy', tip: 'Envoy background', go: 'kell_truth' },
          { t: 'Threaten her. Soldiers do.', go: 'kell_fear' },
        ],
      },
      kell_truth: {
        title: 'What Kell Knows', mood: 'court',
        enter: [{ set: 'kellTruth' }, { chron: 'The Ashborn captive told you why the Pale Banner wants the Vault.' }],
        text: [
          'She tells it in a flat voice, as if reciting a lesson.',
          '“The Duchess doesn’t want your keep. She wants what’s under it. The king hid something in the Vault years ago, and when he died the Ember went dark. I don’t understand it. I only know the Duchess’s mages say the Ashborn are *drawn* to it, like moths. We’re all dying, slowly. The Vault is where the Ember came from, and the only place it might come back.”',
          '“And the maps of my walls?” Maren asks. Kell hesitates. “Came from the Regent’s chamberlain. A man in a grey glove. Someone in the capital is selling both sides the same knife.”',
          '“I’m called Kell,” she says at last. “Kell Ashworth. I’d like to stop being a prisoner now, please.”',
        ],
        choices: [
          { t: 'Release her and offer her a place in your company.', fx: [{ join: 'kell' }, { set: 'kellSpared' }, { trust: { tamsin: 1 } }, { chron: 'Kell Ashworth, an Ashborn raider, joined your company.' }], go: AFTER_GATE },
          { t: 'Release her and send her away.', fx: [{ set: 'kellFreed' }, { trust: { tamsin: 1 } }], go: AFTER_GATE },
          { t: 'Keep her in the cellar for now.', fx: [{ set: 'kellHeld' }], go: AFTER_GATE },
        ],
      },
      kell_fear: {
        title: 'What Kell Says', mood: 'court',
        enter: [{ set: 'kellFeared' }, { set: 'kellHeld' }],
        text: [
          'She goes rigid, spits once, and says nothing for a long time. When she does talk, it is what a frightened person thinks you want to hear: the Pale Banner will take the keep by midwinter, the Duchess is unstoppable, you should surrender while you still can.',
          'It is, Tamsin observes quietly afterward, almost certainly not the whole truth.',
        ],
        next: AFTER_GATE,
      },

      isolde_returns: {
        title: 'A Figure at the Gate', mood: 'snow',
        enter: [{ join: 'isolde' }, { trust: { isolde: -1 } }, { chron: 'Isolde Fenn came to Cindervale of her own accord.' }],
        text: [
          'Three nights later, a figure steps out of the Greywood into the torchlight and drops a brace of dead rabbits at the gate. It is Isolde Fenn, with her bow slung and her face set like stone.',
          { if: 'isoldeSpurned', t: '“You left me in the stocks,” she says. “I held on to that for four days.” She shrugs. “Then I watched you hold that gate from the treeline.”' },
          { if: '!isoldeSpurned', t: '“Isolde Fenn, from Lower Cinder. I was away when you came. Word is the new Warden holds gates and doesn’t hang people for hunting.”' },
          '“Maybe the king’s wood needs a warden after all,” she says. “Don’t make me regret it.”',
        ],
        next: 'act3_open',
      },

      /* ======================= ACT III: CHOOSING ======================= */
      act3_open: {
        title: 'Three Banners', mood: 'court',
        enter: [{ day: 5 }],
        text: [
          'The ash does not stop. Six nights after the gate, three parties come up the ridge road within a single afternoon.',
          '**The Regent’s Hand.** Captain Aldous Venn, grey-bearded and tired, with sixty spears and a letter under Lord Thorne’s seal: *Cindervale will be garrisoned for the Crown. The Vault will be opened to the Regent’s agents.*',
          { if: 'sworeRegent', t: 'You swore to him; he expects a Warden who keeps oaths.' },
          { if: 'defiedRegent', t: 'He has not forgotten your refusal at the gate.' },
          '**The Pale Banner.** Dame Sirene Ashgrove, the Duchess’s champion, in white-enamelled mail. She offers an alliance and a promise: the Duchess will relight the Ember, and Cindervale will hold the northern march in perpetuity.',
          { if: 'kellSpared', t: '“Kell,” she says, without looking at her. “You look well, for a traitor.” Kell flinches.' },
          '**The Marchers.** Hettie Rook, elder of the Greywood clans, with forty hunters who have lived at the edge of the ash for three generations. They want nothing from any crown except to be left alone, and a Warden who will hold the line against the dead.',
          '“Choose,” Maren says quietly. “The barrows open tonight. Whoever stands beside us tonight is who we owe.”',
        ],
        choices: [
          { t: 'Accept the Regent’s garrison.', tip: '+3 gold, +2 levies, −1 Standing', fx: [{ set: 'path_loyalist' }, { res: { gold: 3, levies: 2, standing: -1 } }, { trust: { maren: 1 } }, { chron: 'You accepted the Regent’s garrison at Cindervale.' }], go: 'council2' },
          { t: 'Take the Duchess’s hand.', tip: '+2 gold, +1 levy', fx: [{ set: 'path_rebel' }, { res: { gold: 2, levies: 1 } }, { trust: { isolde: 1 } }, { chron: 'You took the Pale Banner’s hand against the Regent.' }], go: 'council2' },
          { t: 'Stand with the Marchers.', need: { res: 'standing', gte: 1 }, needText: 'The clans follow only a Warden the people trust (Standing 1+).', tip: '+3 grain, +3 levies', fx: [{ set: 'path_independent' }, { res: { grain: 3, levies: 3 } }, { trust: { isolde: 2 } }, { chron: 'You stood with the Greywood Marchers, answering to no crown.' }], go: 'council2' },
        ],
      },

      council2: {
        title: 'The Barrow Council', mood: 'fire', council: 'barrow',
        text: [
          'Night comes fast. In the great hall, the allies you chose and the companions you kept watch you plan. The barrows will open at moonrise, and Tamsin must stand at the old altar and hold the light. Everything else is your problem.',
        ],
      },

      evt_aldous: {
        title: 'Captain Aldous', mood: 'court',
        text: [
          'Aldous Venn finds you on the wall as the light goes. “My orders say the Vault,” he says. “But I have eyes. If the barrows are what Tamsin says, orders can wait until morning.” He studies you. “What is down there, Warden?”',
        ],
        choices: [
          { t: 'Tell him what you know of the Ember and the Vault.', fx: [{ set: 'sharedVault' }, { chron: 'You told Captain Aldous what lay beneath Cindervale.' }], go: '@return' },
          { t: 'Keep the Vault’s secret.', fx: [{ set: 'keptSecret' }], go: '@return' },
        ],
      },
      evt_sirene: {
        title: 'Dame Sirene', mood: 'court',
        text: [
          'Dame Sirene finds you in the stable, brushing her horse as though the night were quiet. “The Duchess needs what’s under your keep,” she says. “You’ve seen what is happening to the Ashborn. Do you want that to spread?” She says it without cruelty, which is worse.',
        ],
        choices: [
          { t: 'Hear her out.', tip: '+1 gold', fx: [{ set: 'heardSirene' }, { res: { gold: 1 } }, { chron: 'You heard Dame Sirene’s case for the Duchess.' }], go: '@return' },
          { t: 'Refuse to discuss the Vault.', fx: [{ set: 'keptSecret' }], go: '@return' },
        ],
      },
      evt_hettie: {
        title: 'Hettie Rook', mood: 'snow',
        text: [
          'Hettie Rook sits by the fire sucking a clay pipe. “Wights fear fire and iron,” she says. “And they come up where the ground is soft, same places they did when my grandmother was a girl. Bring both. I’ll tell you where.”',
        ],
        choices: [
          { t: 'Learn the clans’ lore of the barrow-field.', tip: 'One wave of dead will not come', fx: [{ set: 'clanLore' }, { chron: 'The Marchers taught you where the barrow-dead rise.' }], go: '@return' },
          { t: 'Swear a pact of mutual defence.', tip: 'A fourth clan hunter will fight at the Vault', fx: [{ set: 'clanPact' }, { chron: 'You swore a pact of mutual defence with the Greywood clans.' }], go: '@return' },
        ],
      },

      /* ======================= THE BARROWS ======================= */
      barrow_prelude: {
        title: 'Moonrise', mood: 'night',
        text: [
          'Moonrise. The barrow-field below the keep is a plain of standing stones and older mounds, silver under the ash. At its centre is a stone altar older than the kingdom; Tamsin’s lantern-flame lies flat toward it like a compass needle.',
          '“The rite is simple,” Tamsin says, in the voice of someone describing surgery. “I stand at the altar and hold the light. If I’m interrupted, if I fall, it goes out and doesn’t come back. We have to last until the moon sets.”',
          { if: 'path_loyalist', t: 'Aldous’s pikemen form a hedge of iron on the left flank.' },
          { if: 'path_rebel', t: 'Sirene’s knights ride out in white and silver, their horses already shying from the smell of old death.' },
          { if: 'path_independent', t: 'Hettie’s hunters melt into the standing stones, arrows nocked.' },
          { if: { any: ['scoutedBarrows', 'clanLore'] }, t: 'You know where the dead will rise. You will not be surprised twice.' },
          { if: 'ritualPrepared', t: 'Salt and iron nails ring the altar.' },
        ],
        choices: [{ t: 'Light the lantern.', go: 'barrow_battle' }],
      },
      barrow_battle: { title: 'Barrow Night', mood: 'night', battle: 'barrows', win: 'barrow_win', lose: 'barrow_lose', text: [] },

      barrow_win: {
        title: 'The Light Holds', mood: 'snow',
        enter: [{ chron: 'Tamsin held the altar-light through Barrow Night, and the dead went back to the ground.' }, { trust: { tamsin: 1 } }, { day: 1 }],
        text: [
          'Dawn comes grey and clean. The ash stops falling. In the heart of the altar, something small and blue rekindles: not a fire, a *point*, steady as a star. Tamsin sinks to her knees, laughing and sobbing at once.',
          '“It’s the same light,” she says. “Same as the Ember. A small one, but the same. Orrin knew.”',
        ],
        next: 'ultimatum',
      },
      barrow_lose: {
        title: 'The Light Fails', mood: 'night',
        enter: [{ chron: 'The altar-light failed on Barrow Night. The dead walked until dawn.' }, { res: { standing: -1, grain: -1 } }, { day: 1 }],
        text: [
          'The light gutters. Tamsin goes down, and the field fills with grey hands. You fall back through the postern, and whatever survives crawls home by dawn.',
          'The ash keeps falling. But the dead are tired too, and by sunrise they return to the mounds, as though the night had been a rehearsal.',
        ],
        next: 'ultimatum',
      },

      ultimatum: {
        title: 'The Vault', mood: 'court',
        text: [
          'Whoever stood beside you in the dark now stands before you in the morning, and wants what they came for.',
          { if: 'path_loyalist', t: 'Aldous Venn removes his helm. “My orders are plain. The Vault, Warden. Now.”' },
          { if: 'path_rebel', t: 'Sirene dismounts. “The Duchess’s patience is spent. The Vault.”' },
          { if: 'path_independent', t: 'Hettie Rook spits into the ash. “Both will come now. You can count on that. Where do you want us?”' },
        ],
        choices: [
          { t: 'Open the Vault for the Regent.', if: 'path_loyalist', fx: [{ set: ['ally_regent', 'enemy_pale', 'regentVault'] }, { chron: 'You opened the Vault under the Regent’s banner; the Pale Banner struck as the door opened.' }], go: 'vault_prelude' },
          { t: 'Ask Aldous to guard the stair while Tamsin opens the door alone.', if: ['path_loyalist', 'sharedVault'], tip: 'He trusts you', fx: [{ set: ['ally_regent', 'enemy_pale', 'regentTrust'] }, { chron: 'Captain Aldous agreed to guard the stair, trusting you with what lay behind the door.' }], go: 'vault_prelude' },
          { t: 'Refuse. “The Vault is Cindervale’s.”', if: 'path_loyalist', fx: [{ set: 'enemy_regent' }, { res: { standing: 1 } }, { trust: { maren: 1 } }, { chron: 'You refused the Regent’s demand. His men turned on you.' }], go: 'vault_prelude' },
          { t: 'Open the Vault for the Duchess.', if: 'path_rebel', fx: [{ set: ['ally_pale', 'enemy_regent', 'paleVault'] }, { chron: 'You opened the Vault under the Pale Banner; the Regent’s men struck as the door opened.' }], go: 'vault_prelude' },
          { t: 'Persuade Sirene to guard the stair while Tamsin opens the door alone.', if: ['path_rebel', 'heardSirene'], tip: 'She hears you', fx: [{ set: ['ally_pale', 'enemy_regent', 'paleTrust'] }, { chron: 'Dame Sirene agreed to guard the stair, trusting you with what lay behind the door.' }], go: 'vault_prelude' },
          { t: 'Refuse. “The Vault is Cindervale’s.”', if: 'path_rebel', fx: [{ set: 'enemy_pale' }, { res: { standing: 1 } }, { trust: { maren: 1 } }, { chron: 'You refused the Duchess’s demand. Her knights turned on you.' }], go: 'vault_prelude' },
          { t: 'Hold the stair with the Marchers.', if: 'path_independent', fx: [{ set: ['ally_clans', 'enemy_both'] }, { chron: 'You held the Vault stair with the Marchers against both claimants.' }], go: 'vault_prelude' },
          { t: 'Bluff the Regent’s men into standing down.', if: ['path_independent', 'bg_envoy'], tip: 'Envoy background', fx: [{ set: ['ally_clans', 'enemy_pale', 'bluffedRegent'] }, { chron: 'You bluffed the Regent’s men into standing down.' }], go: 'vault_prelude' },
        ],
      },

      vault_prelude: {
        title: 'A Hundred and One Steps', mood: 'vault',
        text: [
          'The Vault door lies at the top of the old stair beneath the great hall: a hundred and one steps worn by no one. Tamsin carries the key, a blue point of light in a lantern, and cannot use it unless she stands at the door.',
          { if: 'enemy_pale', t: 'Pale Banner steel glints in the dark above.' },
          { if: 'enemy_regent', t: 'Regent’s crossbows gleam on the landing.' },
          { if: 'enemy_both', t: 'Two banners, two sets of boots on the stone. They are wary of each other.' },
          { if: { wounded: 'tamsin' }, t: 'Tamsin is bruised from Barrow Night and leans on her staff, but she is moving.' },
          'Maren checks her sword. “We go up together,” she says. “Or not at all.”',
        ],
        choices: [{ t: 'Climb.', go: 'vault_battle' }],
      },
      vault_battle: { title: 'The Vault Stair', mood: 'vault', battle: 'vault', win: 'vault_win', lose: 'vault_lose', text: [] },

      vault_lose: {
        title: 'The Stair Is Lost', mood: 'night',
        enter: [{ res: { gold: -2, standing: -2 } }, { set: 'vaultLost' }, { chron: 'The Vault stair was lost. You fled Cindervale with what you could carry.' }, { day: 2 }],
        text: [
          'Tamsin falls on the ninety-fourth step. You drag her back down through the dark while the stair rings with boots.',
          'The door stays shut. Whoever holds the stair will hold Cindervale by morning.',
        ],
        next: 'ending_lost',
      },

      vault_win: {
        title: 'The Door', mood: 'vault',
        enter: [{ chron: 'Tamsin opened the Vault door.' }, { day: 1 }],
        text: [
          'Tamsin sets the lantern against the door. The blue flame leaps, and the stone *opens*, not like a door, but like an eyelid.',
          'The Vault is a round chamber of black glass. In the middle, hanging in the air where there is no cord, no pedestal, no wire, turns a shard the length of a forearm. It is the colour of the space between stars. It hums.',
          'On a shelf of the same black glass lies a journal in the old king’s hand. Tamsin reads the last page aloud, her voice not steady. *The Ember was never fire. It is a lighthouse. Something called, and this answered. If it goes out, it will call again, and I do not know who will come. Do not let them touch it. Do not let them feed it. If I am dead, someone must decide what it is.*',
          { if: 'regentTrust', t: 'Aldous stands at the door with his hand on his sword and does not step through. “I will report what I choose to report,” he says quietly.' },
          { if: 'paleTrust', t: 'Sirene bows her head at the threshold. “The Duchess will want to know,” she says. “I will tell her you were reasonable.”' },
          { if: 'kellSpared', t: 'Kell is shaking, but not with fear. The shard’s hum is in her bones, and the lit eyes shine.' },
          'The decision is yours.',
        ],
        choices: [
          { t: 'Seal the Vault. Let the shard sleep.', go: 'ending_seal' },
          { t: 'Rekindle the Ember with the shard.', go: 'ending_relight' },
          { t: 'Reach out and touch the shard.', go: 'ending_veil' },
        ],
      },

      /* ======================= ENDINGS ======================= */
      ending_seal: {
        title: 'Sealed', mood: 'snow', end: true,
        enter: [{ chron: 'You sealed the Vault with the old king’s ring. The shard sleeps.' }, { set: 'ch1_seal' }],
        text: [
          'You press the king’s ring to the lock, and the door closes with the sound of an old book shutting.',
          'The ash slows. The dead lie quiet. The hearths do not burn warmer, but they burn. Aldmere will wake to a cold spring, a throne without a king, and a ruin on the northern ridge that is suddenly very hard to ignore.',
          { if: 'kellSpared', t: 'Kell coughs in the cold morning. It will get worse before it gets better, and she knows it. She stays anyway.' },
          'Chapter One ends here. The shard sleeps, for now.',
        ],
      },
      ending_relight: {
        title: 'The Ember Returns', mood: 'fire', end: true,
        enter: [{ chron: 'You relit the Ember with the Veil-stone. The north was warm again.' }, { set: 'ch1_relight' }],
        text: [
          'The shard drifts to the lantern, and the blue flame swells, climbs the stair, floods the hall. On a hundred hearths across Aldmere, in the one moment before dawn, the fires bend north and burn warm.',
          'The Ash-sickness lifts from the Ashborn like a held breath. The dead settle. The shard dims to the colour of an old bruise and does not hum again.',
          { if: 'kellSpared', t: 'Kell laughs, a real laugh, her eyes dimming from ember to ordinary brown, and sits down heavily on the stair.' },
          'But Tamsin watches the dimmed shard for a long time. “It answered,” she says. “That means it was a question.”',
          'Chapter One ends here. The question is still out there.',
        ],
      },
      ending_lost: {
        title: 'Ashes', mood: 'night', end: true,
        text: [
          'You do not die at Cindervale, but Cindervale dies a little. By dawn the stair belongs to someone else, the Ember remains dark, and the northern road is empty and white.',
          'The story is not over. Maren tightens her cloak. “We rebuild,” she says. “Slower. Smarter.” Tamsin does not say anything, but she is still holding the little blue lantern, and its flame is still burning.',
          'Chapter One ends here. You can go back to your last save and try the stair again.',
        ],
      },
      ending_veil: {
        title: 'The Veil', mood: 'vault',
        enter: [{ chron: 'You touched the Veil-stone. The world went quiet.' }, { set: 'ch1_veil' }],
        text: [
          'You reach out. Tamsin says your name once, urgently. Maren starts to move.',
          'The shard is cold as the space between stars, and then it is not cold at all. The Vault walls peel away like old paint, and behind them is not stone, but *distance*. A great curved floor of dark glass. A ceiling of impossible stars.',
          'The hum stops. In the sudden silence you hear, very faintly, the sound of a very large machine waking up.',
        ],
        choices: [{ t: 'Step through.', fx: [{ travel: { pack: 'scifi', scene: 'wake' } }] }],
      },
    },
  };
})();

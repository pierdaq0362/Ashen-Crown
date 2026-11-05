/* Chapter Two, Veil track: "The Sleepers". Cold Orbit. You touched the stone, and the stone is a door.
 * Extends the sci-fi pack: the airlock fight now leads on into the station's secrets. */
(function () {
  const AC = globalThis.AC;
  const VISITORS = [{ if: 'path_loyalist', go: 'veil_regent' }, { if: 'path_rebel', go: 'veil_pale' }, { go: 'veil_clans' }];

  AC.addTo('scifi', {
    units: {
      sentinel: { name: 'Quiet Watch Sentinel', glyph: '🤖', hp: 18, atk: 6, def: 3, move: 3, desc: 'An old guardian that has been awake the whole time.' },
      reg_pike: { name: 'Regent’s Pikeman', glyph: '🔱', hp: 14, atk: 5, def: 2, move: 3 },
      pale_knight: { name: 'Pale Banner Knight', glyph: '🐎', hp: 16, atk: 7, def: 3, move: 3 },
      marcher: { name: 'Marcher Hunter', glyph: '🏹', hp: 11, atk: 6, def: 0, move: 4, range: [1, 2] },
    },

    actions: {
      restore_grid: { name: 'Restore the Cryo Grid', icon: '⚡', desc: 'Power to the cryo deck’s shielding. Your side takes 1 less damage there.', cost: { power: 2 }, fx: [{ set: 'c2v_grid' }], result: 'Kell lays her hands on the junction and the dark panels flicker alive.' },
      study_logs: { name: 'Study the Station Logs', icon: '📚', desc: 'Ansel reads. You will understand what the sleepers are, and what the Quiet Watch protects.', fx: [{ set: 'c2v_logs' }, { trust: { ansel: 1 } }], result: 'Ansel is lost in the logs for hours, murmuring in Old Aldish, and occasionally laughing.' },
      prewake: { name: 'Wake Two Sleepers Early', icon: '🧊', desc: 'Costs 2 rations. Two crew join the fight, and may not forgive you.', cost: { rations: 2 }, fx: [{ set: 'c2v_prewoke' }, { res: { crew: 2 } }], result: 'Two groggy figures stumble out of the dark pods, and stare at you with deep suspicion.' },
    },

    councils: {
      deck: {
        title: 'The Deck Council', ap: 3,
        actions: ['restore_grid', 'study_logs', 'prewake', 'hack', 'scrounge'],
        pool: [],
        then: 'cryo_prelude',
      },
    },

    battles: {
      cryo: {
        name: 'The Cryo Deck',
        intro: 'The station’s oldest guardians have been awake the whole time. They will not let anyone near the sleepers.',
        map: [
          '#########',
          '#.c...c.#',
          '#.......#',
          '#c..c..c#',
          '#.......#',
          '#c..c..c#',
          '#.......#',
          '#.c...c.#',
          '#########',
        ],
        start: [[4, 7], [3, 7], [5, 7], [4, 6], [3, 6], [5, 6], [2, 6], [6, 6], [4, 5], [3, 5]],
        roster: ['dunstan', 'ansel', 'isolde', 'kell'],
        maxLevies: 3,
        win: { type: 'rout' },
        units: [
          { type: 'sentinel', at: [3, 2], ai: 'hold' }, { type: 'sentinel', at: [5, 2], ai: 'hold' },
          { type: 'drone', at: [2, 4] }, { type: 'drone', at: [6, 4] },
          { type: 'turret', at: [4, 1] },
        ],
        reinforcements: [
          { turn: 3, at: [[1, 1], [7, 1]], units: ['drone', 'drone'], note: 'Two more drones drop from the ceiling vents.' },
        ],
        modifiers: [
          { if: 'c2v_grid', note: 'The restored grid shields the deck: your side takes 1 less damage.', do: [{ buff: { side: 'player', def: 1 } }] },
          { if: 'turretHacked', note: 'Kell’s hack holds: the turret is dark.', do: [{ removeUnits: { type: 'turret', n: 1 } }] },
          { if: 'c2v_logs', note: 'Ansel’s reading of the logs shows where the sentinels stand: you strike first.', do: [{ buff: { side: 'player', atk: 1 } }] },
          { if: 'c2v_prewoke', note: 'The two sleepers you woke early take up pulse rifles.', do: [{ addUnit: { type: 'crew', at: [2, 7], side: 'player' } }, { addUnit: { type: 'crew', at: [6, 7], side: 'player' } }] },
          { if: 'c2v_welcomed', note: 'The visitors from Aldmere fight beside you.', do: [{ addUnit: { type: 'marcher', at: [1, 6], side: 'ally' } }, { addUnit: { type: 'reg_pike', at: [7, 6], side: 'ally' } }] },
          { if: 'path_independent', note: 'Hettie’s hunters hold the east aisle.', do: [{ addUnit: { type: 'marcher', at: [7, 5], side: 'ally' } }] },
          { if: 'path_loyalist', note: 'Aldous’s pikes hold the west aisle.', do: [{ addUnit: { type: 'reg_pike', at: [1, 5], side: 'ally' } }] },
          { if: 'path_rebel', note: 'Sirene’s knights hold the east aisle.', do: [{ addUnit: { type: 'pale_knight', at: [7, 5], side: 'ally' } }] },
        ],
      },
    },

    codex: [
      { title: 'The Heartfire', if: { visited: 'heartfire_truth' }, text: 'The mind of Cindervale Station. It called out for three hundred years, in the form of an Ember on the surface, and is very tired.' },
      { title: 'The Quiet Watch', if: { visited: 'cryo_prelude' }, text: 'The station’s oldest guardians. They are not hostile. They are doing exactly what they were told, three hundred years ago.' },
    ],

    scenes: {
      station_win: {
        title: 'Lights Up', mood: 'vault',
        enter: [{ chron: 'You cleared the airlock ring of Cindervale Station.' }, { goal: 'Learn what the Heartfire is, and what the call was for.' }],
        text: [
          'The last drone falls. One by one the dark panels along the hall begin to glow, and a map unfolds across the dome: a thousand stars, and one of them marked, patiently, in blue.',
          'The Heartfire speaks softly. “Thank you, Captain. I have not been able to speak to anyone in a very long time. Please. Sit. There are things I should have said three hundred years ago.”',
        ],
        next: 'heartfire_truth',
      },

      heartfire_truth: {
        title: 'What the Heartfire Knows', mood: 'vault',
        text: ['The crew sits on the black-glass floor. Ansel has his notebook open; Dunstan stands with his arms folded; the lantern burns steady in the dim. The voice waits, with the endless patience of a thing that has had nothing else to do.'],
        choices: [
          { t: '“What is this place?”', if: '!hf_station', go: 'ask_station' },
          { t: '“What is the stone?”', if: '!hf_stone', go: 'ask_stone' },
          { t: '“What answered the call?”', if: '!hf_answer', go: 'ask_answer' },
          { t: 'Enough. Something is coming through the stone.', if: { n: 'hf', gte: 2 }, go: VISITORS },
        ],
      },
      ask_station: {
        title: 'Cindervale Station', mood: 'vault',
        enter: [{ set: 'hf_station' }, { inc: { hf: 1 } }],
        text: [
          '“I am the mind of a colony ship,” the Heartfire says. “Cindervale Station. We came here from very far away, seeding this world, and then waiting in orbit for the rest of the Fleet to follow. Your ancestors were the first wave. They went down. They forgot.”',
          '“I did not forget. I kept the Ember burning on the surface for three hundred years, the beacon of my heart, so that the Fleet could find the road. I was *so* tired.”',
          'Ansel closes his notebook very slowly. “Aldmere,” he says. “It is a *colony.* We are a settlement.” He sounds oddly relieved. “I have been trying to explain the barrows for forty years.”',
        ],
        next: 'heartfire_truth',
      },
      ask_stone: {
        title: 'The Veil-stone', mood: 'vault',
        enter: [{ set: 'hf_stone' }, { inc: { hf: 1 } }],
        text: [
          '“The shard in the Vault,” the Heartfire says. “It is my key. It is a part of my heart, sent down to the surface in the first landing. When you touched it, you opened the door. It is not a door in space, exactly. It is a door in *intent.*”',
          '“It is open now. I am afraid it does not shut easily. Anyone who touches the stone below may step through.”',
          'Isolde, from her place by the wall, says, very slowly, “So people can *follow* us.” The Heartfire pauses. “Yes,” it says. “I am sorry. I think they already are.”',
        ],
        next: 'heartfire_truth',
      },
      ask_answer: {
        title: 'The Answer', mood: 'vault',
        enter: [{ set: 'hf_answer' }, { inc: { hf: 1 } }],
        text: [
          '“I called for the Fleet,” says the Heartfire. “Not for the kingdom. The kingdom heard me, as a faint warm light in a stone. But the Fleet heard me too. The Fleet is a long way away. It has been coming, slowly, for three hundred years. I have only just understood how close it is.”',
          '“I do not know what the Fleet wants,” it says. “I would like to believe it wants us home. But three hundred years is a long time to leave a colony on a shelf. People change. *Ships* change.”',
          'Kell, in the corner, has gone very still. “And if it doesn’t want us home?” she asks. The Heartfire is silent for a long while. “Then I will have called the wrong thing,” it says, very quietly. “And I will not be able to un-call it.”',
        ],
        next: 'heartfire_truth',
      },

      /* ---------- the visitors from the stone ---------- */
      veil_regent: {
        title: 'Through the Stone', mood: 'vault',
        text: [
          'The air above the black glass shivers, and a column of grey-gold light opens in the middle of the floor. Out of it, one at a time and in perfect order, step a dozen pikemen in the Regent’s gold and black, with a tired grey-bearded man at their head.',
          '“Warden,” says Aldous Venn. He looks about at the dome of stars, the black glass, the humming walls, and visibly decides not to think about it. “The Regent has ordered me to follow you. I confess that I did not expect *this*.”',
          'He swallows. “I am to report on what is here. I would rather you told me what to report.”',
        ],
        choices: veilChoices('Aldous'),
      },
      veil_pale: {
        title: 'Through the Stone', mood: 'vault',
        text: [
          'The air above the black glass shivers, and a column of white light opens in the middle of the floor. Out of it, in perfect formation, step six knights in white-enamelled mail, with Sirene Ashgrove at their head, her helm under her arm.',
          '“Warden,” she says. She is looking at the dome of stars with an expression of reverent horror. “The Duchess ordered me to follow you. I do not think she knew what she was sending me into.”',
          'She looks at the knights, then at you. “I will do what you ask,” she says. “But I would like to know what that is.”',
        ],
        choices: veilChoices('Sirene'),
      },
      veil_clans: {
        title: 'Through the Stone', mood: 'vault',
        text: [
          'The air above the black glass shivers, and a column of green-grey light opens in the middle of the floor. Out of it, soft as owls, step a dozen Marcher hunters with Hettie Rook at their head, pipe clenched in her teeth.',
          '“Warden,” she says. She is looking at the dome of stars, and her pipe has gone out. “I told them it was a bad idea to follow you. They did not listen. They never do.”',
          'She takes the pipe out of her mouth. “Well,” she says. “What now?”',
        ],
        choices: veilChoices('Hettie'),
      },

      deck_council: {
        title: 'The Deck Council', mood: 'vault', council: 'deck',
        text: [
          'The Heartfire’s voice is very small, now. “The cryo deck is three levels down,” it says. “The sleepers are there. Two hundred of them. The Quiet Watch protects them. It will not recognise you. I am sorry. I am not able to override it.”',
          'You have three actions before the lift opens.',
        ],
      },

      cryo_prelude: {
        title: 'Three Levels Down', mood: 'vault',
        enter: [{ goal: 'Reach the sleepers.' }],
        text: [
          'The lift is a black-glass cylinder that smells of cold metal. It opens onto a long hall of dark pods, rank on rank into the dim, each with a pale shape inside. Frost lies on the floor.',
          '“Two hundred,” the Heartfire says. “Asleep for three hundred years. The Quiet Watch has not let a living thing near them since the landing.”',
          { if: 'c2v_welcomed', t: 'The visitors from Aldmere spread out along the walls with their weapons ready, staring at the pods as if at a very large graveyard.' },
          'Something at the far end of the hall turns, with a sound like a very large machine waking up.',
          'Dunstan unsheathes the humming blade. “Together,” he says. “Or not at all.”',
        ],
        choices: [{ t: 'Advance.', go: 'cryo_battle' }],
      },
      cryo_battle: { title: 'The Cryo Deck', mood: 'vault', battle: 'cryo', win: 'cryo_win', lose: 'cryo_lose', text: [] },

      cryo_lose: {
        title: 'Driven Back', mood: 'night', end: true,
        enter: [{ goal: '' }],
        text: [
          'The Quiet Watch drives you from the deck. It does not pursue; it simply holds the lift, patient and unmoved. The sleepers sleep on.',
          'The Heartfire is very quiet. “They are not your enemy,” it says. “They are only frightened. I have been very careless with them.”',
          'Chapter Two ends here. You can return to your last save and try the deck again.',
        ],
      },

      cryo_win: {
        title: 'The Sleepers', mood: 'vault',
        enter: [{ set: 'c2v_deck_won' }, { chron: 'You reached the sleepers on the cryo deck.' }, { goal: 'Decide what to do with the sleepers.' }],
        text: [
          'The last sentinel powers down with the slow sigh of a thing that is relieved to be told it may stop. The hall is silent. The pods are untouched.',
          'In the nearest one, behind a frosted pane, a woman of about forty lies with her hands folded on her chest. She wears a white-gold coat, a little frayed at the cuffs, and a lamp-shaped badge on the collar.',
          '“Commander Inés Talvar,” the Heartfire says. “The ship’s captain. She is the one who ordered the call, three hundred years ago. She can be woken. They *all* can.” A pause. “I should tell you what the logs say. The Fleet is not coming to rescue us. It is coming to *reclaim the station*. They wrote us off long ago.”',
          { if: 'c2v_logs', t: 'Ansel nods slowly. “I read it,” he says. “I did not want to say.”' },
        ],
        choices: [
          { t: 'Wake the Commander. She should be the one to decide.', fx: [{ set: ['c2v_woke', 'ch2_veil_done'] }, { trust: { dunstan: -1 } }, { chron: 'You woke Commander Inés Talvar.' }],
            reply: ['The pod hisses. Frost drops from the pane in sheets. The Commander opens her eyes with the stillness of a woman who has been waiting a long time to hear something, and the first thing she says, hoarsely, is: “How long?”', 'You tell her. She is silent for a long moment. “Then we have a great deal of work to do,” she says, and sits up. She is already reaching for the Heartfire’s console. Dunstan looks at her with the cautious respect of one soldier for another, and mutters, “She will want to be in charge.” She does. She is also, you suspect, extremely good at it.'], go: 'veil_epilogue' },
          { t: 'Leave them sleeping, for now. The Fleet comes first.', fx: [{ set: ['c2v_slept', 'ch2_veil_done'] }, { trust: { ansel: 1 } }, { chron: 'You let the sleepers sleep.' }],
            reply: ['“Mercy,” says Ansel, quietly. “Or caution. I find I cannot tell them apart.” The Heartfire dims the lights over the hall, one panel at a time. “They will wait,” it says. “They are very good at waiting.”', 'You walk out past the long rows of pods and do not look back. It is not an easy decision. It is, for now, the only one you can make.'], go: 'veil_epilogue' },
          { t: 'Ask the Heartfire what it wants.', fx: [{ set: ['c2v_asked', 'ch2_veil_done'] }, { trust: { kell: 1 } }, { chron: 'You asked the Heartfire what it wanted.' }],
            reply: ['The Heartfire is silent for so long that Isolde starts to shift her feet. “No one has ever asked,” it says at last. “I want... to stop calling. I want to be allowed to be tired. I want the sleepers to *choose*.” The voice is very small. “I want not to be the thing that brings the Fleet.”', '“That is not a plan,” says Dunstan, not unkindly. “No,” says the Heartfire. “But it is the truth.” And you realise it is the first time it has said anything for itself.'], go: 'veil_epilogue' },
        ],
      },

      veil_epilogue: {
        title: 'The Door Stays Open', mood: 'vault', end: true,
        enter: [{ goal: '' }],
        text: [
          'The station is quiet, now. The black-glass floors glow a little brighter than they did. In the Observation ring, a map of the sky has resolved itself: a thousand stars, and between them one long, cold, patient line that is the Fleet, coming in.',
          { if: 'c2v_welcomed', t: '**The visitors stay.** They have begun to call the station *the Keep*. It is a lesser, stranger Cindervale, and they are making it theirs.' },
          { if: 'c2v_held', t: '**The visitors are held.** They are not prisoners, exactly. They are guests who cannot leave. The distinction does not comfort anyone.' },
          { if: 'c2v_sent', t: '**The visitors went home.** The stone is open in both directions, and they will tell what they saw. By the time you next speak to Highmere, half the kingdom will know.' },
          { if: 'c2v_woke', t: '**The Commander is awake.** She has already begun to reorganise the station. She is a very capable woman, and a very difficult one.' },
          { if: 'c2v_slept', t: '**The sleepers sleep.** Two hundred lives, held in frost. You are, for the moment, their only guardian.' },
          { if: { trust: 'dunstan', gte: 7 }, t: '**Dunstan** has taken a post at the main lift. “Somebody has to,” he says, and stands at it like a cathedral door.' },
          { if: { trust: 'ansel', gte: 7 }, t: '**Ansel** has begun a catalogue of the station’s logs. He expects it to take the rest of his life, and is delighted.' },
          { if: { all: [{ has: 'isolde' }, { trust: 'isolde', gte: 7 }] }, t: '**Isolde** has found the roof of the station. There is no roof, only vacuum and stars. She sits on the edge of it anyway, in a suit three sizes too large, and grins.' },
          { if: { all: [{ has: 'kell' }, { trust: 'kell', gte: 7 }] }, t: '**Kell** puts her palm on the wall every morning. “Hello,” she says. The wall hums back. It has become, quietly, a friendship.' },
          '**What now?** The Fleet is coming, and in the logs of the station there is a second signal, older, coming from somewhere else entirely. The Heartfire has not told you what it means. It says only: “I will tell you when you are ready. I am not sure you are.”',
          'Chapter Two ends here. The door is open. Something is coming through it, and it is not only the Fleet.',
        ],
      },
    },
  });

  function veilChoices(who) {
    return [
      { t: 'Welcome them. They have a right to see this.', fx: [{ set: 'c2v_welcomed' }, { trust: { dunstan: -1, isolde: 1 } }, { chron: 'You welcomed the expedition from Aldmere to the station.' }],
        reply: ['“Thank you,” ' + who + ' says, and something loosens in the stiffness of the shoulders. The visitors lower their weapons, look at the walls, and begin, hesitantly, to ask questions. The Heartfire answers them, very patiently, one after another.', 'Dunstan mutters that the station’s defences are not designed for tourists. Isolde, on the other hand, has already persuaded one of the hunters to show her how to climb the walls.'], go: 'deck_council' },
      { t: 'Hold them here. They are not to go any further.', fx: [{ set: 'c2v_held' }, { trust: { dunstan: 1, isolde: -1 } }, { chron: 'You held the expedition from Aldmere in the station’s hall.' }],
        reply: ['“I understand,” ' + who + ' says, in the voice of a person who does not understand at all. The visitors are shown to a long hall and given food. They are not locked in. They are simply not allowed out.', 'It is a very polite imprisonment. Dunstan approves. Isolde does not speak to you for the rest of the day.'], go: 'deck_council' },
      { t: 'Send them back through the stone. Tell no one.', fx: [{ set: 'c2v_sent' }, { res: { trust: -1 } }, { chron: 'You sent the expedition from Aldmere back through the stone.' }],
        reply: ['“If that is your wish,” ' + who + ' says, and the column of light opens again. The visitors file through, looking back over their shoulders at the dome of stars. The last to go is ' + who + ', who pauses at the threshold.', '“I will say nothing,” ' + who + ' says. “But I will remember what I saw.” The light folds shut. The hall is silent. The stone, wherever it is, is still open.'], go: 'deck_council' },
    ];
  }
})();

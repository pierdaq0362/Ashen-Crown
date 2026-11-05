/* Chapter Two, Relight track: "The Answer". The ward is back, the Ashborn are healing, and something has answered the call. */
(function () {
  const AC = globalThis.AC;

  AC.addTo('fantasy', { scenes: {
    c2r_open: {
      title: 'The Warm Spring', mood: 'fire',
      enter: [{ day: 30 }, { goal: 'Learn what answered the Ember, and what it wants.' }, { chron: 'Chapter Two. The ward holds, and the barrows have begun to light.' }],
      text: [
        'The spring is warm. It is the first thing anyone says. The ash has stopped, the dead lie quiet in their mounds, and the hearths of Aldmere burn with a steady blue that does not flicker. The Ashborn walk the roads with their eyes slowly going brown.',
        { if: 'kellSpared', t: 'Kell has stopped coughing. She does not seem to know what to do with her lungs. She spends a great deal of time standing in the courtyard, breathing in and out, as though checking that it still works.' },
        'Then, on the twelfth night, the first barrow lights.',
        'It is a mound a mile north of Cindervale, one of the long line that runs across the hills. A pale blue point appears on its crown, like a lamp being lit at a window. Next night, the next barrow. The night after, the next. One a night, marching north.',
        'Ansel stands on the wall with a quill and a map, drawing a line. “One a night,” he says. “A hundred miles. When the last one lights, whatever it was waiting for will know the road is open.” He smiles at you, and the smile is not entirely happy. “I would very much like to know *who* is waiting.”',
        { if: 'path_loyalist', t: 'Aldous Venn’s letters have become very short. The latest: *The Regent wants to know what you have done to the north. He wants to know if it can be done again.*' },
        { if: 'path_rebel', t: 'Sirene’s raven has brought only one word this week: *Congratulations.* There is a second line, scratched out and re-written, that you cannot read.' },
        { if: 'path_independent', t: 'Hettie’s hunters bring you a message every dawn, the same one: *Lamps.*' },
      ],
      next: 'c2r_council',
    },
    c2r_council: {
      title: 'The Spring Council', mood: 'fire', council: 'ch2_relight',
      text: [
        'The council meets by the light of the blue hearth. Nobody has needed a candle in weeks. Dunstan keeps staring at the fire as if it might do something improper.',
        'You have three actions before the last lamp lights. Whatever the barrows are leading to, it is coming to Cindervale.',
      ],
    },

    c2r_evt_lamps: {
      title: 'The Lamp-line', mood: 'night',
      text: [
        'On the thirtieth night, Ansel wakes you with a lantern and an expression that can only be described as *rapt*. “It has been counting,” he says. “Look.”',
        'On the map, the line of lit barrows runs north in a perfect curve. At the northern end there is a gap. A single dark mound, a hundred miles away, with Isolde’s pencilled note beside it: *Highest. On the ridge. Old altar. Same as ours.*',
        '“It lights tomorrow,” Ansel says. “And I think it must be *protected*. I think someone is going to try to put it out.”',
      ],
      choices: [
        { t: 'Ask Ansel what he thinks will answer.', fx: [{ trust: { ansel: 1 } }, { set: 'c2_ansel_theory' }],
          reply: ['“Something that has been listening,” Ansel says. “A lighthouse has two ends, Warden. It was not built to be seen from the sea. It was built to be seen from *very far above it*.” He holds up the lantern, and the flame leans, very gently, toward the northern sky.', '“I think we have been a harbour,” he says. “For a very long time.”'], go: '@return' },
        { t: 'Send riders to the last barrow tonight.', cost: { grain: 1 }, fx: [{ set: 'c2_riders' }, { trust: { isolde: 1 } }],
          reply: ['Isolde volunteers before you finish the sentence. By midnight, six of the keep’s fastest riders have vanished into the dark, and Isolde, who does not like horses, is at the head of them, swearing.', 'They will be at the last barrow before the lamp lights. Whether that is wise remains to be seen.'], go: '@return' },
      ],
    },
    c2r_evt_regent: {
      title: 'The Regent’s Envoy', mood: 'court',
      text: [
        'A coach arrives from Highmere, which no one in Cindervale has seen since the old king’s day. The man who gets out is thin, bespectacled, and carrying a satchel that is clearly very important. He introduces himself as **Under-Secretary Pell**, and bows from the waist.',
        '“Lord Regent Thorne wishes the Warden to know,” he says, “that the Regent’s Hand has noted the restoration of the Ember with the *greatest* interest. The Regent would like to formalise the Crown’s stewardship of the Ember. A modest charter, a small garrison, a *very* generous stipend.”',
        'Behind you, Dunstan makes a noise like a kettle.',
      ],
      choices: [
        { t: 'Accept the charter. The Crown’s protection may be useful.', fx: [{ set: 'c2_chartered' }, { res: { gold: 3 } }, { trust: { dunstan: -1 } }, { chron: 'You accepted the Regent’s charter for the Ember.' }],
          reply: ['Pell’s smile is exquisite. “The Regent will be so pleased,” he says, and means it. He lays out the paperwork, three pages of tidy clauses, and you sign it with the blue light on your hands.', 'Dunstan does not look at the document. “A charter,” he says, afterwards. “A lid with a stipend.” He is not wrong, and you both know it.'], go: '@return' },
        { t: 'Refuse. The Ember is not a thing to be chartered.', fx: [{ set: 'c2_refused_charter' }, { res: { standing: 1 } }, { trust: { dunstan: 1 } }],
          reply: ['“I see,” says Pell. His smile has not changed in the slightest, which is how you know you have hurt him. “The Regent will be disappointed. I will convey it with the appropriate sorrow.” He gets back in his coach. The curtains are drawn before the wheels move.', 'Dunstan watches the coach out of sight. “I am very much in favour of you,” he says, which is the closest he comes to a compliment.'], go: '@return' },
      ],
    },
    c2r_evt_pale: {
      title: 'The Duchess’s Herald', mood: 'court',
      text: [
        'A herald in white and silver rides up to the gate, trumpet at his lips, and announces, in a voice that carries to the fields, the *Gracious Compliments of Her Grace the Duchess Ysmay of Greywater, who has been moved to Joy by the Restoration of the Ember, which her Ancestors Gave.*',
        'Sirene, behind him, is looking at her saddle with great interest. “Her Grace,” the herald continues, “has declared that the Ember was, is, and shall be the *Gift of the House of Greywater*. And that the Warden of Cindervale is its most honoured *Steward.*”',
        'Ansel, beside you, murmurs, “I have read the Greywater charters. The House did not give the Ember to anyone. They *inherited* the right to hold a lamp.”',
      ],
      choices: [
        { t: 'Accept the title of Steward. It costs nothing.', fx: [{ set: 'c2_steward' }, { res: { standing: 1, gold: 2 } }, { chron: 'You accepted the title of Steward of the Ember from the Duchess.' }],
          reply: ['The herald unfurls a silk banner with the Greywater arms and a lamp, and drapes it on the gate. It looks well there. Sirene gives you a very small nod, the nod of a woman who has swallowed something.', '“It costs nothing,” Ansel says afterwards, “but it will be remembered.”'], go: '@return' },
        { t: 'Decline politely. The Ember belongs to no house.', fx: [{ set: 'c2_declined_steward' }, { trust: { ansel: 1 } }],
          reply: ['The herald’s smile does not waver. “Her Grace will be so very grieved,” he says. Sirene, behind him, almost smiles. Ansel, beside you, makes a small pleased noise.', '“Well said,” he says, once the herald is gone. “I feel very strongly about charters. They are how empires begin.”'], go: '@return' },
      ],
    },
    c2r_evt_clans: {
      title: 'Hettie’s Lamps', mood: 'snow',
      text: [
        'Hettie Rook sits on the wall with her pipe, watching the northern line of lamps climb night by night. She has not said anything for an hour.',
        '“My grandmother told me,” she says, at last, “that the barrows were not graves. She said they were *candles*. For the dead to find their way home by. I thought she was soft in the head.” She taps her pipe on the stone. “I have been wrong about a number of things lately.”',
        '“The clans are scared,” she adds. “Not of the dead. Of what is coming to look at the lamps. I told them you would not let it hurt them. Was I right?”',
      ],
      choices: [
        { t: '“I will do everything I can.”', fx: [{ trust: { isolde: 1 } }, { set: 'c2_clans_promised' }],
          reply: ['“That is not a promise,” says Hettie. “But it is honest.” She pats your arm, once, with a hand like a worn root. “Isolde was right about you. She will be unbearable now.”'], go: '@return' },
        { t: '“No one is coming to hurt the clans. I swear it.”', fx: [{ res: { standing: 1 } }, { set: 'c2_clans_sworn' }, { chron: 'You swore to Hettie Rook that no one would hurt the clans.' }],
          reply: ['“Careful,” says Hettie. “The land has long ears, and a good memory.” But she is smiling, a little, for the first time that evening. “I will hold you to it.”'], go: '@return' },
      ],
    },

    /* ---------- the last lamp ---------- */
    c2r_lamp_prelude: {
      title: 'The Last Barrow', mood: 'night',
      enter: [{ goal: 'Hold the last lamp until it lights.' }],
      text: [
        'The last barrow stands on the highest ridge in the north, a hundred miles from Cindervale, with an old stone altar on its crown and a view of everything. You reach it at dusk, with the lantern, and Ansel, and everyone who has chosen to follow you.',
        { if: 'c2_riders', t: 'Isolde’s riders are already there, crouched in the heather, bows nocked.' },
        'The lamp is not lit. Ansel sets the lantern at the altar’s foot, and the blue flame leans towards the stone, and holds.',
        { if: 'path_loyalist', t: 'Down the ridge, in the gathering dark, white-and-silver banners are moving: the Duchess’s men, who also want the Ember. Aldous’s pikes take position on the near slope.' },
        { if: 'path_rebel', t: 'Down the ridge, in the gathering dark, gold-and-black banners are moving: the Regent’s men, who also want the Ember. Sirene’s knights take position on the near slope.' },
        { if: 'path_independent', t: 'Down the ridge, in the gathering dark, two banners are moving, one gold-and-black, one white-and-silver, each trying to arrive first. The Marchers lie in the heather, waiting.' },
        '“Hold the light,” Ansel says, to himself, or to the lantern. “Just hold it. Until it catches.”',
      ],
      choices: [{ t: 'Guard the altar.', go: 'c2r_lamp_battle' }],
    },
    c2r_lamp_battle: { title: 'The Last Lamp', mood: 'night', battle: 'lamp', win: 'c2r_lamp_win', lose: 'c2r_lamp_lose', text: [] },

    c2r_lamp_win: {
      title: 'The Lamp Catches', mood: 'fire',
      enter: [{ chron: 'You held the last lamp until it lit. Light ran north along the barrows like a spark along a fuse.' }, { set: 'c2_lamp_lit' }, { day: 1 }, { goal: 'Meet the Answer.' }],
      text: [
        'The lamp catches at the moment the moon touches the horizon. A blue point, steady and small, on the crown of the barrow. Then the line of barrows to the south lights *brighter*, all at once, one after another, in a ripple that runs a hundred miles in the space of a breath.',
        'The sky above the ridge turns the colour of the inside of a shell. And something very high, very bright and very far, begins, slowly, to come down.',
        'Ansel is on his knees in the heather. He is not praying. He is *counting*. “Seven days,” he says, to himself. “It will take seven days to land.”',
      ],
      next: 'c2r_arrival',
    },
    c2r_lamp_lose: {
      title: 'The Lamp Gutters', mood: 'night',
      enter: [{ chron: 'The last lamp guttered, and lit weak and late.' }, { set: 'c2_lamp_weak' }, { res: { standing: -1 } }, { day: 1 }, { goal: 'Meet the Answer.' }],
      text: [
        'The light fails once, and Ansel goes down. The sellswords are on the altar before anyone can reach them. But the lamp, bruised and spitting, catches *anyway*, a pale and weak and furious little flame, like a candle someone has tried to put out and failed.',
        'The sky above the ridge turns, slowly, the colour of the inside of a shell. Something high and far begins, without hurry, to come down.',
        'Ansel, bandaged and shaking, looks up at it. “It will land,” he says. “It is very sorry about the delay.”',
      ],
      next: 'c2r_arrival',
    },

    /* ---------- the Answer ---------- */
    c2r_arrival: {
      title: 'The Answer', mood: 'fire',
      enter: [{ day: 7 }, { set: 'c2_answer_arrived' }],
      text: [
        'It lands in the Greywood, a mile from the ridge, in a column of pale gold light that burns without heat. The trees do not catch. The snow does not melt. When the light folds away, there is a clearing in the forest that was not there before, and in the middle of it stand thirty figures in white-gold plate, each carrying a lamp.',
        'They are tall and quiet and entirely unhurried. At their head is a broad, grey-eyed man with a face like a very kind judge. He sets down his lamp, takes off his helm, and bows.',
        '“I am Auren Vael,” he says. “Marshal of the Lamp. We heard you call. We are *so* sorry it took us so long.”',
        { if: 'path_loyalist', t: 'A rider from Highmere has arrived behind you, out of breath, with the Regent’s banner. Under-Secretary Pell dismounts with a satchel.' },
        { if: 'path_rebel', t: 'Sirene has come down from the ridge, alone, her helm under her arm. She is staring at the Marshal’s armour: *the same white as her own*.' },
        { if: 'path_independent', t: 'Hettie Rook stands at the treeline with forty hunters, arrows nocked. Her face is a wall.' },
      ],
      next: 'c2r_parley',
    },
    c2r_parley: {
      title: 'The Marshal’s Offer', mood: 'fire',
      text: [
        '“I will be plain,” says Marshal Vael, “because you have been patient. Three hundred years ago, our people sent a seed-ship to this world: your ancestors. The Heartfire, your Ember, was meant to keep the road open. It failed. We have been looking for the signal ever since.”',
        '“You called. We answered. You are our lost branch, and we have come to bring you *home*.” He smiles. It is a genuinely kind smile, which is the most frightening thing about it.',
        '“There is a small matter of the Vault. The stone in it is our property, as it is the key to the Fleet. And the lit ones, the Ashborn, are our crew’s children. Their spark is a lantern-key. We would like them to come with us, willingly, where they will be safe.”',
        { if: 'c2r_kell_spoke', t: 'Kell has said her piece. The Marshal listens to all of it, and nods, and seems, truly, to understand.' },
        { if: 'path_loyalist', t: 'Pell clears his throat. “The Regent would be *delighted* to enter into a formal treaty of friendship.” The Marshal looks at him with infinite patience.' },
        { if: 'path_rebel', t: '“Marshal,” says Sirene, in a low voice. “The Duchess’s line is descended from your officers. She is, I believe, your *cousin*.” The Marshal bows to her. “We know,” he says. “We have been looking forward to meeting her.”' },
        { if: 'path_independent', t: '“We have not asked you to come,” says Hettie, from the treeline. “Go home.” The Marshal bows to her too. “Gladly,” he says. “With our people.”' },
        '“I do not want to compel you,” says Vael. “But I will not leave without what is ours.”',
      ],
      choices: [
        { t: 'Let Kell speak first.', if: { all: [{ has: 'kell' }, '!c2r_kell_spoke'] }, fx: [{ set: 'c2r_kell_spoke' }, { trust: { kell: 1 } }],
          reply: ['Kell steps forward, white-faced, with her chin up. “I am not your crew’s child,” she says. “I am a girl from a gutter in Greywater who was used as fuel. I will go where I like.” The Marshal inclines his head. “Of course,” he says. “That is the first right of any crew.” It is, you realise, entirely sincere.', '“But the others,” Kell says, more quietly. “The ones still sick. They do not know. They will go, if you tell them there is a cure.” She looks at him. “Is there?” “Yes,” says the Marshal. And he is telling the truth, which is worse.'], go: 'c2r_parley' },
        { t: 'Welcome them. Give them the Veil-stone, and let the Ashborn choose.', fx: [{ set: ['c2_welcome', 'c2_stone_given'] }, { res: { standing: -1 } }, { trust: { dunstan: -2, isolde: -1 } }, { chron: 'You welcomed the Answer and handed over the Veil-stone.' }],
          reply: ['The Marshal’s joy is quiet and absolute. He kneels, and takes the Veil-stone from you in both hands, and it hums, and the whole clearing hums with it. “Thank you,” he says. “You have no idea how long we have waited.”', 'Dunstan turns his back. It is, in the grammar of his silence, a considerable statement. Isolde mutters something that sounds like *lamb to slaughter*, and Kell, behind you, is very still.', 'But the Ashborn come down from the hills in ones and twos, and the Marshal speaks to each of them gently, and many of them, to your surprise, say yes.'], go: 'c2r_welcome' },
        { t: 'Bargain: the stone stays, the ward stays, and a delegation visits Highmere.', fx: [{ set: 'c2_bargain' }, { trust: { ansel: 1 } }, { chron: 'You bargained with the Answer: a trial of arms for the right to speak.' }],
          reply: ['“A bargain,” says Vael, with delight. “Our people have always honoured bargains.” He looks at you for a long moment, and the smile is a little less kind. “But we settle terms, by custom, with a trial of arms. Not blood. A test.”', 'Dunstan looks at the thirty figures in white-gold. “I have been in a number of ‘tests,’” he says. “They are never as small as the people proposing them say.”'], go: 'c2r_lampfall_prelude' },
        { t: 'Refuse. The stone and the Ashborn belong to Aldmere.', fx: [{ set: 'c2_refuse' }, { res: { standing: 1 } }, { trust: { isolde: 1, kell: 1 } }, { chron: 'You refused the Answer. Aldmere is not a colony.' }],
          reply: ['The smile does not leave Vael’s face, but something behind it changes. “I see,” he says. He picks up his helm, and his lamp. “I had hoped for a gentler conversation. We will have the other kind.” His people spread out among the trees, silent as falling snow.', '“Warden,” says Ansel, very quietly. “For the record: I am extremely frightened.” “For the record,” says Dunstan, “so am I.” He draws his sword.'], go: 'c2r_lampfall_prelude' },
      ],
    },

    c2r_welcome: {
      title: 'Gifts and Costs', mood: 'fire',
      enter: [{ goal: '' }],
      text: [
        'It is a very gentle conquest. There is no battle. The Lampbearers set up their camp beside the Greywood in a ring of pale lamps. The Ashborn who choose to go, around two hundred, walk out in the morning with their bags. They are smiling. The coughing stops as they cross the clearing’s edge.',
        { if: 'kellSpared', t: 'Kell does not go. She stands at the edge of the clearing for a long time, watching the others. “They are happy,” she says. “I think it is real.” She does not seem comforted. “I think that is the worst part.”' },
        'The Marshal bows to you before he leaves. “We will return at first snow,” he says, “with the Admiral. She will wish to meet the Warden who welcomed us.” He pauses. “She is not as gentle as I am.”',
        'You have won a peace. You are not at all sure it is a peace you can keep.',
      ],
      next: 'c2r_epilogue',
    },

    c2r_lampfall_prelude: {
      title: 'The Clearing', mood: 'fire',
      enter: [{ goal: 'Win the day against the Lampbearers.' }],
      text: [
        'The Greywood clearing is silent. The Lampbearers stand in a loose crescent at the far edge, each with a lamp raised, each with a sword drawn. The air smells of hot metal.',
        { if: 'c2_bargain', t: 'It is a trial, not a war: the Marshal has pulled back most of his people, and only his guard will fight. But they are *good*.' },
        { if: 'c2_refuse', t: 'It is a war. The Marshal has brought everyone.' },
        { if: 'c2_chart', t: 'Ansel’s chart of the lamp-line showed where the Lampbearers would stand. You have the ground, for what that is worth.' },
        'Dunstan checks his sword. “Together,” he says. “Or not at all.” Isolde nocks an arrow. Kell closes her hands, and flame blossoms between them.',
      ],
      choices: [{ t: 'Meet them.', go: 'c2r_lampfall_battle' }],
    },
    c2r_lampfall_battle: { title: 'The Greywood Clearing', mood: 'fire', battle: 'lampfall', win: 'c2r_lampfall_win', lose: 'c2r_lampfall_lose', text: [] },

    c2r_lampfall_win: {
      title: 'The Marshal Yields', mood: 'snow',
      enter: [{ set: 'c2_lampfall_won' }, { res: { standing: 1 } }, { chron: 'You faced the Marshal of the Lamp in the Greywood, and he yielded.' }, { goal: '' }],
      text: [
        'The Marshal goes down on one knee with a smile that has not changed. He sets down his lamp. “Well fought,” he says. “That is the first honest answer anyone has given us in three hundred years.”',
        { if: 'c2_bargain', t: '“By custom, the terms are yours,” he says. “The stone stays. The ward stays. The lit ones may *choose*. And a delegation of your people will visit the Fleet, as guests. It will be a long road, and a very strange one.”' },
        { if: 'c2_refuse', t: '“You have refused us,” he says. “We will withdraw. But the Admiral will not. She will want to know why a branch of her people answers her *no*.” He looks at you without anger. “I would be ready.”' },
        { if: { has: 'kell' }, t: 'Kell is standing over the nearest Lampbearer with her hands still lit. She looks at the flame, and then at you. “They are not stronger than us,” she says, with the voice of someone discovering something. “They are just *more*.”' },
        'The Marshal rises, and his people follow him into the light. The column folds away, and the clearing is only a clearing again, with scorch-marks on the snow and a very silent forest.',
      ],
      next: 'c2r_epilogue',
    },
    c2r_lampfall_lose: {
      title: 'The Marshal’s Mercy', mood: 'night',
      enter: [{ set: 'c2_lampfall_lost' }, { res: { standing: -2 } }, { chron: 'The Lampbearers beat you in the Greywood. The Marshal was merciful.' }, { goal: '' }],
      text: [
        'The Lampbearers are better than you. It is not a close thing. By the end, you are on your knees in the snow with your sword across your lap, and the Marshal’s lamp is shining in your face.',
        '“I am sorry,” he says, and he is. “But I did warn you.” He takes the Veil-stone, very gently, from the pouch at your belt, and the lamps in the clearing flare.',
        'He does not kill anyone. He does not need to. When the column folds away, taking the stone and a hundred of the Ashborn, you are left in an empty clearing, with Ansel kneeling in the snow, holding the dimmed lantern against his chest like a child.',
      ],
      next: 'c2r_epilogue',
    },

    c2r_epilogue: {
      title: 'The Lamp-line, Lit', mood: 'night', end: true,
      enter: [{ chron: 'Chapter Two ended with the Answer arrived, and the Admiral on her way.' }, { goal: '' }, { set: 'ch2_relight_done' }],
      text: [
        'The Answer has gone, or half-gone, back into the light. The Greywood is only a forest. The barrows still burn. The lamp-line runs north and south in a long unbroken curve, visible from the ridge at night, a ribbon of blue across the land.',
        { if: 'c2_welcome', t: '**You welcomed them.** The Ashborn who went are said to be happy. The Veil-stone is gone. The Fleet will return at first snow, with its Admiral. Some say you have saved the kingdom. Some say you have sold it.' },
        { if: 'c2_lampfall_won', t: '**You faced them.** The Marshal has gone, but the Fleet has not forgotten. The north has been told what you did. Some call you the Warden of the Lamp. Some call you a fool.' },
        { if: 'c2_lampfall_lost', t: '**They won.** The Marshal took the stone, and the Ashborn who would go. The north saw you beaten. It will take a long time to mend that.' },
        { if: 'c2_bargain', t: '**You bargained.** A delegation will go to the Fleet as guests. It is a thin thread of peace, and everyone knows how easily thin threads break.' },
        { if: 'c2_chartered', t: 'The Regent’s charter binds Cindervale to the Crown’s stewardship of the Ember. It was a very good price, and a very long chain.' },
        { if: 'c2_steward', t: 'The Duchess calls you Steward of the Ember. It is a title with a very long reach.' },
        { if: { trust: 'dunstan', gte: 7 }, t: '**Dunstan** says, quietly, on the ridge, “I do not know what we are fighting. But I know who I am fighting beside.”' },
        { if: { trust: 'ansel', gte: 7 }, t: '**Ansel** has begun a new book. He has titled it *A Grammar of Lamps*. The first line reads, *We were a harbour, and we did not know.*' },
        { if: { all: [{ has: 'isolde' }, { trust: 'isolde', gte: 7 }] }, t: '**Isolde** has come to a decision. She says nothing about it, but she has moved her bedroll next to yours.' },
        { if: { all: [{ has: 'kell' }, { trust: 'kell', gte: 7 }] }, t: '**Kell** has stopped coughing entirely. She says, in the small hours, “I am not afraid of them. I am afraid of how much I *wanted* to go.”' },
        '**What now?** The Fleet is coming. Its Admiral has not yet been told what you did, or what you did not do. And the Veil-stone, wherever it is, is humming, in the key of a very long journey.',
        'Chapter Two ends here. Whatever answered the call, it was not the last thing to come.',
      ],
    },
  } });
})();

/* Chapter One, part 2: the three banners, Barrow Night, the Vault, the choice, and what follows. */
(function () {
  const AC = globalThis.AC;

  AC.addTo('fantasy', { scenes: {
    /* ======================= THE THREE BANNERS ======================= */
    act3_open: {
      title: 'Three Banners', mood: 'court',
      enter: [{ day: 5 }, { goal: 'Choose who stands beside you on Barrow Night.' }],
      text: [
        'The ash does not stop. Six nights after the gate, three parties come up the ridge road within a single afternoon, and Dunstan lines them up in the courtyard like a man arranging knives on a table.',
        '**The Regent’s Hand.** Captain Aldous Venn, grey-bearded and tired, with sixty spears and a letter under Lord Thorne’s seal: *Cindervale will be garrisoned for the Crown. The Vault will be opened to the Regent’s agents.* The Regent offers order and gold. He does not offer to explain the Vault.',
        { if: 'sworeRegent', t: 'You swore to him; he expects a Warden who keeps oaths.' },
        { if: 'defiedRegent', t: 'He has not forgotten your refusal at the gate.' },
        '**The Pale Banner.** Dame Sirene Ashgrove, the Duchess’s champion, in white-enamelled mail. She offers an alliance and a promise: the Duchess will relight the Ember, and Cindervale will hold the northern march in perpetuity. She offers fire and a title. She does not say how the Ember will be relit.',
        { if: 'kellSpared', t: '“Kell,” she says, without looking at her. “You look well, for a traitor.” Kell flinches.' },
        '**The Marchers.** Hettie Rook, elder of the Greywood clans, with forty hunters who have lived at the edge of the ash for three generations. They offer no gold and no title. They want a Warden who will hold the line against the dead, and be left alone after.',
        { if: { has: 'isolde' }, t: 'Isolde stands very slightly closer to her aunt than to you. It tells you what the Marchers think of the others.' },
        '“Choose,” Dunstan says quietly. “The barrows open tonight. Whoever stands beside us tonight is who we owe tomorrow. Think what you would say to the others.”',
      ],
      choices: [
        { t: 'Accept the Regent’s garrison.', tip: '+3 gold, +2 levies, −1 Standing. Order, and a debt to the Crown.', fx: [{ set: 'path_loyalist' }, { res: { gold: 3, levies: 2, standing: -1 } }, { trust: { dunstan: 1 } }, { chron: 'You accepted the Regent’s garrison at Cindervale.' }, { goal: 'Survive Barrow Night with the Regent’s spears at your side.' }],
          reply: ['Aldous Venn takes off his gauntlet and shakes your hand like a man signing a ledger. His sixty spears file into the yard and take over the east wall with brisk, tired competence.', '“Orders are orders, Warden,” he says. “But I’ve walked those barrows on a bad night. I’ll fight beside you first and argue afterwards.” Dunstan watches the Regent’s banner go up with an expression you cannot read. “They are good soldiers,” he says eventually. “That is not the question.”', { if: 'defiedRegent', t: 'The Regent’s men do not mention the gate. That, too, is a message.' }], go: 'council2' },
        { t: 'Take the Duchess’s hand.', tip: '+2 gold, +1 levy. A powerful ally, and an unexplained promise.', fx: [{ set: 'path_rebel' }, { res: { gold: 2, levies: 1 } }, { trust: { isolde: 1 } }, { chron: 'You took the Pale Banner’s hand against the Regent.' }, { goal: 'Survive Barrow Night with the Pale Banner at your side.' }],
          reply: ['Dame Sirene bows from the saddle, which you have the distinct feeling she does not do often. “The Duchess will be glad,” she says. “We both want the dead to lie quiet.”', 'Her knights make camp on the west rise in white and silver, a little too tidy for the circumstances. Ansel watches them from the wall. “She did not answer the question,” he says to you, mildly. “*How* the Ember is relit. It is a very particular thing to leave out.”', { if: 'defiedRegent', t: 'The Regent’s men, at the foot of the ridge, strike camp and march away at once. Whatever they do next, they will not be your friends.' }], go: 'council2' },
        { t: 'Stand with the Marchers.', need: { any: [{ res: 'standing', gte: 1 }, { trust: 'isolde', gte: 4 }] }, needText: 'The clans follow only a Warden the people trust (Standing 1+), or one Isolde will vouch for (her Trust 4+).', tip: '+3 grain, +3 levies. No crown, and no friends in high places.', fx: [{ set: 'path_independent' }, { res: { grain: 3, levies: 3 } }, { trust: { isolde: 2 } }, { chron: 'You stood with the Greywood Marchers, answering to no crown.' }, { goal: 'Survive Barrow Night with the Marchers, answering to no crown.' }],
          reply: ['Hettie Rook looks you up and down for a long time, sucking her clay pipe, and finally says, “Well. Isolde was right, curse her.” She turns and waves a hand, and forty hunters in grey-green wool slide into the yard as quietly as a cold wind.', { if: { trust: 'isolde', gte: 4 }, t: '“My niece says you’re worth it,” Hettie adds. “She doesn’t say that. Don’t waste it.”' }, 'The other two banners watch in silence. Aldous Venn mutters, “Well, that is going to be a problem.” Sirene says nothing at all, and that is worse.'], go: 'council2' },
      ],
    },

    council2: {
      title: 'The Barrow Council', mood: 'fire', council: 'barrow',
      text: [
        'Night comes fast. In the great hall, the allies you chose and the companions you kept watch you plan. The barrows will open at moonrise, and Ansel must stand at the old altar and hold the light. He cannot move, and he cannot be allowed to fall. Everything else is your problem.',
        { if: { res: 'standing', gte: 3 }, t: 'Down in Lower Cinder, the villagers have lit torches along the road. They have decided, without asking, that this is their fight too.' },
      ],
    },

    evt_aldous: {
      title: 'Captain Aldous', mood: 'court',
      text: [
        'Aldous Venn finds you on the wall as the light goes. “My orders say the Vault,” he says. “But I have eyes. If the barrows are what Ansel says, orders can wait until morning.” He studies you. “What is down there, Warden?”',
      ],
      choices: [
        { t: 'Tell him what you know of the Ember and the Vault.', fx: [{ set: 'sharedVault' }, { chron: 'You told Captain Aldous what lay beneath Cindervale.' }],
          reply: ['You tell him all of it: the spark, the key, the king’s journal you have not yet found. Aldous listens without interrupting, with his hands clasped behind him.', '“Then I’ll write what I choose to write,” he says at last. “The Regent reads my reports. He doesn’t read the margins.” It is the nearest thing to a promise you will get from him. Down the wall, Dunstan has overheard, and says nothing.'], go: '@return' },
        { t: 'Keep the Vault’s secret.', fx: [{ set: 'keptSecret' }],
          reply: ['“Fair enough,” Aldous says, though a little of the warmth has gone out of it. “Keep your secrets, Warden. Just know I’ll be asking again in the morning, and I won’t be asking alone.”', 'He walks the wall until moonrise, looking at the ground as if it owed him an answer.'], go: '@return' },
      ],
    },
    evt_sirene: {
      title: 'Dame Sirene', mood: 'court',
      text: [
        'Dame Sirene finds you in the stable, brushing her horse as though the night were quiet. “The Duchess needs what’s under your keep,” she says. “You’ve seen what is happening to the Ashborn. Do you want that to spread?” She says it without cruelty, which is worse.',
      ],
      choices: [
        { t: 'Hear her out.', tip: '+1 gold', fx: [{ set: 'heardSirene' }, { res: { gold: 1 } }, { chron: 'You heard Dame Sirene’s case for the Duchess.' }],
          reply: ['She tells you about the sickness in the north: the cough, the lit eyes, a child in Greywater who stopped being able to sleep. She tells it plainly, as a soldier reports casualties.', '“I am not a clever woman,” she says. “I know the Duchess means well, and I know she is ruthless, and I have not been able to make those two things stop being true at once.” She leaves a small purse on the stable gate. It is the Duchess’s goodwill, and it is also a hook, and you take it anyway.'], go: '@return' },
        { t: 'Refuse to discuss the Vault.', fx: [{ set: 'keptSecret' }],
          reply: ['“I thought you might,” she says, and for the briefest moment looks relieved, which is not what you expected. “Then I will do my duty tonight and ask again in the morning.”', 'She resumes brushing the horse. It does not seem to need it.'], go: '@return' },
      ],
    },
    evt_hettie: {
      title: 'Hettie Rook', mood: 'snow',
      text: [
        'Hettie Rook sits by the fire sucking a clay pipe. “Wights fear fire and iron,” she says. “And they come up where the ground is soft, same places they did when my grandmother was a girl. Bring both. I’ll tell you where.”',
      ],
      choices: [
        { t: 'Learn the clans’ lore of the barrow-field.', tip: 'One wave of dead will not come', fx: [{ set: 'clanLore' }, { chron: 'The Marchers taught you where the barrow-dead rise.' }],
          reply: ['Hettie draws the field in the ashes of the hearth: the mounds, the soft ground, the three places the old ones are buried shallow. “They come up in order,” she says. “Eldest first. You don’t fight them. You make them wait.”', 'She taps the south mound with her pipe. “That one stays asleep, if somebody sits on it with a torch. My nephew will do. He’s done worse for less.”'], go: '@return' },
        { t: 'Swear a pact of mutual defence.', tip: 'A fourth clan hunter will fight at the Vault', fx: [{ set: 'clanPact' }, { chron: 'You swore a pact of mutual defence with the Greywood clans.' }],
          reply: ['The oath is short, and sealed with a nick on the thumb and a drop in the fire. Hettie gives you a grey-green cord for your wrist. “Wear it where the clans can see it,” she says. “That means you’re ours, and we are yours.”', { if: { has: 'isolde' }, t: 'Isolde looks at the cord, then at you, and for once has nothing to say. She nods once, very slightly.' }], go: '@return' },
      ],
    },

    /* ======================= THE BARROWS ======================= */
    barrow_prelude: {
      title: 'Moonrise', mood: 'night',
      enter: [{ goal: 'Hold the altar-light until the moon sets.' }],
      text: [
        'Moonrise. The barrow-field below the keep is a plain of standing stones and older mounds, silver under the ash. At its centre is a stone altar older than the kingdom; Ansel’s lantern-flame lies flat toward it like a compass needle.',
        '“The rite is simple,” Ansel says, in the voice of an old man describing surgery he has read about. “I stand at the altar and hold the light. If I am interrupted, if I fall, it goes out and does not come back. We must last until the moon sets.”',
        { if: 'path_loyalist', t: 'Aldous’s pikemen form a hedge of iron on the left flank.' },
        { if: 'path_rebel', t: 'Sirene’s knights ride out in white and silver, their horses already shying from the smell of old death.' },
        { if: 'path_independent', t: 'Hettie’s hunters melt into the standing stones, arrows nocked.' },
        { if: { res: 'standing', gte: 3 }, t: 'On the north stair, two lines of torchlight appear: hamlet folk, come to hold the ground behind your army.' },
        { if: { any: ['scoutedBarrows', 'clanLore'] }, t: 'You know where the dead will rise. You will not be surprised twice.' },
        { if: 'ritualPrepared', t: 'Salt and iron nails ring the altar.' },
      ],
      choices: [{ t: 'Light the lantern.', go: 'barrow_battle' }],
    },
    barrow_battle: { title: 'Barrow Night', mood: 'night', battle: 'barrows', win: 'barrow_win', lose: 'barrow_lose', text: [] },

    barrow_win: {
      title: 'The Light Holds', mood: 'snow',
      enter: [{ chron: 'Ansel held the altar-light through Barrow Night, and the dead went back to the ground.' }, { trust: { ansel: 1 } }, { set: 'barrowsLit' }, { day: 1 }, { goal: 'Find out what the Vault holds, and what to do with it.' }],
      text: [
        'Dawn comes grey and clean. The ash stops falling. In the heart of the altar, something small and blue rekindles: not a fire, a *point*, steady as a star. Ansel sinks to his knees, laughing and coughing at once.',
        '“It is the same light,” he says. “Same as the Ember. A small one, but the same.” He is staring up the line of barrow-mounds that runs north across the hills, one every mile or so, like lamps along a road. “Orrin knew. He *knew*.”',
        '“I have been reading it wrong for forty years,” Ansel says, to no one. “It was never a fire. It was a *beacon*. And the barrows are the lamps.”',
        'He looks at you, and for the first time his face is afraid. “A lighthouse does not burn for itself. A lighthouse burns so that someone far away can find the shore.”',
      ],
      next: 'ultimatum',
    },
    barrow_lose: {
      title: 'The Light Fails', mood: 'night',
      enter: [{ chron: 'The altar-light failed on Barrow Night. The dead walked until dawn.' }, { res: { standing: -1, grain: -1 } }, { set: 'barrowsLit' }, { day: 1 }, { goal: 'Find out what the Vault holds, and what to do with it.' }],
      text: [
        'The light gutters. Ansel goes down, and the field fills with grey hands. You fall back through the postern, and whatever survives crawls home by dawn.',
        'The ash keeps falling. But the dead are tired too, and by sunrise they return to the mounds, as though the night had been a rehearsal.',
        'Ansel, bandaged and shaking, looks up the long line of mounds as the sun rises on them. “They are not random,” he says. “They are *spaced*.” He says it with the horror of an old man who has just understood a very old joke. “It is a lighthouse. It was always a lighthouse.”',
      ],
      next: 'ultimatum',
    },

    ultimatum: {
      title: 'The Vault', mood: 'court',
      enter: [{ goal: 'Settle who holds the Vault stair, then open the Vault.' }],
      text: [
        'Whoever stood beside you in the dark now stands before you in the morning, and wants what they came for.',
        { if: 'path_loyalist', t: 'Aldous Venn removes his helm. “My orders are plain. The Vault, Warden. Now.”' },
        { if: 'path_rebel', t: 'Sirene dismounts. “The Duchess’s patience is spent. The Vault.”' },
        { if: 'path_independent', t: 'Hettie Rook spits into the ash. “Both will come now. You can count on that. Where do you want us?”' },
        { if: 'grey_hand', t: 'In the back of your mind is a closed fist in grey wax. Whoever sold your walls is watching, and this moment is when it pays.' },
      ],
      choices: [
        { t: 'Open the Vault for the Regent.', if: 'path_loyalist', fx: [{ set: ['ally_regent', 'enemy_pale', 'regentVault'] }, { chron: 'You opened the Vault under the Regent’s banner; the Pale Banner struck as the door opened.' }],
          reply: ['Aldous nods once, grimly. “Then we do it properly.” He gives the order, and the Regent’s pikes take the lower landing in good order. Ansel carries the lantern to the foot of the stair.', 'It is Dunstan who sees the white banner on the ridge first. “There,” he says. “She was waiting for us to commit.” Sirene’s knights are already coming down the hill, and her face, at this distance, is only a white smudge.'], go: 'vault_prelude' },
        { t: 'Ask Aldous to guard the stair while Ansel opens the door alone.', if: ['path_loyalist', 'sharedVault'], tip: 'He trusts you', fx: [{ set: ['ally_regent', 'enemy_pale', 'regentTrust'] }, { chron: 'Captain Aldous agreed to guard the stair, trusting you with what lay behind the door.' }],
          reply: ['“If you’re wrong,” Aldous says, “it is my neck.” He thinks for a long moment. Then, to his sergeants: “We guard the stair. We do not go through the door.” You have not often seen a man choose his own conscience over his orders so carefully.', '“Make it worth it,” he says quietly. Behind him, along the ridge, the white banner begins to move.'], go: 'vault_prelude' },
        { t: 'Refuse. “The Vault is Cindervale’s.”', if: 'path_loyalist', fx: [{ set: 'enemy_regent' }, { res: { standing: 1 } }, { trust: { dunstan: 1 } }, { chron: 'You refused the Regent’s demand. His men turned on you.' }],
          reply: ['Aldous looks at you for a long time. “Then I’ll have to take it,” he says, without relish. He is a man who does what the letter says. “I am sorry, Warden. I had hoped it would not come to this.”', 'Dunstan says, quietly, “The north will remember this.” The pikes are already turning.'], go: 'vault_prelude' },
        { t: 'Open the Vault for the Duchess.', if: 'path_rebel', fx: [{ set: ['ally_pale', 'enemy_regent', 'paleVault'] }, { chron: 'You opened the Vault under the Pale Banner; the Regent’s men struck as the door opened.' }],
          reply: ['Sirene inclines her head. “The Duchess will not forget this.” Her knights take the lower landing and the white banner goes up over the great hall.', 'Down the ridge, a column in gold and black is moving fast. “The Regent’s men,” Dunstan says. “They must have been shadowing us all night.” He draws his sword. “It seems we are committed.”'], go: 'vault_prelude' },
        { t: 'Persuade Sirene to guard the stair while Ansel opens the door alone.', if: ['path_rebel', 'heardSirene'], tip: 'She hears you', fx: [{ set: ['ally_pale', 'enemy_regent', 'paleTrust'] }, { chron: 'Dame Sirene agreed to guard the stair, trusting you with what lay behind the door.' }],
          reply: ['“You ask me to stand outside a door I was sent to open,” Sirene says. “That is a hard thing to be asked.” She is silent. Then: “The Duchess is not here. I am. I will guard the stair.”', 'She says it as if she has just put down a very heavy weight, and is surprised to find she can stand without it.'], go: 'vault_prelude' },
        { t: 'Refuse. “The Vault is Cindervale’s.”', if: 'path_rebel', fx: [{ set: 'enemy_pale' }, { res: { standing: 1 } }, { trust: { dunstan: 1 } }, { chron: 'You refused the Duchess’s demand. Her knights turned on you.' }],
          reply: ['“I had hoped,” says Sirene, and does not finish. She mounts, slowly, like a woman who has done this too many times. “You are making a mistake, Warden. But I will give you the courtesy of making it quickly.”', 'The knights are already forming. Kell, if she is anywhere near, is not looking at them.'], go: 'vault_prelude' },
        { t: 'Hold the stair with the Marchers.', if: 'path_independent', fx: [{ set: ['ally_clans', 'enemy_both'] }, { chron: 'You held the Vault stair with the Marchers against both claimants.' }],
          reply: ['“Aye,” says Hettie, and taps out her pipe. “Hunters, to the stair. No one in, no one out.” The grey-green wool closes ranks. It is very quiet.', 'On the ridge, two banners are coming: one white, one gold and black. For once they are heading for the same place. Dunstan almost smiles. “Well,” he says. “At least they will be unpleasant to each other.”'], go: 'vault_prelude' },
        { t: 'Bluff the Regent’s men into standing down.', if: ['path_independent', 'bg_envoy'], tip: 'Envoy background', fx: [{ set: ['ally_clans', 'enemy_pale', 'bluffedRegent'] }, { chron: 'You bluffed the Regent’s men into standing down.' }],
          reply: ['You walk out alone to meet Aldous Venn under a flag of truce and say, very pleasantly, that Lord Thorne’s chamberlain has already sold the Vault’s location to the Duchess, and that if the Regent’s men would like to be the ones left holding the bag, you are happy to wait.', 'It is half true, and entirely plausible. Aldous stares at you for a very long time. Then he orders his pikes to stand down. “If I find this was a lie,” he says. “I will come back.” Dunstan, when you return, is staring at you. “I have never seen anyone lie so *accurately*,” he says.'], go: 'vault_prelude' },
      ],
    },

    vault_prelude: {
      title: 'A Hundred and One Steps', mood: 'vault',
      enter: [{ goal: 'Get Ansel to the Vault door.' }],
      text: [
        'The Vault door lies at the top of the old stair beneath the great hall: a hundred and one steps worn by no one. Ansel carries the key, a blue point of light in a lantern, and cannot use it unless he stands at the door.',
        { if: 'enemy_pale', t: 'Pale Banner steel glints in the dark above.' },
        { if: 'enemy_regent', t: 'Regent’s crossbows gleam on the landing.' },
        { if: 'enemy_both', t: 'Two banners, two sets of boots on the stone. They are wary of each other.' },
        { if: { wounded: 'ansel' }, t: 'Ansel is bruised from Barrow Night and leans on his staff, but he is moving.' },
        { if: { trust: 'ansel', gte: 7 }, t: '“Whatever is up there,” Ansel says, “I would rather meet it with you than with anyone else.”' },
        'Dunstan checks his sword. “We go up together,” he says. “Or not at all.”',
      ],
      choices: [{ t: 'Climb.', go: 'vault_battle' }],
    },
    vault_battle: { title: 'The Vault Stair', mood: 'vault', battle: 'vault', win: 'vault_win', lose: 'vault_lose', text: [] },

    vault_lose: {
      title: 'The Stair Is Lost', mood: 'night',
      enter: [{ res: { gold: -2, standing: -2 } }, { set: 'vaultLost' }, { chron: 'The Vault stair was lost. You fled Cindervale with what you could carry.' }, { day: 2 }, { goal: 'Survive, regroup, and take the stair back.' }],
      text: [
        'Ansel falls on the ninety-fourth step. You drag him back down through the dark while the stair rings with boots.',
        'The door stays shut. Whoever holds the stair will hold Cindervale by morning.',
      ],
      next: 'ending_lost',
    },

    vault_win: {
      title: 'The Door', mood: 'vault',
      enter: [{ chron: 'Ansel opened the Vault door.' }, { day: 1 }, { goal: 'Decide what to do with the Veil-stone.' }],
      text: [
        'Ansel sets the lantern against the door. The blue flame leaps, and the stone *opens*, not like a door, but like an eyelid.',
        'The Vault is a round chamber of black glass. In the middle, hanging in the air where there is no cord, no pedestal, no wire, turns a shard the length of a forearm. It is the colour of the space between stars. It hums.',
        'On a shelf of the same black glass lies a journal in the old king’s hand. Ansel reads the last page aloud, his voice not steady. *The Ember was never fire. It is a lighthouse. Something called, and this answered. If it goes out, it will call again, and I do not know who will come. Do not let them touch it. Do not let them feed it. If I am dead, someone must decide what it is. I could not. I hope you can.*',
        '*I chose you because you asked nothing of me. Everyone else I might have chosen wanted something from the Vault. If you want nothing, you may be the only one who can choose well.*',
        { if: 'regentTrust', t: 'Aldous stands at the door with his hand on his sword and does not step through. “I will report what I choose to report,” he says quietly.' },
        { if: 'paleTrust', t: 'Sirene bows her head at the threshold. “The Duchess will want to know,” she says. “I will tell her you were reasonable.”' },
        { if: 'kellSpared', t: 'Kell is shaking, but not with fear. The shard’s hum is in her bones, and the lit eyes shine.' },
        'The decision is yours. But you do not have to make it alone.',
      ],
      next: 'vault_counsel',
    },

    /* ======================= COUNSEL ======================= */
    vault_counsel: {
      title: 'Before You Choose', mood: 'vault',
      enter: [{ goal: 'Choose: seal the shard, rekindle the Ember, or touch it.' }],
      text: ['The shard turns. The company stands in the black glass, tired and bloody and waiting. Everyone here has an opinion, and each has earned the right to give it. Who do you want to hear?'],
      choices: [
        { t: 'Ask Dunstan.', if: { all: [{ has: 'dunstan' }, '!heard_dunstan'] }, go: 'counsel_dunstan' },
        { t: 'Ask Ansel.', if: { all: [{ has: 'ansel' }, '!heard_ansel'] }, go: 'counsel_ansel' },
        { t: 'Ask Isolde.', if: { all: [{ has: 'isolde' }, '!heard_isolde'] }, go: 'counsel_isolde' },
        { t: 'Ask Kell.', if: { all: [{ has: 'kell' }, '!heard_kell'] }, go: 'counsel_kell' },
        { t: 'I have heard enough. Decide.', go: 'decision' },
      ],
    },
    counsel_dunstan: {
      title: 'Dunstan’s Counsel', mood: 'vault',
      enter: [{ set: 'heard_dunstan' }],
      text: [
        { if: { trust: 'dunstan', gte: 4 }, t: '“Seal it,” Dunstan says, with no hesitation, and then, because he trusts you, he explains. “I served a king who kept this door shut for thirty years and slept badly every night of them. If he was wrong, he was wrong gently. I would rather be wrong gently.” He looks at the shard. “I have buried too many men to want to be right loudly.”' },
        { if: { trust: 'dunstan', lt: 4 }, t: '“Seal it,” Dunstan says. “That is what the decree said. You asked me for a counsel, and that is all I have. I have not known you long enough to tell you more.”' },
      ],
      next: 'vault_counsel',
    },
    counsel_ansel: {
      title: 'Ansel’s Counsel', mood: 'vault',
      enter: [{ set: 'heard_ansel' }],
      text: [
        { if: { trust: 'ansel', gte: 4 }, t: '“I want to touch it,” Ansel says, and laughs unhappily. “Forty years of reading about it. But I think I am the *wrong* man for it, and you may be the right one.” He lowers his voice. “If you ask me what I fear: the Ember answered a call, and it will answer again. Relighting it is a way of answering that call *back*. I do not know who is listening. Sealing it hides us. Touching it asks them to come and look. Whichever you choose, I will stand with you.”' },
        { if: { trust: 'ansel', lt: 4 }, t: '“I would like to read the journal again,” Ansel says carefully. “I cannot tell you what to do. I can only tell you what I would hate to see go to waste. Please, think.”' },
      ],
      next: 'vault_counsel',
    },
    counsel_isolde: {
      title: 'Isolde’s Counsel', mood: 'vault',
      enter: [{ set: 'heard_isolde' }],
      text: [
        { if: { trust: 'isolde', gte: 4 }, t: '“Light the damn thing,” Isolde says. “I grew up on the edge of the ash. My nan died of the cough. You’re standing in a room that could fix it.” Then, softer: “But you’re the one who has to live with what happens. If you say seal it, I’ll hold the door.”' },
        { if: { trust: 'isolde', lt: 4 }, t: '“Don’t ask me,” Isolde says. “I’m not a thinking sort. I’d relight it. But I’m new here. You decide.”' },
      ],
      next: 'vault_counsel',
    },
    counsel_kell: {
      title: 'Kell’s Counsel', mood: 'vault',
      enter: [{ set: 'heard_kell' }],
      text: [
        { if: { trust: 'kell', gte: 4 }, t: '“It’s calling me,” Kell says, in a very small voice. “It has been since the stair. I don’t know if it’s kind. I don’t know if it’s *anything*. But the lit ones have been dying slowly for years, and if there’s a way to stop that I would like to know it.” She swallows. “Don’t seal it. Please. Or if you do, tell me you tried.”' },
        { if: { trust: 'kell', lt: 4 }, t: '“I don’t get a vote,” Kell says shortly. “I’m only here because you let me be. Do what you want. I’ll live with it.”' },
      ],
      next: 'vault_counsel',
    },

    decision: {
      title: 'The Veil-stone', mood: 'vault',
      text: [
        'The shard turns. The hum in the glass is almost a word. Everyone is looking at you.',
        'You asked nothing of the king, and he chose you for it. Now you have to want *something*.',
      ],
      choices: [
        { t: 'Seal the Vault. Let the shard sleep.', tip: 'The north is quiet. The question stays closed. Dunstan’s choice.', go: 'ending_seal' },
        { t: 'Rekindle the Ember with the shard.', tip: 'The sickness lifts, and the lighthouse burns again. Isolde’s and Kell’s hope.', go: 'ending_relight' },
        { t: 'Reach out and touch the shard.', tip: 'Learn what answers. Ansel’s fear, and his curiosity.', go: 'ending_veil' },
      ],
    },

    /* ======================= ENDINGS ======================= */
    ending_seal: {
      title: 'Sealed', mood: 'snow',
      enter: [{ chron: 'You sealed the Vault with the old king’s ring. The shard sleeps.' }, { set: 'ch1_seal' }, { goal: '' }],
      text: [
        'You press the king’s ring to the lock, and the door closes with the sound of an old book shutting.',
        'The ash slows. The dead lie quiet. The hearths do not burn warmer, but they burn. Aldmere will wake to a cold spring, a throne without a king, and a ruin on the northern ridge that is suddenly very hard to ignore.',
        { if: 'kellSpared', t: 'Kell coughs in the cold morning. It will get worse before it gets better, and she knows it. She stays anyway.' },
        { if: { trust: 'dunstan', gte: 4 }, t: '“Well done, Warden,” Dunstan says, very quietly, at the top of the stair. “I think the old king would have said the same.”' },
        { if: { trust: 'ansel', gte: 4 }, t: 'Ansel traces the shape of the door with his fingertips. “Quiet,” he says. “For now.”' },
      ],
      next: 'epilogue',
    },
    ending_relight: {
      title: 'The Ember Returns', mood: 'fire',
      enter: [{ chron: 'You relit the Ember with the Veil-stone. The north was warm again.' }, { set: 'ch1_relight' }, { goal: '' }],
      text: [
        'The shard drifts to the lantern, and the blue flame swells, climbs the stair, floods the hall. On a hundred hearths across Aldmere, in the one moment before dawn, the fires bend north and burn warm.',
        'The Ash-sickness lifts from the Ashborn like a held breath. The dead settle. The shard dims to the colour of an old bruise and does not hum again.',
        { if: 'kellSpared', t: 'Kell laughs, a real laugh, her eyes dimming from ember to ordinary brown, and sits down heavily on the stair.' },
        { if: { trust: 'isolde', gte: 4 }, t: 'Isolde presses the back of her hand to her mouth, then grins like a wolf. “My nan would’ve liked that.”' },
        'But Ansel watches the dimmed shard for a long time. “It answered,” he says. “That means it was a question.”',
      ],
      next: 'epilogue',
    },
    ending_lost: {
      title: 'Ashes', mood: 'night', end: true,
      enter: [{ goal: '' }],
      text: [
        'You do not die at Cindervale, but Cindervale dies a little. By dawn the stair belongs to someone else, the Ember remains dark, and the northern road is empty and white.',
        'The story is not over. Dunstan tightens his cloak. “We rebuild,” he says. “Slower. Smarter.” Ansel does not say anything, but he is still holding the little blue lantern, and its flame is still burning.',
        'Chapter One ends here. You can return to the last save and try the stair again.',
      ],
    },
    ending_veil: {
      title: 'The Veil', mood: 'vault',
      enter: [{ chron: 'You touched the Veil-stone. The world went quiet.' }, { set: 'ch1_veil' }, { goal: '' }],
      text: [
        'You reach out. Ansel says your name once, urgently. Dunstan starts to move.',
        'The shard is cold as the space between stars, and then it is not cold at all. The Vault walls peel away like old paint, and behind them is not stone, but *distance*. A great curved floor of dark glass. A ceiling of impossible stars.',
        'The hum stops. In the sudden silence you hear, very faintly, the sound of a very large machine waking up.',
      ],
      choices: [{ t: 'Step through.', fx: [{ travel: { pack: 'scifi', scene: 'wake' } }] }],
    },

    /* ======================= EPILOGUE ======================= */
    epilogue: {
      title: 'What the Morning Left', mood: 'snow', end: true,
      enter: [{ day: 3 }, { chron: 'The morning after the Vault: the banners, the company and the north each took stock.' }],
      text: [
        'Three days later, the great hall of Cindervale is quiet. You sit with the maps and the unpaid bills and think about what you have done.',
        { if: { res: 'standing', gte: 6 }, t: '**The north is yours.** The hamlets send food, unprompted. People say *the Warden* the way they used to say *the king*. You are not sure you like it.' },
        { if: { all: [{ res: 'standing', gte: 3 }, { res: 'standing', lt: 6 }] }, t: '**The north trusts you.** Lower Cinder has repaired the road to your gate by itself. It is a small thing, and it is not small.' },
        { if: { all: [{ res: 'standing', gt: -2 }, { res: 'standing', lt: 3 }] }, t: '**The north waits.** Nobody loves you, and nobody hates you. You have not yet been tested enough to know which.' },
        { if: { res: 'standing', lte: -2 }, t: '**The north is wary.** The hamlets shut their doors a little too quickly when your riders pass. It will take more than a won battle to mend that.' },
        { if: 'ally_regent', t: '**The Regent’s Hand** holds the east wall and the road to the capital. Aldous Venn writes his report, and you do not see what is in it.' },
        { if: 'enemy_regent', t: '**The Regent** will not forget that Cindervale turned on his men. His chamberlain’s seal is still on a map in your drawer.' },
        { if: 'ally_pale', t: '**The Pale Banner** rides out in the morning, and Sirene says the Duchess will be told everything. She sounds uncertain what “everything” is.' },
        { if: 'enemy_pale', t: '**The Duchess** has made an enemy of the Warden of Cindervale. She will have the north, one way or another.' },
        { if: 'ally_clans', t: '**The Marchers** keep the stair, then the ridge, then the keep. Hettie Rook says the clans do not forget a debt, and that they are paid in both directions.' },
        { if: 'enemy_both', t: '**Both claimants** are your enemies now. It is, at least, a symmetrical problem.' },
        { if: { trust: 'dunstan', gte: 7 }, t: '**Dunstan** is still at his post on the north wall. “I’ll stay,” he says, as though it were not a gift. “Eleven years in this ruin and I only just found out why.”' },
        { if: { trust: 'ansel', gte: 7 }, t: '**Ansel** has already started rewriting the archive. He asks you to read the first page. It begins: *The Warden of Cindervale asked nothing of the king. The king, for once, was right.*' },
        { if: { all: [{ has: 'isolde' }, { trust: 'isolde', gte: 7 }] }, t: '**Isolde** leaves for the Greywood to “see about some deer”, and returns with a brace of rabbits and her aunt’s blessing. She says nothing of it.' },
        { if: { all: [{ has: 'kell' }, { trust: 'kell', gte: 7 }] }, t: '**Kell** asks if she can stay in the keep through the winter. She says it quickly, as if daring you to refuse.' },
        '**What now?** The Vault is settled, for now. But the Grey Hand is still out there, someone sold Cindervale’s walls, and the shard’s hum has not entirely left the stones. The Ember answered something. Whatever it was, it has not forgotten the answer.',
        'Chapter One ends here. What you chose in the Vault, and who you stood beside, will shape what comes next.',
      ],
    },
  } });
})();

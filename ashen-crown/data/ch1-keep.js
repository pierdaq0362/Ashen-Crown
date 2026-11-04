/* Chapter One, part 1: arriving at Cindervale, the winter council, the gate, and the night after. */
(function () {
  const AC = globalThis.AC;
  const AFTER_GATE = [{ if: { not: { has: 'isolde' } }, go: 'isolde_returns' }, { go: 'night_watch' }];

  AC.addTo('fantasy', { scenes: {
    /* ======================= PROLOGUE ======================= */
    prologue: {
      title: 'The Night the Ember Died', mood: 'night',
      enter: [{ set: 'seenPrologue' }, { goal: 'Reach Cindervale and learn what the king left in the Vault.' }],
      text: [
        'Ten nights ago, King Orrin the Unbroken died in the Winter Court at Highmere, and the Ember went out.',
        'It had burned in the crown’s heart-stone for three hundred years without fuel or smoke, warding the roads, quieting the barrows, holding the long dark at arm’s length. When the king drew his last breath it guttered, and every hearth in Aldmere flickered with it. Now ash falls from clear skies, and on the northern barrow-fields the dead have begun to walk.',
        'No heir was named. Lord Regent Thorne holds the capital. Duchess Ysmay of Greywater has raised the Pale Banner and calls the throne hers by blood. And from the king’s deathbed came one last decree, sealed with his own ring and addressed to you, {name}: *Take Cindervale. Hold it. Let no one through the Vault.*',
        'You have never been to Cindervale. You have never asked this king for anything, not a post, not a pension, not a favour, and you cannot think why he would remember your name. At the foot of the decree, in a shakier hand than the rest, he wrote one more line: *You asked nothing of me. That is why it must be you.*',
        'Everyone who has heard of the decree thinks it is a punishment. Cindervale is a ruin on the edge of the world.',
      ],
      choices: [{ t: 'Ride north.', go: 'background' }],
    },

    background: {
      title: 'Before the Decree', mood: 'night',
      text: ['The road north is long, and there is time to think. Before the decree, who were you?'],
      choices: [
        { t: 'A soldier. A sworn blade of the Border Guard.', tip: 'You know walls, drills and what a hard winter does to a garrison. +2 levies.', fx: [{ bg: 'soldier' }, { chron: 'You came to Cindervale as a soldier of the Border Guard.' }],
          reply: ['Eleven years on the border, and you never once put your name forward for a command. Other sergeants angled for the capital. You were happy on a wall with a good view of what was coming.', 'It was a small thing, not asking. It seems the king noticed.'], go: 'arrival' },
        { t: 'A scholar. A reader in the King’s Archive.', tip: 'You know old tongues, older oaths, and where the buried things in books are buried. +2 grain.', fx: [{ bg: 'scholar' }, { chron: 'You came to Cindervale as a scholar from the King’s Archive.' }],
          reply: ['Nine years among the shelves, and you never once wrote a dedication to a patron. Your colleagues dined with lords and published. You read, and kept your own counsel.', 'It was a small thing, not asking. It seems the king noticed.'], go: 'arrival' },
        { t: 'An envoy. A voice at the Regent’s table.', tip: 'You know what people want, what they say, and the price of both. +3 gold, +1 Standing.', fx: [{ bg: 'envoy' }, { chron: 'You came to Cindervale as an envoy from the Regent’s court.' }],
          reply: ['You carried other people’s demands for a living, and never added one of your own. Everyone at court wanted something from the old king. You were the one man who only ever wanted the message delivered.', 'It was a small thing, not asking. It seems the king noticed.'], go: 'arrival' },
      ],
    },

    /* ======================= ARRIVAL ======================= */
    arrival: {
      title: 'Cindervale', mood: 'snow',
      enter: [
        { join: 'dunstan' }, { join: 'ansel' },
        { when: 'bg_soldier', then: [{ trust: { dunstan: 1 } }] },
        { when: 'bg_scholar', then: [{ trust: { ansel: 1 } }] },
        { day: 1 },
        { goal: 'Take stock of Cindervale and prepare it for what is coming.' },
      ],
      text: [
        'Cindervale squats on a ridge above the Greywood, a keep of black stone with half its teeth missing. Snow lies on the battlements and ash lies on the snow.',
        'A broad, grey-bearded man in a battered knight’s cloak meets you at the gate and does not smile. **Ser Dunstan Garrow**, castellan, thirty years in the old king’s service, eleven of them in this ruin. “The decree arrived before you did,” he says. “So did the ash. I’d call that an omen, if I believed in omens.”',
        'Beside him stands a very old man, thin as a quill and stained with ink to the elbows, holding a lantern whose flame burns small, blue and perfectly steady. “**Brother Ansel Wick**. Ember-priest, archivist, and for ten nights the only man in this keep who has slept less than the sentries.” He looks past you at the sealed stair behind the great hall. “The king’s letter to me said only: *the key will come to you when the Ember goes out.* This is it.” He lifts the lantern. “The last spark. It leans toward that door like a dog toward its master. I believe it is the only thing that will open it.”',
        { if: 'bg_soldier', t: 'Dunstan’s eyes go over your boots, your hands, the way you stand. “Soldier,” he says, and it sounds almost like approval.' },
        { if: 'bg_scholar', t: 'Ansel stares at the ink on your cuff. “Archive-trained. Thank the Ember.”' },
        { if: 'bg_envoy', t: 'Dunstan notes your good gloves. “Court,” he says, as though naming a disease.' },
        '“Here is what I know,” Dunstan says. “The Vault is under the great hall. The king ordered it held, and nobody has told me why. Three powers want in: the Regent, the Duchess, and whoever else crawls out of the Greywood. We have a ruined wall, a thin garrison and a hamlet that doesn’t trust us. Winter is coming, and the dead are already walking.”',
      ],
      choices: [{ t: 'Take stock of Cindervale.', go: 'stock' }],
    },

    stock: {
      title: 'Taking Stock', mood: 'snow',
      text: ['Dunstan lays the keep’s troubles out like a hand of bad cards: the walls, the granary, the hamlet beneath the ridge. There is time to look into two of them before the council must meet.'],
      choices: [
        { t: 'Walk the walls with Dunstan.', if: '!v_walls', go: 'stock_walls' },
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
        '“Two good archers on that wall-walk are worth ten spearmen in the yard,” Dunstan says. “Fix the rampart and I can put the militia on it. Two gold in mortar and carters.”',
      ],
      choices: [
        { t: 'Pay two gold for masons.', cost: { gold: 2 }, fx: [{ set: 'wallsRepaired' }, { trust: { dunstan: 1 } }, { chron: 'You had the north rampart rebuilt.' }],
          reply: ['The masons are two brothers from Lower Cinder who work without speaking and charge exactly what they said. By evening a clean line of new mortar crosses the gap.', '“That’ll do,” Dunstan says, which from him is a speech. He is already marking where the archers will stand.'], go: 'stock' },
        { t: 'Show the garrison how to reseat the stones yourself.', if: 'bg_soldier', tip: 'Soldier background', fx: [{ set: 'wallsRepaired' }, { trust: { dunstan: 2 } }, { chron: 'You rebuilt the north rampart with the garrison, stone by stone.' }],
          reply: ['You shed your cloak and take the first stone. The garrison stares for a moment, then joins in. By dusk your hands are raw, and the rampart stands.', 'Dunstan watches from the wall-walk with his arms folded. When you climb up beside him he says, without looking at you, “I served a king who never lifted a stone in his life.” A pause. “I think I’ll like this better.”'], go: 'stock' },
        { t: 'Leave it. Gold is scarcer than stone.', reply: ['“As you say,” Dunstan answers, with the care of a man who has served worse masters. He looks at the pile of fallen masonry a moment longer than he needs to.', 'The gap in the wall will still be there when the raiders come.'], go: 'stock' },
      ],
    },

    stock_granary: {
      title: 'The Granary', mood: 'snow',
      enter: [{ set: 'v_granary' }, { inc: { stock: 1 } }],
      text: [
        'The granary is a cold stone room with more rat-droppings than grain. The steward, a nervous man named Piet, shows you the count: five sacks, a long winter, and a garrison that has not been paid since autumn.',
      ],
      choices: [
        { t: 'Ration the garrison.', tip: '+1 grain, Dunstan will not like it', fx: [{ res: { grain: 1 } }, { trust: { dunstan: -1 } }, { set: 'rationed' }],
          reply: ['The ration is announced at supper: half portions until the thaw. Nobody argues, which is worse than arguing. The soldiers eat looking at their bowls.', '“They’ll bear it,” Dunstan says afterwards. “I’d have liked to be asked first.”'], go: 'stock' },
        { t: 'Requisition grain from the hamlet.', tip: '+3 grain, −1 Standing', fx: [{ res: { grain: 3, standing: -1 } }, { set: 'requisitioned' }, { chron: 'You requisitioned grain from the hamlet.' }],
          reply: ['Four soldiers and a handcart go down to Lower Cinder. They come back with grain and a story: a woman stood in her doorway holding a ladle, and did not move until they took the sack from beside her feet.', 'The hamlet will remember it. Piet, counting the new sacks, will not meet your eyes.'], go: 'stock' },
        { t: 'Buy grain from the miller.', cost: { gold: 2 }, tip: '+3 grain, +1 Standing', fx: [{ res: { grain: 3, standing: 1 } }],
          reply: ['The miller is astonished to be paid. He throws in a sack of oats and the news that the last Warden of Cindervale took what he wanted and called it a tax.', '“You’re not him, then,” he says. It is not quite a question, but you answer it anyway.'], go: 'stock' },
        { t: 'Have Ansel search the chapel records for old stores.', if: 'bg_scholar', tip: 'Scholar background: +3 grain', fx: [{ res: { grain: 3 } }, { trust: { ansel: 1 } }, { chron: 'You found a forgotten root cellar in the old chapel records.' }],
          reply: ['The two of you spend an afternoon among mouldering ledgers while Ansel mutters about the sins of previous archivists. In a margin, in a hand a century dead: *root cellar under the north chapel, sealed against rats.*', 'The cellar is full of turnips, salt pork and a frankly alarming number of onions. Ansel sits on a barrel and laughs until he coughs. “Forty years I’ve walked over this.”'], go: 'stock' },
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
        { t: 'Free her. “The king’s wood has no king.”', fx: [{ join: 'isolde' }, { trust: { isolde: 2 } }, { res: { standing: 1 } }, { set: 'freedIsolde' }, { chron: 'You freed Isolde Fenn from the stocks of Lower Cinder.' }],
          reply: ['The reeve opens his mouth, looks at your face, and fetches the key. Isolde rubs her wrists and looks you over like a horse she is thinking of buying.', '“I’ll owe you for that,” she says. “I don’t like owing. So I’ll pay it off fast.” Around the square, doors that were half-shut open a little wider.'], go: 'stock' },
        { t: 'Talk the reeve into releasing her to your custody.', if: 'bg_envoy', tip: 'Envoy background', fx: [{ join: 'isolde' }, { trust: { isolde: 1 } }, { res: { standing: 1 } }, { set: 'talkedIsolde' }, { chron: 'You talked the reeve into releasing Isolde Fenn to you.' }],
          reply: ['It takes ten minutes, a promise about the king’s venison and a fine you invent on the spot. The reeve leaves believing it was his idea.', '“Smooth,” Isolde says, climbing out of the stocks. “I don’t trust smooth. But I’ll take it.”'], go: 'stock' },
        { t: 'Fine her two gold and let her work it off.', fx: [{ join: 'isolde' }, { res: { gold: 2 } }, { set: 'finedIsolde' }, { chron: 'You fined Isolde Fenn and took her into your company.' }],
          reply: ['She counts out the coin she does not have with a look that would sour milk, and you let her work it off in the keep. By the time you have walked back up the ridge she has already scouted three approaches to the north gate without being asked.', '“Don’t think this makes us friends,” she says. It is, nonetheless, a start.'], go: 'stock' },
        { t: 'Leave her in the stocks. Order is order.', fx: [{ set: 'isoldeSpurned' }],
          reply: ['The reeve nods approvingly. Isolde says nothing at all. She watches you walk out of the square, and she does not look away until you have reached the ridge road.', 'The hamlet is quiet. Nobody offers you anything, but nobody blocks the way either.'], go: 'stock' },
      ],
    },

    council1: {
      title: 'The Winter Council', mood: 'fire', council: 'winter',
      enter: [{ goal: 'Prepare for winter. Something is coming from the Greywood.' }],
      text: [
        'The council meets in the great hall around a table with one leg shorter than the others. Dunstan, Ansel and the steward wait for your orders.',
        { if: { has: 'isolde' }, t: 'Isolde has attached herself to the corner by the fire, sharpening an arrowhead and listening to everything.' },
        'You have three actions. Spend them on the keep, or on the people in it: the conversations you have now are the ones you will lean on later.',
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
        { t: 'Pay three gold and swear the oath.', cost: { gold: 3 }, tip: '−1 Standing, Dunstan will not like it', fx: [{ set: 'sworeRegent' }, { res: { standing: -1 } }, { trust: { dunstan: -1 } }, { chron: 'You swore to the Regent’s Hand to quiet the Tax-Reeve.' }],
          reply: ['You speak the words. Corvin writes them down himself, and the clerk makes a copy, and the spearmen stand a little straighter in the snow.', '“The Regent will be pleased,” Corvin says. He sounds almost sorry. Behind you Dunstan has gone very still, and when the column has gone he says, quietly, “Thirty years I served one king. I have never sworn to a clerk.” He walks away before you can answer.'], go: '@return' },
        { t: 'Bargain: one gold now, the rest “when the roads clear”.', if: 'bg_envoy', cost: { gold: 1 }, tip: 'Envoy background', fx: [{ set: 'regentStalled' }, { chron: 'You talked the Tax-Reeve into leaving with one gold and a promise.' }],
          reply: ['You do not argue. You listen, sympathise, and at the right moment mention that a Reeve who returns with a quarter of the arrears and a *plan* looks better than one who returns with an argument.', 'Corvin leaves with one gold, a letter in your best court hand, and the distinct impression that this was his idea. As his spears file out, Dunstan murmurs, “I have never seen anyone lose a fight so politely.”'], go: '@return' },
        { t: 'Let the rebuilt wall speak for you.', if: ['bg_soldier', 'wallsRepaired'], tip: 'Soldier background', fx: [{ set: 'defiedRegent' }, { res: { standing: 1 } }, { trust: { dunstan: 1 } }, { chron: 'You walked the Regent’s Tax-Reeve along the rebuilt wall until he went pale.' }],
          reply: ['You do not say no. You take Corvin for a walk: the rebuilt rampart, the archers on the wall-walk, the gap in the north gate where a column of twelve would have to go single file.', '“Charming,” he says, in a thin voice, at the end. “Very sound masonry.” He leaves by the afternoon light with his spears, with no gold and his coat splashed with slush to the knee. Dunstan watches the column out of sight and says only, “That was well done, Warden.” From him, it is a medal.'], go: '@return' },
        { t: 'Refuse. “Cindervale answers to Cindervale.”', fx: [{ set: 'defiedRegent' }, { res: { standing: 1 } }, { trust: { dunstan: 1, isolde: 1 } }, { chron: 'You turned the Regent’s Tax-Reeve away from the gate.' }],
          reply: ['The silence stretches. Corvin’s spearmen glance at one another. Then a voice from the wall-walk, very clearly, says, “Aye,” and then another, and then half the garrison is saying it.', 'Corvin goes white, then red. “You are making an enemy of the Regent.” “He is welcome to come and say so,” you reply. The column goes down the ridge road in a stiff line. From the hamlet below, someone has started to cheer.'], go: '@return' },
      ],
    },

    evt_refugees: {
      title: 'Refugees', mood: 'snow',
      text: [
        'A line of people trudges out of the snow: farmers from Greywater, children wrapped in sacking. They say the Pale Banner is taking grain for the Duchess’s army, and the Regent’s men are taking the rest.',
      ],
      choices: [
        { t: 'Shelter them in the keep.', cost: { grain: 2 }, tip: '+1 levy, +1 Standing', fx: [{ res: { levies: 1, standing: 1 } }, { chron: 'You gave shelter to refugees from Greywater.' }],
          reply: ['They fill the great hall with wet wool and quiet. A boy of about twelve stares at Dunstan’s sword until Dunstan, with enormous dignity, lets him hold the scabbard.', 'In the morning, a young father named Joss asks where the spears are kept. He would like to be of use. Word will travel along the roads that Cindervale has a door that opens.'], go: '@return' },
        { t: 'Give them one meal and send them south.', cost: { grain: 1 }, fx: [{ chron: 'You fed refugees and sent them south.' }],
          reply: ['They eat in silence in the yard, thank you in the careful voice of people who have learned not to ask for more, and shoulder their packs. Nobody says it is unkind. Nobody says it is kind, either.', 'Ansel watches them go until the road bends. “South,” he says. “Toward the Regent’s tax-collectors.” He does not finish the thought.'], go: '@return' },
        { t: 'Turn them away.', tip: '−1 Standing, Ansel and Dunstan disapprove', fx: [{ res: { standing: -1 } }, { trust: { ansel: -1, dunstan: -1 } }, { chron: 'You turned refugees away from the gate.' }],
          reply: ['The gate does not open. Someone in the line starts to argue, and stops. A child is carried by. It is very cold.', 'Ansel says nothing for the rest of the day, which is the loudest thing you have heard him do. Dunstan says, “A garrison that shuts out the cold will be shut out of the next hamlet’s warmth.” He is not wrong, and you both know it.'], go: '@return' },
      ],
    },

    evt_ashfall: {
      title: 'Ashfall', mood: 'night',
      text: [
        'Ash falls all night, soft as wool. By morning the courtyard is grey, and the sentries report that something stood at the treeline until dawn: a person-shaped thing, patient, facing the keep.',
        'Ansel sets his small blue lantern on the table, and the flame leans toward the north.',
      ],
      choices: [
        { t: 'Ask Ansel what he knows about the Ember.', go: 'evt_ashfall_lore' },
        { t: 'Double the night watch.', cost: { grain: 1 }, tip: 'Dunstan approves', fx: [{ set: 'doubledWatch' }, { trust: { dunstan: 1 } }],
          reply: ['Dunstan arranges it in ten minutes: pairs on every wall, a runner at the gate, fresh sentries at the third bell. Nothing comes. The watch grumbles about the cold and, privately, about being glad of it.', '“Better to lose sleep than a wall,” Dunstan says. “You’ll find that I count sleep as a cheap currency.”'], go: '@return' },
      ],
    },
    evt_ashfall_lore: {
      title: 'What the Archive Remembers', mood: 'night',
      enter: [{ set: 'loreEmber' }, { trust: { ansel: 1 } }],
      text: [
        '“The Ember was a ward,” Ansel says. “Now there is nothing between the barrows and the living but the dark.”',
        '“The records say Orrin’s grandfather found the heart-stone in a crater, still warm. We always assumed it was fire. But it never burned anything. It never smoked.” He turns the lantern slowly. “In seventy years I never once asked what it was *for*. I think that was our mistake. I think it was never *ours*.”',
        'He is quiet for a moment, then smiles at you, small and old. “Forgive me. I tend to say the interesting things at the worst possible hour.”',
      ],
      next: '@return',
    },

    evt_peddler: {
      title: 'The Peddler', mood: 'snow',
      text: [
        'A peddler named Odo wanders up the ridge in a cart pulled by an ox older than the kingdom, offering lamp-oil, salt, a crate of crossbow bolts, and a sack of grain that is “definitely not stolen”.',
      ],
      choices: [
        { t: 'Buy the grain.', cost: { gold: 2 }, tip: '+3 grain', fx: [{ res: { grain: 3 } }],
          reply: ['Odo weighs the coin in his palm with the air of a man who has been cheated by experts. “A fair price,” he says, as though it hurts. The grain smells slightly of horse, but it is grain.', '“Don’t ask where from,” he adds cheerfully, and you do not.'], go: '@return' },
        { t: 'Buy the bolts for Isolde.', if: { has: 'isolde' }, cost: { gold: 1 }, tip: 'Isolde will be delighted', fx: [{ trust: { isolde: 2 } }],
          reply: ['You hand Isolde the crate without a word. She opens it, runs a thumb along a bolt-shaft, and for once says nothing sharp at all.', '“Who told you my fletching was low?” she says at last. Nobody did. You simply noticed. She tucks the crate under her arm like it might be taken back.'], go: '@return' },
        { t: 'Pay him in conversation: ask for news.', fx: [{ set: 'heardWar' }],
          reply: ['Odo talks while he restocks, in the manner of a man who has been alone with an ox for weeks. The Regent’s army is garrisoning the river crossings. The Duchess has hired mercenaries from the east. And, in a lower voice: a rider in a grey glove has been seen on every road between Highmere and the Greywood, and nobody knows who he works for.', '“Grey glove,” Dunstan repeats flatly, when you tell him. He does not say why that bothers him.'], go: '@return' },
      ],
    },

    /* ======================= THE GATE ======================= */
    gate_prelude: {
      title: 'Dusk', mood: 'fire',
      enter: [{ goal: 'Hold the north gate.' }],
      text: [
        'Dusk, the fifth day. The horn on the north wall sounds twice: riders on the Greywood road, many, without a banner.',
        { if: 'scoutedPass', t: 'Your scouts reported them hours ago, and the garrison has had time to arm.' },
        { if: '!scoutedPass', t: 'It comes without warning. Half the garrison is still at supper.' },
        { if: 'fortified', t: 'Carts and timber choke the north gate down to a single gap, and Dunstan has put his best men behind it.' },
        { if: 'wallsRepaired', t: 'The rebuilt rampart bristles with militia bows.' },
        { if: { res: 'standing', gte: 3 }, t: 'From Lower Cinder comes a ragged line of men and women with pitchforks, hunting-bows and kitchen knives. “If it’s our hill, it’s our wall,” says the reeve, a little embarrassed. They take places along the stones.' },
        { if: { res: 'standing', lte: -2 }, t: 'You count heads and the number is wrong. Two of the levies are gone, bedrolls and all. Nobody says why. Nobody needs to.' },
        { if: { has: 'isolde' }, t: 'Isolde takes the ruined stair two steps at a time, strings her bow without being told, and grins like a wolf. “Finally.”' },
        { if: { trust: 'dunstan', gte: 4 }, t: 'Dunstan hands you a spear you did not ask for. “Warden,” he says, and then, quietly, so only you hear it: “I’ll take the gate itself. You stand where I can see you.”' },
        { if: { trust: 'dunstan', lt: 4 }, t: 'Dunstan hands you a spear you did not ask for. “Warden,” he says. “They should learn the name.”' },
      ],
      choices: [{ t: 'To the gate!', go: 'gate_battle' }],
    },
    gate_battle: { title: 'The North Gate', mood: 'fire', battle: 'gate', win: 'gate_win', lose: 'gate_lose', text: [] },

    gate_win: {
      title: 'Dawn at the Gate', mood: 'snow',
      enter: [{ res: { gold: 2 } }, { set: 'kellCaptured' }, { chron: 'The raiders broke against the north gate of Cindervale.' }, { day: 1 }, { goal: 'Decide what to do with the prisoner, then find out who sent the raiders.' }],
      text: [
        'The raiders break. The last of them, a young woman in a scorched grey cloak who threw fire from her bare hands, goes down at the foot of the gate with ash steaming from her sleeves.',
        'She is alive. Her eyes are the colour of embers: not red, *lit*, as though something behind them were burning. Ansel kneels beside her and goes very still. “Ashborn,” he whispers. “I thought they were a story.”',
        'She wears no banner, but there is a pale ribbon sewn inside her collar. The Pale Banner’s colour.',
        { if: { res: 'standing', gte: 3 }, t: 'The hamlet volunteers are sitting in the snow with their weapons across their knees, shaky, proud and mostly unhurt. Somebody has already started a song. It is not a good song, but it is about you.' },
      ],
      next: 'kell_fate',
    },

    gate_lose: {
      title: 'The Gate Falls', mood: 'fire',
      enter: [{ res: { grain: -1, standing: -1 } }, { set: 'gateLost' }, { chron: 'The north gate fell. Cindervale burned, and the raiders took what they could carry.' }, { day: 1 }, { goal: 'Pick up the pieces, and find out who sent the raiders.' }],
      text: [
        'The gate gives. The raiders pour through, burn the stable and the granary roof, strip the armoury of whatever they can carry, and are gone by moonrise with a wagon of your grain. They leave only ash and a pale ribbon snagged on the gatepost.',
        'You are alive, and so is the keep. Dunstan has a broken arm, a gash across his scalp and a very short temper.',
        'Ansel carries the lantern from room to room, counting the living by its light. “The ribbon is the Pale Banner’s,” he says. “Whoever sent them did not mean to take the keep. They meant to *measure* it.”',
      ],
      next: AFTER_GATE,
    },

    kell_fate: {
      title: 'The Captive', mood: 'court',
      text: [
        'By dawn the prisoner is awake, chained to a bench in the guardroom, watching the door like a cornered cat. The garrison wants her hanged. Ansel wants her *studied*, gently. Dunstan wants to know what she knows.',
      ],
      choices: [
        { t: 'Send the guards out and talk to her.', go: 'kell_talk' },
        { t: 'Lock her in the cellar and decide later.', fx: [{ set: 'kellHeld' }],
          reply: ['The cellar door shuts on her stare. Ansel brings her a blanket and a bowl without being asked, and you pretend not to notice. Dunstan says nothing, but he posts the one guard who can be trusted not to be cruel.', 'The question has not gone away. It is only sitting in the dark, waiting.'], go: AFTER_GATE },
        { t: 'Hang her at dawn as a raider.', tip: 'Ansel will not forgive this', fx: [{ set: 'kellExecuted' }, { trust: { ansel: -3, isolde: -1 } }, { chron: 'You hanged the Ashborn raider at dawn.' }], go: 'kell_hanged' },
      ],
    },
    kell_hanged: {
      title: 'The Rope', mood: 'night',
      enter: [{ chron: 'The garrison watched in silence. Ansel did not.' }],
      text: [
        'The rope is quick. Nobody speaks. Ansel stays in the chapel, and does not come out for supper, nor for the next day’s. When he does, he takes the lantern to the grave-yard and sits with it until dark.',
        'Dunstan says, to no one, that it was a soldier’s justice, and it sounds as if he is trying to believe it.',
        { if: { has: 'isolde' }, t: 'Isolde watches you across the yard for a long time. “You said the king’s wood had no king,” she says. “Funny what *you* do with a rope.”' },
      ],
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
      enter: [{ set: 'kellTruth' }, { set: 'grey_hand' }, { chron: 'The Ashborn captive told you why the Pale Banner wants the Vault, and who sold Cindervale’s walls.' }],
      text: [
        'She tells it in a flat voice, as if reciting a lesson.',
        '“The Duchess doesn’t want your keep. She wants what’s under it. The king hid something in the Vault years ago, and when he died the Ember went dark. I don’t understand it. I only know the Duchess’s mages say the Ashborn are *drawn* to it, like moths. We’re all dying, slowly. The Vault is where the Ember came from, and the only place it might come back.”',
        '“And the maps of my walls?” Dunstan asks. Kell hesitates. “Came from the Regent’s chamberlain. A man named Lucan Vey, in a grey glove. The seal on the map was a closed hand. Someone in the capital is selling both sides the same knife.”',
        'Dunstan’s jaw works. Then he says, very quietly, “Vey.”',
        '“I’m called Kell,” she says at last. “Kell Ashworth. I’d like to stop being a prisoner now, please.”',
      ],
      choices: [
        { t: 'Release her and offer her a place in your company.', fx: [{ join: 'kell' }, { set: 'kellSpared' }, { trust: { ansel: 1 } }, { chron: 'Kell Ashworth, an Ashborn raider, joined your company.' }],
          reply: ['Dunstan unlocks the chain himself, without being asked, and hands her the key to look at. “Wearing it was my idea,” he says. “Taking it off is yours.” She turns it over in her fingers, unsure what she is being offered.', 'Kell says nothing for a long moment. Then: “If I run, you’ll have to explain to everyone why you were stupid.” “Yes,” you say. She nods, as though that were a fair price, and follows you out.'], go: AFTER_GATE },
        { t: 'Release her and send her away.', fx: [{ set: 'kellFreed' }, { trust: { ansel: 1 } }],
          reply: ['You walk her to the postern at dawn and give her a day’s bread. She looks at the road and then at you, as if one of them must be a trap.', '“Don’t go back to the Duchess,” you say. “I won’t,” she says, and does not say where she will go. The snow takes her footprints within the hour.'], go: AFTER_GATE },
        { t: 'Keep her in the cellar for now.', fx: [{ set: 'kellHeld' }],
          reply: ['She nods as if she expected it, and goes back down the cellar stair without being pushed. “It’s a decent cellar,” she says. “I’ve been in worse.”', 'Ansel leaves a candle for her at the foot of the stair. Dunstan pretends not to see it.'], go: AFTER_GATE },
      ],
    },
    kell_fear: {
      title: 'What Kell Says', mood: 'court',
      enter: [{ set: 'kellFeared' }, { set: 'kellHeld' }],
      text: [
        'She goes rigid, spits once, and says nothing for a long time. When she does talk, it is what a frightened person thinks you want to hear: the Pale Banner will take the keep by midwinter, the Duchess is unstoppable, you should surrender while you still can.',
        'It is, Ansel observes quietly afterward, almost certainly not the whole truth. “She is very good at being afraid,” he says. “It is a skill. I would like to know who taught her.”',
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
      next: 'night_watch',
    },

    /* ======================= THE NIGHT AFTER ======================= */
    night_watch: {
      title: 'The Night Watch', mood: 'night',
      enter: [{ day: 1 }, { set: 'sawNightWatch' }, { goal: 'Understand what is at stake, and choose who to stand with.' }, { chron: 'In the quiet after the gate, you and your company pieced together what you know.' }],
      text: [
        'The gate is mended. The dead are buried, or burned. Dunstan, Ansel and you sit in the great hall with a pot of something that was once soup, and for the first time since the decree there is room to think.',
        '“Let us lay it out,” Ansel says, “as plainly as a reader’s mind prefers.” He clears a space on the table among the maps.',
        { if: 'kellSpared', t: 'Kell has been given a stool by the fire. She is trying very hard to look as if she is not listening.' },
        { if: { has: 'isolde' }, t: 'Isolde, who does not sit at tables, perches on the windowsill with her bow across her knees.' },
        'There is a great deal you do not know. But there are three questions you can ask the people in this room, and each answer may change what you do next.',
      ],
      next: 'night_hub',
    },

    night_hub: {
      title: 'What Do We Know?', mood: 'night',
      text: ['Ansel waits, hands folded. Dunstan stares into the fire. The lantern flame leans, patient, toward the sealed stair.'],
      choices: [
        { t: '“What is in the Vault?”', if: '!asked_vault', go: 'ask_vault' },
        { t: '“Who are the three banners, and what do they want?”', if: '!asked_banners', go: 'ask_banners' },
        { t: '“Who gave them our walls?”', if: '!asked_walls', go: 'ask_walls' },
        { t: 'That is enough. Let the banners come.', if: { n: 'asked', gte: 2 }, go: 'act3_open' },
      ],
    },
    ask_vault: {
      title: 'The Vault', mood: 'night',
      enter: [{ set: 'asked_vault' }, { inc: { asked: 1 } }, { trust: { ansel: 1 } }],
      text: [
        '“No one knows,” Ansel says. “I want you to hear that. I have been the king’s archivist for forty years, and I do not know. But I know three things.”',
        '“One: the Vault was built by Orrin’s grandfather, around the heart-stone he found in the crater, before the Ember was ever a ward. Two: the Ember burns without fuel, and since the night of the king’s death it has been *this*.” He lifts the lantern. “The last spark. Three: this spark is a key. I felt it the first night. It wants to go home.”',
        '“The king did not want the Vault opened,” Dunstan says. “And he did not want it taken. He wanted it *held*. By someone who did not want it for themselves.” He looks at you. “That is what the decree means. It is also, I think, why it was you.”',
      ],
      next: 'night_hub',
    },
    ask_banners: {
      title: 'The Three Banners', mood: 'night',
      enter: [{ set: 'asked_banners' }, { inc: { asked: 1 } }],
      text: [
        '“There will be three,” Dunstan says. He counts on thick fingers. “The Regent’s Hand: Lord Thorne, who holds the capital by being the only one who was standing when the king fell. He has sixty spears nearby under a Captain Aldous Venn, honest enough, tired enough. He will say the Vault belongs to the Crown, and the Crown is him.”',
        '“The Pale Banner. Duchess Ysmay claims the throne by blood and has the nobles to prove it. Her champion is Dame Sirene Ashgrove, a good knight, a fair one. She says the Duchess will relight the Ember. I do not know what she means by that, and I do not like not knowing.”',
        '“And the Marchers,” says Ansel. “The Greywood clans. Three generations at the edge of the ash. They are not a faction. They are a people who would like to be left alone and are not. Their elder, Hettie Rook, is Isolde’s aunt.”',
        { if: { has: 'isolde' }, t: '“Don’t,” Isolde says from the windowsill, but it is without heat. “She’s a stubborn old woman. She’ll like you if you’re useful.”' },
        '“Whoever stands beside us when the dead rise,” Dunstan says, “is who we owe afterwards. Choose carefully. And choose for reasons you could say aloud.”',
      ],
      next: 'night_hub',
    },
    ask_walls: {
      title: 'The Grey Hand', mood: 'night',
      enter: [{ set: 'asked_walls' }, { inc: { asked: 1 } }, { set: 'grey_hand' }, { trust: { dunstan: 1 } }],
      text: [
        'Dunstan unrolls the raiders’ plan of Cindervale on the table. The wall-heights, the gate, the posterns, every weakness. It is drawn in a clerk’s hand. In the corner, pressed into grey wax, is a seal: a closed fist.',
        '“I know that seal,” he says. “Every castellan in Aldmere does. It is the chamberlain’s mark. **Lucan Vey**, the Regent’s man. I served the old king beside him once. He has a gift for being useful to whoever is winning.”',
        '“A map of *my* walls,” he says, “in the hands of the *Duchess’s* raiders. Which means either the Regent’s chamberlain sold his own master’s secrets, or the Regent sold them himself.” He folds the paper with great care. “Neither is good.”',
        { if: { has: 'kell' }, t: '“It was the same grey glove I saw,” Kell says quietly from the fire. “He never gave a name. He paid in silver. That is all I know.”' },
        'Ansel says, “Someone, then, wants Cindervale to fall to *neither* of them, and for both to believe the other did it.” He sighs. “It is a very old kind of treachery. It usually ends in a very large war.”',
      ],
      next: 'night_hub',
    },
  } });
})();

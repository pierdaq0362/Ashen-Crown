/* Chapter Two, Seal track: "The Grey Hand". The Ember stayed dead; the war and the hunt for Lucan Vey drive the story. */
(function () {
  const AC = globalThis.AC;
  const ARRIVE = [{ if: 'path_loyalist', go: 'c2s_arrive_regent' }, { if: 'path_rebel', go: 'c2s_arrive_pale' }, { go: 'c2s_arrive_clans' }];

  AC.addTo('fantasy', { scenes: {
    c2s_open: {
      title: 'The Thaw', mood: 'snow',
      enter: [{ day: 30 }, { goal: 'Find out who the Grey Hand serves, and stop the war before it starts.' }, { chron: 'Chapter Two. Spring came to Cindervale, and with it the first riders from Highmere.' }],
      text: [
        'Spring reaches Cindervale a month late and does not stay long. The ash has stopped falling, but the Ember has not come back; the hearths burn small and the nights are very long. The dead lie quiet in their mounds. Nobody trusts it.',
        'Word from the south arrives in the mouths of peddlers. The Regent has called the lords to Highmere. The Duchess has called her banners to Greywater. Between them, the river road is filling with spears, and every rumour ends the same way: *by midsummer, one of them will march.*',
        { if: 'path_loyalist', t: 'Aldous Venn writes to you every week, a careful, bland, honest letter. His last one has a postscript, in a different ink: *Be careful of whom you trust at Highmere. I have begun to wonder about my own office.*' },
        { if: 'path_rebel', t: 'Sirene’s letters come by raven, short and courteous. Her last one reads: *The Duchess grows impatient. I find, to my surprise, that I do not.*' },
        { if: 'path_independent', t: 'Hettie’s messages come by hunters: always three words, always unsigned. The last was *Grey men. Road.*' },
        'Dunstan finds you on the wall at dawn with a face like a closed door. “The map,” he says. “The seal. I have not stopped thinking about it. Someone put a closed fist on a plan of *my walls*. That man is still out there, and so is whatever he wants.” He looks down the ridge road. “I think he is coming for the spark.”',
        { if: 'dunstan_son_read', t: '“My son wrote me again,” he adds, quietly. “*Please be careful of the Chamberlain. He has stopped sleeping.*”' },
      ],
      next: 'c2s_council',
    },
    c2s_council: {
      title: 'The Spring Council', mood: 'fire', council: 'ch2_seal',
      text: [
        'The council meets in the great hall again, but the table has a new leg now, and the garrison is bigger. Dunstan stands by the fire with his arms folded. Ansel has the lantern, as ever.',
        'You have three actions before whatever is coming arrives. The Grey Hand knows where you are. It is time to act like you know it too.',
      ],
    },

    c2s_evt_tobin: {
      title: 'A Rider from Highmere', mood: 'night',
      text: [
        { if: 'dunstan_son_read', t: 'A rider comes in at midnight on a foundered horse. It is **Tobin Garrow**, Dunstan’s son: a thin young clerk with ink on his cuffs and his father’s jaw. Dunstan meets him at the gate and does not say anything at all. They simply stand there for a while.' },
        { if: '!dunstan_son_read', t: 'A rider comes in at midnight on a foundered horse, a thin young clerk with ink on his cuffs and a familiar jaw. “Tobin Garrow,” he says. “Dunstan’s son. I wrote. He didn’t answer. I thought I had better come.” Dunstan, behind you, makes a small sound.' },
        '“The Quiet Office,” Tobin says, when he can speak. “That is what it is called inside. Lucan Vey has no title in the Regent’s ledger. He has a hundred men on no payroll, and a list. The list has your name on it. And the old Ember-priest’s.” He looks at Ansel. “They are coming for the spark. In a week, perhaps less.”',
      ],
      choices: [
        { t: 'Thank him, and give him a place by the fire.', fx: [{ trust: { dunstan: 1 } }, { set: 'c2_tobin_here' }, { chron: 'Tobin Garrow brought word that the Grey Hand was coming for Ansel.' }],
          reply: ['Dunstan will not meet his son’s eyes, and cannot stop looking at him. At supper he cuts his son’s bread without being asked. Tobin eats like a boy who has not been fed in a week.', 'Late that night you pass the kitchen and see them both at the table. Neither is speaking. It is, you suspect, the most honest conversation they have had in ten years.'], go: '@return' },
        { t: 'Question him closely. Could this be a trap?', fx: [{ trust: { dunstan: -1 } }, { set: 'c2_tobin_questioned' }],
          reply: ['Tobin answers every question. His voice shakes, but his answers do not change. Dunstan stands at the back of the room with his jaw set so hard you can hear it.', '“He is telling the truth,” Dunstan says after, in a voice like gravel. “I raised him badly, but I raised him not to lie.” He leaves. You have the sense that he has forgiven you and will not forget it.'], go: '@return' },
      ],
    },
    c2s_evt_regent: {
      title: 'A Summons from the Regent', mood: 'court',
      text: [
        'Captain Aldous Venn rides up the ridge in plain wool, with only two men. He bows stiffly and holds out a sealed letter.',
        '“Lord Thorne requests your presence at Highmere,” he says. “*Requests.* He is frightened, Warden. His own household is not telling him things. He has asked me to bring you in person, with the spark, to be kept safe.” He looks at the letter. “I do not think he knows what he is asking. I think someone in his office is *telling* him what to ask.”',
      ],
      choices: [
        { t: 'Tell Aldous about the Grey Hand’s seal.', fx: [{ set: 'c2_aldous_told' }, { chron: 'You told Captain Aldous about the closed-hand seal.' }],
          reply: ['Aldous goes very still. “A closed hand,” he says. “Grey wax.” He is silent for a long time. “Lucan Vey seals the Regent’s private papers. I had assumed—” He stops. “Warden. I will say this once: if the Chamberlain is selling the Regent’s secrets, I will not stand for it. Send word when you move. I will be at the gate.”'], go: '@return' },
        { t: 'Keep it to yourself for now.', fx: [{ set: 'c2_aldous_kept' }],
          reply: ['“As you wish,” says Aldous. You have a feeling he knows you are holding something back. “But if it is the kind of thing I should know before I do something stupid, I would like it before, not after.”'], go: '@return' },
      ],
    },
    c2s_evt_pale: {
      title: 'A Raven from the Duchess', mood: 'court',
      text: [
        'A raven lands on the north wall with a ribbon of white silk on its leg. The message is in Sirene’s square hand.',
        '*The Duchess has taken Greywater’s castle. The lords are coming over to her, one by one. She will march at midsummer. She has asked me to ask you: will Cindervale march with her, or will it simply not march against her?*',
        'Under it, smaller and faster: *I would prefer the second. I find myself hoping you will say so.*',
      ],
      choices: [
        { t: 'Promise that Cindervale will not march against her.', fx: [{ set: 'c2_neutral_pale' }, { trust: { kell: 1 } }],
          reply: ['You write the reply yourself, three lines, and send the raven off with it. Kell reads it over your shoulder and says, “You meant that.” “Yes,” you say. She nods slowly. “She will be pleased. She will also not forgive you if you are lying.”'], go: '@return' },
        { t: 'Refuse to commit either way.', fx: [{ set: 'c2_noncommittal' }],
          reply: ['The raven goes back with a note that says only *Cindervale is watching.* It is, you reflect, perfectly true. Ansel reads it and remarks mildly that he has seen better diplomacy from cats.'], go: '@return' },
      ],
    },
    c2s_evt_clans: {
      title: 'Hettie Rook’s Warning', mood: 'snow',
      text: [
        'Hettie Rook comes up the ridge herself this time, with Isolde’s cousin Bryn, a lanky hunter who has not yet learned to stand still. “Grey men,” Hettie says. “In the Greywood. Twenty or thirty. They walk like soldiers and dress like clerks. They have been seen at three of our hamlets, asking the way to the old Warden.”',
        '“We took one,” she adds. “He bit through his own tongue before he said a word. So we know they are serious, and we know they are afraid. That is a poor combination.”',
      ],
      choices: [
        { t: 'Ask Hettie to move the hamlets inside the keep’s walls.', cost: { grain: 1 }, fx: [{ res: { standing: 1 } }, { set: 'c2_clans_sheltered' }],
          reply: ['“Hm,” says Hettie. “That is generous.” She is quiet for a moment. “The clans do not like to be sheltered. But we like to be dead less.” Over three days, forty people and an alarming number of goats move into the lower court.', 'Isolde watches the goats with the expression of a woman who has seen her family come home and has not yet decided if she likes it.'], go: '@return' },
        { t: 'Ask the clans to set a watch on the Greywood roads.', fx: [{ set: 'c2_clans_watch' }],
          reply: ['“That we can do,” says Hettie. “It is what we are for.” Bryn grins, a little too widely, and runs off to tell his friends. By nightfall the Greywood has a hundred new eyes.'], go: '@return' },
      ],
    },

    /* ---------- the ford ---------- */
    c2s_ford_prelude: {
      title: 'Stonebridge', mood: 'fire',
      enter: [{ goal: 'Keep Ansel alive at Stonebridge Ford.' }],
      text: [
        'You do not wait. When the riders come, you are already at the ford, a day’s march south, with the river between you and the road to Highmere.',
        { if: 'c2_scouted_road', t: 'Isolde’s riders have been in the ditches for two nights. The Blades will not find their flank.' },
        { if: 'c2_barricade', t: 'Wagons and stakes choke the ford to a single lane.' },
        { if: 'path_loyalist', t: 'Aldous’s pikes hold the south bank.' },
        { if: 'path_rebel', t: 'A knight in white silk waits on the bank, and a pale archer beside her.' },
        { if: 'path_independent', t: 'The Marchers wait in the trees, silent as old stones.' },
        'The Grey Blades come out of the trees in good order, in grey coats and quiet shoes, without a banner. They move like men who have never once been loud.',
        'Ansel grips his lantern. “They want me,” he says, a little faintly. “I am afraid I am a very poor reason to fight a war.”',
        'Dunstan draws his sword. “You are an excellent reason,” he says. “Stand behind me.”',
      ],
      choices: [{ t: 'Hold the ford.', go: 'c2s_ford_battle' }],
    },
    c2s_ford_battle: { title: 'Stonebridge Ford', mood: 'fire', battle: 'ford', win: 'c2s_ford_win', lose: 'c2s_ford_lose', text: [] },

    c2s_ford_win: {
      title: 'The Ford Holds', mood: 'snow',
      enter: [{ res: { gold: 1 } }, { set: 'c2_ford_won' }, { chron: 'You held Stonebridge Ford against Lucan Vey’s Grey Blades.' }, { day: 1 }, { goal: 'Reach Highmere and unmask the Grey Hand.' }],
      text: [
        'The last Blade breaks off and runs for the trees. One, wounded, does not run fast enough. Isolde has him by the collar before he reaches the bank.',
        'He is young. Under the grey coat he wears a clerk’s ink-stained shirt, and he is trembling. “I will not say anything,” he says, with the fervour of a boy who has been told this is what a man does.',
        '“No one will make you,” Ansel says quietly, kneeling at his side with a water-skin. “But you are bleeding on my robes, and I am rather fond of them.”',
      ],
      choices: [
        { t: 'Threaten him. He knows where the Chamberlain is.', fx: [{ set: ['c2_know_tower', 'c2_blade_threatened'] }, { trust: { ansel: -1 } }],
          reply: ['It does not take long. He breaks before Dunstan has finished unsheathing the dagger, and tells you everything in a rush: the tower, the stair, the number of men. His eyes go to Ansel the whole time, as if waiting to be condemned.', 'Ansel does not look at you. “I would like to tend his wound,” he says, to the air. “If it is permitted.” It is. The silence on the road south is very long.'], go: 'c2s_road' },
        { t: 'Give him water, and ask him why he joined.', fx: [{ set: ['c2_know_tower', 'c2_blade_kind'] }, { trust: { ansel: 1 } }],
          reply: ['“They said it was for the Regent,” he says, after a long silence. “My mother was dying. They paid for the physician.” He stares at his hands. “It was not for the Regent, was it.” You tell him you do not think so. He tells you the rest anyway, haltingly: the tower, the stair, the men. He asks, at the end, if he will be hanged. You say no.', 'Ansel smiles at you across the fire. It is the kind of smile that does a man more good than a battle.'], go: 'c2s_road' },
        { t: 'Let him go, with a message for the Chamberlain.', fx: [{ set: ['c2_know_tower', 'c2_blade_freed'] }, { res: { standing: 1 } }],
          reply: ['“Tell Lucan Vey,” you say, “that the Warden of Cindervale is coming to talk.” The boy stares. Then he runs, and does not look back. Dunstan watches him go with an expression of weary admiration.', '“That was either very clever or very stupid,” he says. “I have not decided which.” By nightfall, on the road south, you find a note pinned to a tree: a map of the tower, in an unfamiliar clerk’s hand. *For my mother.*'], go: 'c2s_road' },
      ],
    },
    c2s_ford_lose: {
      title: 'The Ford Falls', mood: 'night',
      enter: [{ leave: 'ansel' }, { set: ['c2_ansel_taken', 'c2_know_tower'] }, { res: { standing: -1 } }, { chron: 'The Grey Blades took Ansel at Stonebridge Ford.' }, { day: 1 }, { goal: 'Rescue Ansel from Highmere.' }],
      text: [
        'The Blades are too quick. A grey coat slips through the line, and then another. Ansel is on the ground with a cloth over his mouth before you can reach him, and the lantern, still burning, is gone into the trees.',
        'Dunstan is on one knee with a gash in his thigh, shouting. Isolde brings down two of them from the bank and loses the third in the dark. When it is quiet, the ford is empty and the river is very loud.',
        'On the body of the only Blade you caught, a scrap of paper in a clerk’s hand: *Delivery to the tower at Highmere. Alive.*',
        'They did not kill him. That means they need him. That means you have time.',
      ],
      next: 'c2s_road',
    },

    c2s_road: {
      title: 'The Road to Highmere', mood: 'snow',
      enter: [{ day: 4 }],
      text: [
        'It takes four days to reach the river-city. The road is full: carts, pilgrims, refugees, and the soldiers of three armies who cannot decide which of them are going to shoot each other first.',
        { if: 'c2_ansel_taken', t: 'Dunstan does not say a word about Ansel. He simply rides at the front, with his mouth set and his hand very tight on his sword-hilt. You understand, now, how much of the keep’s heart that old man carried.' },
        { if: '!c2_ansel_taken', t: 'Ansel rides in the cart, swaddled in blankets, reading by the light of his lantern and annotating the margins of a stolen map. “I find that I am unreasonably cheerful,” he says. “It is deeply unseemly.”' },
        'Highmere appears on the horizon: a pale, many-towered city on a bend of the river, with the Winter Court at its heart and the Regent’s banner on every spire.',
      ],
      next: ARRIVE,
    },

    /* ---------- arriving: three roads in ---------- */
    c2s_arrive_regent: {
      title: 'Through the Regent’s Gate', mood: 'court',
      text: [
        'Aldous Venn is at the gate, as he said he would be, with two dozen pikes and a face like a man swallowing a bad oath. “I am to escort you,” he says. “To the Regent. I am also to forget that I saw you.”',
        'The Winter Court is strangely hushed. The great doors are open; the courtiers whisper behind their sleeves. At the high table sits Lord Regent Thorne, a tall grey man who has lost weight in a winter. At his elbow, in a plain grey coat and grey gloves, stands a man who smiles very politely.',
        'Lucan Vey. He bows to you with exquisite courtesy, and says, “Warden. What a pleasure.”',
        'Dunstan’s hand goes to his hilt. Aldous, very slightly, puts his own hand on Dunstan’s arm.',
      ],
      choices: [
        { t: 'Accuse him in front of the court.', need: { any: [{ res: 'standing', gte: 1 }, 'c2_aldous_told'] }, needText: 'The court will not hear an accusation from a stranger (Standing 1+, or tell Aldous first).', tip: 'The court’s men fight beside you. Vey is warned.', fx: [{ set: 'c2_accuse' }, { chron: 'You accused Lucan Vey before the Regent’s court.' }],
          reply: ['The court goes quiet. “Lord Regent,” you say, “your chamberlain sold our walls to both of your enemies. I have the seal.” You lay the map on the table. The grey wax gleams.', 'Thorne stares at the closed fist for a long moment. “Lucan,” he says, very slowly. Vey smiles. “A forgery, my lord.” But his gloved hand has begun, very slightly, to shake. Aldous’s pikes move a half-pace closer to the door.', '“Arrest him,” says the Regent, and Vey, with a sigh, turns and walks out through a side door, unhurried. The tower’s lamps come on, one by one.'], go: 'c2s_tower_prelude' },
        { t: 'Slip away in the confusion and take the back stair.', need: { any: ['c2_pass', 'c2_inside'] }, needText: 'You need a forged pass, or a friend inside (Tobin).', tip: 'Fewer guards. No allies.', fx: [{ set: 'c2_sneak' }],
          reply: ['It is easy, in the end. The pass opens a door that has been closed since the old king’s day. Aldous looks the other way. Tobin, if he is there, opens the postern with a key he is not supposed to have.', 'The back stair of the Chamberlain’s tower is cold and dark and smells of old paper. Somewhere above, a clock ticks. Dunstan unsheathes his sword with the care of a man cutting a letter open.'], go: 'c2s_tower_prelude' },
        { t: 'Bargain with Vey. Offer him something.', cost: { gold: 2 }, tip: 'He sends fewer men. He thinks you are tractable.', fx: [{ set: 'c2_bargain' }, { trust: { dunstan: -1 } }],
          reply: ['“I am a reasonable person,” you say, and let it hang. Vey’s smile widens by a hair. “Let us speak privately.” Over a glass of Regent’s wine, in a small room hung with maps, he is every inch the charming administrator. You learn nothing. He learns that you can be bought.', 'Dunstan, who has been standing in the doorway the whole time, says afterwards, “I hope you know what you are doing.” You hope so too.'], go: 'c2s_tower_prelude' },
        { t: 'Go in openly, with no plan beyond the stairs.', tip: 'No help, no tricks. Full guard.', fx: [{ set: 'c2_blunt' }, { trust: { dunstan: 1 } }],
          reply: ['“No tricks,” Dunstan says, with something close to relief. “I have always found that stairs are honest.” He checks his sword, and the company falls in behind him without a word.', 'It is not clever. It is, you think, the sort of plan Orrin would have understood.'], go: 'c2s_tower_prelude' },
      ],
    },
    c2s_arrive_pale: {
      title: 'Under the White Banner', mood: 'court',
      text: [
        'You do not go to the gate. Sirene meets you in a pavilion of white silk outside the city walls, in a ring of siege-lines that surround Highmere like a necklace of tents. She is tired, and, for a woman who is winning, unhappy.',
        '“The Duchess is not here,” she says. “She is in Greywater, resting. The siege is mine.” A pause. “I will not lie to you, Warden. The city will fall in a month. We have the Regent’s lords. I am not sure the Regent is even the problem.”',
        'She lowers her voice. “There is a man in the tower. A grey one. He has been feeding us information for a year: where the Regent’s troops are, where the grain is. I thought it was a defector. I have begun to think it is a *tool*.”',
        { if: 'kell_resolved', t: 'Kell, behind you, shifts uneasily. Sirene looks at her for a long moment, and says, softly, “You look well.” It is not an accusation. It is, almost, a relief.' },
      ],
      choices: [
        { t: 'Have Sirene’s knights storm the tower openly.', tip: 'Knights fight beside you. Vey is warned.', fx: [{ set: 'c2_accuse' }, { chron: 'You stormed the Chamberlain’s tower at the head of the Pale Banner’s knights.' }],
          reply: ['“Gladly,” says Sirene, with the simple relief of a woman who has been given something to do. Within the hour, forty knights in white and silver are in the streets of Highmere, and the Chamberlain’s lamps have gone out.', 'The Regent’s men do not resist. They do not seem to know where to stand.'], go: 'c2s_tower_prelude' },
        { t: 'Slip into the city and take the back stair.', need: { any: ['c2_pass', 'c2_inside'] }, needText: 'You need a forged pass, or a friend inside (Tobin).', tip: 'Fewer guards. No allies.', fx: [{ set: 'c2_sneak' }],
          reply: ['“Be careful,” Sirene says. “Whatever he is, he is not stupid.” The pass gets you through the Fish Gate. The back stair is dark, cold and smells of ink.', 'Dunstan goes first, with the quiet tread of a man who has spent thirty years on night-watches.'], go: 'c2s_tower_prelude' },
        { t: 'Offer Vey a bargain through Sirene.', cost: { gold: 2 }, tip: 'He sends fewer men. He thinks you are tractable.', fx: [{ set: 'c2_bargain' }],
          reply: ['Sirene carries the message herself. Vey replies within the hour: *A sensible Warden. Let us talk.* The reply is on grey paper. It is signed with a closed fist.', '“I do not like this,” Sirene says. “But I like even less that it has come to this.”'], go: 'c2s_tower_prelude' },
        { t: 'Go in openly, with no plan beyond the stairs.', tip: 'No help, no tricks. Full guard.', fx: [{ set: 'c2_blunt' }, { trust: { dunstan: 1 } }],
          reply: ['“No tricks,” Dunstan says, with something close to relief. “I have always found that stairs are honest.” He checks his sword, and the company falls in behind him without a word.', 'It is not clever. It is, you think, the sort of plan Orrin would have understood.'], go: 'c2s_tower_prelude' },
      ],
    },
    c2s_arrive_clans: {
      title: 'Under the River Gate', mood: 'night',
      text: [
        'The Marchers know a way into Highmere that is not on any map: a storm drain beneath the river wall, wide enough for a cart and low enough to bruise your head. Bryn leads, with a hooded lantern, whistling softly through his teeth.',
        'You emerge in a back-alley behind a baker’s shop, smelling of bread and old sewage. Hettie, who has come in with you, sniffs. “Civilisation,” she says, in the tone of a woman describing a disease.',
        'Isolde, in a long cloak, scouts the alley and returns. “The Chamberlain’s tower is three streets over. It has more guards than any building I have ever seen. Also, there is a very nice cat.”',
        { if: 'c2_tobin_here', t: 'Tobin Garrow has come too, pale and silent, and does not take his eyes off his father’s back.' },
      ],
      choices: [
        { t: 'Rouse the city’s people against the Chamberlain.', need: { res: 'standing', gte: 1 }, needText: 'The city’s people follow only a Warden they trust (Standing 1+).', tip: 'Crowds slow the guards. Vey is warned.', fx: [{ set: 'c2_accuse' }, { chron: 'You roused the people of Highmere against the Chamberlain.' }],
          reply: ['It begins with a baker. He has heard the rumours. He has seen the grey men on the streets at night. He says so loudly, in a very bad temper. By the time you reach the tower square, three hundred people have gathered, and they are not at all sure what they are angry at, only that it is the man in the tower.', 'Hettie watches the crowd with the grim approval of a woman who has always known that cities are more dangerous than forests.'], go: 'c2s_tower_prelude' },
        { t: 'Slip up the back stair with the Marchers.', need: { any: ['c2_pass', 'c2_inside'] }, needText: 'You need a forged pass, or a friend inside (Tobin).', tip: 'Fewer guards. Marchers climb the outside wall.', fx: [{ set: 'c2_sneak' }],
          reply: ['The Marchers go up the outside of the tower like squirrels, and you go up the back stair like a thief. Dunstan mutters about the indignity of it. Isolde, from somewhere above, whistles once, which means *clear*.'], go: 'c2s_tower_prelude' },
        { t: 'Send Vey an offer to talk.', cost: { gold: 2 }, tip: 'He sends fewer men. He thinks you are tractable.', fx: [{ set: 'c2_bargain' }],
          reply: ['The reply comes within the hour: a small grey card, with a closed fist embossed on one corner. *Delighted. Come at once.* Hettie reads it over your shoulder. “It is too polite,” she says. “Men who write like that kill you very slowly.”'], go: 'c2s_tower_prelude' },
        { t: 'Go in openly, with no plan beyond the stairs.', tip: 'No help, no tricks. Full guard.', fx: [{ set: 'c2_blunt' }, { trust: { dunstan: 1 } }],
          reply: ['“No tricks,” Dunstan says, with something close to relief. “I have always found that stairs are honest.” He checks his sword, and the company falls in behind him without a word.', 'It is not clever. It is, you think, the sort of plan Orrin would have understood.'], go: 'c2s_tower_prelude' },
      ],
    },

    /* ---------- the tower ---------- */
    c2s_tower_prelude: {
      title: 'The Chamberlain’s Tower', mood: 'vault',
      enter: [{ goal: 'Bring down Lucan Vey.' }],
      text: [
        'The tower stands over the Winter Court like a finger raised for silence. Its lamps burn grey. Its door is open. Nobody is guarding it, which is the most frightening thing about it.',
        { if: 'c2_ansel_taken', t: 'Ansel is in there. You can feel it, the way you can feel a missing tooth.' },
        { if: 'c2_sneak', t: 'You are coming in through the back stair, in the dark, and the man at the top does not know it yet.' },
        { if: 'c2_blunt', t: 'You are going up the front stair, in the open. It is, at least, honest.' },
        { if: 'c2_accuse', t: 'The man at the top knows you are coming. He has had time to prepare, and so have you.' },
        { if: 'c2_bargain', t: 'The man at the top thinks you have come to bargain. He has sent a very polite welcome, and a very small guard.' },
        'The stair goes up and up. Dunstan checks his sword once, exactly as he did at Cindervale. “Together,” he says. “Or not at all.”',
      ],
      choices: [{ t: 'Climb.', go: 'c2s_tower_battle' }],
    },
    c2s_tower_battle: { title: 'The Chamberlain’s Tower', mood: 'vault', battle: 'tower', win: 'c2s_vey', lose: 'c2s_tower_lose', text: [] },

    c2s_tower_lose: {
      title: 'The Tower Holds', mood: 'night',
      enter: [{ set: 'c2_vey_escaped' }, { res: { standing: -1, gold: -2 } }, { chron: 'The Chamberlain escaped; you fought your way out of Highmere.' }, { day: 1 }, { goal: 'Survive, and keep the spark away from the Grey Hand.' }],
      text: [
        'The Blades are too many, and the stair too narrow. You fight your way out through the kitchens, and the kitchens, by luck, have a door.',
        'Through the streets, over the wall, into the dark. Dunstan carries the wounded; Isolde carries Dunstan. Nobody speaks until you are three miles from the city.',
        'On the road south, Ansel, if he is with you, looks back at the pale towers. “He will use the spark,” he says. “If he has it. He will not be careful.”',
      ],
      next: 'c2s_epilogue',
    },

    c2s_vey: {
      title: 'The Man in Grey', mood: 'vault',
      enter: [{ join: 'ansel' }, { set: 'c2_vey_beaten' }, { chron: 'You broke the Grey Hand in the Chamberlain’s tower.' }, { day: 1 }, { goal: 'Decide what to do with Lucan Vey.' }],
      text: [
        'Lucan Vey sits against his own desk with a sword-cut across his ribs and his grey gloves in his lap. He looks, now, like a very tired civil servant who has been up all night.',
        { if: 'c2_ansel_taken', t: 'Ansel is in the next room, tied to a chair, wholly unharmed and extremely annoyed. “They would not let me read,” he says. “It was most unpleasant.” The lantern sits on the desk, still burning, still blue.' },
        '“You may as well hear it,” Vey says. “Since you won. Orrin made me. Thirty years ago, he called me into this room and told me his greatest fear: that someone would open the Vault. He did not want it guarded. Guards can be bribed. He wanted it *forgotten*. He wanted three powers in Aldmere who would never, ever agree on anything.”',
        '“So I made sure of it. I fed the Regent the Duchess’s plans. I fed the Duchess the Regent’s. I let the Marchers believe the Crown would burn them. Every time the three of them came close to a truce, I made it fail.” He laughs, without humour. “It was the most successful career in the history of the Crown. I never once saw a thank-you.”',
        '“And the walls?” Dunstan says, very quietly. “You sold the Duchess my walls.” “I tested them,” says Vey. “I wanted to know if the lid would hold. It did.” He looks at you. “It was a compliment, of a sort.”',
        '“As for the old man’s death,” he adds, more quietly, “you should know. Orrin did not simply die. He was dying already, a long time. In his last hour he put out the Ember himself. With his own hands, with the ring. He told me why, though I did not understand. *It calls,* he said. *It must stop calling.* And then he died, and the lamps went out.”',
        { if: 'dunstan_son', t: 'Dunstan has not taken his eyes off Vey. “My son,” he says. “You used him.” “I employed him,” says Vey. “He was very good. Better than you.”' },
      ],
      choices: [
        { t: 'Expose him to the Regent and the lords.', fx: [{ set: ['c2_quiet_office', 'c2_vey_exposed'] }, { res: { standing: 2 } }, { chron: 'You exposed the Quiet Office and its master.' }],
          reply: ['It takes all night. You drag Vey down to the Winter Court in his grey gloves and lay out the evidence in front of the Regent, the lords, and anyone who will listen: the forged letters, the double payrolls, the closed-hand seal. The Regent listens in silence, then asks, quietly, to be left alone.', 'In the morning, the news is in every street. For the first time in a year, Highmere’s three powers all agree on something: they have been played. The lords do not know who to hate. It is, in its way, a beginning.'], go: 'c2s_epilogue' },
        { t: 'Let Dunstan decide.', fx: [{ set: ['c2_quiet_office', 'c2_vey_dead'] }, { trust: { dunstan: 2 } }, { chron: 'Dunstan ended the Chamberlain, and the Quiet Office with him.' }],
          reply: ['Dunstan looks at Vey for a long time. “Thirty years,” he says. “You made my son a spy.” He draws his sword. Vey does not flinch. “Get on with it,” he says. It is done quickly. Dunstan wipes the blade on the Chamberlain’s own grey coat, and sheathes it, and says, to the room, “That is all.”', 'The Quiet Office dies with its master. It will take the court a year to notice what is missing.'], go: 'c2s_epilogue' },
        { t: 'Turn him. The Quiet Office is a weapon; it can be pointed.', fx: [{ set: ['c2_quiet_office', 'c2_vey_recruited'] }, { trust: { dunstan: -2, ansel: -1 } }, { chron: 'You spared Lucan Vey, and took the Quiet Office for yourself.' }],
          reply: ['Vey stares at you for a long moment. Then he laughs, genuinely, for the first time. “Orrin chose you well,” he says. “I should have seen it.” He holds out his gloved hand. You do not take it, but you do not refuse it either.', 'Dunstan leaves the room without a word. Ansel stays, and says, in a very small voice, “I hope you know what you are doing.” You say you do not, but that you will. He nods, and does not say anything more.'], go: 'c2s_epilogue' },
        { t: 'Let him walk away, with a warning.', fx: [{ set: ['c2_quiet_office', 'c2_vey_free'] }, { trust: { dunstan: -1 } }],
          reply: ['“The Quiet Office ends here,” you say. “If I see a grey glove anywhere in my country again, I will find you.” Vey bows. It is the most courteous thing you have ever seen. “Of course,” he says. He walks out of the door with the dignity of a man leaving a long-running play.', 'Dunstan says nothing. The silence in the room is very loud. “I would not have done that,” he says, finally. “But it is yours to do.”'], go: 'c2s_epilogue' },
      ],
    },

    c2s_epilogue: {
      title: 'What the Grey Hand Left', mood: 'night', end: true,
      enter: [{ chron: 'Chapter Two ended with the Grey Hand broken, and a new star over the north.' }, { goal: '' }, { set: 'ch2_seal_done' }],
      text: [
        'You leave Highmere before dawn. The river is high with spring melt, and the bells of three armies are ringing, each for different reasons.',
        { if: 'c2_vey_exposed', t: '**The Quiet Office is public.** The Regent has put his own house in arrest. The lords are quarrelling over who knew what. The war has not been called off, but it has been *delayed*, which is almost as good.' },
        { if: 'c2_vey_dead', t: '**The Chamberlain is dead.** No one will say who killed him. The Regent’s court is quieter than it has been in years, and all the clerks look nervous.' },
        { if: 'c2_vey_recruited', t: '**The Quiet Office is yours.** A hundred grey men who answer to a man who answers to you. It is a very large and very dangerous thing, and you do not yet know what to do with it.' },
        { if: 'c2_vey_free', t: '**Lucan Vey walked out of the city.** Nobody has seen him since. A closed hand in grey wax is not the only seal he knows how to forge.' },
        { if: 'c2_vey_escaped', t: '**Lucan Vey is still free.** The Quiet Office is intact, and has the spark’s location. You will have to find him again.' },
        { if: 'c2_ansel_taken', t: 'Ansel is back, and the lantern with him. He refuses to speak of what was done to him, only that he is “grateful, and a little tired.”' },
        { if: { all: ['dunstan_son', 'c2_tobin_here'] }, t: '**Tobin Garrow** has asked to come back to Cindervale. Dunstan has said yes, and then spent an hour pretending he had not.' },
        { if: { trust: 'dunstan', gte: 7 }, t: '**Dunstan** says, on the road north, “I have not served a king in a year. I find I do not miss it.” He is looking at you.' },
        { if: { trust: 'ansel', gte: 7 }, t: '**Ansel** has written all of it down. He has decided, he says, to call the book *The Quiet Years*.' },
        { if: { all: [{ has: 'isolde' }, { trust: 'isolde', gte: 7 }] }, t: '**Isolde** has not said anything about the city. She says, at the gate of Cindervale, “Walls,” with the tone of a woman who has had enough of them.' },
        { if: { all: [{ has: 'kell' }, { trust: 'kell', gte: 7 }] }, t: '**Kell** is quiet. “I did not know a place could be that afraid,” she says of Highmere. She stays close to you all the way home.' },
        '**What now?** The Grey Hand was a sentry, not a master. The Vault is still sealed. But Orrin put out the Ember because it *called*, and on the way home Ansel stops in the middle of the road, and looks north, and says, in a very small voice: “Look.”',
        'Above the northern horizon, in a patch of clear evening sky, there is a star that was not there before. It does not twinkle. It does not move. It is blue.',
        'Chapter Two ends here. The call was never stopped. Only muffled.',
      ],
    },
  } });
})();

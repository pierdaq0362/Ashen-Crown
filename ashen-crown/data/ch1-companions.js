/* Chapter One: conversations with the company. Opened from council actions; the council resumes afterwards.
 * Part 1 is open to everyone. Part 2 needs Trust 4 and pays off in the Vault counsel and the epilogue. */
(function () {
  const AC = globalThis.AC;

  AC.addTo('fantasy', { scenes: {
    /* ---------- Dunstan ---------- */
    talk_dunstan_1: {
      title: 'A Quiet Hour with Dunstan', mood: 'fire', enter: [{ set: 'talk_dunstan_1' }],
      text: [
        'You find Dunstan on the north wall in the last grey light, oiling a sword that is already clean. He does not stop when you arrive.',
        '“Eleven years,” he says. “They sent me here for telling the old king he was wrong about a border treaty. I thought it was a punishment. I stayed because nobody told me I could leave.”',
        'He holds the blade up to the light. “Do you know what I miss? Being asked my opinion by someone who might act on it.”',
      ],
      choices: [
        { t: '“Then I am asking. What would you do with Cindervale?”', fx: [{ trust: { dunstan: 2 } }, { set: 'dunstan_asked' }],
          reply: ['Dunstan turns, finally, and looks at you with the faint surprise of a man whose clock has been wrong for a decade. He talks for a quarter of an hour: the walls, the wells, the posterns, the blind corner by the east tower where a man with a rope could climb up unseen.', 'When he stops, he sounds almost embarrassed. “Eleven years of ideas,” he says. “Nobody asked.” He puts the sword away. “Thank you, Warden.”'], go: '@council' },
        { t: '“Why did the king exile you?”', fx: [{ trust: { dunstan: 1 } }],
          reply: ['“Orrin wanted a treaty that would have bled the Marchers dry,” Dunstan says. “I told him it would cost him the north in ten years. He said I was a sentimentalist.” A pause. “It has been eleven. The north is very nearly lost.”', 'He does not look pleased to have been right.'], go: '@council' },
        { t: 'Stand with him a while in silence.', fx: [{ trust: { dunstan: 1 } }],
          reply: ['You stand. The snow falls in the torchlight. Neither of you says anything for a long time, and the quiet is not uncomfortable.', '“Most wardens talk,” Dunstan says eventually. “It is good to find one who can stand.”'], go: '@council' },
      ],
    },
    talk_dunstan_2: {
      title: 'What Dunstan Kept', mood: 'night', enter: [{ set: 'talk_dunstan_2' }],
      text: [
        'Dunstan finds you at the end of the night, which is not like him. He has a small wrapped bundle in his hands, and his hands are not entirely steady.',
        '“I have a son,” he says. “Had. In Highmere. We have not spoken since I was sent north. He is a clerk now, in the chamberlain’s office. Lucan Vey’s office.”',
        'He sets the bundle on the table. Inside is a letter, unopened, with the closed-hand seal. “It came three weeks ago. I have not been able to read it.”',
      ],
      choices: [
        { t: '“Read it. Whatever it is, we will face it together.”', fx: [{ trust: { dunstan: 2 } }, { set: ['dunstan_son', 'dunstan_son_read'] }, { chron: 'Dunstan trusted you with the letter from his son.' }],
          reply: ['He breaks the seal. It is a short note in a clerk’s tidy hand: *Father. They are using my name on the Warden’s accounts. I cannot say more. Please be careful of the map.* There is a date, and a smudge where something was crossed out.', '“So it is Vey,” Dunstan says, hoarsely. “And my boy has been writing me warnings in a code I was too proud to open.” He folds the letter with great care. “I owe you a debt, Warden. I will pay it.”'], go: '@council' },
        { t: '“It is yours. Read it when you are ready.”', fx: [{ trust: { dunstan: 1 } }, { set: 'dunstan_son' }],
          reply: ['He nods, and takes the letter back, and puts it inside his coat. “Soon,” he says. “Not tonight.”', 'You have the feeling that he will read it soon, and that it will matter that you did not push.'], go: '@council' },
      ],
    },

    /* ---------- Ansel ---------- */
    talk_ansel_1: {
      title: 'Sitting with Brother Ansel', mood: 'night', enter: [{ set: 'talk_ansel_1' }],
      text: [
        'Ansel is in the chapel, surrounded by his lantern and a mountain of ledgers, reading by a light that does not flicker.',
        '“Warden. Do sit. I am an old man and I talk to the lantern when no one is by. It listens better than most.”',
        'He gestures at the ledgers. “Forty years in the archive. In all of it, I found one line that mattered. *The key will come when the Ember goes out.* A thing I wrote down in my second year. I did not understand it. I do now.”',
      ],
      choices: [
        { t: '“Tell me what you wrote, and why.”', fx: [{ trust: { ansel: 2 } }, { set: 'ansel_told' }],
          reply: ['“Orrin’s grandfather,” Ansel says, “told me a story when he was dying: he had not found the heart-stone. It had found *him*. It was the strangest thing: a warm stone in a crater, humming, and a voice in his head saying, in his own tongue, *keep me*.” He smiles faintly. “I thought he was senile. I wrote it down anyway. Forty years.”', 'He hands you the page. The ink has gone brown. In the margin, in his younger hand: *Who asked?*'], go: '@council' },
        { t: 'Ask about the lantern. How does it feel?', fx: [{ trust: { ansel: 1 } }],
          reply: ['“Warm,” says Ansel. “Like holding a living thing. It is not frightening. It is more like being *accompanied*.” He lifts it, gently. “I had thought, when I was a young man, that I would never be of use to anything. And here I am. A lantern-bearer.”', 'He laughs, a dry old-man laugh, and the flame dances, just a little, in time.'], go: '@council' },
        { t: 'Offer to read to him while he rests his eyes.', fx: [{ trust: { ansel: 1 } }],
          reply: ['“Oh,” says Ansel. “Oh, that would be a kindness.” You read from the ledger in your best archive voice, which is poor, and he corrects your Old Aldish gently and thoroughly until he falls asleep in the chair.', 'You leave a blanket over his knees. In the dark, the lantern keeps burning.'], go: '@council' },
      ],
    },
    talk_ansel_2: {
      title: 'What Ansel Took', mood: 'night', enter: [{ set: 'talk_ansel_2' }],
      text: [
        'Ansel is waiting for you in the chapel this time, standing, with his hands folded in front of him like a man about to confess.',
        '“I must tell you something,” he says. “And I would like you to hear all of it before you decide what to think.”',
        '“The night the king died, the spark did not simply *come* to me. I was at the Winter Court. I saw it go out in the heart-stone. And I took it.” He lifts the lantern. “I did not have permission. I slipped it into this, in the confusion, and fled north on a borrowed horse. I did not know why. I only knew it wanted to be carried.”',
        '“I am, in the plainest sense, a thief,” he says. “I thought you should know, before the Vault.”',
      ],
      choices: [
        { t: '“You saved it. That is not theft.”', fx: [{ trust: { ansel: 2 } }, { set: ['ansel_thief', 'ansel_forgiven'] }, { chron: 'Ansel confessed that he stole the spark from the Winter Court. You told him he had saved it.' }],
          reply: ['Ansel’s eyes are wet. “Forty years,” he says. “Forty years of being careful. And in one night I did the only reckless thing of my life, and it was the right one.” He laughs, shakily. “Thank you.”', '“I will carry it to the door,” he says. “And I will do whatever you decide, whatever it is.” The flame in the lantern leans toward you, just a little.'], go: '@council' },
        { t: '“Tell no one else. I will keep it.”', fx: [{ trust: { ansel: 1 } }, { set: 'ansel_thief' }],
          reply: ['“That is a heavy thing to carry for an old man’s sake,” Ansel says. “But I accept it.” He bows his head. “If the Regent’s people learn of it, they will not understand.”', 'You find you do not mind carrying it. It is a small price for a man who has given you forty years of lore.'], go: '@council' },
        { t: '“You should have told me at once.”', fx: [{ trust: { ansel: -1 } }, { set: 'ansel_thief' }],
          reply: ['Ansel nods slowly. “Yes. Yes, I should. You are right to be angry.” He lowers his head. “I was afraid you would take the lantern from me.”', 'It is a small honesty, and the silence afterwards is long. When he leaves, he walks like a man who has just put a heavy weight back on his shoulders.'], go: '@council' },
      ],
    },

    /* ---------- Isolde ---------- */
    talk_isolde_1: {
      title: 'A Walk on the Ridge', mood: 'snow', enter: [{ set: 'talk_isolde_1' }],
      text: [
        'Isolde is on the ridge above the keep, where the Greywood starts, checking a snare with the focus of someone who would very much like not to be interrupted.',
        '“You walk loud for a warden,” she says, without looking up. “I could hear you from the second bend.” She resets the snare. “What do you want?”',
      ],
      choices: [
        { t: '“To learn the wood from the person who knows it best.”', fx: [{ trust: { isolde: 2 } }, { set: 'isolde_taught' }],
          reply: ['“Hmph,” says Isolde. But she shows you: how to read a track in old snow, how to find a deer-run, where the wood goes quiet when something large is walking. She is a better teacher than she pretends to be, and a worse liar.', '“You’re not completely hopeless,” she says, at the end. It is the nicest thing she has said to you.'], go: '@council' },
        { t: '“Tell me about Lower Cinder.”', fx: [{ trust: { isolde: 1 } }],
          reply: ['“Nine chimneys,” Isolde says. “Six, now. The old Warden took the tax, and the Regent took the rest. My nan died in the winter of the third bad harvest, of the cough. The one that doesn’t clear.” She says it without self-pity. “That’s why I took the king’s deer. She wanted venison. I was nineteen.”', 'She resets the snare, harder than needed. “Don’t be sorry. Be useful.”'], go: '@council' },
        { t: 'Hand her a flask. “It is cold.”', fx: [{ trust: { isolde: 1 } }],
          reply: ['She looks at the flask, then at you, and takes a long pull. “Hm,” she says. “That’s the good stuff.” She hands it back, a little warmer. “You’re odd, for a warden.”', 'You walk back down together in comfortable silence.'], go: '@council' },
      ],
    },
    talk_isolde_2: {
      title: 'Isolde’s Promise', mood: 'night', enter: [{ set: 'talk_isolde_2' }],
      text: [
        'It is very late. Isolde sits on the wall with her feet over the drop, not drinking, not shooting, only watching the dark treeline.',
        '“My aunt,” she says, without turning. “Hettie. She is the elder of the clans. She sent word. When the barrows open, she wants me home. She wants me to fight with the Marchers, not with the Crown.” She looks at her hands. “I have to decide whether I belong to Cindervale or the wood.”',
        '“I promised my nan I would never serve a lord,” she says. “And here I am, serving one.”',
      ],
      choices: [
        { t: '“You serve no lord. You are here because you chose to be.”', fx: [{ trust: { isolde: 2 } }, { set: ['promised_isolde', 'isolde_free'] }, { chron: 'Isolde promised to stay at Cindervale, as a friend and not a servant.' }],
          reply: ['Isolde is silent for a long moment. Then she nods. “That’s the thing,” she says. “Nobody ever said it that way.” She swings her legs back over the wall. “I’ll stay. Not for you. For the wall. But I’ll stay.”', 'It is, you suspect, the nearest she gets to a vow.'], go: '@council' },
        { t: '“Go to your aunt. I will not stop you.”', fx: [{ trust: { isolde: 1 } }, { set: 'promised_isolde' }],
          reply: ['She looks at you, surprised. “You mean that.” It is not a question. “Hm. That’s rarer than you’d think.” She is quiet. “I’ll go if I have to. But I think I’ll wait until after the barrows.”', 'You do not know whether you have made a friend or a mistake. Perhaps they are the same.'], go: '@council' },
        { t: '“I need you here. I would not ask if I did not.”', fx: [{ trust: { isolde: 1 } }, { set: 'promised_isolde' }],
          reply: ['“That’s honest,” says Isolde. “I’ll give you that.” She hops down off the wall. “I don’t like being needed. But I like being lied to less.”', 'She walks away, and does not say whether she will stay.'], go: '@council' },
      ],
    },

    /* ---------- Kell ---------- */
    talk_kell_1: {
      title: 'Kell in the Cold Yard', mood: 'night', enter: [{ set: 'talk_kell_1' }],
      text: [
        'Kell is in the yard in the dark, sitting on a mounting-block with her hands held out in front of her. A very small flame is dancing in each palm, blue-white, unwavering.',
        'She closes her hands when she sees you. “Sorry. I do it when I can’t sleep. It helps.”',
        '“Does it hurt?” you ask. She considers that. “Not the fire. The *wanting*. Like being hungry for a thing you’ve never tasted.”',
      ],
      choices: [
        { t: 'Sit beside her. “Show me.”', fx: [{ trust: { kell: 2 } }, { set: 'kell_shown' }],
          reply: ['She hesitates. Then she opens her hands again, and the two small flames lean toward each other, like a pair of candles in a draught. “It’s the only thing I’m good at,” she says. “Everyone made me use it. I’d like to just look at it for a while.”', 'You look at it with her. It is, you realise, very beautiful.'], go: '@council' },
        { t: '“Who taught you to control it?”', fx: [{ trust: { kell: 1 } }],
          reply: ['“No one,” says Kell. “The Duchess’s mages tried. They kept saying I was *wasteful*. So I taught myself, in a cellar, with a bucket.” A faint, unwilling smile. “The bucket was a good teacher.”'], go: '@council' },
        { t: 'Bring her a blanket and leave her to it.', fx: [{ trust: { kell: 1 } }],
          reply: ['She takes the blanket without a word, and nods once, a little stiffly. When you glance back from the stair, she has wrapped it around her shoulders, and the flames in her hands have grown gentler.'], go: '@council' },
      ],
    },
    talk_kell_2: {
      title: 'What Kell Left Behind', mood: 'night', enter: [{ set: 'talk_kell_2' }],
      text: [
        'Kell finds you, which she has not done before. She is holding a small, ragged scrap of white cloth in her fist.',
        '“Sirene,” she says. “She was my captain. She was kind to me. She found me in a gutter in Greywater when I was fourteen and she gave me food and a bed and a *purpose*.” She uncurls her fingers. “And I attacked your gate because the Duchess told her to tell me to.”',
        '“I loved her. I think I still do. And I am afraid that if I see her again, I will go back.”',
      ],
      choices: [
        { t: '“You are not the same girl. You can say no.”', fx: [{ trust: { kell: 2 } }, { set: ['kell_sirene', 'kell_resolved'] }, { chron: 'Kell confided her fear of returning to Sirene, and you told her she could say no.' }],
          reply: ['Kell is silent for a long time. Then she tears the white cloth in half, slowly, and drops the pieces in the fire. “I can say no,” she says, to herself, as if testing the words. They hold.', '“Thank you,” she says. “I’ll tell her myself. When it matters.”'], go: '@council' },
        { t: '“If you go back, I will understand. But I would rather you stayed.”', fx: [{ trust: { kell: 1 } }, { set: 'kell_sirene' }],
          reply: ['“That’s not an answer,” says Kell. “But it’s an honest one.” She tucks the cloth back in her sleeve. “I’ll think about it.”', 'You have the sense that you have given her room to decide, and that the decision is still very open.'], go: '@council' },
        { t: 'Say nothing. Let her talk.', fx: [{ trust: { kell: 1 } }, { set: 'kell_sirene' }],
          reply: ['She talks for an hour. About Greywater, about the Duchess, about a hundred small kindnesses and a handful of terrible things. You do not interrupt. When she has finished, she looks at you, almost startled.', '“You didn’t tell me what to do,” she says. “Everyone tells me what to do.” It is, apparently, the best thing you could have done.'], go: '@council' },
      ],
    },
  } });
})();

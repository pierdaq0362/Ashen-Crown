/* The Ashen Crown — "Cold Orbit" (sci-fi prototype pack).
 *
 * Reached by touching the Veil-stone at the end of Chapter One (or by opening index.html?pack=scifi).
 * It reuses the same engine with a different set of resources, units and terrain.
 * Companions carry over by id (dunstan, ansel, isolde, kell), as echoes of themselves.
 */
(function () {
  const AC = (globalThis.AC = globalThis.AC || {});
  AC.packs = AC.packs || {};

  AC.packs.scifi = {
    id: 'scifi',
    title: 'The Ashen Crown: Cold Orbit',
    subtitle: 'Prototype — the Veil, crossed',
    start: 'wake',
    defaultTitle: 'Captain',

    resources: {
      power: { name: 'Power', icon: '🔋', start: 5 },
      rations: { name: 'Rations', icon: '🥫', start: 4 },
      crew: { name: 'Crew', icon: '🧑‍🚀', start: 3, max: 10 },
      trust: { name: 'Trust', icon: '🤝', start: 0, min: -5, max: 10 },
    },
    levy: { res: 'crew', unit: 'crew' },
    backgrounds: {},

    companions: {
      dunstan: { name: 'Dunstan Garrow', unit: 'sec', glyph: '🛡️', trust: 2, blurb: 'Security chief of Cindervale Station. Armoured, unmoved, and entirely familiar.' },
      ansel: { name: 'Ansel Wick', unit: 'medic', glyph: '🕯️', trust: 2, blurb: 'Systems archivist, old as the station’s first logs. His little blue lantern is a handheld reactor key.' },
      isolde: { name: 'Isolde Fenn', unit: 'scout', glyph: '🏹', trust: 1, blurb: 'Runner of the outer ducts. Carries a railbow she built herself.' },
      kell: { name: 'Kell Ashworth', unit: 'tech', glyph: '🔥', trust: 1, blurb: 'Reactor-burned engineer. The glow in her eyes is not a metaphor here.' },
    },

    terrain: {
      c: { name: 'Crate cover (+1 defence)', cost: 1, def: 1, cls: 't-ruin', glyph: '▤' },
    },

    units: {
      crew: { name: 'Crew Hand', glyph: '🧑‍🚀', hp: 10, atk: 4, def: 1, move: 3, desc: 'Station crew with a pulse rifle.' },
      sec: { name: 'Security Chief', glyph: '🛡️', hp: 22, atk: 6, def: 3, move: 3, skill: { name: 'Bulkhead Stance', kind: 'brace', power: 2, cooldown: 1, desc: '+2 defence until your next turn.' } },
      medic: { name: 'Systems Archivist', glyph: '🕯️', hp: 12, atk: 3, def: 0, move: 3, skill: { name: 'Mend', kind: 'heal', power: 6, range: [0, 2], cooldown: 1, desc: 'Heal an ally within 2 tiles.' } },
      scout: { name: 'Duct Runner', glyph: '🏹', hp: 13, atk: 6, def: 1, move: 4, range: [1, 2] },
      tech: { name: 'Reactor Engineer', glyph: '🔥', hp: 10, atk: 4, def: 0, move: 3, range: [1, 2], skill: { name: 'Arc Surge', kind: 'burst', power: 5, range: [2, 3], radius: 1, cooldown: 2, desc: 'Arc a surge at a tile 2–3 away; hits everything within 1.' } },
      drone: { name: 'Sentry Drone', glyph: '🛸', hp: 9, atk: 5, def: 1, move: 4, tags: ['flying'], desc: 'Flies over cover and barricades.' },
      turret: { name: 'Gun Turret', glyph: '🎯', hp: 12, atk: 6, def: 2, move: 0, range: [2, 3], ai: 'stand', desc: 'Bolted down. Shoots 2–3 tiles.' },
    },

    actions: {
      reroute: { name: 'Reroute Power to the Bulkheads', icon: '⚡', desc: 'A barricade of shielding blocks half the airlock.', cost: { power: 2 }, fx: [{ set: 'bulkheadsUp' }], result: 'Blast-shutters slam across half the airlock.' },
      scrounge: { name: 'Scrounge the Galley', icon: '🥫', desc: '+2 rations.', fx: [{ res: { rations: 2 } }], result: 'The galley still has sealed packs from before the long night.' },
      wake: { name: 'Wake a Cryo-Sleeper', icon: '🧊', desc: 'Costs 1 ration, adds 2 crew.', cost: { rations: 1 }, fx: [{ res: { crew: 2 } }], result: 'Two groggy figures stumble out of the dark pods.' },
      hack: { name: 'Hack the Sentry Network', icon: '💻', desc: 'Kell’s hands know this machine. The turret will not fire.', if: { has: 'kell' }, fx: [{ set: 'turretHacked' }], result: 'Kell lays her palm on a panel and the turret’s light goes dim.' },
    },

    councils: {
      station: { title: 'Station Briefing', ap: 2, actions: ['reroute', 'scrounge', 'wake', 'hack'], pool: [], then: 'airlock_prelude' },
    },

    battles: {
      airlock: {
        name: 'The Airlock Ring',
        intro: 'The station’s defence drones have not recognised you. Clear the airlock ring.',
        map: [
          '#########',
          '#.......#',
          '#.c...c.#',
          '#.......#',
          '#.c...c.#',
          '#.......#',
          '#########',
        ],
        start: [[4, 5], [3, 5], [5, 5], [2, 5], [6, 5], [4, 4], [3, 4], [5, 4]],
        roster: ['dunstan', 'ansel', 'isolde', 'kell'],
        maxLevies: 3,
        win: { type: 'rout' },
        units: [
          { type: 'turret', at: [4, 1] },
          { type: 'drone', at: [2, 1] }, { type: 'drone', at: [6, 1] }, { type: 'drone', at: [4, 2] },
        ],
        modifiers: [
          { if: 'bulkheadsUp', note: 'Blast-shutters narrow the approach.', do: [{ terrain: [3, 3, 'b'] }, { terrain: [5, 3, 'b'] }] },
          { if: 'turretHacked', note: 'The turret is dark.', do: [{ removeUnits: { type: 'turret', n: 1 } }] },
        ],
      },
    },

    codex: [],

    scenes: {
      wake: {
        title: 'Cold Orbit', mood: 'vault',
        enter: [{ chron: 'You crossed the Veil and woke aboard a dead station.' }],
        text: [
          'You wake on a floor of black glass. Above is a dome of stars, the wrong stars, and the air tastes of cold metal and old ash.',
          'A voice, flat and kind, speaks from everywhere at once. *HEARTFIRE RESERVE AT ZERO POINT THREE PERCENT. WELCOME BACK, CREW.*',
          { if: { has: 'dunstan' }, t: 'Dunstan is already on his feet in hull-grey armour, sword replaced by something that hums. He looks at you without surprise. “Warden,” he says, then corrects himself. “Captain.”' },
          { if: { has: 'ansel' }, t: 'Ansel’s lantern is a handheld reactor key. Its blue light is exactly the same.' },
          { if: { has: 'isolde' }, t: 'Isolde is already halfway up a service duct, grinning down at you. “Finally. Somewhere with a roof worth climbing.”' },
          { if: { has: 'kell' }, t: 'Kell puts her palm against the wall and the lights flicker on for her, as though the whole station recognised the burn in her eyes.' },
        ],
        choices: [{ t: 'Find out where you are.', go: 'bridge' }],
      },

      bridge: {
        title: 'The Heartfire', mood: 'vault',
        text: [
          'The station’s name, in a script you can somehow read, is CINDERVALE. It has been waiting for a very long time.',
          '“I am the Heartfire,” the voice says. “You called me the Ember. I called out, and your kingdom answered. I regret that it was not the crew.” A pause. “Defence drones do not recognise you. I can open the airlock ring, but they will not be gentle.”',
          'Power is at five percent. The galley may still have food. There are cryo-pods in the dark.',
        ],
        next: 'station_council',
      },
      station_council: {
        title: 'Station Briefing', mood: 'vault', council: 'station',
        text: ['You have time for two things before the airlock ring opens.'],
      },

      airlock_prelude: {
        title: 'The Airlock Ring', mood: 'vault',
        text: ['The ring door grinds open on a long hall with crates for cover and a ceiling full of dark glass. Somewhere above, small things are turning toward you.'],
        choices: [{ t: 'Advance.', go: 'airlock_battle' }],
      },
      airlock_battle: { title: 'The Airlock Ring', mood: 'vault', battle: 'airlock', win: 'station_win', lose: 'station_lose', text: [] },

      station_win: {
        title: 'Lights Up', mood: 'vault', end: true,
        enter: [{ chron: 'You cleared the airlock ring of Cindervale Station.' }],
        text: [
          'The last drone falls. One by one the dark panels along the hall begin to glow, and a map unfolds across the dome: a thousand stars, and one of them marked, patiently, in blue.',
          'The Heartfire speaks softly. “Thank you, Captain. We have a long way to go.”',
          'This is where the prototype ends. The world of the Ashen Crown continues here, in a different sky.',
        ],
      },
      station_lose: {
        title: 'Sleep', mood: 'night', end: true,
        text: ['The drones drive you back. The station sleeps again, and waits. It is very good at waiting.'],
      },
    },
  };
})();

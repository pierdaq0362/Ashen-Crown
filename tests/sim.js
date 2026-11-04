/* Playthrough fuzzer + balance sim: node tests/sim.js [runs]
 * Plays the whole game thousands of times through the real engine:
 *  - story choices are picked at random (or "smart": always spend council actions well),
 *  - battles are fought by the built-in AI on both sides (the player side uses the same heuristic).
 * Reports crashes, dead ends, scene coverage, ending split, and win-rates per battle.
 */
'use strict';
const path = require('path');
const root = path.join(__dirname, '..');
require('./load.js');
const AC = globalThis.AC, E = AC.Engine, B = AC.Battle;
const RUNS = +process.argv[2] || 1500;

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const SMART = {
  winter: ['fortify', 'muster', 'talk_dunstan', 'talk_ansel', 'talk_isolde', 'train', 'scout', 'feast'],
  barrow: ['consecrate', 'talk_ansel', 'talk_dunstan', 'talk_kell', 'talk_isolde', 'muster', 'scout_barrows', 'train', 'feast'],
  station: ['reroute', 'hack', 'wake', 'scrounge'],
};

// Simple goal-seeking for escort battles (the AI alone would just fight).
function bfs(bs, goal) {
  const d = new Map([[goal.join(','), 0]]), q = [goal];
  for (let i = 0; i < q.length; i++) {
    const [x, y] = q[i], c = d.get(x + ',' + y);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
      if (!B.inb(bs, nx, ny) || d.has(k) || B.terr(bs, nx, ny).block) continue;
      d.set(k, c + 1); q.push([nx, ny]);
    }
  }
  return d;
}
function escortStep(bs) {
  const w = bs.def.win;
  if (!w || w.type !== 'reach') return;
  const u = bs.units.find((x) => x.side === 'player' && x.role === w.unit);
  if (!u) return;
  const d = bfs(bs, w.tiles[0]);
  // A sensible escort: never step ahead of the front-most friendly fighter.
  const friends = bs.units.filter((x) => x !== u && x.side !== 'enemy').map((x) => d.get(x.x + ',' + x.y)).filter((v) => v != null);
  const front = friends.length ? Math.min(...friends) : 0;
  let best = null, bv = Infinity;
  for (const t of B.reach(bs, u).values()) {
    const v = d.get(t.x + ',' + t.y);
    if (v != null && v < bv && (v >= front || (t.x === u.x && t.y === u.y))) { bv = v; best = t; }
  }
  // Once the way is clear (the door is within reach), just go.
  for (const t of B.reach(bs, u).values()) if (t.x === w.tiles[0][0] && t.y === w.tiles[0][1]) best = t;
  if (best && (best.x !== u.x || best.y !== u.y)) B.move(bs, u, best.x, best.y);
  if (!bs.result) {
    const tg = B.attackTargets(bs, u).sort((a, b) => a.hp - b.hp)[0];
    if (tg && Math.random() < 0.5) B.attack(bs, u, tg); else B.wait(bs, u);
  }
}

function fight(S) {
  const bs = E.startBattle(S);
  let guard = 50;
  while (!bs.result && guard-- > 0) {
    escortStep(bs);
    if (!bs.result) B.runPhase(bs, 'player');
    if (bs.result) break;
    B.endPlayerTurn(bs); bs.phase = 'ally'; B.runPhase(bs, 'ally');
    if (bs.result) break;
    bs.phase = 'enemy'; B.runPhase(bs, 'enemy');
    if (bs.result) break;
    B.beginTurn(bs);
  }
  if (!bs.result) bs.result = { win: false, reason: 'timeout' };
  return bs;
}

function play(mode) {
  const S = E.newState(Math.random() < 0.02 ? 'scifi' : 'fantasy', 'Sim', { easy: !!process.env.EASY });
  const trail = [], battles = [];
  let steps = 0;
  while (steps++ < 900) {
    if (S.reply) { E.advance(S); continue; }
    const sc = E.scene(S);
    trail.push(S.pack + ':' + S.scene);
    if (S.battle) {
      const bs = fight(S);
      battles.push({ id: bs.id, win: bs.result.win, turns: bs.turn, reason: bs.result.reason, levies: bs.deployedLevies, mode, flags: S.flags });
      E.finishBattle(S, bs, bs.result.win);
      continue;
    }
    if (S.council) {
      const order = mode === 'smart' ? SMART[S.council.id] || [] : [];
      const acts = S.council.ap > 0 ? E.councilActions(S).filter((x) => x.enabled) : [];
      if (acts.length && !(mode === 'random' && Math.random() < 0.15)) {
        let a = null;
        for (const id of order) { a = acts.find((x) => x.id === id); if (a) break; }
        E.doAction(S, (a || pick(acts)).id);
        continue;
      }
      E.concludeCouncil(S);
      continue;
    }
    if (sc.end) return { S, trail, battles, ended: S.scene, steps };
    if (sc.choices) {
      const ch = E.choicesFor(S, sc).filter((x) => x.enabled);
      if (!ch.length) throw new Error('No enabled choices in ' + S.pack + ':' + S.scene);
      E.choose(S, pick(ch).i);
    } else if (sc.next !== undefined) E.advance(S);
    else throw new Error('Dead end at ' + S.pack + ':' + S.scene);
  }
  throw new Error('Run did not finish (loop?) — last scenes: ' + trail.slice(-6).join(' > '));
}

const stats = { fail: new Map(), endings: new Map(), seen: new Set(), battles: {} };
const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
for (let i = 0; i < RUNS; i++) {
  const mode = i % 2 ? 'smart' : 'random';
  try {
    const r = play(mode);
    bump(stats.endings, mode + ' → ' + r.ended);
    r.trail.forEach((t) => stats.seen.add(t));
    for (const b of r.battles) {
      const k = b.id + ' (' + b.mode + ')';
      const x = (stats.battles[k] = stats.battles[k] || { n: 0, w: 0, turns: 0, timeouts: 0 });
      x.n++; x.w += b.win ? 1 : 0; x.turns += b.turns; if (b.reason === 'timeout') x.timeouts++;
    }
  } catch (e) { bump(stats.fail, e.message); }
}

console.log(`\n=== ${RUNS} playthroughs ===`);
console.log('\nCrashes / dead ends:');
if (!stats.fail.size) console.log('  none');
for (const [m, n] of stats.fail) console.log(`  ${n}×  ${m}`);
console.log('\nEndings:');
for (const [k, n] of [...stats.endings].sort()) console.log(`  ${String(n).padStart(5)}  ${k}`);
console.log('\nBattle win-rate (AI plays your side; "smart" spends council actions well):');
for (const [k, x] of Object.entries(stats.battles).sort()) console.log(`  ${k.padEnd(20)} ${(100 * x.w / x.n).toFixed(0).padStart(3)}% win   avg ${(x.turns / x.n).toFixed(1)} turns   n=${x.n}${x.timeouts ? '   timeouts=' + x.timeouts : ''}`);
const missed = [];
for (const [pid, p] of Object.entries(AC.packs)) for (const id of Object.keys(p.scenes)) if (!stats.seen.has(pid + ':' + id)) missed.push(pid + ':' + id);
console.log('\nScenes never visited in these runs:', missed.length ? missed.join(', ') : 'none');
process.exit(stats.fail.size ? 1 : 0);

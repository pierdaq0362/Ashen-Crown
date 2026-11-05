/* Content validator: node tests/validate.js
 * Catches broken routes, bad conditions/effects, unknown units/resources, map problems
 * and unreachable scenes in every pack. Exit code 1 if anything is wrong.
 */
'use strict';
const path = require('path');
const root = path.join(__dirname, '..');
require('./load.js');
const AC = globalThis.AC, E = AC.Engine, B = AC.Battle;

let errors = 0, warns = 0;
const err = (m) => { errors++; console.log('ERROR   ' + m); };
const warn = (m) => { warns++; console.log('warning ' + m); };
const toArr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);

const FX_KEYS = ['res', 'set', 'unset', 'inc', 'trust', 'join', 'leave', 'chron', 'day', 'level', 'bg', 'travel', 'goal', 'when', 'then', 'else'];
const COND_KEYS = ['any', 'all', 'not', 'res', 'trust', 'n', 'has', 'visited', 'wounded', 'gte', 'gt', 'lte', 'lt', 'eq'];

const SHARED_SET = new Set(); // flags carry across packs (a fantasy flag can be tested in the sci-fi pack)
for (const [pid, p] of Object.entries(AC.packs)) {
  const where = (m) => `[${pid}] ${m}`;
  const setFlags = SHARED_SET, testedFlags = new Set(), edges = new Map();
  const edge = (from, to) => { if (!edges.has(from)) edges.set(from, new Set()); edges.get(from).add(to); };

  const checkCond = (c, ctx) => {
    if (c == null) return;
    if (typeof c === 'string') { testedFlags.add(c.replace(/^!/, '')); return; }
    if (Array.isArray(c)) return c.forEach((x) => checkCond(x, ctx));
    for (const k of Object.keys(c)) if (!COND_KEYS.includes(k)) err(where(`${ctx}: unknown condition key "${k}"`));
    if (c.any) c.any.forEach((x) => checkCond(x, ctx));
    if (c.all) c.all.forEach((x) => checkCond(x, ctx));
    if (c.not) checkCond(c.not, ctx);
    if (c.res && !p.resources[c.res]) err(where(`${ctx}: unknown resource "${c.res}" in condition`));
    if (c.trust && !p.companions[c.trust]) err(where(`${ctx}: unknown companion "${c.trust}" in condition`));
    if (c.has && !p.companions[c.has]) err(where(`${ctx}: unknown companion "${c.has}" in condition`));
    if (c.visited && !p.scenes[c.visited]) err(where(`${ctx}: unknown scene "${c.visited}" in condition`));
    if (c.wounded && !p.companions[c.wounded]) err(where(`${ctx}: unknown companion "${c.wounded}" in condition`));
    if (c.n) testedFlags.add(c.n);
  };

  const checkFx = (fx, ctx, from) => {
    for (const e of toArr(fx)) {
      for (const k of Object.keys(e)) if (!FX_KEYS.includes(k)) err(where(`${ctx}: unknown effect key "${k}"`));
      if (e.when !== undefined) { checkCond(e.when, ctx); checkFx(e.then, ctx, from); checkFx(e.else, ctx, from); continue; }
      if (e.res) for (const r of Object.keys(e.res)) if (!p.resources[r]) err(where(`${ctx}: unknown resource "${r}"`));
      toArr(e.set).forEach((f) => setFlags.add(f));
      if (e.inc) Object.keys(e.inc).forEach((f) => setFlags.add(f));
      if (e.trust) for (const id of Object.keys(e.trust)) if (!p.companions[id]) err(where(`${ctx}: unknown companion "${id}" in trust`));
      if (e.join && !p.companions[e.join]) err(where(`${ctx}: unknown companion "${e.join}" in join`));
      if (e.bg) { if (!p.backgrounds[e.bg]) err(where(`${ctx}: unknown background "${e.bg}"`)); else { setFlags.add('bg_' + e.bg); checkFx(p.backgrounds[e.bg].fx, ctx + ' (background)', from); } }
      if (e.travel) {
        const tp = AC.packs[e.travel.pack];
        if (!tp) err(where(`${ctx}: travel to unknown pack "${e.travel.pack}"`));
        else if (!tp.scenes[e.travel.scene]) err(where(`${ctx}: travel to unknown scene "${e.travel.scene}"`));
        else edge(from, e.travel.pack + ':' + e.travel.scene);
      }
    }
  };

  const route = (spec, ctx, from) => {
    if (spec === undefined) return;
    if (Array.isArray(spec)) { spec.forEach((r) => { checkCond(r.if, ctx); route(r.go, ctx, from); }); return; }
    if (spec === '@return' || spec === '@council') return;
    if (typeof spec !== 'string' || !p.scenes[spec]) { err(where(`${ctx}: route to unknown scene "${spec}"`)); return; }
    edge(from, pid + ':' + spec);
  };

  // ----- basics -----
  if (!p.scenes[p.start]) err(where(`start scene "${p.start}" missing`));
  for (const [id, u] of Object.entries(p.units)) for (const k of ['hp', 'atk', 'def', 'move']) if (typeof u[k] !== 'number') err(where(`unit ${id}: missing ${k}`));
  for (const [id, c] of Object.entries(p.companions)) if (!p.units[c.unit]) err(where(`companion ${id}: unknown unit "${c.unit}"`));
  if (p.levy && !p.units[p.levy.unit]) err(where(`levy unit "${p.levy.unit}" missing`));
  if (p.levy && !p.resources[p.levy.res]) err(where(`levy resource "${p.levy.res}" missing`));
  for (const [id, b] of Object.entries(p.backgrounds)) checkFx(b.fx, `background ${id}`, pid + ':?');

  // ----- actions & councils -----
  for (const [id, a] of Object.entries(p.actions)) {
    checkCond(a.if, `action ${id}`); checkCond(a.need, `action ${id}`); checkFx(a.fx, `action ${id}`, pid + ':?');
    if (a.go !== undefined) route(a.go, `action ${id}`, pid + ':?action:' + id);
    for (const r of Object.keys(a.cost || {})) if (!p.resources[r]) err(where(`action ${id}: unknown resource "${r}" in cost`));
  }
  for (const [id, c] of Object.entries(p.councils)) {
    for (const a of c.actions) if (!p.actions[a]) err(where(`council ${id}: unknown action "${a}"`));
    if (!p.scenes[c.then]) err(where(`council ${id}: "then" scene "${c.then}" missing`));
    for (const e of c.pool || []) { if (!p.scenes[e.scene]) err(where(`council ${id}: pool scene "${e.scene}" missing`)); checkCond(e.if, `council ${id} pool`); }
  }

  // ----- scenes -----
  for (const [id, sc] of Object.entries(p.scenes)) {
    const from = pid + ':' + id, ctx = `scene ${id}`;
    if (!sc.title) warn(where(`${ctx}: no title`));
    checkFx(sc.enter, ctx + ' enter', from);
    for (const t of toArr(sc.text)) {
      const txt = typeof t === 'string' ? t : t.t;
      if (typeof t !== 'string') checkCond(t.if, ctx + ' text');
      for (const m of String(txt).match(/\{[^}]*\}/g) || []) if (!['{name}', '{title}', '{day}'].includes(m)) err(where(`${ctx}: stray "${m}" in text`));
      if (/\*\*[^*]*$/.test(txt.replace(/\*\*[^*]*\*\*/g, ''))) warn(where(`${ctx}: unbalanced ** in text`));
    }
    const kinds = ['choices', 'next', 'battle', 'council', 'end'].filter((k) => sc[k] !== undefined);
    if (!kinds.length) err(where(`${ctx}: dead end (no choices, next, battle, council or end)`));
    if (sc.choices && !sc.choices.length) err(where(`${ctx}: empty choices`));
    route(sc.next, ctx + ' next', from);
    if (sc.battle) {
      if (!p.battles[sc.battle]) err(where(`${ctx}: unknown battle "${sc.battle}"`));
      if (!sc.win || !sc.lose) err(where(`${ctx}: battle scene needs win and lose`));
      route(sc.win, ctx + ' win', from); route(sc.lose, ctx + ' lose', from);
      setFlags.add('won_' + sc.battle); setFlags.add('lost_' + sc.battle);
    }
    if (sc.council) {
      if (!p.councils[sc.council]) err(where(`${ctx}: unknown council "${sc.council}"`));
      else { edge(from, pid + ':' + p.councils[sc.council].then); for (const e of p.councils[sc.council].pool || []) edge(from, pid + ':' + e.scene); for (const a of p.councils[sc.council].actions) edge(from, pid + ':?action:' + a); }
    }
    (sc.choices || []).forEach((c, i) => {
      const cc = `${ctx} choice ${i + 1}`;
      if (!c.t) err(where(`${cc}: no text`));
      checkCond(c.if, cc); checkCond(c.need, cc); checkFx(c.fx, cc, from); route(c.go, cc, from);
      if (c.go === undefined && !toArr(c.fx).some((e) => e.travel)) err(where(`${cc}: no "go" target`));
      if (c.reply !== undefined) {
        if (c.go === undefined) err(where(`${cc}: reply needs a go`));
        for (const t of toArr(c.reply)) if (typeof t !== 'string') checkCond(t.if, cc + ' reply');
      } else if ((toArr(c.fx).length || c.cost) && c.go !== undefined && !sc.battle && !/^(night_hub|vault_counsel)$/.test(id) && !/^(prologue)$/.test(id)) {
        const tgt = typeof c.go === 'string' ? c.go : null;
        const plain = tgt === null || tgt === '@return' || tgt === '@council' || ['stock'].includes(tgt);
        if (plain) warn(where(`${cc}: has effects but no reply (abrupt)`));
      }
      for (const r of Object.keys(c.cost || {})) if (!p.resources[r]) err(where(`${cc}: unknown resource "${r}" in cost`));
    });
  }

  // ----- battles -----
  for (const [id, b] of Object.entries(p.battles)) {
    const ctx = `battle ${id}`, h = b.map.length, w = b.map[0].length;
    b.map.forEach((r, i) => { if (r.length !== w) err(where(`${ctx}: row ${i} is ${r.length} wide, expected ${w}`)); });
    const terr = Object.assign({}, B.BASE_TERRAIN, p.terrain || {});
    b.map.forEach((r, y) => r.split('').forEach((ch, x) => { if (!terr[ch]) err(where(`${ctx}: unknown terrain "${ch}" at ${x},${y}`)); }));
    const spot = (pt, what, canFly) => {
      if (!pt || pt[0] < 0 || pt[1] < 0 || pt[0] >= w || pt[1] >= h) { err(where(`${ctx}: ${what} out of bounds ${JSON.stringify(pt)}`)); return; }
      const t = terr[b.map[pt[1]][pt[0]]];
      if (t && t.block && !canFly) err(where(`${ctx}: ${what} at ${pt} is on blocking terrain "${t.name}"`));
    };
    for (const s of b.start || []) spot(s, 'start tile');
    for (const c of b.roster || []) if (!p.companions[c]) err(where(`${ctx}: unknown roster companion "${c}"`));
    const checkSpec = (u, what) => { if (!p.units[u.type]) err(where(`${ctx}: ${what}: unknown unit "${u.type}"`)); spot(u.at, `${what} ${u.type}`, p.units[u.type] && (p.units[u.type].tags || []).includes('flying')); };
    (b.units || []).forEach((u) => checkSpec(u, 'unit'));
    (b.reinforcements || []).forEach((r) => { r.at.forEach((a) => spot(a, 'reinforcement point')); r.units.forEach((t) => { if (!p.units[t]) err(where(`${ctx}: reinforcement unit "${t}" unknown`)); }); });
    (b.modifiers || []).forEach((m, i) => {
      checkCond(m.if, `${ctx} modifier ${i + 1}`);
      for (const d of m.do || []) {
        for (const k of Object.keys(d)) if (!['addUnit', 'terrain', 'buff', 'removeUnits', 'reinforce', 'winTurns', 'dropWave'].includes(k)) err(where(`${ctx} modifier ${i + 1}: unknown key "${k}"`));
        if (d.addUnit) checkSpec(d.addUnit, `modifier ${i + 1} addUnit`);
        if (d.terrain) { spot([d.terrain[0], d.terrain[1]], 'terrain change', true); if (!terr[d.terrain[2]]) err(where(`${ctx}: modifier terrain "${d.terrain[2]}" unknown`)); }
        if (d.dropWave && !(b.reinforcements || []).some((r) => r.turn === d.dropWave)) warn(where(`${ctx}: dropWave ${d.dropWave} matches no reinforcement`));
      }
    });
    if (b.win && b.win.type === 'reach') (b.win.tiles || []).forEach((t) => spot(t, 'objective'));
    if (!['rout', 'survive', 'reach'].includes((b.win || { type: 'rout' }).type)) err(where(`${ctx}: unknown win type`));
  }

  // ----- flag bookkeeping -----
  for (const f of testedFlags) if (!setFlags.has(f)) warn(where(`flag "${f}" is tested but nothing ever sets it`));
  for (const f of setFlags) if (!testedFlags.has(f) && !/^(won_|lost_)/.test(f)) console.log(`note    [${pid}] flag "${f}" is set but never tested (fine for story memory)`);

  // ----- reachability (static) -----
  const seen = new Set(), q = [pid + ':' + p.start];
  while (q.length) { const n = q.pop(); if (seen.has(n)) continue; seen.add(n); for (const t of edges.get(n) || []) q.push(t); }
  for (const id of Object.keys(p.scenes)) if (!seen.has(pid + ':' + id)) warn(where(`scene "${id}" is not reachable from the start`));
}

// ----- every battle must build in plausible situations, with no stacked or walled-in units -----
function mkState(packId, flags, extra) {
  const p = AC.packs[packId];
  const s = { pack: packId, flags: Object.fromEntries((flags || []).map((f) => [f, true])), res: {}, party: {}, wounded: {}, level: 1, visited: {} };
  for (const [k, d] of Object.entries(p.resources)) s.res[k] = Math.max(d.start || 0, 6);
  for (const id of Object.keys(p.companions)) s.party[id] = { trust: 3 };
  return Object.assign(s, extra || {});
}
const scenarios = {
  fantasy: {
    gate: [[], ['fortified'], ['scoutedPass', 'wallsRepaired', 'trained'], ['fortified', 'scoutedPass', 'wallsRepaired', 'trained']],
    barrows: [['path_loyalist'], ['path_rebel', 'scoutedBarrows'], ['path_independent', 'clanLore', 'ritualPrepared'], ['path_loyalist', 'ritualPrepared', 'scoutedBarrows']],
    vault: [['ally_regent', 'enemy_pale'], ['enemy_regent'], ['ally_pale', 'enemy_regent'], ['enemy_pale'], ['ally_clans', 'enemy_both', 'clanPact'], ['ally_clans', 'enemy_pale', 'won_barrows']],
  },
  scifi: { airlock: [[], ['bulkheadsUp'], ['turretHacked', 'bulkheadsUp']] },
};
for (const [pid, battles] of Object.entries(scenarios)) {
  for (const [bid, list] of Object.entries(battles)) {
    for (const flags of list) {
      const label = `[${pid}] battle ${bid} with {${flags.join(', ')}}`;
      try {
        const s = mkState(pid, flags);
        s.res.standing = 4;
        const bs = B.create(AC.packs[pid], Object.assign({ id: bid }, AC.packs[pid].battles[bid]), s);
        const seen = new Map();
        for (const u of bs.units) {
          const k = u.x + ',' + u.y;
          if (seen.has(k)) err(`${label}: ${u.name} and ${seen.get(k)} share tile ${k}`);
          seen.set(k, u.name);
          if (B.terr(bs, u.x, u.y).block && !u.tags.includes('flying')) err(`${label}: ${u.name} stands on blocking terrain at ${k}`);
        }
        if (!bs.units.some((u) => u.side === 'player')) err(`${label}: no player units`);
        if (!bs.units.some((u) => u.side === 'enemy')) err(`${label}: no enemy units`);
      } catch (e) { err(`${label}: ${e.message}`); }
    }
  }
}

console.log(`\n${errors} error(s), ${warns} warning(s).`);
process.exit(errors ? 1 : 0);

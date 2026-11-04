/* The Ashen Crown — story + realm engine.
 * Pure game logic: no DOM. Works in the browser (window.AC.Engine) and Node (tests).
 *
 * A "pack" (see data/fantasy.js) is plain data: resources, units, companions, scenes,
 * councils, actions and battles. Swap the pack and the same engine runs a different world.
 */
(function () {
  'use strict';
  const AC = (globalThis.AC = globalThis.AC || {});
  AC.packs = AC.packs || {};
  // Chapters live in their own files: AC.addTo('fantasy', { scenes: {...}, battles: {...}, codex: [...] })
  AC.addTo = function (packId, part) {
    const p = AC.packs[packId];
    if (!p) throw new Error('addTo: unknown pack ' + packId);
    for (const [k, v] of Object.entries(part)) p[k] = Array.isArray(v) ? (p[k] || []).concat(v) : Object.assign(p[k] || {}, v);
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const toArr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
  const sign = (n) => (n > 0 ? '+' + n : '−' + Math.abs(n));
  const pack = (s) => AC.packs[s.pack];

  /* ---------- randomness (seeded, saved with the game) ---------- */
  function rand(s) {
    s.seed = (s.seed + 0x6d2b79f5) | 0;
    let t = Math.imul(s.seed ^ (s.seed >>> 15), 1 | s.seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /* ---------- conditions ----------
   * "flag"            flag is set
   * "!flag"           flag is not set
   * [a, b]            all of
   * {any:[..]} {all:[..]} {not:c}
   * {res:'gold', gte:2}   (also gt, lte, lt, eq)
   * {trust:'maren', gte:3}   {n:'counter', gte:2}   {has:'isolde'}   {visited:'scene'}   {wounded:'maren'}
   */
  function cmp(v, c) {
    if ('gte' in c && !(v >= c.gte)) return false;
    if ('gt' in c && !(v > c.gt)) return false;
    if ('lte' in c && !(v <= c.lte)) return false;
    if ('lt' in c && !(v < c.lt)) return false;
    if ('eq' in c && v !== c.eq) return false;
    return true;
  }
  function test(c, s) {
    if (c == null) return true;
    if (typeof c === 'string') return c[0] === '!' ? !s.flags[c.slice(1)] : !!s.flags[c];
    if (Array.isArray(c)) return c.every((x) => test(x, s));
    if (c.any) return c.any.some((x) => test(x, s));
    if (c.all) return c.all.every((x) => test(x, s));
    if (c.not) return !test(c.not, s);
    if (c.res) return cmp(s.res[c.res] || 0, c);
    if (c.trust) return cmp(s.party[c.trust] ? s.party[c.trust].trust : 0, c);
    if (c.n) return cmp(+s.flags[c.n] || 0, c);
    if (c.has) return !!s.party[c.has];
    if (c.visited) return !!s.visited[c.visited];
    if (c.wounded) return !!s.wounded[c.wounded];
    throw new Error('Bad condition: ' + JSON.stringify(c));
  }

  function fmt(str, s) {
    return String(str).replace(/\{(\w+)\}/g, (m, k) => (k === 'name' ? s.name : k === 'title' ? s.title : k === 'day' ? s.day : m));
  }

  /* ---------- effects ----------
   * {res:{gold:-2}} {set:'flag'|[..]} {unset:..} {inc:{counter:1}} {trust:{maren:1}}
   * {join:'isolde'} {leave:'isolde'} {chron:'text'} {day:2} {level:1} {bg:'soldier'}
   * {when:cond, then:[..], else:[..]} {travel:{pack:'scifi', scene:'wake'}}
   */
  function applyEffects(s, effects, out) {
    out = out || { changes: [], travel: null };
    const p = pack(s);
    for (const e of toArr(effects)) {
      if (e.when !== undefined) { applyEffects(s, test(e.when, s) ? e.then : e.else, out); continue; }
      if (e.res) for (const [r, v] of Object.entries(e.res)) {
        const d = p.resources[r]; if (!d) throw new Error('Unknown resource ' + r);
        const before = s.res[r] || 0, after = clamp(before + v, d.min == null ? 0 : d.min, d.max == null ? 99 : d.max);
        s.res[r] = after;
        if (after !== before) out.changes.push(d.icon + ' ' + d.name + ' ' + sign(after - before));
      }
      for (const f of toArr(e.set)) s.flags[f] = true;
      for (const f of toArr(e.unset)) delete s.flags[f];
      if (e.inc) for (const [k, v] of Object.entries(e.inc)) s.flags[k] = (+s.flags[k] || 0) + v;
      if (e.trust) for (const [id, v] of Object.entries(e.trust)) {
        const m = s.party[id]; if (!m) continue;
        const b = m.trust; m.trust = clamp(b + v, 0, 10);
        if (m.trust !== b) out.changes.push(p.companions[id].name + ' trusts you ' + sign(m.trust - b));
      }
      if (e.join) {
        const c = p.companions[e.join]; if (!c) throw new Error('Unknown companion ' + e.join);
        if (!s.party[e.join]) { s.party[e.join] = { trust: c.trust == null ? 1 : c.trust }; out.changes.push(c.name + ' joins your company'); }
      }
      if (e.leave && s.party[e.leave]) { delete s.party[e.leave]; out.changes.push(p.companions[e.leave].name + ' leaves'); }
      if (e.chron) s.chronicle.push({ day: s.day, text: fmt(e.chron, s) });
      if (e.day) s.day += e.day;
      if (e.goal !== undefined) s.goal = e.goal ? fmt(e.goal, s) : '';
      if (e.level) { s.level = clamp(s.level + e.level, 1, 6); out.changes.push('★ Your company grows stronger'); }
      if (e.bg) { const b = p.backgrounds[e.bg]; s.bg = e.bg; s.title = b.title; s.flags['bg_' + e.bg] = true; applyEffects(s, b.fx, out); }
      if (e.travel) out.travel = e.travel;
    }
    return out;
  }

  /* ---------- state ---------- */
  function newState(packId, name, opts) {
    const p = AC.packs[packId];
    if (!p) throw new Error('Unknown pack ' + packId);
    const s = {
      v: 2, easy: !!(opts && opts.easy), pack: packId, name: (name || '').trim() || 'Wanderer', bg: null, title: p.defaultTitle || 'Warden', day: 1,
      seed: (Date.now() & 0x7fffffff) ^ 0x5bd1e995, scene: null, res: {}, flags: {}, party: {}, wounded: {}, level: 1,
      chronicle: [], visited: {}, council: null, returnTo: null, queue: [], goal: '', reply: null, parked: null, battle: null, changes: [], reachedEnd: false,
    };
    for (const [k, d] of Object.entries(p.resources)) s.res[k] = d.start || 0;
    enterScene(s, p.start);
    return s;
  }

  function switchPack(s, packId) {
    const p = AC.packs[packId];
    if (!p) throw new Error('Unknown pack ' + packId);
    s.pack = packId; s.res = {};
    for (const [k, d] of Object.entries(p.resources)) s.res[k] = d.start || 0;
    s.wounded = {}; s.council = null; s.returnTo = null; s.title = p.defaultTitle || s.title;
    for (const id of Object.keys(s.party)) if (!p.companions[id]) delete s.party[id];
  }

  function enterScene(s, id) {
    const p = pack(s), sc = p.scenes[id];
    if (!sc) throw new Error('Unknown scene "' + id + '" in pack ' + s.pack);
    s.scene = id; s.visited[id] = (s.visited[id] || 0) + 1; s.changes = []; s.battle = null; s.council = null; s.reply = null;
    s.reachedEnd = !!sc.end;
    if (sc.enter) {
      const r = applyEffects(s, sc.enter);
      s.changes = r.changes;
      if (r.travel) { const pre = r.changes; switchPack(s, r.travel.pack); enterScene(s, r.travel.scene); s.changes = pre.concat(s.changes); return pack(s).scenes[s.scene]; }
    }
    if (sc.council) {
      if (s.parked && s.parked.scene === id) { s.council = s.parked; s.parked = null; } // back from a side scene
      else s.council = { id: sc.council, scene: id, ap: pack(s).councils[sc.council].ap || 2, used: {}, notes: [] };
    }
    if (sc.battle) s.battle = { id: sc.battle };
    return sc;
  }

  function route(s, spec) {
    if (Array.isArray(spec)) { const hit = spec.find((r) => test(r.if, s)); spec = hit ? hit.go : null; }
    if (spec === '@council') spec = s.parked ? s.parked.scene : null;
    if (spec === '@return') {
      if (s.queue && s.queue.length) spec = s.queue.shift();
      else { spec = s.returnTo; s.returnTo = null; }
    }
    if (!spec) throw new Error('Route resolved to nothing in scene ' + s.scene);
    return spec;
  }

  function scene(s) { return pack(s).scenes[s.scene]; }

  function paragraphs(s, sc) {
    return toArr(sc.text).filter((t) => typeof t === 'string' || test(t.if, s)).map((t) => fmt(typeof t === 'string' ? t : t.t, s));
  }

  function replyParagraphs(s) {
    return toArr(s.reply.text).filter((t) => typeof t === 'string' || test(t.if, s)).map((t) => fmt(typeof t === 'string' ? t : t.t, s));
  }

  function choicesFor(s, sc) {
    const p = pack(s);
    return (sc.choices || []).map((c, i) => ({ c, i })).filter(({ c }) => test(c.if, s)).map(({ c, i }) => {
      let enabled = true, reason = null;
      if (c.need && !test(c.need, s)) { enabled = false; reason = c.needText || 'Requirement not met'; }
      if (c.cost) for (const [r, v] of Object.entries(c.cost)) if ((s.res[r] || 0) < v) { enabled = false; reason = 'Needs ' + v + ' ' + p.resources[r].name; }
      return { c, i, enabled, reason, text: fmt(c.t, s) };
    });
  }

  function go(s, c, extra) {
    const fx = [];
    if (c.cost) fx.push({ res: Object.fromEntries(Object.entries(c.cost).map(([k, v]) => [k, -v])) });
    fx.push(...toArr(c.fx), ...toArr(extra));
    const r = applyEffects(s, fx);
    const pre = r.changes;
    if (r.travel) { switchPack(s, r.travel.pack); enterScene(s, r.travel.scene); }
    else if (c.reply !== undefined && c.go !== undefined) {
      // Aftermath: show the reply first, then continue to c.go when the player presses Continue.
      const sc = scene(s);
      s.reply = { title: c.replyTitle || sc.title, mood: sc.mood, text: toArr(c.reply), go: c.go };
      s.changes = pre;
      return;
    }
    else if (c.go !== undefined) enterScene(s, route(s, c.go));
    s.changes = pre.concat(s.changes);
  }

  function choose(s, i) {
    const sc = scene(s), ch = choicesFor(s, sc).find((x) => x.i === i);
    if (!ch || !ch.enabled) throw new Error('Choice not available');
    go(s, ch.c);
  }

  function advance(s) {
    if (s.reply) { const r = s.reply; s.reply = null; go(s, { go: r.go }); return; }
    const sc = scene(s);
    if (sc.next === undefined) throw new Error('Scene ' + s.scene + ' has no next');
    go(s, { go: sc.next });
  }

  /* ---------- council (realm management) ---------- */
  function councilDef(s) { return pack(s).councils[s.council.id]; }

  function councilActions(s) {
    const p = pack(s), c = councilDef(s);
    return c.actions.map((id) => {
      const a = p.actions[id];
      if (!test(a.if, s)) return null;
      let enabled = true, reason = null;
      if (a.need && !test(a.need, s)) { enabled = false; reason = a.needText || 'Requirement not met'; }
      if (s.council.ap <= 0) { enabled = false; reason = 'No actions left'; }
      if ((s.council.used[id] || 0) >= (a.max || 1)) { enabled = false; reason = 'Already done this council'; }
      if (a.cost) for (const [r, v] of Object.entries(a.cost)) if ((s.res[r] || 0) < v) { enabled = false; reason = 'Needs ' + v + ' ' + p.resources[r].name; }
      return { id, a, enabled, reason };
    }).filter(Boolean);
  }

  function doAction(s, id) {
    const x = councilActions(s).find((y) => y.id === id);
    if (!x || !x.enabled) throw new Error('Action not available');
    const a = x.a, fx = [];
    if (a.cost) fx.push({ res: Object.fromEntries(Object.entries(a.cost).map(([k, v]) => [k, -v])) });
    fx.push(...toArr(a.fx));
    const r = applyEffects(s, fx);
    s.council.ap--; s.council.used[id] = (s.council.used[id] || 0) + 1;
    s.council.notes.push(fmt(a.result || a.name, s));
    s.changes = r.changes;
    if (a.go !== undefined) { // a side scene (e.g. a conversation); the council resumes afterwards
      s.parked = s.council; s.council = null;
      enterScene(s, route(s, a.go));
      s.changes = r.changes.concat(s.changes);
    }
  }

  // Draw up to c.draws events: priority events first, then weighted-random from the rest.
  function drawEvents(s, c) {
    let pool = (c.pool || []).filter((e) => test(e.if, s) && !(e.once && s.visited[e.scene]));
    const out = [], n = c.draws || 1;
    for (const e of pool.filter((e) => e.priority)) if (out.length < n) out.push(e);
    pool = pool.filter((e) => !e.priority);
    while (out.length < n && pool.length) {
      const total = pool.reduce((a, e) => a + (e.weight || 1), 0);
      let r = rand(s) * total, pick = pool[pool.length - 1];
      for (const e of pool) { r -= e.weight || 1; if (r < 0) { pick = e; break; } }
      out.push(pick);
      pool = pool.filter((e) => e !== pick);
    }
    return out;
  }

  function concludeCouncil(s) {
    const c = councilDef(s), evs = drawEvents(s, c);
    if (!evs.length) { enterScene(s, c.then); return; }
    s.returnTo = c.then;
    s.queue = evs.slice(1).map((e) => e.scene);
    enterScene(s, evs[0].scene);
  }

  /* ---------- battles ---------- */
  function startBattle(s) {
    const p = pack(s), def = p.battles[s.battle.id];
    return AC.Battle.create(p, Object.assign({ id: s.battle.id }, def), s);
  }

  function finishBattle(s, bs, won, accept) {
    const p = pack(s), sc = scene(s), lv = p.levy;
    const changes = [];
    if (lv && bs.deployedLevies > 0) {
      const alive = bs.units.filter((u) => u.levy && u.side === 'player').length, lost = bs.deployedLevies - alive;
      if (lost > 0) { s.res[lv.res] = Math.max(0, s.res[lv.res] - lost); changes.push(lost + ' ' + p.resources[lv.res].name.toLowerCase() + ' lost'); }
    }
    s.wounded = {};
    for (const f of bs.fallen) if (f.cid && f.side === 'player') { s.wounded[f.cid] = true; changes.push(f.name + ' is wounded'); }
    s.flags[(won ? 'won_' : 'lost_') + bs.id] = true;
    if (won) s.level = clamp(s.level + 1, 1, 6);
    const next = won ? sc.win : sc.lose;
    if (!next) throw new Error('Scene ' + s.scene + ' has no ' + (won ? 'win' : 'lose') + ' target');
    enterScene(s, next);
    s.changes = changes.concat(s.changes);
  }

  /* ---------- journal helpers ---------- */
  function codex(s) { return (pack(s).codex || []).filter((c) => test(c.if, s)).map((c) => ({ title: c.title, text: fmt(c.text, s) })); }

  /* ---------- realm summary (resources with named tiers) ---------- */
  function tierOf(d, v) { let t = null; for (const x of d.tiers || []) if (v >= x.at) t = x; return t; }
  function realm(s) {
    return Object.entries(pack(s).resources).map(([k, d]) => ({ k, icon: d.icon, name: d.name, value: s.res[k] || 0, desc: d.desc || '', tier: tierOf(d, s.res[k] || 0) }));
  }

  /* ---------- save / load ---------- */
  const KEY = 'ashen-crown:';
  function storage() { try { return globalThis.localStorage || null; } catch (e) { return null; } }
  function save(slot, s) {
    const st = storage(); if (!st) return false;
    try { st.setItem(KEY + slot, JSON.stringify({ t: Date.now(), state: s })); return true; } catch (e) { return false; }
  }
  function peek(slot) {
    const st = storage(); if (!st) return null;
    try { const raw = st.getItem(KEY + slot); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
  }
  function validate(s) {
    if (!s || typeof s !== 'object' || s.v !== 2 || !AC.packs[s.pack] || !AC.packs[s.pack].scenes[s.scene]) return null;
    return s;
  }
  function load(slot) { const r = peek(slot); return r ? validate(r.state) : null; }
  function exportSave(s) { return JSON.stringify(s); }
  function importSave(text) { try { return validate(JSON.parse(text)); } catch (e) { return null; } }

  AC.Engine = {
    test, fmt, rand, applyEffects, newState, enterScene, scene, paragraphs, replyParagraphs, choicesFor, choose, advance, route,
    councilActions, doAction, concludeCouncil, realm, startBattle, finishBattle, codex, save, peek, load, exportSave, importSave,
  };
})();

/* The Ashen Crown — grid battle engine.
 * Pure game logic: no DOM. Works in the browser (window.AC.Battle) and Node (tests).
 * Deterministic: damage is fixed, so players can plan around the previews.
 */
(function () {
  'use strict';
  const AC = (globalThis.AC = globalThis.AC || {});

  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const K = (x, y) => x + ',' + y;
  const md = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  const team = (side) => (side === 'enemy' ? 'e' : 'p'); // player + ally vs enemy
  const hostile = (a, b) => team(a.side) !== team(b.side);

  const BASE_TERRAIN = {
    '.': { name: 'Open ground', cost: 1, def: 0, cls: 't-plain' },
    f: { name: 'Forest (+1 defence, slow)', cost: 2, def: 1, cls: 't-forest', glyph: '🌲' },
    '^': { name: 'High ground (+1 defence, slow)', cost: 2, def: 1, cls: 't-hill', glyph: '▲' },
    r: { name: 'Ruins (+1 defence)', cost: 1, def: 1, cls: 't-ruin', glyph: '▞' },
    ',': { name: 'Ash drift (slow)', cost: 2, def: 0, cls: 't-ash' },
    '#': { name: 'Wall', cost: 99, def: 0, block: true, cls: 't-wall' },
    '~': { name: 'Deep water', cost: 99, def: 0, block: true, cls: 't-water' },
    b: { name: 'Barricade', cost: 99, def: 0, block: true, cls: 't-barricade', glyph: '╫' },
    X: { name: 'Objective', cost: 1, def: 0, cls: 't-goal', glyph: '✦' },
    s: { name: 'Standing stone (blocks)', cost: 99, def: 0, block: true, cls: 't-stone', glyph: '▮' },
    a: { name: 'Altar (+1 defence)', cost: 1, def: 1, cls: 't-altar', glyph: '✶' },
  };

  function terr(bs, x, y) { return bs.terrain[bs.grid[y][x]] || bs.terrain['.']; }
  function inb(bs, x, y) { return x >= 0 && y >= 0 && x < bs.w && y < bs.h; }
  function unitAt(bs, x, y) { return bs.units.find((u) => u.x === x && u.y === y) || null; }
  function log(bs, text, cls) { bs.log.push({ turn: bs.turn, text, cls: cls || '' }); }
  function inRange(u, x, y, tx, ty) { const d = Math.abs(x - tx) + Math.abs(y - ty); return d >= u.range[0] && d <= u.range[1]; }

  /* ---------- creation ---------- */

  function makeUnit(bs, kind, side, x, y, o) {
    o = o || {};
    const t = bs.pack.units[kind];
    if (!t) throw new Error('Unknown unit type: ' + kind);
    const st = Object.assign({ hp: t.hp, atk: t.atk, def: t.def, move: t.move }, o.stats || {});
    const u = {
      uid: ++bs.uidN, kind, side, x, y,
      name: o.name || t.name, glyph: o.glyph || t.glyph || '?', desc: t.desc || '',
      maxHp: st.hp, hp: st.hp, atk: st.atk, def: st.def, move: st.move,
      range: (t.range || [1, 1]).slice(), tags: (t.tags || []).slice(), bonusVs: t.bonusVs || {},
      skill: t.skill ? Object.assign({}, t.skill) : null, cd: 0, brace: 0,
      moved: false, acted: false, prev: null, ai: o.ai || t.ai || 'aggressive',
      cid: o.cid || null, role: o.role || o.cid || null, levy: !!o.levy, immobile: false,
    };
    bs.units.push(u);
    return u;
  }

  function addSpec(bs, sp) {
    return makeUnit(bs, sp.type, sp.side || 'enemy', sp.at[0], sp.at[1], { name: sp.name, ai: sp.ai, role: sp.role, stats: sp.stats });
  }

  function applyMod(bs, d) {
    if (d.addUnit) addSpec(bs, d.addUnit);
    if (d.terrain) bs.grid[d.terrain[1]][d.terrain[0]] = d.terrain[2];
    if (d.buff) {
      for (const u of bs.units) {
        if (u.side !== d.buff.side || (d.buff.type && u.kind !== d.buff.type)) continue;
        for (const st of ['atk', 'def', 'move']) if (d.buff[st]) u[st] = Math.max(0, u[st] + d.buff[st]);
        if (d.buff.hp) { u.maxHp = Math.max(1, u.maxHp + d.buff.hp); u.hp = Math.max(1, Math.min(u.maxHp, u.hp + d.buff.hp)); }
      }
    }
    if (d.removeUnits) {
      let n = d.removeUnits.n || 1;
      bs.units = bs.units.filter((u) => {
        if (n > 0 && u.side === (d.removeUnits.side || 'enemy') && (!d.removeUnits.type || u.kind === d.removeUnits.type)) { n--; return false; }
        return true;
      });
    }
    if (d.reinforce) bs.pending.push(Object.assign({}, d.reinforce));
    if (d.winTurns) bs.winTurns += d.winTurns;
    if (d.dropWave) bs.pending = bs.pending.filter((r) => r.turn !== d.dropWave);
  }

  function create(pack, def, gs) {
    const rows = def.map, h = rows.length, w = rows[0].length;
    rows.forEach((r, i) => { if (r.length !== w) throw new Error('Battle ' + def.id + ': row ' + i + ' has width ' + r.length + ', expected ' + w); });
    const bs = {
      id: def.id, name: def.name, pack, def, w, h, grid: rows.map((r) => r.split('')),
      terrain: Object.assign({}, BASE_TERRAIN, pack.terrain || {}),
      units: [], fallen: [], uidN: 0, turn: 1, phase: 'player', log: [], notes: [], pending: [],
      result: null, winTurns: (def.win && def.win.turns) || 0, deployedLevies: 0,
    };
    bs.pending = (def.reinforcements || []).map((r) => Object.assign({}, r));

    const starts = (def.start || []).slice();
    const lb = Math.max(0, (gs.level || 1) - 1);
    for (const cid of (def.roster || []).filter((c) => gs.party[c])) {
      const c = pack.companions[cid], ut = pack.units[c.unit];
      const fixed = def.fixed && def.fixed[cid];
      const pos = fixed ? fixed.at : starts.shift();
      if (!pos) continue;
      const stats = { hp: ut.hp + 2 * lb, atk: ut.atk + (lb >= 2 ? 1 : 0), def: ut.def, move: ut.move };
      if (fixed && fixed.immobile) stats.move = 0;
      const u = makeUnit(bs, c.unit, 'player', pos[0], pos[1], { name: c.name, glyph: c.glyph, stats, cid });
      if (fixed && fixed.immobile) u.immobile = true;
      if (gs.wounded && gs.wounded[cid]) u.hp = Math.max(1, Math.ceil(u.maxHp * 0.6));
    }
    const lv = pack.levy;
    if (lv) {
      const n = Math.min(def.maxLevies == null ? 4 : def.maxLevies, gs.res[lv.res] || 0, starts.length);
      const bonus = lv.bonusFlag && gs.flags[lv.bonusFlag] ? lv.bonus || {} : {};
      const ut = pack.units[lv.unit];
      for (let i = 0; i < n; i++) {
        const pos = starts.shift();
        makeUnit(bs, lv.unit, 'player', pos[0], pos[1], { levy: true, stats: { hp: ut.hp + (bonus.hp || 0), atk: ut.atk + (bonus.atk || 0), def: ut.def, move: ut.move } });
      }
      bs.deployedLevies = n;
    }
    for (const sp of def.units || []) addSpec(bs, sp);
    for (const m of def.modifiers || []) {
      if (!AC.Engine.test(m.if, gs)) continue;
      if (m.note) bs.notes.push(m.note);
      for (const d of m.do || []) applyMod(bs, d);
    }
    if (gs.easy) { // Story mode: sturdier allies, softer enemies.
      for (const u of bs.units) {
        if (u.side === 'enemy') u.atk = Math.max(1, u.atk - 1);
        else { u.maxHp = Math.ceil(u.maxHp * 1.3); u.hp = Math.ceil(u.hp * 1.3); }
      }
    }
    log(bs, def.name + ' begins.', 'sys');
    return bs;
  }

  /* ---------- movement ---------- */

  function reach(bs, u) {
    const flying = u.tags.includes('flying');
    const best = new Map();
    const start = { x: u.x, y: u.y, cost: 0, prev: null };
    best.set(K(u.x, u.y), start);
    const q = [start];
    while (q.length) {
      q.sort((a, b) => a.cost - b.cost);
      const c = q.shift();
      if (c.cost > best.get(K(c.x, c.y)).cost) continue;
      for (const [dx, dy] of DIRS) {
        const nx = c.x + dx, ny = c.y + dy;
        if (!inb(bs, nx, ny)) continue;
        const t = terr(bs, nx, ny);
        if (t.block && !flying) continue;
        const occ = unitAt(bs, nx, ny);
        if (occ && hostile(u, occ)) continue;
        const nc = c.cost + (flying ? 1 : t.cost);
        if (nc > u.move) continue;
        const kk = K(nx, ny), old = best.get(kk);
        if (!old || nc < old.cost) { const n = { x: nx, y: ny, cost: nc, prev: c }; best.set(kk, n); q.push(n); }
      }
    }
    for (const [kk, v] of [...best]) { const occ = unitAt(bs, v.x, v.y); if (occ && occ !== u) best.delete(kk); }
    return best;
  }

  // BFS distance (in steps) from a set of source tiles, ignoring units.
  function distMap(bs, sources, u) {
    const flying = u.tags.includes('flying');
    const d = new Map();
    const q = [];
    for (const s of sources) { d.set(K(s.x, s.y), 0); q.push(s); }
    for (let i = 0; i < q.length; i++) {
      const c = q[i], cd = d.get(K(c.x, c.y));
      for (const [dx, dy] of DIRS) {
        const nx = c.x + dx, ny = c.y + dy;
        if (!inb(bs, nx, ny) || d.has(K(nx, ny))) continue;
        if (terr(bs, nx, ny).block && !flying) continue;
        d.set(K(nx, ny), cd + 1); q.push({ x: nx, y: ny });
      }
    }
    return d;
  }

  function move(bs, u, x, y) {
    if (bs.result || u.moved || u.acted) return null;
    const t = reach(bs, u).get(K(x, y));
    if (!t) return null;
    if (x === u.x && y === u.y) { u.moved = true; u.prev = null; return []; }
    const path = [];
    for (let n = t; n; n = n.prev) path.unshift({ x: n.x, y: n.y });
    const ev = { t: 'move', uid: u.uid, from: { x: u.x, y: u.y }, to: { x, y }, path };
    u.prev = { x: u.x, y: u.y };
    u.x = x; u.y = y; u.moved = true;
    checkEnd(bs);
    return [ev];
  }

  function undoMove(bs, u) {
    if (bs.result || !u.prev || u.acted) return false;
    u.x = u.prev.x; u.y = u.prev.y; u.prev = null; u.moved = false;
    return true;
  }

  /* ---------- combat ---------- */

  function damageFor(bs, a, ax, ay, d, dx, dy) {
    let atk = a.atk;
    const dist = Math.abs(ax - dx) + Math.abs(ay - dy);
    if (a.range[1] > 1 && dist === 1) atk -= 1; // point-blank is awkward for ranged units
    for (const tag of d.tags) if (a.bonusVs[tag]) atk += a.bonusVs[tag];
    return Math.max(1, atk - d.def - (terr(bs, dx, dy).def || 0) - (d.brace || 0));
  }

  function attackTargets(bs, u, x, y) {
    x = x == null ? u.x : x; y = y == null ? u.y : y;
    return bs.units.filter((t) => hostile(u, t) && inRange(u, x, y, t.x, t.y));
  }

  function preview(bs, a, d) {
    const dmg = damageFor(bs, a, a.x, a.y, d, d.x, d.y);
    const kill = dmg >= d.hp;
    let counter = 0;
    if (!kill && inRange(d, d.x, d.y, a.x, a.y)) counter = damageFor(bs, d, d.x, d.y, a, a.x, a.y);
    return { dmg, kill, counter, counterKills: counter >= a.hp };
  }

  function kill(bs, u) {
    bs.units = bs.units.filter((x) => x !== u);
    bs.fallen.push({ uid: u.uid, name: u.name, cid: u.cid, role: u.role, side: u.side, kind: u.kind, levy: u.levy });
  }

  function attack(bs, a, d) {
    if (bs.result || a.acted || !attackTargets(bs, a).includes(d)) return null;
    const dmg = damageFor(bs, a, a.x, a.y, d, d.x, d.y);
    d.hp -= dmg;
    const e = { t: 'attack', a: a.uid, d: d.uid, dmg, ax: a.x, ay: a.y, dx: d.x, dy: d.y };
    log(bs, a.name + ' strikes ' + d.name + ' for ' + dmg + '.', a.side);
    if (d.hp <= 0) { kill(bs, d); e.killed = true; log(bs, d.name + ' falls.', 'fall'); }
    else if (inRange(d, d.x, d.y, a.x, a.y)) {
      const c = damageFor(bs, d, d.x, d.y, a, a.x, a.y);
      a.hp -= c; e.counter = c;
      log(bs, d.name + ' strikes back for ' + c + '.', d.side);
      if (a.hp <= 0) { kill(bs, a); e.attackerKilled = true; log(bs, a.name + ' falls.', 'fall'); }
    }
    a.acted = true; a.moved = true; a.prev = null;
    checkEnd(bs);
    return [e];
  }

  /* ---------- skills ---------- */

  function skillReady(u) { return !!(u.skill && u.cd === 0 && !u.acted); }

  // Tiles a skill can be aimed at from the unit's current position.
  function skillTiles(bs, u, fx, fy) {
    fx = fx == null ? u.x : fx; fy = fy == null ? u.y : fy;
    const s = u.skill; if (!s || s.kind === 'brace') return [];
    const out = [], r = s.range || [1, 1];
    for (let y = 0; y < bs.h; y++) for (let x = 0; x < bs.w; x++) {
      const d = Math.abs(x - fx) + Math.abs(y - fy);
      if (d < r[0] || d > r[1]) continue;
      if (s.kind === 'heal') { const t = unitAt(bs, x, y); if (t && !hostile(u, t) && t.hp < t.maxHp) out.push({ x, y }); }
      else out.push({ x, y });
    }
    return out;
  }

  function burstHits(bs, u, tx, ty) {
    const rad = u.skill.radius == null ? 1 : u.skill.radius;
    return bs.units.filter((t) => hostile(u, t) && Math.abs(t.x - tx) + Math.abs(t.y - ty) <= rad);
  }

  function useSkill(bs, u, tx, ty) {
    if (bs.result || !skillReady(u)) return null;
    const s = u.skill, ev = { t: s.kind, a: u.uid, x: tx, y: ty };
    if (s.kind === 'brace') {
      u.brace = s.power; log(bs, u.name + ' braces (' + s.name + ').', u.side);
    } else if (s.kind === 'heal') {
      const t = unitAt(bs, tx, ty);
      if (!t || hostile(u, t) || !skillTiles(bs, u).some((p) => p.x === tx && p.y === ty)) return null;
      const amt = Math.min(s.power, t.maxHp - t.hp); t.hp += amt; ev.d = t.uid; ev.amt = amt;
      log(bs, u.name + ' mends ' + t.name + ' for ' + amt + '.', u.side);
    } else if (s.kind === 'burst') {
      if (!skillTiles(bs, u).some((p) => p.x === tx && p.y === ty)) return null;
      ev.hits = [];
      log(bs, u.name + ' unleashes ' + s.name + '!', u.side);
      for (const t of burstHits(bs, u, tx, ty)) {
        const dmg = Math.max(1, s.power - Math.floor(t.def / 2));
        t.hp -= dmg; const h = { d: t.uid, dmg, x: t.x, y: t.y };
        log(bs, t.name + ' takes ' + dmg + '.', u.side);
        if (t.hp <= 0) { h.killed = true; kill(bs, t); log(bs, t.name + ' falls.', 'fall'); }
        ev.hits.push(h);
      }
    } else return null;
    u.cd = (s.cooldown || 0) + 1; u.acted = true; u.moved = true; u.prev = null;
    checkEnd(bs);
    return [ev];
  }

  function wait(bs, u) { u.acted = true; u.moved = true; u.prev = null; checkEnd(bs); }

  /* ---------- turn flow ---------- */

  function nearest(u, list) { return list.length ? Math.min(...list.map((h) => md(u, h))) : 99; }

  function nextActor(bs, side) {
    const list = bs.units.filter((u) => u.side === side && !u.acted);
    if (!list.length) return null;
    const hs = bs.units.filter((h) => team(h.side) !== team(side));
    list.sort((a, b) => nearest(a, hs) - nearest(b, hs) || a.uid - b.uid);
    return list[0];
  }

  function runPhase(bs, side) {
    const ev = [];
    let u, guard = 80;
    while (!bs.result && guard-- > 0 && (u = nextActor(bs, side))) ev.push(...aiAct(bs, u));
    return ev;
  }

  function spawnWave(bs, r, ev) {
    if (r.note) log(bs, r.note, 'sys');
    r.units.forEach((type, i) => {
      const base = r.at[i % r.at.length];
      let pos = null;
      for (let rad = 0; rad < 6 && !pos; rad++) {
        for (let dy = -rad; dy <= rad && !pos; dy++) for (let dx = -rad; dx <= rad && !pos; dx++) {
          if (Math.abs(dx) + Math.abs(dy) !== rad) continue;
          const x = base[0] + dx, y = base[1] + dy;
          if (inb(bs, x, y) && !terr(bs, x, y).block && !unitAt(bs, x, y)) pos = [x, y];
        }
      }
      if (!pos) return;
      const u = makeUnit(bs, type, r.side || 'enemy', pos[0], pos[1], { ai: r.ai || 'aggressive' });
      u.acted = u.moved = false;
      ev.push({ t: 'spawn', uid: u.uid, x: pos[0], y: pos[1] });
    });
  }

  function beginTurn(bs) {
    const ev = [];
    if (bs.result) return ev;
    bs.turn++;
    for (const u of bs.units) { u.moved = u.acted = false; u.prev = null; u.brace = 0; if (u.cd > 0) u.cd--; }
    for (const r of bs.pending.filter((r) => r.turn === bs.turn)) spawnWave(bs, r, ev);
    bs.pending = bs.pending.filter((r) => r.turn > bs.turn);
    bs.phase = 'player';
    checkEnd(bs);
    if (!bs.result) log(bs, 'Turn ' + bs.turn + '.', 'sys');
    return ev;
  }

  function finish(bs, win, reason) {
    bs.result = { win, reason };
    bs.phase = win ? 'won' : 'lost';
    log(bs, reason, win ? 'win' : 'lose');
    return bs.result;
  }

  function checkEnd(bs) {
    if (bs.result) return bs.result;
    const d = bs.def, alive = (s) => bs.units.some((u) => u.side === s);
    if (!alive('player')) return finish(bs, false, 'Your company has fallen.');
    if (d.lose && d.lose.unitDies) {
      const f = bs.fallen.find((u) => u.role === d.lose.unitDies);
      if (f) return finish(bs, false, f.name + ' has fallen.');
    }
    if (d.lose && d.lose.turnLimit && bs.turn > d.lose.turnLimit) return finish(bs, false, 'Time has run out.');
    const w = d.win || { type: 'rout' };
    const clear = !alive('enemy') && bs.pending.length === 0;
    if (w.type === 'rout' && clear) return finish(bs, true, 'The field is yours.');
    if (w.type === 'survive') {
      if (bs.turn > bs.winTurns) return finish(bs, true, d.winText || 'You have held until the end.');
      if (clear) return finish(bs, true, 'Nothing left to fight — the line holds.');
    }
    if (w.type === 'reach') {
      const hit = bs.units.find((u) => u.side === 'player' && (!w.unit || u.role === w.unit) && w.tiles.some((t) => t[0] === u.x && t[1] === u.y));
      if (hit) return finish(bs, true, d.winText || hit.name + ' reaches the objective.');
    }
    return null;
  }

  function endPlayerTurn(bs) { if (!bs.result) bs.phase = 'ally'; }

  function objectiveText(bs) {
    const w = bs.def.win || { type: 'rout' };
    if (w.type === 'rout') return 'Defeat every enemy.';
    if (w.type === 'survive') return 'Survive until turn ' + (bs.winTurns + 1) + ' (now ' + Math.min(bs.turn, bs.winTurns + 1) + ').';
    if (w.type === 'reach') return (w.unit ? (bs.pack.companions[w.unit] || {}).name || w.unit : 'Any unit') + ' must reach the marked tile.';
    return '';
  }

  /* ---------- AI (used for enemies, allies — and for tests/sims) ---------- */

  function aiAct(bs, u) {
    const ev = [];
    const done = () => { u.acted = u.moved = true; return ev; };
    const hostiles = bs.units.filter((h) => hostile(u, h));
    const friends = bs.units.filter((f) => !hostile(u, f));
    if (!hostiles.length) return done();

    if (u.ai === 'hold' && !u.alerted) {
      if (hostiles.some((h) => md(u, h) <= u.move + u.range[1] + 1)) u.alerted = true; else return done();
    }
    const here = { x: u.x, y: u.y, cost: 0 };
    const tiles = u.ai === 'stand' ? [here] : [...reach(bs, u).values()];
    let best = null;
    const consider = (score, act) => { if (!best || score > best.score) best = { score, act }; };

    for (const t of tiles) {
      const defb = terr(bs, t.x, t.y).def || 0;
      for (const h of hostiles) {
        if (!inRange(u, t.x, t.y, h.x, h.y)) continue;
        const dmg = damageFor(bs, u, t.x, t.y, h, h.x, h.y), kills = dmg >= h.hp;
        let ctr = 0;
        if (!kills && inRange(h, h.x, h.y, t.x, t.y)) ctr = damageFor(bs, h, h.x, h.y, u, t.x, t.y);
        let s = dmg * 2 + (kills ? 10 : 0) + (h.skill ? 1.5 : 0) + (h.role === 'tamsin' ? 4 : 0) - ctr * 1.4 + defb * 1.2;
        if (u.range[1] > 1) s += (Math.abs(t.x - h.x) + Math.abs(t.y - h.y)) * 0.5;
        consider(s, { type: 'attack', t, h });
      }
      if (skillReady(u) && u.skill.kind === 'burst') {
        const r = u.skill.range || [1, 1], rad = u.skill.radius == null ? 1 : u.skill.radius;
        for (const c of hostiles) {
          const dc = Math.abs(t.x - c.x) + Math.abs(t.y - c.y);
          if (dc < r[0] || dc > r[1]) continue;
          let s = 1.5;
          for (const h of hostiles) if (Math.abs(h.x - c.x) + Math.abs(h.y - c.y) <= rad) {
            const dmg = Math.max(1, u.skill.power - Math.floor(h.def / 2));
            s += dmg * 2 + (dmg >= h.hp ? 10 : 0);
          }
          consider(s + defb * 1.2, { type: 'burst', t, x: c.x, y: c.y });
        }
      }
      if (skillReady(u) && u.skill.kind === 'heal') {
        const r = u.skill.range || [0, 1];
        for (const f of friends) {
          const miss = f.maxHp - f.hp, df = Math.abs(t.x - f.x) + Math.abs(t.y - f.y);
          if (miss < 3 || df < r[0] || df > r[1]) continue;
          consider(Math.min(u.skill.power, miss) * 2.2 + (f.hp <= f.maxHp / 2 ? 3 : 0), { type: 'heal', t, x: f.x, y: f.y });
        }
      }
    }

    const go = (t) => { if (t.x !== u.x || t.y !== u.y) { const m = move(bs, u, t.x, t.y); if (m) ev.push(...m); } };
    if (best) {
      const a = best.act;
      go(a.t);
      if (!bs.result) {
        if (a.type === 'attack') { const r = attack(bs, u, a.h); if (r) ev.push(...r); }
        else { const r = useSkill(bs, u, a.x, a.y); if (r) ev.push(...r); }
      }
      return done();
    }
    // Nothing to hit: advance toward the nearest hostile, keeping standoff distance if ranged.
    if (u.ai !== 'stand') {
      const dm = distMap(bs, hostiles.map((h) => ({ x: h.x, y: h.y })), u);
      let bt = null, bv = Infinity;
      for (const t of tiles) {
        const dv = dm.get(K(t.x, t.y));
        if (dv == null) continue;
        const v = Math.abs(dv - u.range[1]) * 10 - (terr(bs, t.x, t.y).def || 0);
        if (v < bv) { bv = v; bt = t; }
      }
      if (bt) go(bt);
    }
    return done();
  }

  AC.Battle = {
    create, reach, move, undoMove, attack, attackTargets, preview, skillReady, skillTiles, useSkill, burstHits,
    wait, nextActor, aiAct, runPhase, endPlayerTurn, beginTurn, checkEnd, objectiveText, terr, unitAt, hostile,
    inRange, inb, K, md, BASE_TERRAIN,
  };
})();

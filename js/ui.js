/* The Ashen Crown — UI.
 * Only DOM and input live here. All rules are in engine.js (story/realm) and battle.js (grid combat).
 */
(function () {
  'use strict';
  const AC = window.AC, E = AC.Engine, B = AC.Battle;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const app = $('#app'), modal = $('#modal'), toastEl = $('#toast');
  const params = new URLSearchParams(location.search);
  const PACK = AC.packs[params.get('pack')] ? params.get('pack') : 'fantasy';
  const K = B.K;

  let S = null;   // story state (saved)
  let BS = null;  // live battle (not saved; a saved game restarts the battle)
  const fresh = () => ({ sel: null, target: null, inspect: null, mode: 'idle', aim: null, busy: false, intro: false, units: new Map(), tileEls: [], built: null });
  const ui = Object.assign(fresh(), { fast: false });

  /* ---------- helpers ---------- */
  let toastTimer = 0;
  function toast(msg, bad) {
    toastEl.textContent = msg; toastEl.className = 'on' + (bad ? ' bad' : '');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { toastEl.className = ''; }, 2600);
  }
  function fail(e) { console.error(e); ui.busy = false; toast('Something went wrong: ' + (e && e.message ? e.message : e), true); }
  const pack = () => AC.packs[S ? S.pack : PACK];
  const pips = (n) => Array.from({ length: 10 }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
  const costText = (cost) => Object.entries(cost || {}).map(([r, v]) => pack().resources[r].icon + ' ' + v).join('  ');

  function commit(opts) {
    if (S) {
      const ok = E.save('auto', S);
      if (S.battle) E.save('battle', S);
      if (!ok && !ui.warnedSave) { ui.warnedSave = true; toast('This browser is not keeping saves. Use Menu, then Export save, to keep your progress.', true); }
    }
    const y = opts && opts.keep ? window.scrollY : 0;
    render();
    window.scrollTo(0, y);
  }

  function hud() {
    const p = pack();
    const res = Object.entries(p.resources).map(([k, d]) => `<span class="res" title="${esc(d.name)}"><i>${d.icon}</i><b>${S.res[k] || 0}</b><small>${esc(d.name)}</small></span>`).join('');
    return `<header class="hud"><div class="brand">${esc(p.title)}</div><div class="resbar">${res}</div>
      <div class="hudbtns"><span class="day">Day ${S.day}</span><button data-act="journal">Journal</button><button data-act="menu">Menu</button></div></header>`;
  }

  /* ---------- screens ---------- */
  function render() {
    document.body.dataset.pack = S ? S.pack : PACK;
    if (!S) { document.body.dataset.mood = 'night'; return renderTitle(); }
    const sc = E.scene(S);
    document.body.dataset.mood = sc.mood || 'night';
    if (S.battle) return renderBattle();
    BS = null;
    if (S.council) return renderCouncil(sc);
    return renderScene(sc);
  }

  function renderTitle() {
    const p = AC.packs[PACK], has = !!E.peek('auto');
    app.innerHTML = `<main class="title">
      <h1>${esc(p.title)}</h1><p class="sub">${esc(p.subtitle || '')}</p><div class="flame"></div>
      <p class="blurb">${esc(p.blurb || 'The Ember is out and the dead are walking. You hold a ruined keep and a dying king’s last order. What you decide between battles shapes who stands beside you in them.')}</p>
      <label>Your name<input id="pname" maxlength="20" placeholder="Wanderer" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="easy"><span><b>Story mode</b>Sturdier allies and softer enemies in battle.</span></label>
      <div class="stack">
        <button class="btn primary" data-act="new">New game</button>
        ${has ? '<button class="btn" data-act="continue">Continue</button>' : ''}
        <button class="btn quiet" data-act="menu">Load or import a save</button>
        <button class="btn quiet" data-act="help">How to play</button>
      </div>
      <small>Saves stay in this browser.</small></main>`;
  }

  function changesHtml() {
    if (!S.changes || !S.changes.length) return '';
    return '<div class="changes">' + S.changes.map((c) => `<span class="${/\+\d/.test(c) || /joins/.test(c) || /grows/.test(c) ? 'up' : /−\d|lost|wounded|leaves/.test(c) ? 'down' : ''}">${esc(c)}</span>`).join('') + '</div>';
  }

  function stageHead(sc) {
    return `<div class="when">Day ${S.day}</div><h2>${esc(sc.title || '')}</h2>`;
  }
  function proseHtml(sc) {
    return '<div class="prose">' + E.paragraphs(S, sc).map((t) => `<p>${rich(t)}</p>`).join('') + '</div>';
  }

  function renderScene(sc) {
    let foot = '';
    if (sc.end) foot = endPanel();
    else if (sc.choices) {
      foot = '<div class="choices">' + E.choicesFor(S, sc).map((x) => {
        const cost = x.c.cost ? `<span class="cost">Costs ${costText(x.c.cost)}</span>` : '';
        const tip = x.c.tip ? `<span class="tip">${esc(x.c.tip)}</span>` : '';
        const why = !x.enabled && x.reason ? `<span class="why">${esc(x.reason)}</span>` : '';
        return `<button class="choice" data-act="choose" data-i="${x.i}" ${x.enabled ? '' : 'disabled'}>${rich(x.text)}${cost}${tip}${why}</button>`;
      }).join('') + '</div>';
    } else if (sc.next !== undefined) foot = '<div class="choices"><button class="choice go" data-act="next">Continue</button></div>';
    app.innerHTML = hud() + `<main class="stage">${stageHead(sc)}${changesHtml()}${proseHtml(sc)}${foot}</main>`;
  }

  function endPanel() {
    const chron = S.chronicle.map((c) => `<li><b>Day ${c.day}</b>${esc(c.text)}</li>`).join('');
    return `<div class="theend"><h3>The chronicle so far</h3><ul class="chron">${chron}</ul>
      <div class="row">${E.peek('battle') ? '<button class="btn primary" data-act="loadSlot" data-slot="battle">Retry the last battle</button>' : ''}
      <button class="btn" data-act="title">Back to title</button></div></div>`;
  }

  function renderCouncil(sc) {
    const c = pack().councils[S.council.id], acts = E.councilActions(S);
    const ap = Array.from({ length: c.ap || 2 }, (_, i) => `<i class="${i < S.council.ap ? 'on' : ''}"></i>`).join('');
    const cards = acts.map((x) => `<button class="action" data-act="action" data-id="${x.id}" ${x.enabled ? '' : 'disabled'}>
        <span class="ai">${x.a.icon}</span><span class="an">${esc(x.a.name)}</span><span class="ad">${esc(x.a.desc)}</span>
        ${x.a.cost ? `<span class="cost">Costs ${costText(x.a.cost)}</span>` : ''}${!x.enabled && x.reason ? `<span class="why">${esc(x.reason)}</span>` : ''}</button>`).join('');
    const done = S.council.notes.length ? '<ul class="done">' + S.council.notes.map((n) => `<li>${esc(n)}</li>`).join('') + '</ul>' : '';
    app.innerHTML = hud() + `<main class="stage">${stageHead(sc)}${proseHtml(sc)}${changesHtml()}
      <div class="ap">${ap}<span>${S.council.ap} of ${c.ap || 2} actions left</span></div>
      <div class="actions">${cards}</div>${done}
      <div class="choices"><button class="choice go" data-act="conclude">${S.council.ap > 0 ? 'End the council (unused actions are lost)' : 'End the council'}</button></div></main>`;
  }

  /* ---------- journal, menu, help ---------- */
  function showModal(html) {
    modal.innerHTML = `<div class="overlay" data-act="closeBg"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`;
    const first = modal.querySelector('button, textarea'); if (first) first.focus();
  }
  function closeModal() { modal.innerHTML = ''; }

  function openJournal(tab) {
    tab = tab || 'company';
    const p = pack();
    let body = '';
    if (tab === 'company') {
      body = Object.entries(S.party).map(([id, m]) => {
        const c = p.companions[id];
        return `<div class="member"><span class="g">${c.glyph}</span><div><b>${esc(c.name)}</b><span class="pips" title="Trust ${m.trust}/10">${pips(m.trust)}</span></div>
          <div class="meta">${esc(p.units[c.unit].name)}${S.wounded[id] ? ' · wounded' : ''}</div><p>${esc(c.blurb)}</p></div>`;
      }).join('') || '<p>No companions yet.</p>';
    } else if (tab === 'chronicle') {
      body = S.chronicle.length ? '<ul class="chron">' + S.chronicle.map((c) => `<li><b>Day ${c.day}</b>${esc(c.text)}</li>`).join('') + '</ul>' : '<p>Nothing recorded yet.</p>';
    } else {
      const items = E.codex(S);
      body = items.length ? '<dl class="codex">' + items.map((c) => `<dt>${esc(c.title)}</dt><dd>${esc(c.text)}</dd>`).join('') + '</dl>' : '<p>Nothing learned yet.</p>';
    }
    const t = (id, label) => `<button data-act="tab" data-tab="${id}" aria-selected="${tab === id}">${label}</button>`;
    showModal(`<h2>Journal</h2><div class="tabs">${t('company', 'Company')}${t('chronicle', 'Chronicle')}${t('codex', 'Codex')}</div>${body}
      <div class="row" style="margin-top:18px"><button class="btn" data-act="closeModal">Close</button></div>`);
  }

  function slotInfo(id) {
    const r = E.peek(id), st = r && r.state, pk = st && AC.packs[st.pack], sc = pk && pk.scenes[st.scene];
    return sc ? { when: new Date(r.t).toLocaleString(), text: `${sc.title} · Day ${st.day}` } : null;
  }
  function openMenu() {
    const slots = [['auto', 'Autosave', false], ['battle', 'Before the last battle', false], ['1', 'Slot 1', true], ['2', 'Slot 2', true], ['3', 'Slot 3', true]];
    const rows = slots.map(([id, label, canSave]) => {
      const i = slotInfo(id);
      return `<div class="slot"><div class="si"><b>${label}</b>${i ? esc(i.text) + ' · ' + esc(i.when) : 'Empty'}</div>
        <div class="row">${i ? `<button class="btn" data-act="loadSlot" data-slot="${id}">Load</button>` : ''}${canSave && S ? `<button class="btn" data-act="saveSlot" data-slot="${id}">Save</button>` : ''}</div></div>`;
    }).join('');
    showModal(`<h2>Menu</h2>${rows}
      <p class="si" style="font:0.82rem var(--ui);color:var(--ash-faint);margin-top:10px">The game saves automatically at every step. A save made during a battle restarts that battle.</p>
      <div class="row" style="margin-top:12px">
        ${S ? '<button class="btn" data-act="export">Export save</button>' : ''}<button class="btn" data-act="importBox">Import save</button>
        <button class="btn" data-act="help">How to play</button>${S ? '<button class="btn" data-act="title">Back to title</button>' : ''}<button class="btn quiet" data-act="closeModal">Close</button></div>`);
  }
  function openHelp() {
    showModal(`<h2>How to play</h2>
      <h3>Story</h3><p>Read, then choose. Choices change your resources, who trusts you, and which battles you face. The Journal shows your company, what has happened, and what you have learned.</p>
      <h3>Council</h3><p>Between battles you get two actions. Spend gold, grain and levies where they matter: what you prepare shows up in the next fight.</p>
      <h3>Battle</h3><ul class="tips">
        <li>Click one of your blue units, then a lit tile to move it.</li>
        <li>Click a red-lit enemy to preview the hit, then click it again (or press Attack) to strike. Enemies strike back unless they fall.</li>
        <li>Click an enemy with nothing selected to see how far it can reach next turn.</li>
        <li>Forest, hills, ruins and the altar give +1 defence. Archers hit 2 tiles away but lose 1 damage point-blank.</li>
        <li>Skills (Mend, Shield Wall, Cinderburst) have cooldowns. Press End turn when you are done; you do not have to move everyone.</li>
        <li>Lose a fight and you can retry it, or accept the defeat and let the story go on.</li></ul>
      <div class="row" style="margin-top:16px"><button class="btn" data-act="closeModal">Close</button></div>`);
  }

  /* ---------- battle: build ---------- */
  function renderBattle() {
    if (!BS) { BS = E.startBattle(S); Object.assign(ui, fresh()); ui.intro = true; }
    if (ui.built !== BS) buildBattle();
    refresh();
    if (ui.intro) showIntro();
  }

  function buildBattle() {
    ui.built = BS; ui.units = new Map();
    app.innerHTML = hud() + `<main class="battle">
      <div class="bhead"><div><h2>${esc(BS.name)}</h2></div><div class="obj" id="obj"></div></div>
      <div class="bmain">
        <div class="boardwrap" id="boardwrap"><div class="board" id="board" style="--w:${BS.w};--h:${BS.h}"><div class="tiles" id="tiles"></div><div class="ulayer" id="ulayer"></div></div></div>
        <aside class="side"><div id="info"></div><div class="acts" id="acts"></div><div class="log" id="log"></div></aside>
      </div></main>
      <div class="bfoot"><button class="btn quiet speed" data-act="speed" id="speed"></button><span id="phase"></span><button class="btn primary" id="endturn" data-act="endturn">End turn</button></div>
      <div id="overlay"></div>`;
    let html = '';
    for (let y = 0; y < BS.h; y++) for (let x = 0; x < BS.w; x++) {
      const t = B.terr(BS, x, y);
      html += `<div class="tile ${t.cls}" data-x="${x}" data-y="${y}">${t.glyph ? `<span>${t.glyph}</span>` : ''}</div>`;
    }
    $('#tiles').innerHTML = html;
    ui.tileEls = [...$('#tiles').children];
    const board = $('#board');
    board.addEventListener('click', onBoardClick);
    board.addEventListener('mouseover', onBoardOver);
    board.addEventListener('mouseleave', () => markAoe(null));
    sizeBoard();
  }

  function sizeBoard() {
    const board = $('#board'), wrap = $('#boardwrap');
    if (!board || !BS) return;
    const w = Math.min((wrap && wrap.clientWidth) || 9999, document.documentElement.clientWidth - 32), h = window.innerHeight - 200;
    const cell = Math.max(26, Math.min(64, Math.floor(Math.min(w / BS.w, h / BS.h))));
    board.style.setProperty('--cell', cell + 'px');
  }

  function showIntro() {
    const notes = BS.notes.length ? '<ul class="notes">' + BS.notes.map((n) => `<li>${esc(n)}</li>`).join('') + '</ul>' : '';
    $('#overlay').innerHTML = `<div class="overlay"><div class="sheet"><h2>${esc(BS.name)}</h2><p>${esc(BS.def.intro || '')}</p>${notes}
      <p style="margin-top:12px"><strong>Objective:</strong> ${esc(B.objectiveText(BS))}</p>
      <div class="row" style="margin-top:16px"><button class="btn primary" data-act="begin">Begin the battle</button><button class="btn quiet" data-act="help">How to fight</button></div></div></div>`;
  }

  /* ---------- battle: draw ---------- */
  function refresh() {
    if (!BS || ui.built !== BS) return;
    updateUnits(); updateTiles(); updatePanels();
  }

  function updateUnits() {
    const layer = $('#ulayer'), alive = new Set(BS.units.map((u) => u.uid));
    for (const [uid, el] of ui.units) if (!alive.has(uid)) { el.classList.add('gone'); ui.units.delete(uid); setTimeout(() => el.remove(), 450); }
    for (const u of BS.units) {
      let el = ui.units.get(u.uid), isNew = false;
      if (!el) {
        el = document.createElement('div'); isNew = true;
        el.innerHTML = '<div class="tok"></div><div class="hp"><i></i></div><span class="n"></span>';
        el.querySelector('.tok').textContent = u.glyph;
        el.style.setProperty('--x', u.x); el.style.setProperty('--y', u.y);
        ui.units.set(u.uid, el);
      }
      el.className = 'unit ' + u.side + (u.acted && u.side === 'player' && BS.phase === 'player' ? ' acted' : '') + (ui.sel === u ? ' sel' : '');
      el.style.setProperty('--x', u.x); el.style.setProperty('--y', u.y);
      const pct = Math.max(0, (u.hp / u.maxHp) * 100);
      el.querySelector('.hp i').style.width = pct + '%';
      el.querySelector('.hp').classList.toggle('low', pct <= 35);
      el.querySelector('.n').textContent = u.hp;
      if (isNew) layer.appendChild(el);
    }
  }

  function highlights() {
    const hl = { mv: new Set(), atk: new Set(), skill: new Set(), threat: new Set(), sel: null };
    const u = ui.sel;
    if (u && BS.units.includes(u) && BS.phase === 'player' && !BS.result) {
      hl.sel = K(u.x, u.y);
      if (ui.mode === 'skill') for (const t of B.skillTiles(BS, u)) hl.skill.add(K(t.x, t.y));
      else {
        if (!u.moved && !u.acted) for (const t of B.reach(BS, u).values()) if (t.x !== u.x || t.y !== u.y) hl.mv.add(K(t.x, t.y));
        if (!u.acted) for (const t of B.attackTargets(BS, u)) hl.atk.add(K(t.x, t.y));
      }
    }
    const e = ui.inspect;
    if (e && e !== u && BS.units.includes(e)) {
      for (const r of B.reach(BS, e).values()) {
        for (let y = 0; y < BS.h; y++) for (let x = 0; x < BS.w; x++) if (B.inRange(e, r.x, r.y, x, y)) hl.threat.add(K(x, y));
        hl.threat.add(K(r.x, r.y));
      }
    }
    return hl;
  }

  function updateTiles() {
    const hl = highlights();
    for (let y = 0; y < BS.h; y++) for (let x = 0; x < BS.w; x++) {
      const el = ui.tileEls[y * BS.w + x], k = K(x, y), t = B.terr(BS, x, y), u = B.unitAt(BS, x, y);
      let c = 'tile ' + t.cls;
      if (hl.threat.has(k)) c += ' threat';
      if (hl.mv.has(k)) c += ' mv';
      if (hl.skill.has(k)) c += ' skill';
      if (hl.atk.has(k)) c += ' atk';
      if (hl.sel === k) c += ' sel';
      if (ui.target && ui.target.x === x && ui.target.y === y) c += ' tgt';
      el.className = c;
      el.title = (u ? `${u.name} (${u.hp}/${u.maxHp} HP) — ` : '') + t.name;
    }
  }

  function unitCard(u) {
    const t = B.terr(BS, u.x, u.y), pct = Math.max(0, (u.hp / u.maxHp) * 100);
    const rng = u.range[0] === u.range[1] ? u.range[0] : u.range[0] + '–' + u.range[1];
    const side = u.side === 'player' ? 'Your company' : u.side === 'ally' ? 'Ally' : 'Enemy';
    const tags = u.tags.length ? `<p>${u.tags.map((x) => x[0].toUpperCase() + x.slice(1)).join(', ')}</p>` : '';
    const sk = u.skill ? `<p class="sk"><b>${esc(u.skill.name)}</b>: ${esc(u.skill.desc)}${u.cd > 0 ? ` <i>(ready in ${u.cd} turn${u.cd > 1 ? 's' : ''})</i>` : ''}</p>` : '';
    return `<div class="ucard ${u.side}"><h3><span>${esc(u.glyph)}</span>${esc(u.name)}<span class="side-tag">${side}</span></h3>
      <div class="hpbar"><i style="width:${pct}%"></i></div>
      <div class="stats"><span>HP <b>${u.hp}/${u.maxHp}</b></span><span>Attack <b>${u.atk}</b></span><span>Defence <b>${u.def}${t.def ? '+' + t.def : ''}</b></span><span>Move <b>${u.move}</b></span><span>Range <b>${rng}</b></span></div>
      ${u.desc ? `<p>${esc(u.desc)}</p>` : ''}${tags}${sk}</div>`;
  }
  function previewCard(a, d) {
    const p = B.preview(BS, a, d);
    const back = p.kill ? '' : p.counter ? ` It strikes back for <b>${p.counter}</b>${p.counterKills ? ` <span class="warn">and would defeat ${esc(a.name)}</span>` : ''}.` : ' It cannot strike back.';
    return `<div class="preview"><b>${esc(a.name)}</b> hits <b>${esc(d.name)}</b> for <b>${p.dmg}</b>${p.kill ? ' <span class="kill">and defeats it</span>' : ''}.${back}
      <div class="row" style="margin-top:8px"><button class="btn primary" data-act="confirm">Attack</button><button class="btn quiet" data-act="cancel">Cancel</button></div></div>`;
  }

  function updatePanels() {
    $('#obj').innerHTML = `${esc(B.objectiveText(BS))}<small>Turn ${BS.turn}</small>`;
    let info = '';
    if (ui.sel && BS.units.includes(ui.sel)) info += unitCard(ui.sel);
    if (ui.sel && ui.target && BS.units.includes(ui.target)) info += previewCard(ui.sel, ui.target);
    else if (ui.inspect && ui.inspect !== ui.sel && BS.units.includes(ui.inspect)) info += unitCard(ui.inspect) + (ui.inspect.side === 'enemy' ? '<p class="si" style="font:0.8rem var(--ui);color:var(--ash-faint)">Red tiles show where it can strike next turn.</p>' : '');
    if (!info) info = '<p style="font:0.88rem var(--ui);color:var(--ash-dim);margin:0">Click one of your blue units to move and fight. Click an enemy to see its reach.</p>';
    $('#info').innerHTML = info;

    const u = ui.sel, acts = [];
    if (u && BS.units.includes(u) && u.side === 'player' && BS.phase === 'player' && !ui.busy && !BS.result) {
      if (u.skill) acts.push(`<button class="btn" data-act="skill" ${B.skillReady(u) ? '' : 'disabled'}>${esc(u.skill.name)}${ui.mode === 'skill' ? ' (aiming)' : ''}</button>`);
      if (!u.acted) acts.push('<button class="btn" data-act="wait">Done</button>');
      if (u.prev && !u.acted) acts.push('<button class="btn quiet" data-act="undo">Undo move</button>');
      acts.push('<button class="btn quiet" data-act="cancel">Deselect</button>');
    }
    $('#acts').innerHTML = acts.join('');

    const log = $('#log');
    log.innerHTML = BS.log.slice(-40).map((l) => `<div class="${esc(l.cls)}">${esc(l.text)}</div>`).join('');
    log.scrollTop = log.scrollHeight;

    const mine = BS.units.filter((x) => x.side === 'player');
    const idle = mine.every((x) => x.acted);
    const et = $('#endturn');
    et.disabled = ui.busy || BS.phase !== 'player' || !!BS.result || ui.intro;
    et.classList.toggle('ready', !et.disabled && idle);
    $('#phase').textContent = BS.result ? '' : BS.phase === 'player' ? `Turn ${BS.turn}: your move` : BS.phase === 'ally' ? 'Allies are moving…' : 'The enemy is moving…';
    $('#speed').textContent = ui.fast ? 'Speed: fast' : 'Speed: normal';
  }

  /* ---------- battle: input ---------- */
  function onBoardOver(e) {
    if (ui.mode !== 'skill' || !ui.sel || !ui.sel.skill || ui.sel.skill.kind !== 'burst') return;
    const el = e.target.closest('[data-x]');
    if (el) markAoe(+el.dataset.x, +el.dataset.y);
  }
  function markAoe(cx, cy) {
    ui.tileEls.forEach((el) => el.classList.remove('aoe'));
    if (cx == null || ui.mode !== 'skill' || !ui.sel || !ui.sel.skill) return;
    if (!ui.tileEls[cy * BS.w + cx].classList.contains('skill')) return;
    const rad = ui.sel.skill.radius == null ? 1 : ui.sel.skill.radius;
    for (let y = 0; y < BS.h; y++) for (let x = 0; x < BS.w; x++) if (Math.abs(x - cx) + Math.abs(y - cy) <= rad) ui.tileEls[y * BS.w + x].classList.add('aoe');
  }

  function onBoardClick(e) {
    if (ui.busy || ui.intro || !BS || BS.result || BS.phase !== 'player') return;
    const el = e.target.closest('[data-x]');
    if (!el) return;
    const x = +el.dataset.x, y = +el.dataset.y, k = K(x, y), there = B.unitAt(BS, x, y), sel = ui.sel;

    if (sel && ui.mode === 'skill') {
      if (el.classList.contains('skill')) {
        if (sel.skill.kind === 'burst' && !(ui.aim && ui.aim.x === x && ui.aim.y === y)) { ui.aim = { x, y }; markAoe(x, y); return; }
        return doSkill(sel, x, y);
      }
      ui.mode = 'idle'; ui.aim = null; refresh(); return;
    }
    if (sel && !sel.acted) {
      if (there && B.hostile(sel, there) && B.attackTargets(BS, sel).includes(there)) {
        if (ui.target === there) return doAttack(sel, there);
        ui.target = there; refresh(); return;
      }
      if (!sel.moved && !there && el.classList.contains('mv')) return doMove(sel, x, y);
    }
    ui.target = null;
    if (there) {
      if (there.side === 'player' && !there.acted) { ui.sel = there; ui.inspect = null; ui.mode = 'idle'; }
      else ui.inspect = there;
    } else { ui.sel = null; ui.inspect = null; ui.mode = 'idle'; }
    refresh();
  }

  async function doMove(u, x, y) {
    ui.busy = true;
    const ev = B.move(BS, u, x, y);
    refresh();
    if (ev && ev.length) await T(280);
    ui.busy = false; ui.target = null; after();
  }
  async function doAttack(a, d) {
    ui.busy = true; ui.target = null;
    const ev = B.attack(BS, a, d);
    await playEvents(ev);
    ui.busy = false; after();
  }
  async function doSkill(u, x, y) {
    ui.busy = true;
    const ev = B.useSkill(BS, u, x, y);
    if (!ev) { ui.busy = false; toast('That skill cannot be used there.', true); return; }
    await playEvents(ev);
    ui.busy = false; after();
  }
  function after() {
    ui.mode = 'idle'; ui.aim = null;
    if (BS.result) { refresh(); showResult(); return; }
    if (ui.sel && (ui.sel.acted || !BS.units.includes(ui.sel))) ui.sel = null;
    refresh();
  }

  async function endTurn() {
    if (ui.busy || !BS || BS.result || BS.phase !== 'player' || ui.intro) return;
    ui.sel = ui.target = ui.inspect = null; ui.mode = 'idle'; ui.busy = true;
    B.endPlayerTurn(BS); refresh();
    for (const side of ['ally', 'enemy']) {
      BS.phase = side; refresh();
      let u, guard = 80;
      while (!BS.result && guard-- > 0 && (u = B.nextActor(BS, side))) await playEvents(B.aiAct(BS, u));
      if (BS.result) break;
    }
    if (!BS.result) { const ev = B.beginTurn(BS); await playEvents(ev); }
    ui.busy = false; refresh();
    if (BS.result) showResult();
  }

  /* ---------- battle: feedback ---------- */
  const T = (ms) => sleep(ui.fast ? ms / 3 : ms);
  const unitByUid = (uid) => BS.units.find((u) => u.uid === uid);
  function float(x, y, text, cls) {
    const el = document.createElement('div');
    el.className = 'float ' + (cls || ''); el.style.setProperty('--x', x); el.style.setProperty('--y', y);
    el.innerHTML = '<span></span>'; el.firstChild.textContent = text;
    const layer = $('#ulayer'); if (!layer) return;
    layer.appendChild(el); setTimeout(() => el.remove(), 1000);
  }
  function flash(uid) {
    const el = ui.units.get(uid); if (!el) return;
    el.classList.add('hit'); setTimeout(() => el.classList.remove('hit'), 340);
  }
  async function playEvents(ev) {
    ev = ev || [];
    refresh();
    if (ev.some((e) => e.t === 'move')) await T(280);
    for (const e of ev) {
      if (e.t === 'attack') {
        flash(e.d); float(e.dx, e.dy, '−' + e.dmg);
        if (e.counter != null) setTimeout(() => { flash(e.a); float(e.ax, e.ay, '−' + e.counter); }, ui.fast ? 90 : 260);
        await T(e.counter != null ? 540 : 380);
      } else if (e.t === 'burst') {
        for (const h of e.hits) { flash(h.d); float(h.x, h.y, '−' + h.dmg); }
        await T(e.hits.length ? 540 : 260);
      } else if (e.t === 'heal') {
        const d = unitByUid(e.d); if (d) float(d.x, d.y, '+' + e.amt, 'heal');
        await T(420);
      } else if (e.t === 'brace') {
        const a = unitByUid(e.a); if (a) float(a.x, a.y, 'Braced', 'info');
        await T(350);
      } else if (e.t === 'spawn') await T(120);
    }
    refresh();
  }

  function showResult() {
    const r = BS.result, win = r.win, lost = BS.fallen.filter((f) => f.side === 'player');
    const lines = lost.filter((f) => f.cid).map((f) => `${f.name} fell, and starts the next fight wounded.`);
    const levies = lost.filter((f) => f.levy).length;
    if (levies) lines.push(`${levies} ${levies > 1 ? 'levies were' : 'levy was'} lost.`);
    $('#overlay').innerHTML = `<div class="overlay"><div class="sheet result ${win ? 'win' : 'lose'}"><h2>${win ? 'Victory' : 'Defeat'}</h2><p>${esc(r.reason)}</p>
      ${lines.length ? '<ul class="notes">' + lines.map((l) => `<li>${esc(l)}</li>`).join('') + '</ul>' : ''}
      ${win ? '' : '<p style="font:0.88rem var(--ui);color:var(--ash-dim)">You can fight this battle again, or accept the defeat and let the story carry on with the consequences.</p>'}
      <div class="row" style="margin-top:16px">${win ? '<button class="btn primary" data-act="finish">Continue</button>' : '<button class="btn primary" data-act="retry">Retry the battle</button><button class="btn" data-act="finish">Accept the defeat</button>'}</div></div></div>`;
  }

  /* ---------- action handlers (data-act) ---------- */
  function startGame() {
    const name = ($('#pname') && $('#pname').value) || '';
    S = E.newState(PACK, name, { easy: !!($('#easy') && $('#easy').checked) });
    BS = null; commit();
  }
  function loadState(st) {
    if (!st) return toast('That save could not be loaded.', true);
    S = st; BS = null; closeModal(); commit();
  }
  const H = {
    new: startGame,
    continue: () => loadState(E.load('auto')),
    choose: (el) => { E.choose(S, +el.dataset.i); commit(); },
    next: () => { E.advance(S); commit(); },
    action: (el) => { E.doAction(S, el.dataset.id); commit({ keep: true }); },
    conclude: () => { E.concludeCouncil(S); commit(); },
    journal: () => openJournal('company'),
    tab: (el) => openJournal(el.dataset.tab),
    menu: openMenu,
    help: openHelp,
    closeModal,
    closeBg: (el, ev) => { if (ev.target === el) closeModal(); },
    saveSlot: (el) => { toast(E.save(el.dataset.slot, S) ? 'Saved.' : 'Could not save in this browser.', !E.peek(el.dataset.slot)); openMenu(); },
    loadSlot: (el) => loadState(E.load(el.dataset.slot)),
    export: () => {
      showModal(`<h2>Export save</h2><p>Copy this text somewhere safe. You can paste it back in with Import save, in any browser.</p><textarea id="xp" readonly>${esc(E.exportSave(S))}</textarea>
        <div class="row" style="margin-top:12px"><button class="btn primary" data-act="copy">Copy</button><button class="btn quiet" data-act="closeModal">Close</button></div>`);
      $('#xp').select();
    },
    copy: () => { const t = $('#xp'); t.select(); (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(() => toast('Copied.'), () => { document.execCommand && document.execCommand('copy'); toast('Copied.'); }); },
    importBox: () => showModal(`<h2>Import save</h2><p>Paste a save you exported earlier.</p><textarea id="ip" placeholder="Paste save text here"></textarea>
        <div class="row" style="margin-top:12px"><button class="btn primary" data-act="doImport">Load this save</button><button class="btn quiet" data-act="closeModal">Close</button></div>`),
    doImport: () => loadState(E.importSave($('#ip').value)),
    title: () => { S = null; BS = null; closeModal(); render(); window.scrollTo(0, 0); },
    begin: () => { ui.intro = false; $('#overlay').innerHTML = ''; refresh(); },
    endturn: () => endTurn(),
    speed: () => { ui.fast = !ui.fast; try { localStorage.setItem('ashen-crown:fast', ui.fast ? '1' : '0'); } catch (e) { /* storage unavailable */ } refresh(); },
    skill: () => {
      const u = ui.sel; if (!u || !u.skill || ui.busy) return;
      if (u.skill.kind === 'brace') return doSkill(u);
      ui.mode = ui.mode === 'skill' ? 'idle' : 'skill'; ui.target = null; ui.aim = null; refresh();
      if (ui.mode === 'skill' && !B.skillTiles(BS, u).length) { toast('No valid target in range.', true); ui.mode = 'idle'; refresh(); }
    },
    wait: () => { if (ui.sel && !ui.busy) { B.wait(BS, ui.sel); ui.sel = null; ui.target = null; after(); } },
    undo: () => { if (ui.sel && !ui.busy) { B.undoMove(BS, ui.sel); ui.target = null; refresh(); } },
    cancel: () => { ui.sel = ui.target = ui.inspect = null; ui.mode = 'idle'; ui.aim = null; refresh(); },
    confirm: () => { if (ui.sel && ui.target && !ui.busy) doAttack(ui.sel, ui.target); },
    finish: () => { E.finishBattle(S, BS, BS.result.win); BS = null; Object.assign(ui, fresh()); commit(); },
    retry: () => { BS = E.startBattle(S); Object.assign(ui, fresh()); ui.intro = true; render(); },
  };

  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const fn = H[el.dataset.act];
    if (!fn) return;
    Promise.resolve().then(() => fn(el, ev)).catch(fail);
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    if (modal.firstChild) closeModal();
    else if (BS && !ui.busy) H.cancel();
  });
  window.addEventListener('resize', sizeBoard);

  /* ---------- boot ---------- */
  try { ui.fast = localStorage.getItem('ashen-crown:fast') === '1'; } catch (e) { /* storage unavailable */ }
  AC.debug = { state: () => S, battle: () => BS, ui };
  render();
})();

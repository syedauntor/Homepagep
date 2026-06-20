/**
 * Name Tracing + Coloring Generator
 * Combines SVG text tracing with a coloring image row below each line.
 */
window.puNameColorGen = (function () {

    const FONTS = ['Codystar', 'Raleway Dots'];
    const LINK  = 'https://fonts.googleapis.com/css2?family=Codystar:wght@300;400&family=Raleway+Dots&display=swap';

    const themes = [
        { id:'plain',       label:'Plain',        bg:'#ffffff', lineColor:'#d1d5db', accent:'#111827', image:'' },
        { id:'unicorn',     label:'Unicorn',       bg:'#fdf4ff', lineColor:'#e9d5ff', accent:'#7c3aed', image:'🦄' },
        { id:'dinosaur',    label:'Dinosaur',      bg:'#f0fdf4', lineColor:'#bbf7d0', accent:'#15803d', image:'🦖' },
        { id:'princess',    label:'Princess',      bg:'#fff1f2', lineColor:'#fecdd3', accent:'#be123c', image:'👑' },
        { id:'space',       label:'Space',         bg:'#eff6ff', lineColor:'#bfdbfe', accent:'#1d4ed8', image:'🚀' },
        { id:'ocean',       label:'Ocean',         bg:'#ecfeff', lineColor:'#a5f3fc', accent:'#0e7490', image:'🐟' },
        { id:'jungle',      label:'Jungle',        bg:'#f7fee7', lineColor:'#d9f99d', accent:'#3f6212', image:'🐘' },
        { id:'farm',        label:'Farm',          bg:'#fefce8', lineColor:'#fef08a', accent:'#854d0e', image:'🐮' },
    ];

    const state = {
        title:       'Name Tracing + Coloring',
        showName:    true,
        showDate:    true,
        text:        'JASMINE',
        font:        'Codystar',
        fontSize:    50,
        color:       '#000000',
        lines:       5,
        spacing:     2,
        cols:        1,
        theme:       themes[0],
        generated:   false,
    };

    /* ── helpers ─────────────────────────────────────────── */
    function $(id) { return document.getElementById(id); }

    function syncState() {
        state.title     = ($('gen-title')?.value       ?? state.title).trim() || 'Name Tracing + Coloring';
        state.showName  = !!$('gen-show-name')?.checked;
        state.showDate  = !!$('gen-show-date')?.checked;
        state.text      = ($('gen-text')?.value        ?? state.text).trim()  || 'JASMINE';
        state.font      = $('gen-font')?.value         ?? state.font;
        state.fontSize  = parseInt($('gen-font-size')?.value ?? state.fontSize, 10);
        state.color     = $('gen-color')?.value        ?? state.color;
        state.lines     = parseInt($('gen-lines')?.value ?? state.lines, 10);
        state.spacing   = parseInt($('gen-spacing')?.value ?? state.spacing, 10);
        state.cols      = parseInt(document.querySelector('input[name="gen-cols"]:checked')?.value ?? state.cols, 10);
    }

    /* ── theme rendering ─────────────────────────────────── */
    function renderThemes() {
        const grid = $('theme-grid');
        if (!grid) return;
        grid.innerHTML = themes.map((t, i) =>
            `<div class="pu-theme-card${state.theme.id === t.id ? ' selected' : ''}" onclick="puNameColorGen.selectTheme(${i})" title="${t.label}">
                <div class="pu-theme-preview" style="background:${t.bg};border:2px solid ${t.lineColor}">
                    <span style="font-size:1.5rem">${t.image || '📄'}</span>
                    <span style="font-size:.65rem;font-weight:600;color:${t.accent}">${t.label}</span>
                </div>
            </div>`
        ).join('');
    }

    /* ── SVG tracing row ─────────────────────────────────── */
    function buildTracingRow(text, w) {
        const fSize   = state.fontSize;
        const lineH   = fSize * 1.4;
        const totalH  = lineH + fSize * state.spacing * 0.5;
        const coloringH = 80;
        const rowH    = totalH + coloringH + 20;
        const fontUrl = LINK;
        const t       = state.theme;
        const lineCount = state.lines;

        let rows = '';
        for (let i = 0; i < lineCount; i++) {
            const y = i * rowH;
            rows += `
                <rect x="0" y="${y}" width="${w}" height="${rowH}" fill="${t.bg}"/>
                <line x1="0" y1="${y + totalH}" x2="${w}" y2="${y + totalH}" stroke="${t.lineColor}" stroke-width="1"/>
                <text x="${w / 2}" y="${y + fSize + 4}" dominant-baseline="auto" text-anchor="middle"
                      font-family="${state.font},cursive" font-size="${fSize}"
                      fill="none" stroke="${state.color}" stroke-width="1.2">${text}</text>
                <text x="${w / 2}" y="${y + totalH - 8}" dominant-baseline="auto" text-anchor="middle"
                      font-family="${state.font},cursive" font-size="${fSize * 0.35}"
                      fill="${t.lineColor}">Trace the letters</text>
                <rect x="${(w - (w * 0.6)) / 2}" y="${y + totalH + 10}" width="${w * 0.6}" height="${coloringH - 10}" rx="8"
                      fill="${t.bg}" stroke="${t.lineColor}" stroke-width="1.5" stroke-dasharray="4 4"/>
                <text x="${w / 2}" y="${y + totalH + 55}" text-anchor="middle" font-size="28">${t.image || '🎨'}</text>
                <text x="${w / 2}" y="${y + totalH + 78}" text-anchor="middle" font-size="10" fill="${t.lineColor}">Color it!</text>`;
        }

        const totalSVGH = lineCount * rowH;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${totalSVGH}" viewBox="0 0 ${w} ${totalSVGH}">${rows}</svg>`;
    }

    /* ── main preview build ──────────────────────────────── */
    function buildHTML() {
        const t    = state.theme;
        const cols = state.cols;
        const colW = cols === 1 ? 680 : cols === 2 ? 330 : 215;

        const colSVGs = [];
        for (let c = 0; c < cols; c++) {
            colSVGs.push(buildTracingRow(state.text, colW));
        }

        const header = `
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link href="${LINK}" rel="stylesheet">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid ${t.lineColor}">
                <h1 style="margin:0;font-size:18px;font-weight:800;color:${t.accent}">${state.title}</h1>
                <div style="display:flex;gap:16px">
                    ${state.showName ? '<div style="border-bottom:1px solid #9ca3af;width:140px;font-size:11px;color:#9ca3af">Name: _______________</div>' : ''}
                    ${state.showDate ? '<div style="border-bottom:1px solid #9ca3af;width:100px;font-size:11px;color:#9ca3af">Date: __________</div>'  : ''}
                </div>
            </div>`;

        const grid = `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:12px;align-items:start">
            ${colSVGs.map(s => `<div>${s}</div>`).join('')}
        </div>`;

        return `
            <div id="pu-worksheet" style="background:${t.bg};padding:24px;border-radius:12px;font-family:sans-serif;max-width:720px;margin:0 auto">
                ${header}
                ${grid}
            </div>`;
    }

    /* ── public API ──────────────────────────────────────── */
    return {
        generate() {
            syncState();
            state.generated = true;
            const area = $('pu-preview-area');
            if (area) area.innerHTML = buildHTML();
            const dl = $('pu-download-wrap');
            if (dl) dl.style.display = 'flex';
        },

        reset() {
            if ($('gen-title'))     $('gen-title').value = 'Name Tracing + Coloring';
            if ($('gen-show-name')) $('gen-show-name').checked = true;
            if ($('gen-show-date')) $('gen-show-date').checked = true;
            if ($('gen-text'))      $('gen-text').value = 'JASMINE';
            if ($('gen-font'))      $('gen-font').value = 'Codystar';
            if ($('gen-font-size')) $('gen-font-size').value = '50';
            if ($('gen-color'))     $('gen-color').value = '#000000';
            if ($('gen-color-text')) $('gen-color-text').value = '#000000';
            if ($('gen-lines'))     $('gen-lines').value = '5';
            if ($('gen-spacing'))   $('gen-spacing').value = '2';
            const c1 = $('gen-col-1');
            if (c1) c1.checked = true;
            state.theme = themes[0];
            renderThemes();
            const dl = $('pu-download-wrap');
            if (dl) dl.style.display = 'none';
            const area = $('pu-preview-area');
            if (area) area.innerHTML = '';
        },

        selectTheme(idx) {
            state.theme = themes[idx] || themes[0];
            renderThemes();
            if (state.generated) this.generate();
        },

        switchTab(tab) {
            ['generator','theme','howto'].forEach(t => {
                const panel = $('panel-' + t);
                const btn   = $('tab-' + t);
                if (panel) panel.style.display = t === tab ? '' : 'none';
                if (btn) {
                    btn.classList.toggle('active', t === tab);
                    if (t === 'howto') btn.classList.toggle('active', t === tab);
                }
            });
        },

        download() {
            syncState();
            const win  = window.open('', '_blank');
            const html = buildHTML();
            win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
                <link href="${LINK}" rel="stylesheet">
                <style>@page{size:A4 portrait;margin:15mm} body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style>
                <title>${state.title}</title>
                </head><body>${html}<script>window.onload=()=>{window.print();setTimeout(()=>window.close(),500)}<\/script></body></html>`);
            win.document.close();
        },

        print() { this.download(); },

        init() {
            renderThemes();
            const colorInput = $('gen-color');
            const colorText  = $('gen-color-text');
            if (colorInput && colorText) {
                colorInput.addEventListener('input', () => { colorText.value = colorInput.value; });
                colorText.addEventListener('input', () => {
                    if (/^#[0-9a-f]{6}$/i.test(colorText.value)) colorInput.value = colorText.value;
                });
            }
        },
    };
})();

document.addEventListener('DOMContentLoaded', () => puNameColorGen.init());

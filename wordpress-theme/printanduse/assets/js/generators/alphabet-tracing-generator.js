/* PrintAndUse - Alphabet Tracing Generator */
(function () {
    'use strict';

    const themes = [
        { id: 'blank',   name: 'Blank',        borderColor: 'transparent', borderWidth: '0px', borderStyle: 'solid', decoration: '' },
        { id: 'autumn',  name: 'Autumn Leaves', borderColor: '#10B981',    borderWidth: '3px', borderStyle: 'solid', decoration: '🍂🍁' },
        { id: 'beep',    name: 'Beep Beep',     borderColor: '#F59E0B',    borderWidth: '3px', borderStyle: 'solid', decoration: '🚗🚕' },
        { id: 'blue',    name: 'Blue',          borderColor: '#06B6D4',    borderWidth: '3px', borderStyle: 'solid', decoration: '' },
        { id: 'green',   name: 'Green',         borderColor: '#10B981',    borderWidth: '3px', borderStyle: 'solid', decoration: '' },
        { id: 'hearts',  name: 'Hearts',        borderColor: '#EC4899',    borderWidth: '3px', borderStyle: 'solid', decoration: '❤️💕' },
        { id: 'yellow',  name: 'Yellow',        borderColor: '#EAB308',    borderWidth: '3px', borderStyle: 'solid', decoration: '' },
    ];

    let state = {
        title: 'Alphabet Tracing',
        caseType: 'upper',
        selectedFont: 'Codystar',
        fontSize: 60,
        textColor: '#000000',
        linesPerLetter: 2,
        selectedTheme: themes[0],
        hasGenerated: false,
        showName: true,
        showDate: true,
        activeNavTab: 'generator',
    };

    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function getEl(id) { return document.getElementById(id); }

    function renderPreview() {
        const container = getEl('pu-preview-area');
        if (!container) return;
        if (!state.hasGenerated) {
            container.innerHTML = '<div class="pu-preview-empty"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg><p>No preview available yet.</p></div>';
            getEl('pu-download-wrap') && (getEl('pu-download-wrap').style.display = 'none');
            return;
        }
        if (getEl('pu-download-wrap')) getEl('pu-download-wrap').style.display = '';

        const theme = state.selectedTheme;
        const hasBorder = theme.id !== 'blank';
        const borderCSS = hasBorder ? `border:${theme.borderWidth} ${theme.borderStyle} ${theme.borderColor};` : '';
        const bgStyle = hasBorder ? `background:${theme.borderColor}22;` : 'background:#e5e7eb;';
        const letters = state.caseType === 'both' ? (ALPHABET + ALPHABET.toLowerCase()).split('') : state.caseType === 'upper' ? ALPHABET.split('') : ALPHABET.toLowerCase().split('');

        const lettersHtml = letters.map(letter => {
            const rows = Array.from({length: state.linesPerLetter}, (_, i) => `
                <svg width="100%" height="${state.fontSize * 1.4}" style="overflow:visible;display:block">
                  <text x="${state.fontSize * 0.1}" y="${state.fontSize}"
                    style="font-family:'${state.selectedFont}',cursive;font-size:${state.fontSize}px;fill:none;stroke:${state.textColor};stroke-width:1.5;font-weight:300"
                  >${letter}</text>
                </svg>`).join('');
            return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><div style="font-size:${state.fontSize * 1.5}px;font-weight:900;color:${state.textColor};font-family:'${state.selectedFont}',cursive;line-height:1">${letter}</div>${rows}</div>`;
        }).join('');

        const decoHtml = theme.decoration ? `<span style="position:absolute;top:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;top:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span>` : '';

        container.innerHTML = `<div class="pu-preview-container" style="${bgStyle}"><div class="pu-preview-scale"><div class="pu-worksheet-content" style="${hasBorder?'':'padding:12mm 15mm'}"><div style="display:flex;flex-direction:column;height:100%;position:relative;${borderCSS}${hasBorder?'padding:12mm 15mm;':''}">${decoHtml}<div style="text-align:center"><h1 style="font-size:2.25rem;font-weight:900;color:#111;margin:0">${state.title}</h1><div style="display:flex;justify-content:space-between;font-size:.9375rem;color:#4b5563;margin-top:1.25rem">${state.showName?'<span>Name: _________________________</span>':'<span></span>'}${state.showDate?'<span>Date: _________________________</span>':''}</div></div><div style="flex:1;margin-top:1rem;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;align-content:start">${lettersHtml}</div><div style="text-align:center;font-size:.6875rem;color:#6b7280;padding-top:.5rem"><p style="margin:0">Find more educational worksheets at PrintAndUse.com</p><p style="margin:0">Copyright &copy;2025 - www.printanduse.com | All rights reserved</p></div></div></div></div></div>`;
    }

    function openPrintWindow() {
        if (!state.hasGenerated) { alert('Please generate worksheet first!'); return; }
        const win = window.open('', '_blank', 'width=900,height=1200');
        if (!win) return;
        const theme = state.selectedTheme;
        const hasBorder = theme.id !== 'blank';
        const borderStyle = hasBorder ? `border:${theme.borderWidth} ${theme.borderStyle} ${theme.borderColor};` : '';
        const letters = state.caseType === 'both' ? (ALPHABET + ALPHABET.toLowerCase()).split('') : state.caseType === 'upper' ? ALPHABET.split('') : ALPHABET.toLowerCase().split('');
        const decoHtml = theme.decoration ? `<span style="position:absolute;top:1rem;left:1rem;font-size:1.5rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;top:1rem;right:1rem;font-size:1.5rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;left:1rem;font-size:1.5rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;right:1rem;font-size:1.5rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span>` : '';
        const lettersHtml = letters.map(letter => {
            const rows = Array.from({length: state.linesPerLetter}, () => `<svg width="100%" height="${state.fontSize * 1.4}" style="overflow:visible;display:block"><text x="${state.fontSize * 0.1}" y="${state.fontSize}" style="font-family:'${state.selectedFont}',cursive;font-size:${state.fontSize}px;fill:none;stroke:${state.textColor};stroke-width:1.5;font-weight:300">${letter}</text></svg>`).join('');
            return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><div style="font-size:${state.fontSize * 1.5}px;font-weight:900;color:${state.textColor};font-family:'${state.selectedFont}',cursive;line-height:1">${letter}</div>${rows}</div>`;
        }).join('');
        win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${state.title}</title><link href="https://fonts.googleapis.com/css2?family=Codystar&family=Raleway+Dots&display=swap" rel="stylesheet"><style>@page{size:A4 portrait;margin:${hasBorder?'10mm':'0'}}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}html,body{margin:0;padding:0;font-family:sans-serif;background:#000}.page{width:${hasBorder?'190mm':'210mm'};height:${hasBorder?'277mm':'297mm'};padding:12mm 15mm 10mm;display:flex;flex-direction:column;position:relative;overflow:hidden;background:#fff;${borderStyle}}.header{text-align:center;flex-shrink:0}.header h1{font-size:32px;font-weight:900;color:#111;margin:0}.name-date{display:flex;justify-content:space-between;font-size:15px;color:#4b5563;margin-top:20px}.letters-grid{flex:1;display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-top:12px;align-content:start}.footer{flex-shrink:0;text-align:center;font-size:11px;color:#6b7280;line-height:1.8}</style></head><body><div class="page">${decoHtml}<div class="header"><h1>${state.title}</h1><div class="name-date">${state.showName?'<span>Name: _________________________</span>':'<span></span>'}${state.showDate?'<span>Date: _________________________</span>':''}</div></div><div class="letters-grid">${lettersHtml}</div><div class="footer"><p style="margin:0">Find more educational worksheets at PrintAndUse.com</p><p style="margin:0">Copyright &copy;2025 - www.printanduse.com | All rights reserved</p></div></div><script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}<\/script></body></html>`);
        win.document.close();
    }

    function syncState() {
        const titleEl = getEl('gen-title'); if(titleEl) state.title = titleEl.value;
        const caseEl = getEl('gen-case'); if(caseEl) state.caseType = caseEl.value;
        const fontEl = getEl('gen-font'); if(fontEl) state.selectedFont = fontEl.value;
        const sizeEl = getEl('gen-font-size'); if(sizeEl) state.fontSize = parseInt(sizeEl.value)||60;
        const colorEl = getEl('gen-color'); if(colorEl) state.textColor = colorEl.value;
        const colorTextEl = getEl('gen-color-text'); if(colorTextEl) state.textColor = colorTextEl.value;
        const linesEl = getEl('gen-lines-per-letter'); if(linesEl) state.linesPerLetter = parseInt(linesEl.value)||2;
        const snEl = getEl('gen-show-name'); if(snEl) state.showName = snEl.checked;
        const sdEl = getEl('gen-show-date'); if(sdEl) state.showDate = sdEl.checked;
    }

    function renderThemes() {
        const grid = getEl('theme-grid');
        if (!grid) return;
        grid.innerHTML = themes.map(t => {
            const sel = state.selectedTheme.id === t.id;
            const decoArr = t.decoration ? [...t.decoration] : [];
            const deco = decoArr.length ? `<span class="pu-theme-deco tl">${decoArr[0]||''}</span><span class="pu-theme-deco tr">${decoArr[1]||decoArr[0]||''}</span><span class="pu-theme-deco bl">${decoArr[0]||''}</span><span class="pu-theme-deco br">${decoArr[1]||decoArr[0]||''}</span>` : '';
            const check = sel ? `<div class="pu-theme-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>` : '';
            return `<button class="pu-theme-card${sel?' selected':''}" onclick="puAlphaGen.selectTheme('${t.id}')" type="button"><div class="pu-theme-preview" style="border-color:${t.borderColor};border-width:${t.borderWidth};border-style:${t.borderStyle}">${deco}<span class="pu-theme-preview-label">Preview</span></div><p class="pu-theme-name">${t.name}</p>${check}</button>`;
        }).join('');
    }

    function switchNavTab(tab) {
        ['generator','theme','howto'].forEach(t => {
            const el = getEl('tab-'+t); if(el) el.classList.toggle('active', t===tab);
            const panel = getEl('panel-'+t); if(panel) panel.style.display = t===tab?'':'none';
        });
    }

    window.puAlphaGen = {
        generate: function() { syncState(); state.hasGenerated = true; renderPreview(); },
        reset: function() {
            const el = getEl('gen-title'); if(el) el.value = 'Alphabet Tracing';
            const el2 = getEl('gen-case'); if(el2) el2.value = 'upper';
            const el3 = getEl('gen-font'); if(el3) el3.value = 'Codystar';
            const el4 = getEl('gen-font-size'); if(el4) el4.value = '60';
            const el5 = getEl('gen-lines-per-letter'); if(el5) el5.value = '2';
            const colorEl = getEl('gen-color'); if(colorEl) colorEl.value = '#000000';
            const colorTEl = getEl('gen-color-text'); if(colorTEl) colorTEl.value = '#000000';
            ['gen-show-name','gen-show-date'].forEach(id=>{const e=getEl(id);if(e)e.checked=true;});
            state.hasGenerated = false; state.selectedTheme = themes[0]; syncState(); renderPreview(); renderThemes();
        },
        selectTheme: function(id) { state.selectedTheme=themes.find(t=>t.id===id)||themes[0]; renderThemes(); renderPreview(); },
        switchTab: function(tab) { switchNavTab(tab); },
        download: function() { syncState(); openPrintWindow(); },
        print: function() { syncState(); openPrintWindow(); },
    };

    renderThemes(); renderPreview(); switchNavTab('generator');
    ['gen-title','gen-case','gen-font','gen-font-size','gen-color','gen-color-text','gen-lines-per-letter','gen-show-name','gen-show-date'].forEach(id => {
        const el = getEl(id);
        if(el) el.addEventListener('change', () => { syncState(); if(state.hasGenerated) renderPreview(); });
        if(el) el.addEventListener('input', () => { syncState(); if(state.hasGenerated) renderPreview(); });
    });
})();

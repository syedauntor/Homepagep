/* PrintAndUse - Name Tracing Generator */
(function () {
    'use strict';

    const themes = [
        { id: 'blank',   name: 'Blank',        borderColor: 'transparent', borderWidth: '0px', borderStyle: 'solid', decoration: '' },
        { id: 'autumn',  name: 'Autumn Leaves', borderColor: '#10B981',    borderWidth: '3px', borderStyle: 'solid', decoration: '🍂🍁' },
        { id: 'beep',    name: 'Beep Beep',     borderColor: '#F59E0B',    borderWidth: '3px', borderStyle: 'solid', decoration: '🚗🚕' },
        { id: 'biking',  name: 'Biking',        borderColor: '#8B5CF6',    borderWidth: '3px', borderStyle: 'solid', decoration: '🚴‍♂️🚴‍♀️' },
        { id: 'blue',    name: 'Blue',          borderColor: '#06B6D4',    borderWidth: '3px', borderStyle: 'solid', decoration: '' },
        { id: 'green',   name: 'Green',         borderColor: '#10B981',    borderWidth: '3px', borderStyle: 'solid', decoration: '' },
        { id: 'hearts',  name: 'Hearts',        borderColor: '#EC4899',    borderWidth: '3px', borderStyle: 'solid', decoration: '❤️💕' },
        { id: 'yellow',  name: 'Yellow',        borderColor: '#EAB308',    borderWidth: '3px', borderStyle: 'solid', decoration: '' },
    ];

    const FONTS = ['Codystar', 'Raleway Dots'];

    let state = {
        title: 'Name Tracing Generator',
        text: 'JASMINE',
        selectedFont: 'Codystar',
        fontSize: 50,
        textColor: '#000000',
        lines: 7,
        spacing: 2,
        columns: 3,
        showName: true,
        showDate: true,
        hasGenerated: false,
        selectedTheme: themes[0],
        activeNavTab: 'generator',
    };

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
        const colClass = state.columns === 1 ? 'grid-template-columns:1fr' : state.columns === 2 ? 'grid-template-columns:1fr 1fr' : 'grid-template-columns:1fr 1fr 1fr';
        const rowsHtml = Array.from({length: state.lines}, () => `
            <div style="display:flex;align-items:center;margin-bottom:${state.spacing * 4}px">
              <svg width="100%" height="${state.fontSize * 1.5}" style="overflow:visible">
                <text x="0" y="${state.fontSize}"
                  style="font-family:'${state.selectedFont}',cursive;font-size:${state.fontSize}px;fill:none;stroke:${state.textColor};stroke-width:1.5;letter-spacing:2px;font-weight:300"
                >${state.text.toUpperCase()}</text>
              </svg>
            </div>`).join('');

        const decoHtml = theme.decoration ? `<span style="position:absolute;top:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;top:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span>` : '';

        container.innerHTML = `<div class="pu-preview-container" style="${bgStyle}"><div class="pu-preview-scale" style="font-family:'${state.selectedFont}',cursive"><div class="pu-worksheet-content" style="${hasBorder?'':'padding:12mm 15mm'}"><div style="display:flex;flex-direction:column;height:100%;position:relative;${borderCSS}${hasBorder?'padding:12mm 15mm;':''}">${decoHtml}<div style="text-align:center"><h1 style="font-size:2.25rem;font-weight:900;color:#111;margin:0">${state.title}</h1><div style="display:flex;justify-content:space-between;font-size:.9375rem;color:#4b5563;margin-top:1.25rem">${state.showName?'<span>Name: _________________________</span>':'<span></span>'}${state.showDate?'<span>Date: _________________________</span>':''}</div></div><div style="flex:1;margin-top:1rem;display:grid;${colClass};gap:1rem;align-content:start">${rowsHtml}</div><div style="text-align:center;font-size:.6875rem;color:#6b7280;padding-top:.5rem"><p style="margin:0">Find more educational worksheets at PrintAndUse.com</p><p style="margin:0">Copyright &copy;2025 - www.printanduse.com | All rights reserved</p></div></div></div></div></div>`;
    }

    function openPrintWindow() {
        if (!state.hasGenerated) { alert('Please generate worksheet first!'); return; }
        const win = window.open('', '_blank', 'width=900,height=1200');
        if (!win) return;
        const theme = state.selectedTheme;
        const hasBorder = theme.id !== 'blank';
        const borderStyle = hasBorder ? `border:${theme.borderWidth} ${theme.borderStyle} ${theme.borderColor};` : '';
        const decoHtml = theme.decoration ? `<span style="position:absolute;top:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;top:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span>` : '';
        const rowsHtml = Array.from({length: state.lines}, () => `<div class="trace-row"><svg width="100%" height="${state.fontSize * 1.5}" style="overflow:visible;display:block"><text x="0" y="${state.fontSize}" style="font-family:'${state.selectedFont}',cursive;font-size:${state.fontSize}px;fill:none;stroke:${state.textColor};stroke-width:1.5;letter-spacing:2px;text-transform:uppercase;font-weight:300">${state.text.toUpperCase()}</text></svg></div>`).join('');
        win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${state.title}</title><link href="https://fonts.googleapis.com/css2?family=Codystar&family=Raleway+Dots&display=swap" rel="stylesheet"><style>@page{size:A4 portrait;margin:${hasBorder?'10mm':'0'}}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}html,body{margin:0;padding:0;font-family:sans-serif;background:#000}.page{width:${hasBorder?'190mm':'210mm'};height:${hasBorder?'277mm':'297mm'};padding:12mm 15mm 10mm;display:flex;flex-direction:column;position:relative;overflow:hidden;background:#fff;${borderStyle}}.header{text-align:center;flex-shrink:0}.header h1{font-size:32px;font-weight:900;color:#111;margin:0}.name-date{display:flex;justify-content:space-between;font-size:15px;color:#4b5563;margin-top:20px}.problems{flex:1;overflow:hidden}.trace-row{margin-bottom:0}.footer{flex-shrink:0;text-align:center;font-size:11px;color:#6b7280;padding:0;line-height:1.8}</style></head><body><div class="page">${decoHtml}<div class="header"><h1>${state.title}</h1><div class="name-date">${state.showName?'<span>Name: _________________________</span>':'<span></span>'}${state.showDate?'<span>Date: _________________________</span>':''}</div></div><div class="problems">${rowsHtml}</div><div class="footer"><p style="margin:0">Find more educational worksheets at PrintAndUse.com</p><p style="margin:0">Copyright &copy;2025 - www.printanduse.com | All rights reserved</p></div></div><script>window.onload=function(){var page=document.querySelector('.page'),header=document.querySelector('.header'),footer=document.querySelector('.footer'),rows=document.querySelectorAll('.trace-row');if(rows.length>0&&page&&header&&footer){var pageH=page.offsetHeight,headerH=header.offsetHeight,footerH=footer.offsetHeight,pagePadT=parseFloat(getComputedStyle(page).paddingTop),totalRowH=0;rows.forEach(function(r){totalRowH+=r.offsetHeight;});var available=pageH-pagePadT-headerH-footerH-18-16-8,gap=(available-totalRowH)/rows.length;if(gap<4)gap=4;rows.forEach(function(r){r.style.marginBottom=gap+'px';});document.querySelector('.problems').style.paddingTop='16px';}window.print();window.onafterprint=function(){window.close();}}<\/script></body></html>`);
        win.document.close();
    }

    function syncState() {
        const titleEl = getEl('gen-title'); if(titleEl) state.title = titleEl.value;
        const textEl = getEl('gen-text'); if(textEl) state.text = textEl.value || 'JASMINE';
        const fontEl = getEl('gen-font'); if(fontEl) state.selectedFont = fontEl.value;
        const sizeEl = getEl('gen-font-size'); if(sizeEl) state.fontSize = parseInt(sizeEl.value)||50;
        const colorEl = getEl('gen-color'); if(colorEl) state.textColor = colorEl.value;
        const colorTextEl = getEl('gen-color-text'); if(colorTextEl) state.textColor = colorTextEl.value;
        const linesEl = getEl('gen-lines'); if(linesEl) state.lines = parseInt(linesEl.value)||7;
        const spacingEl = getEl('gen-spacing'); if(spacingEl) state.spacing = parseInt(spacingEl.value)||2;
        const col1 = getEl('gen-col-1'); const col2 = getEl('gen-col-2'); const col3 = getEl('gen-col-3');
        if(col1&&col1.checked) state.columns=1; else if(col2&&col2.checked) state.columns=2; else state.columns=3;
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
            return `<button class="pu-theme-card${sel?' selected':''}" onclick="puNameGen.selectTheme('${t.id}')" type="button"><div class="pu-theme-preview" style="border-color:${t.borderColor};border-width:${t.borderWidth};border-style:${t.borderStyle}">${deco}<span class="pu-theme-preview-label">Preview</span></div><p class="pu-theme-name">${t.name}</p>${check}</button>`;
        }).join('');
    }

    function switchNavTab(tab) {
        ['generator','theme','howto'].forEach(t => {
            const el = getEl('tab-'+t); if(el) el.classList.toggle('active', t===tab);
            const panel = getEl('panel-'+t); if(panel) panel.style.display = t===tab?'':'none';
        });
    }

    window.puNameGen = {
        generate: function() { syncState(); state.hasGenerated = true; renderPreview(); },
        reset: function() {
            ['gen-title','gen-text','gen-font','gen-font-size','gen-lines','gen-spacing'].forEach(id => {
                const el = getEl(id);
                if(!el) return;
                if(id==='gen-title') el.value='Name Tracing Generator';
                else if(id==='gen-text') el.value='JASMINE';
                else if(id==='gen-font') el.value='Codystar';
                else if(id==='gen-font-size') el.value='50';
                else if(id==='gen-lines') el.value='7';
                else if(id==='gen-spacing') el.value='2';
            });
            const colorEl=getEl('gen-color'); if(colorEl) colorEl.value='#000000';
            const colorTEl=getEl('gen-color-text'); if(colorTEl) colorTEl.value='#000000';
            const col3=getEl('gen-col-3'); if(col3) col3.checked=true;
            ['gen-show-name','gen-show-date'].forEach(id=>{const e=getEl(id);if(e)e.checked=true;});
            state.hasGenerated=false; state.selectedTheme=themes[0]; syncState(); renderPreview(); renderThemes();
        },
        selectTheme: function(id) { state.selectedTheme=themes.find(t=>t.id===id)||themes[0]; renderThemes(); renderPreview(); },
        switchTab: function(tab) { switchNavTab(tab); },
        download: function() { syncState(); openPrintWindow(); },
        print: function() { syncState(); openPrintWindow(); },
    };

    renderThemes(); renderPreview(); switchNavTab('generator');

    const liveInputIds = ['gen-title','gen-text','gen-font','gen-font-size','gen-color','gen-color-text','gen-lines','gen-spacing','gen-show-name','gen-show-date','gen-col-1','gen-col-2','gen-col-3'];
    liveInputIds.forEach(id => {
        const el = getEl(id);
        if (el) el.addEventListener('input', () => { syncState(); if(state.hasGenerated) renderPreview(); });
        if (el) el.addEventListener('change', () => { syncState(); if(state.hasGenerated) renderPreview(); });
    });
})();

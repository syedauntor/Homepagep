/* PrintAndUse - Multiplication Generator */
(function () {
    'use strict';

    const themes = [
        { id: 'blank',   name: 'Blank',         borderColor: 'transparent', borderWidth: '0px', borderStyle: 'solid', decoration: '' },
        { id: 'autumn',  name: 'Autumn Leaves',  borderColor: '#10B981',     borderWidth: '3px', borderStyle: 'solid', decoration: '🍂🍁' },
        { id: 'beep',    name: 'Beep Beep',      borderColor: '#F59E0B',     borderWidth: '3px', borderStyle: 'solid', decoration: '🚗🚕' },
        { id: 'biking',  name: 'Biking',         borderColor: '#8B5CF6',     borderWidth: '3px', borderStyle: 'solid', decoration: '🚴‍♂️🚴‍♀️' },
        { id: 'blue',    name: 'Blue',           borderColor: '#06B6D4',     borderWidth: '3px', borderStyle: 'solid', decoration: '' },
        { id: 'green',   name: 'Green',          borderColor: '#10B981',     borderWidth: '3px', borderStyle: 'solid', decoration: '' },
        { id: 'hearts',  name: 'Hearts',         borderColor: '#EC4899',     borderWidth: '3px', borderStyle: 'solid', decoration: '❤️💕' },
        { id: 'yellow',  name: 'Yellow',         borderColor: '#EAB308',     borderWidth: '3px', borderStyle: 'solid', decoration: '' },
    ];

    let state = {
        title: 'Multiplication Worksheet',
        difficulty: 'simple',
        orientation: 'horizontal',
        numProblems: 20,
        showProblemNumber: true,
        showName: true,
        showDate: true,
        problems: [],
        selectedTheme: themes[0],
        activeTab: 'worksheet',
        activeNavTab: 'generator',
    };

    function getEl(id) { return document.getElementById(id); }

    function generateProblems() {
        const problems = [];
        let max, min;
        if (state.difficulty === 'simple')      { max = 9;  min = 0; }
        else if (state.difficulty === 'medium') { max = 12; min = 2; }
        else                                    { max = 20; min = 5; }

        for (let i = 0; i < state.numProblems; i++) {
            const n1 = Math.floor(Math.random() * (max - min + 1)) + min;
            const n2 = Math.floor(Math.random() * (max - min + 1)) + min;
            problems.push({ num1: n1, num2: n2, answer: n1 * n2 });
        }
        state.problems = problems;
        renderPreview();
    }

    function renderPreview() {
        const container = getEl('pu-preview-area');
        if (!container) return;
        if (state.problems.length === 0) {
            container.innerHTML = '<div class="pu-preview-empty"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg><p>No preview available yet.</p></div>';
            getEl('pu-download-wrap') && (getEl('pu-download-wrap').style.display = 'none');
            return;
        }
        if (getEl('pu-download-wrap')) getEl('pu-download-wrap').style.display = '';

        const theme = state.selectedTheme;
        const hasBorder = theme.id !== 'blank';
        const borderCSS = hasBorder ? `border:${theme.borderWidth} ${theme.borderStyle} ${theme.borderColor};` : '';
        const bgStyle = hasBorder ? `background:${theme.borderColor}22;` : 'background:#e5e7eb;';
        const showAnswers = state.activeTab === 'answer';
        const isVertical = state.orientation === 'vertical';
        let problemsHtml = '';

        if (!isVertical) {
            const rows = Math.ceil(state.problems.length / 2);
            for (let r = 0; r < rows; r++) {
                let cols = '';
                for (let c = 0; c < 2; c++) {
                    const idx = r * 2 + c;
                    if (idx >= state.problems.length) { cols += '<div style="width:33.33%"></div>'; continue; }
                    const p = state.problems[idx];
                    const ans = showAnswers ? `<span style="font-weight:700;color:#ea580c">${p.answer}</span>` : `<span style="display:inline-block;width:80px;border-bottom:2px solid #d1d5db"></span>`;
                    const num = state.showProblemNumber ? `<span style="color:#9ca3af;font-size:14px;margin-right:6px">${idx+1}.</span>` : '';
                    cols += `<div style="width:33.33%;text-align:left"><div style="display:flex;align-items:center;gap:10px;font-size:20px">${num}<span>${p.num1}</span><span>&times;</span><span>${p.num2}</span><span>=</span>${ans}</div></div>`;
                }
                problemsHtml += `<div style="display:flex;padding-left:12.5%;padding-right:12.5%;justify-content:space-between;flex:1">${cols}</div>`;
            }
        } else {
            for (let r = 0; r < 5; r++) {
                let cols = '';
                for (let c = 0; c < 4; c++) {
                    const idx = r * 4 + c;
                    if (idx >= state.problems.length) { cols += '<div style="visibility:hidden"><div style="min-width:90px;display:inline-block"><div style="font-size:24px;text-align:right;padding-right:4px">0</div><div style="font-size:24px;text-align:right;padding-right:4px">&times; 0</div><div style="border-top:2px solid #111;margin-top:4px;padding-top:8px"></div></div></div>'; continue; }
                    const p = state.problems[idx];
                    const ans = showAnswers ? `<div style="font-size:24px;font-weight:700;color:#ea580c;border-top:2px solid #111;margin-top:4px;padding-top:4px;text-align:right;padding-right:4px">${p.answer}</div>` : `<div style="border-top:2px solid #111;margin-top:4px;padding-top:8px"></div>`;
                    const num = state.showProblemNumber ? `<div style="color:#9ca3af;font-size:14px;margin-bottom:4px">${idx+1}.</div>` : '';
                    cols += `<div>${num}<div style="min-width:90px;display:inline-block"><div style="font-size:24px;text-align:right;padding-right:4px">${p.num1}</div><div style="font-size:24px;text-align:right;display:flex;justify-content:flex-end"><span style="margin-right:4px">&times;</span><span style="padding-right:4px">${p.num2}</span></div>${ans}</div></div>`;
                }
                problemsHtml += `<div style="display:flex;justify-content:space-between;width:100%;flex:1">${cols}</div>`;
            }
        }

        const decoHtml = theme.decoration ? `<span style="position:absolute;top:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;top:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span>` : '';

        container.innerHTML = `<div class="pu-preview-container" style="${bgStyle}"><div class="pu-preview-scale"><div class="pu-worksheet-content" style="${hasBorder?'':'padding:12mm 15mm'}"><div style="display:flex;flex-direction:column;height:100%;position:relative;${borderCSS}${hasBorder?'padding:12mm 15mm;':''}">${decoHtml}<div style="text-align:center"><h1 style="font-size:2.25rem;font-weight:900;color:#111;margin:0">${state.title}</h1><div style="display:flex;justify-content:space-between;font-size:.9375rem;color:#4b5563;margin-top:1.25rem">${state.showName?'<span>Name: _________________________</span>':'<span></span>'}${state.showDate?'<span>Date: _________________________</span>':''}</div></div><div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem 0;margin-top:2.5rem">${problemsHtml}</div><div style="text-align:center;font-size:.6875rem;color:#6b7280;padding-top:.5rem"><p style="margin:0">Find more educational worksheets at PrintAndUse.com</p><p style="margin:0">Copyright &copy;2025 - www.printanduse.com | All rights reserved</p></div></div></div></div></div>`;
    }

    function openPrintWindow(showAnswers) {
        if (state.problems.length === 0) { alert('Please generate problems first!'); return; }
        const win = window.open('', '_blank', 'width=900,height=1200');
        if (!win) return;
        const theme = state.selectedTheme;
        const hasBorder = theme.id !== 'blank';
        const borderStyle = hasBorder ? `border:${theme.borderWidth} ${theme.borderStyle} ${theme.borderColor};` : '';
        const isVertical = state.orientation === 'vertical';
        const rowCount = isVertical ? 5 : Math.ceil(state.problems.length / 2);
        let problemsHtml = '';
        if (!isVertical) {
            for (let r = 0; r < rowCount; r++) {
                let cols = '';
                for (let c = 0; c < 2; c++) {
                    const idx = r*2+c;
                    if (idx >= state.problems.length) { cols += '<div class="problem-col"></div>'; continue; }
                    const p = state.problems[idx];
                    const ans = showAnswers ? `<span style="font-weight:bold;color:#ea580c">${p.answer}</span>` : `<span style="display:inline-block;width:80px;border-bottom:2px solid #d1d5db"></span>`;
                    const num = state.showProblemNumber ? `<span style="color:#9ca3af;font-size:14px">${idx+1}.</span>` : '';
                    cols += `<div class="problem-col"><div style="display:flex;align-items:center;gap:12px;font-size:20px">${num}<span>${p.num1}</span><span>&times;</span><span>${p.num2}</span><span>=</span>${ans}</div></div>`;
                }
                problemsHtml += `<div class="problem-row">${cols}</div>`;
            }
        } else {
            for (let r = 0; r < 5; r++) {
                let cols = '';
                for (let c = 0; c < 4; c++) {
                    const idx = r*4+c;
                    if (idx >= state.problems.length) { cols += '<div style="visibility:hidden"><div style="min-width:90px"><div style="font-size:24px;text-align:right;padding-right:4px">0</div><div style="font-size:24px;text-align:right;padding-right:4px">&times; 0</div><div style="border-top:2px solid #111;margin-top:4px;padding-top:8px"></div></div></div>'; continue; }
                    const p = state.problems[idx];
                    const ans = showAnswers ? `<div style="font-size:24px;font-weight:bold;color:#ea580c;border-top:2px solid #111;margin-top:4px;padding-top:4px;text-align:right;padding-right:4px">${p.answer}</div>` : `<div style="border-top:2px solid #111;margin-top:4px;padding-top:8px"></div>`;
                    const num = state.showProblemNumber ? `<div style="color:#9ca3af;font-size:14px;margin-bottom:4px">${idx+1}.</div>` : '';
                    cols += `<div>${num}<div style="min-width:90px;display:inline-block"><div style="font-size:24px;text-align:right;padding-right:4px">${p.num1}</div><div style="font-size:24px;text-align:right;display:flex;justify-content:flex-end"><span style="margin-right:4px">&times;</span><span style="padding-right:4px">${p.num2}</span></div>${ans}</div></div>`;
                }
                problemsHtml += `<div class="problem-row" style="display:flex;justify-content:space-between;width:100%">${cols}</div>`;
            }
        }
        const decoHtml = theme.decoration ? `<span style="position:absolute;top:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;top:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span><span style="position:absolute;bottom:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span>` : '';
        win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${state.title}</title><style>@page{size:A4 portrait;margin:${hasBorder?'10mm':'0'}}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}html,body{margin:0;padding:0;font-family:sans-serif;background:#000}.page{width:${hasBorder?'190mm':'210mm'};height:${hasBorder?'277mm':'297mm'};padding:12mm 15mm 10mm;display:flex;flex-direction:column;position:relative;overflow:hidden;background:#fff;${borderStyle}}.header{text-align:center;flex-shrink:0}.header h1{font-size:32px;font-weight:900;color:#111;margin:0}.name-date{display:flex;justify-content:space-between;font-size:15px;color:#4b5563;margin-top:20px}.problems{flex:1;padding-top:16px}.problems-wrapper{${isVertical?'width:100%;':'width:75%;margin:0 auto;'}}.problem-row{margin-bottom:0;display:flex;justify-content:space-between}.problem-col{width:33.33%}.footer{flex-shrink:0;text-align:center;font-size:11px;color:#6b7280;line-height:1.8}</style></head><body><div class="page">${decoHtml}<div class="header"><h1>${state.title}</h1><div class="name-date">${state.showName?'<span>Name: _________________________</span>':'<span></span>'}${state.showDate?'<span>Date: _________________________</span>':''}</div></div><div class="problems"><div class="problems-wrapper">${problemsHtml}</div></div><div class="footer"><p style="margin:0">Find more educational worksheets at PrintAndUse.com</p><p style="margin:0">Copyright &copy;2025 - www.printanduse.com | All rights reserved</p></div></div><script>window.onload=function(){var page=document.querySelector('.page'),header=document.querySelector('.header'),footer=document.querySelector('.footer'),rows=document.querySelectorAll('.problem-row');if(rows.length>0&&page&&header&&footer){var pageH=page.clientHeight,headerH=header.offsetHeight,footerH=footer.offsetHeight,pagePadT=parseFloat(getComputedStyle(page).paddingTop),pagePadB=parseFloat(getComputedStyle(page).paddingBottom),totalRowH=0;rows.forEach(function(r){totalRowH+=r.offsetHeight;});var available=pageH-pagePadT-pagePadB-headerH-footerH-16,gap=(available-totalRowH)/rows.length;if(gap<4)gap=4;rows.forEach(function(r){r.style.marginBottom=gap+'px';});}window.print();window.onafterprint=function(){window.close();}}<\/script></body></html>`);
        win.document.close();
    }

    function syncState() {
        const titleEl = getEl('gen-title'); if(titleEl) state.title = titleEl.value;
        const diffEl = getEl('gen-difficulty'); if(diffEl) state.difficulty = diffEl.value;
        const orientEl = getEl('gen-orientation'); if(orientEl) state.orientation = orientEl.value;
        const numEl = getEl('gen-num-problems'); if(numEl) state.numProblems = Math.min(20,Math.max(1,parseInt(numEl.value)||20));
        const snEl = getEl('gen-show-number'); if(snEl) state.showProblemNumber = snEl.checked;
        const snEl2 = getEl('gen-show-name'); if(snEl2) state.showName = snEl2.checked;
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
            return `<button class="pu-theme-card${sel?' selected':''}" onclick="puMulGen.selectTheme('${t.id}')" type="button"><div class="pu-theme-preview" style="border-color:${t.borderColor};border-width:${t.borderWidth};border-style:${t.borderStyle}">${deco}<span class="pu-theme-preview-label">Preview</span></div><p class="pu-theme-name">${t.name}</p>${check}</button>`;
        }).join('');
    }

    function switchNavTab(tab) {
        state.activeNavTab = tab;
        ['generator','theme','howto'].forEach(t => {
            const el = getEl('tab-'+t); if(el) el.classList.toggle('active', t===tab);
            const panel = getEl('panel-'+t); if(panel) panel.style.display = t===tab?'':'none';
        });
    }

    window.puMulGen = {
        generate: function() { syncState(); generateProblems(); },
        reset: function() {
            const el=getEl('gen-title'); if(el) el.value='Multiplication Worksheet';
            const el2=getEl('gen-difficulty'); if(el2) el2.value='simple';
            const el3=getEl('gen-orientation'); if(el3) el3.value='horizontal';
            const el4=getEl('gen-num-problems'); if(el4) el4.value='20';
            ['gen-show-number','gen-show-name','gen-show-date'].forEach(id=>{const e=getEl(id);if(e)e.checked=true;});
            state.problems=[]; state.selectedTheme=themes[0]; syncState(); renderPreview(); renderThemes();
        },
        selectTheme: function(id) { state.selectedTheme=themes.find(t=>t.id===id)||themes[0]; renderThemes(); renderPreview(); },
        switchTab: function(tab) { switchNavTab(tab); },
        switchPreview: function(tab) { state.activeTab=tab; ['worksheet','answer'].forEach(t=>{const el=getEl('preview-tab-'+t);if(el)el.classList.toggle('active',t===tab);}); renderPreview(); },
        downloadWorksheet: function() { syncState(); openPrintWindow(false); },
        downloadAnswerKey: function() { syncState(); openPrintWindow(true); },
        print: function() { syncState(); openPrintWindow(state.activeTab==='answer'); },
    };

    renderThemes(); renderPreview(); switchNavTab('generator');
    document.querySelectorAll('#gen-title,#gen-difficulty,#gen-orientation,#gen-num-problems,#gen-show-number,#gen-show-name,#gen-show-date').forEach(el => {
        el.addEventListener('change', () => { syncState(); if(state.problems.length>0) renderPreview(); });
    });
})();

/* =============================================
   PrintAndUse - Addition Generator
   ============================================= */
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
        title: 'Addition Worksheet',
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
        if (state.difficulty === 'simple')      { max = 9;   min = 0; }
        else if (state.difficulty === 'medium') { max = 99;  min = 10; }
        else                                    { max = 999; min = 100; }

        for (let i = 0; i < state.numProblems; i++) {
            const n1 = Math.floor(Math.random() * (max - min + 1)) + min;
            const n2 = Math.floor(Math.random() * (max - min + 1)) + min;
            problems.push({ num1: n1, num2: n2, answer: n1 + n2 });
        }
        state.problems = problems;
        renderPreview();
    }

    function renderPreview() {
        const container = getEl('pu-preview-area');
        if (!container) return;

        if (state.problems.length === 0) {
            container.innerHTML = '<div class="pu-preview-empty"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg><p>No posts available yet.</p></div>';
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
                    const ans = showAnswers
                        ? `<span style="font-weight:700;color:#ea580c">${p.answer}</span>`
                        : `<span style="display:inline-block;width:80px;border-bottom:2px solid #d1d5db"></span>`;
                    const num = state.showProblemNumber ? `<span style="color:#9ca3af;font-size:14px;margin-right:6px">${idx+1}.</span>` : '';
                    cols += `<div style="width:33.33%;text-align:left"><div style="display:flex;align-items:center;gap:10px;font-size:20px">${num}<span>${p.num1}</span><span>+</span><span>${p.num2}</span><span>=</span>${ans}</div></div>`;
                }
                problemsHtml += `<div style="display:flex;padding-left:12.5%;padding-right:12.5%;justify-content:space-between;flex:1">${cols}</div>`;
            }
        } else {
            for (let r = 0; r < 5; r++) {
                let cols = '';
                for (let c = 0; c < 4; c++) {
                    const idx = r * 4 + c;
                    if (idx >= state.problems.length) { cols += '<div style="visibility:hidden"><div style="min-width:90px;display:inline-block"><div style="font-size:24px;text-align:right;padding-right:4px">0</div><div style="font-size:24px;text-align:right;padding-right:4px">+ 0</div><div style="border-top:2px solid #111;margin-top:4px;padding-top:8px"></div></div></div>'; continue; }
                    const p = state.problems[idx];
                    const ans = showAnswers
                        ? `<div style="font-size:24px;font-weight:700;color:#ea580c;border-top:2px solid #111;margin-top:4px;padding-top:4px;text-align:right;padding-right:4px">${p.answer}</div>`
                        : `<div style="border-top:2px solid #111;margin-top:4px;padding-top:8px"></div>`;
                    const num = state.showProblemNumber ? `<div style="color:#9ca3af;font-size:14px;margin-bottom:4px">${idx+1}.</div>` : '';
                    cols += `<div>${num}<div style="min-width:90px;display:inline-block"><div style="font-size:24px;text-align:right;padding-right:4px">${p.num1}</div><div style="font-size:24px;text-align:right;display:flex;justify-content:flex-end"><span style="margin-right:4px">+</span><span style="padding-right:4px">${p.num2}</span></div>${ans}</div></div>`;
                }
                problemsHtml += `<div style="display:flex;justify-content:space-between;width:100%;flex:1">${cols}</div>`;
            }
        }

        const decoHtml = theme.decoration ? `
            <span style="position:absolute;top:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span>
            <span style="position:absolute;top:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span>
            <span style="position:absolute;bottom:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span>
            <span style="position:absolute;bottom:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span>` : '';

        container.innerHTML = `
        <div class="pu-preview-container" style="${bgStyle}">
          <div class="pu-preview-scale">
            <div class="pu-worksheet-content" style="${hasBorder ? '' : 'padding:12mm 15mm'}">
              <div style="display:flex;flex-direction:column;height:100%;position:relative;${borderCSS}${hasBorder ? 'padding:12mm 15mm;' : ''}">
                ${decoHtml}
                <div style="text-align:center">
                  <h1 style="font-size:2.25rem;font-weight:900;color:#111;margin:0">${state.title}</h1>
                  <div style="display:flex;justify-content:space-between;font-size:.9375rem;color:#4b5563;margin-top:1.25rem">
                    ${state.showName ? '<span>Name: _________________________</span>' : '<span></span>'}
                    ${state.showDate ? '<span>Date: _________________________</span>' : ''}
                  </div>
                </div>
                <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem 0;margin-top:2.5rem">
                  ${problemsHtml}
                </div>
                <div style="text-align:center;font-size:.6875rem;color:#6b7280;padding-top:.5rem">
                  <p style="margin:0">Find more educational worksheets at PrintAndUse.com</p>
                  <p style="margin:0">Copyright &copy;2025 - www.printanduse.com | All rights reserved</p>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    }

    function openPrintWindow(showAnswers) {
        if (state.problems.length === 0) { alert('Please generate problems first!'); return; }
        const win = window.open('', '_blank', 'width=900,height=1200');
        if (!win) { alert('Please allow popups to download/print.'); return; }

        const theme = state.selectedTheme;
        const hasBorder = theme.id !== 'blank';
        const borderStyle = hasBorder ? `border:${theme.borderWidth} ${theme.borderStyle} ${theme.borderColor};` : '';
        const isVertical = state.orientation === 'vertical';
        const colsPerRow = isVertical ? 4 : 2;
        const rowCount = isVertical ? 5 : Math.ceil(state.problems.length / 2);

        let problemsHtml = '';
        if (!isVertical) {
            for (let r = 0; r < rowCount; r++) {
                const isLast = r === rowCount - 1;
                let cols = '';
                for (let c = 0; c < 2; c++) {
                    const idx = r * 2 + c;
                    if (idx >= state.problems.length) { cols += '<div class="problem-col"></div>'; continue; }
                    const p = state.problems[idx];
                    const ans = showAnswers
                        ? `<span style="font-weight:bold;color:#ea580c">${p.answer}</span>`
                        : `<span style="display:inline-block;width:80px;border-bottom:2px solid #d1d5db"></span>`;
                    const num = state.showProblemNumber ? `<span style="color:#9ca3af;font-size:14px">${idx+1}.</span>` : '';
                    cols += `<div class="problem-col" style="text-align:left"><div style="display:flex;align-items:center;gap:12px;font-size:20px">${num}<span>${p.num1}</span><span>+</span><span>${p.num2}</span><span>=</span>${ans}</div></div>`;
                }
                problemsHtml += `<div class="problem-row${isLast?' last-row':''}">${cols}</div>`;
            }
        } else {
            for (let r = 0; r < 5; r++) {
                const isLast = r === 4;
                let cols = '';
                for (let c = 0; c < 4; c++) {
                    const idx = r * 4 + c;
                    if (idx >= state.problems.length) { cols += '<div style="visibility:hidden"><div style="min-width:90px;display:inline-block"><div style="font-size:24px;text-align:right;padding-right:4px">0</div><div style="font-size:24px;text-align:right;padding-right:4px">+ 0</div><div style="border-top:2px solid #111;margin-top:4px;padding-top:8px"></div></div></div>'; continue; }
                    const p = state.problems[idx];
                    const ans = showAnswers
                        ? `<div style="font-size:24px;font-weight:bold;color:#ea580c;border-top:2px solid #111;margin-top:4px;padding-top:4px;text-align:right;padding-right:4px">${p.answer}</div>`
                        : `<div style="border-top:2px solid #111;margin-top:4px;padding-top:8px"></div>`;
                    const num = state.showProblemNumber ? `<div style="color:#9ca3af;font-size:14px;margin-bottom:4px">${idx+1}.</div>` : '';
                    cols += `<div>${num}<div style="min-width:90px;display:inline-block"><div style="font-size:24px;text-align:right;padding-right:4px">${p.num1}</div><div style="font-size:24px;text-align:right;display:flex;justify-content:flex-end"><span style="margin-right:4px">+</span><span style="padding-right:4px">${p.num2}</span></div>${ans}</div></div>`;
                }
                problemsHtml += `<div class="problem-row${isLast?' last-row':''}" style="display:flex;justify-content:space-between;width:100%">${cols}</div>`;
            }
        }

        const decoHtml = theme.decoration ? `
            <span style="position:absolute;top:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span>
            <span style="position:absolute;top:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span>
            <span style="position:absolute;bottom:1rem;left:1rem;font-size:1.875rem">${[...theme.decoration][0]||''}</span>
            <span style="position:absolute;bottom:1rem;right:1rem;font-size:1.875rem">${[...theme.decoration][1]||[...theme.decoration][0]||''}</span>` : '';

        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${state.title}</title><style>
@page{size:A4 portrait;margin:${hasBorder?'10mm':'0'}}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0;padding:0;font-family:sans-serif;background:#000}
.page{width:${hasBorder?'190mm':'210mm'};height:${hasBorder?'277mm':'297mm'};padding:12mm 15mm 10mm;display:flex;flex-direction:column;position:relative;overflow:hidden;background:#fff;${borderStyle}}
.header{text-align:center;flex-shrink:0}
.header h1{font-size:32px;font-weight:900;color:#111;margin:0}
.name-date{display:flex;justify-content:space-between;font-size:15px;color:#4b5563;margin-top:20px;padding-bottom:4px}
.problems{flex:1;padding-top:16px;overflow:hidden}
.problems-wrapper{${isVertical?'width:100%;height:100%;':'width:75%;margin-left:auto;margin-right:auto;'}}
.problem-row{margin-bottom:0;display:flex;justify-content:space-between}
.problem-col{width:33.33%}
.footer{flex-shrink:0;text-align:center;font-size:11px;color:#6b7280;padding:0;line-height:1.8}
</style></head><body>
<div class="page">
  ${decoHtml}
  <div class="header"><h1>${state.title}</h1><div class="name-date">${state.showName?'<span>Name: _________________________</span>':'<span></span>'}${state.showDate?'<span>Date: _________________________</span>':''}</div></div>
  <div class="problems"><div class="problems-wrapper">${problemsHtml}</div></div>
  <div class="footer"><p style="margin:0">Find more educational worksheets at PrintAndUse.com</p><p style="margin:0">Copyright &copy;2025 - www.printanduse.com | All rights reserved</p></div>
</div>
<script>
window.onload=function(){
  var page=document.querySelector('.page'),header=document.querySelector('.header'),footer=document.querySelector('.footer'),rows=document.querySelectorAll('.problem-row');
  if(rows.length>0&&page&&header&&footer){
    var pageH=page.clientHeight,headerH=header.offsetHeight,footerH=footer.offsetHeight,pagePadT=parseFloat(getComputedStyle(page).paddingTop),pagePadB=parseFloat(getComputedStyle(page).paddingBottom),problemsTopGap=16,totalRowH=0;
    rows.forEach(function(r){totalRowH+=r.offsetHeight;});
    var available=pageH-pagePadT-pagePadB-headerH-footerH-problemsTopGap,gap=(available-totalRowH)/rows.length;
    if(gap<4)gap=4;
    rows.forEach(function(r){r.style.marginBottom=gap+'px';});
    document.querySelector('.problems').style.paddingTop=problemsTopGap+'px';
  }
  window.print();window.onafterprint=function(){window.close();};
}
<\/script></body></html>`;
        win.document.write(html);
        win.document.close();
    }

    function syncState() {
        const titleEl = getEl('gen-title');
        if (titleEl) state.title = titleEl.value;
        const diffEl = getEl('gen-difficulty');
        if (diffEl) state.difficulty = diffEl.value;
        const orientEl = getEl('gen-orientation');
        if (orientEl) state.orientation = orientEl.value;
        const numEl = getEl('gen-num-problems');
        if (numEl) state.numProblems = Math.min(20, Math.max(1, parseInt(numEl.value) || 20));
        const showNumEl = getEl('gen-show-number');
        if (showNumEl) state.showProblemNumber = showNumEl.checked;
        const showNameEl = getEl('gen-show-name');
        if (showNameEl) state.showName = showNameEl.checked;
        const showDateEl = getEl('gen-show-date');
        if (showDateEl) state.showDate = showDateEl.checked;
    }

    function switchNavTab(tab) {
        state.activeNavTab = tab;
        ['generator','theme','howto'].forEach(function(t) {
            const el = getEl('tab-' + t);
            if (el) el.classList.toggle('active', t === tab);
            const panel = getEl('panel-' + t);
            if (panel) panel.style.display = t === tab ? '' : 'none';
        });
    }

    function switchPreviewTab(tab) {
        state.activeTab = tab;
        ['worksheet','answer'].forEach(function(t) {
            const el = getEl('preview-tab-' + t);
            if (el) el.classList.toggle('active', t === tab);
        });
        renderPreview();
    }

    function renderThemes() {
        const grid = getEl('theme-grid');
        if (!grid) return;
        grid.innerHTML = themes.map(function(theme) {
            const isSelected = state.selectedTheme.id === theme.id;
            const decoArr = theme.decoration ? [...theme.decoration] : [];
            const deco = decoArr.length ? `
                <span class="pu-theme-deco tl">${decoArr[0]||''}</span>
                <span class="pu-theme-deco tr">${decoArr[1]||decoArr[0]||''}</span>
                <span class="pu-theme-deco bl">${decoArr[0]||''}</span>
                <span class="pu-theme-deco br">${decoArr[1]||decoArr[0]||''}</span>` : '';
            const check = isSelected ? `<div class="pu-theme-check"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>` : '';
            return `<button class="pu-theme-card${isSelected?' selected':''}" onclick="puAddGen.selectTheme('${theme.id}')" type="button">
                <div class="pu-theme-preview" style="border-color:${theme.borderColor};border-width:${theme.borderWidth};border-style:${theme.borderStyle}">${deco}<span class="pu-theme-preview-label">Preview</span></div>
                <p class="pu-theme-name">${theme.name}</p>${check}
            </button>`;
        }).join('');
    }

    window.puAddGen = {
        generate: function() {
            syncState();
            generateProblems();
            if (state.activeNavTab !== 'generator') switchNavTab('generator');
        },
        reset: function() {
            if (getEl('gen-title')) getEl('gen-title').value = 'Addition Worksheet';
            if (getEl('gen-difficulty')) getEl('gen-difficulty').value = 'simple';
            if (getEl('gen-orientation')) getEl('gen-orientation').value = 'horizontal';
            if (getEl('gen-num-problems')) getEl('gen-num-problems').value = '20';
            if (getEl('gen-show-number')) getEl('gen-show-number').checked = true;
            if (getEl('gen-show-name')) getEl('gen-show-name').checked = true;
            if (getEl('gen-show-date')) getEl('gen-show-date').checked = true;
            state.problems = [];
            state.selectedTheme = themes[0];
            syncState();
            renderPreview();
            renderThemes();
        },
        selectTheme: function(id) {
            state.selectedTheme = themes.find(t => t.id === id) || themes[0];
            renderThemes();
            renderPreview();
        },
        switchTab: function(tab) { switchNavTab(tab); },
        switchPreview: function(tab) { switchPreviewTab(tab); },
        downloadWorksheet: function() { syncState(); openPrintWindow(false); },
        downloadAnswerKey: function() { syncState(); openPrintWindow(true); },
        print: function() { syncState(); openPrintWindow(state.activeTab === 'answer'); },
    };

    // Init
    renderThemes();
    renderPreview();
    switchNavTab('generator');

    // Live update on input change
    document.querySelectorAll('#gen-title,#gen-difficulty,#gen-orientation,#gen-num-problems,#gen-show-number,#gen-show-name,#gen-show-date').forEach(function(el) {
        el.addEventListener('change', function() {
            syncState();
            if (state.problems.length > 0) renderPreview();
        });
    });
})();

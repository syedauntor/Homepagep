@extends('layouts.app')

@section('title', 'Monthly Calendar Generator — PrintAndUse')
@push('styles')
<style>
  .cal-page{min-height:100vh;background:linear-gradient(180deg,#fafaf9,rgba(255,237,213,.15))}
  .cal-container{max-width:1400px;margin:0 auto;padding:2rem 1rem}
  @media(min-width:640px){.cal-container{padding:2rem 1.5rem}}
  @media(min-width:1024px){.cal-container{padding:2rem 2rem}}
  .breadcrumb{display:flex;align-items:center;gap:.375rem;font-size:.875rem;color:#6b7280;margin-bottom:2rem}
  .breadcrumb a{color:#6b7280;text-decoration:none;transition:color .15s}
  .breadcrumb a:hover{color:#ea580c}
  .breadcrumb .sep{width:.875rem;height:.875rem;opacity:.6}
  .hero{margin-bottom:2.5rem}
  .hero-row{display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem}
  .hero-icon{width:3rem;height:3rem;border-radius:1rem;background:#ffedd5;display:flex;align-items:center;justify-content:center;color:#ea580c}
  .hero h1{font-size:1.875rem;font-weight:900;color:#1c1917;letter-spacing:-.02em;margin:0}
  @media(min-width:768px){.hero h1{font-size:2.25rem}}
  .hero p{color:#6b7280;margin-top:.125rem}
  .panel-switcher{display:flex;gap:.5rem;margin-bottom:1.5rem;overflow-x:auto;padding-bottom:.25rem}
  .panel-btn{display:flex;align-items:center;gap:.5rem;padding:.625rem 1.25rem;border-radius:.75rem;font-weight:600;font-size:.875rem;white-space:nowrap;border:1px solid #e5e7eb;background:#fff;color:#6b7280;cursor:pointer;transition:all .15s}
  .panel-btn:hover{border-color:#d1d5db}
  .panel-btn.active{background:#111827;color:#fff;border-color:#111827;box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}
  .panel-btn svg{width:1rem;height:1rem}
  .layout{display:grid;gap:1.5rem}
  @media(min-width:1024px){.layout{grid-template-columns:380px 1fr}}
  .panel-card{background:#fff;border-radius:1.5rem;padding:1.5rem;box-shadow:0 18px 50px rgba(28,25,23,.08);border:1px solid #e7e5e4}
  .panel-card.simple{border-radius:1rem;border-color:#f3f4f6;box-shadow:0 1px 3px rgba(0,0,0,.06)}
  .field-label{display:block;font-size:.75rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem}
  .text-input{width:100%;padding:.75rem 1rem;background:#f9fafb;border:1px solid #e5e7eb;border-radius:.75rem;font-size:.875rem;color:#111827;transition:all .15s}
  .text-input:focus{outline:none;border-color:#f97316;box-shadow:0 0 0 2px #ffedd5}
  .banner-box{border:1px dashed #d6d3d1;background:#fafaf9;border-radius:1rem;padding:1rem;margin-top:.5rem}
  .banner-row{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem}
  .banner-row h3{font-size:.875rem;font-weight:900;color:#1c1917;margin:0}
  .banner-row p{font-size:.75rem;color:#78716c;margin:.25rem 0 0;line-height:1.4}
  .banner-preview{position:relative;margin-top:.75rem;overflow:hidden;border-radius:.75rem;border:1px solid #e7e5e4;background:#fff}
  .banner-preview img{height:6rem;width:100%;object-fit:cover}
  .banner-remove{position:absolute;right:.5rem;top:.5rem;border-radius:9999px;background:rgba(28,25,23,.8);border:none;color:#fff;padding:.375rem;cursor:pointer}
  .banner-remove svg{width:.875rem;height:.875rem;display:block}
  .banner-choose{margin-top:.75rem;display:flex;align-items:center;justify-content:center;border-radius:.75rem;background:#fff;padding:.75rem 1rem;font-size:.875rem;font-weight:700;color:#44403c;box-shadow:0 1px 2px rgba(0,0,0,.05);border:1px solid #e7e5e4;cursor:pointer;transition:all .15s}
  .banner-choose:hover{transform:translateY(-2px);border-color:#fdba74}
  .banner-choose svg{width:1rem;height:1rem;color:#f97316;margin-right:.5rem}
  .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
  .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem}
  .seg-btn{padding:.625rem;border-radius:.75rem;font-size:.875rem;font-weight:600;transition:all .15s;border:1px solid #e5e7eb;background:#f9fafb;color:#6b7280;cursor:pointer;text-transform:capitalize}
  .seg-btn:hover{border-color:#d1d5db}
  .seg-btn.active{background:#f97316;color:#fff;border-color:#f97316;box-shadow:0 1px 2px rgba(0,0,0,.05)}
  .toggle-btn{width:100%;display:flex;align-items:center;justify-content:space-between;padding:.75rem 1rem;border-radius:.75rem;transition:all .15s;border:1px solid #e5e7eb;background:#f9fafb;cursor:pointer}
  .toggle-btn.on{background:#fff7ed;border-color:#fcd9b6}
  .toggle-label{font-weight:600;color:#111827;font-size:.875rem}
  .toggle-track{width:2.5rem;height:1.5rem;border-radius:9999px;transition:background .15s;background:#d1d5db}
  .toggle-track.on{background:#f97316}
  .toggle-knob{width:1.25rem;height:1.25rem;background:#fff;border-radius:9999px;box-shadow:0 1px 2px rgba(0,0,0,.1);transition:transform .15s;margin-top:.125rem;margin-left:.125rem}
  .toggle-track.on .toggle-knob{transform:translateX(1rem)}
  .range-input{width:100%;accent-color:#f97316}
  .reset-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1rem;color:#6b7280;border-radius:.75rem;border:1px solid #e5e7eb;background:transparent;font-weight:600;font-size:.875rem;cursor:pointer;transition:all .15s}
  .reset-btn:hover{background:#f9fafb}
  .reset-btn svg{width:1rem;height:1rem}
  .theme-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
  .theme-card{border-radius:.75rem;padding:.75rem;text-align:left;cursor:pointer;transition:all .15s;border:1px solid #e5e7eb}
  .theme-card:hover{border-color:#d1d5db}
  .theme-card.active{border:2px solid #f97316;box-shadow:0 0 0 1px #f97316}
  .theme-swatch{height:5rem;border-radius:.5rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.25rem;margin-bottom:.5rem}
  .theme-colors{display:flex;gap:.375rem}
  .theme-color-dot{width:1.5rem;height:1.5rem;border-radius:.375rem}
  .theme-color-dot.bordered{border:1px solid #e5e7eb}
  .theme-name{font-size:.75rem;font-weight:700;color:#111827}
  .help-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.75rem}
  .help-item{display:flex;gap:.75rem}
  .help-num{flex-shrink:0;width:1.5rem;height:1.5rem;border-radius:9999px;background:#ffedd5;color:#ea580c;font-size:.75rem;font-weight:700;display:flex;align-items:center;justify-content:center}
  .help-text{font-size:.875rem;color:#374151}
  .preview-card{background:#fff;border-radius:1rem;border:1px solid #f3f4f6;box-shadow:0 1px 3px rgba(0,0,0,.06);overflow:hidden}
  .preview-header{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-bottom:1px solid #f3f4f6}
  .preview-header h2{font-size:.875rem;font-weight:700;color:#111827;margin:0}
  .preview-header p{font-size:.75rem;color:#a8a29e;margin:.125rem 0 0}
  .preview-badge{border-radius:9999px;background:#f5f5f4;padding:.25rem .75rem;font-size:.625rem;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:#78716c}
  .preview-stage{padding:1.25rem;background:#f5f5f4;display:flex;justify-content:center}
  @media(min-width:640px){.preview-stage{padding:2rem}}
  .preview-paper{width:100%;max-width:500px;overflow:hidden;border-radius:22px;border:1px solid #e7e5e4;background:#fff;box-shadow:0 22px 60px rgba(28,25,23,.18);transition:transform .3s}
  .preview-paper:hover{transform:translateY(-4px)}
  .preview-banner{position:relative;height:11rem;overflow:hidden}
  @media(min-width:640px){.preview-banner{height:14rem}}
  .preview-banner.has-img{background:#e7e5e4}
  .preview-banner.no-img{background:radial-gradient(circle at 20% 20%,#fed7aa,#fff7ed 35%,#f5f5f4)}
  .preview-banner img{height:100%;width:100%;object-fit:cover}
  .preview-banner-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.75rem;height:100%;color:#44403c}
  .preview-banner-empty-icon{display:flex;align-items:center;justify-content:center;width:3.5rem;height:3.5rem;border-radius:1rem;background:rgba(255,255,255,.8);color:#f97316;box-shadow:0 1px 2px rgba(0,0,0,.05);border:1px solid #ffedd5}
  .preview-banner-empty-icon svg{width:1.75rem;height:1.75rem}
  .preview-banner-empty-title{font-size:.75rem;font-weight:900;text-transform:uppercase;letter-spacing:.18em;text-align:center}
  .preview-banner-empty-sub{font-size:.6875rem;color:#78716c;margin-top:.25rem;text-align:center}
  .preview-banner-overlay{position:absolute;inset:0;display:flex;align-items:flex-end;padding:1rem 1.25rem;background:linear-gradient(0deg,rgba(0,0,0,.5),transparent 60%)}
  .preview-banner-overlay p{font-size:.625rem;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:rgba(255,255,255,.8);margin:0}
  .preview-cal-header{display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;border-bottom:4px solid;padding:.75rem 1.25rem 1rem}
  .preview-cal-header h3{font-size:1.5rem;font-weight:900;color:#1c1917;margin:0;letter-spacing:-.02em}
  .preview-day-headers{display:grid;grid-template-columns:repeat(7,1fr);gap:.25rem;padding:.75rem .75rem 0}
  .preview-dh{text-align:center;padding:.5rem 0;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
  .preview-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:.25rem;padding:0 .75rem .75rem}
  .preview-cell{border:1px solid #e5e7eb;border-radius:.375rem;padding:.375rem;display:flex;align-items:flex-start;justify-content:flex-end}
  .preview-cell.empty{border-color:#f3f4f6;background:transparent}
  .preview-cell-date{font-weight:700;color:#1f2937;line-height:1}
  .preview-notes{padding:0 1.25rem .75rem}
  .preview-notes-label{font-size:.875rem;font-weight:700;margin-bottom:.25rem}
  .preview-notes-line{border-bottom:1px solid #d1d5db;height:1rem;margin-bottom:.25rem}
  .preview-footer{text-align:center;padding:.75rem;border-top:1px solid #f3f4f6}
  .preview-footer p{font-size:.625rem;color:#9ca3af;margin:0}
  .action-bar{display:flex;flex-direction:column;gap:.75rem;border-top:1px solid #f3f4f6;background:#f9fafb;padding:1.25rem}
  @media(min-width:640px){.action-bar{flex-direction:row;padding:1.5rem}}
  .btn-download{flex:1;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.875rem 1.5rem;background:#1c1917;color:#fff;border-radius:.75rem;font-weight:700;border:none;cursor:pointer;transition:background .15s;box-shadow:0 1px 2px rgba(0,0,0,.05)}
  .btn-download:hover{background:#ea580c}
  .btn-download svg{width:1.25rem;height:1.25rem}
  .btn-print{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.875rem 1.5rem;background:#fff;color:#374151;border-radius:.75rem;font-weight:700;border:1px solid #e5e7eb;cursor:pointer;transition:background .15s}
  .btn-print:hover{background:#f9fafb}
  .btn-print svg{width:1.25rem;height:1.25rem}
  .related{margin-top:3rem}
  .related h2{font-size:1.125rem;font-weight:800;color:#1c1917;margin-bottom:1rem}
  .related-grid{display:grid;grid-template-columns:1fr;gap:.75rem}
  @media(min-width:640px){.related-grid{grid-template-columns:1fr 1fr}}
  .related-card{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;background:#fff;border:1px solid #e5e7eb;border-radius:.75rem;text-decoration:none;color:#1c1917;transition:all .15s}
  .related-card:hover{border-color:#fdba74;transform:translateY(-2px)}
  .related-card span{font-weight:600}
  .related-card svg{width:1.25rem;height:1.25rem;color:#9ca3af}
</style>
@endpush

@section('content')
<div class="cal-page">
  <div class="cal-container">
    {{-- Breadcrumb --}}
    <nav class="breadcrumb">
      <a href="/">Home</a>
      <svg class="sep" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      <a href="/generators">Generators</a>
      <svg class="sep" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      <span style="color:#111827;font-weight:500">Monthly Calendar</span>
    </nav>

    {{-- Hero --}}
    <div class="hero">
      <div class="hero-row">
        <div class="hero-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
        </div>
        <div>
          <h1>Monthly Calendar Generator</h1>
          <p>Design a beautiful printable calendar for any month</p>
        </div>
      </div>
    </div>

    {{-- Panel switcher --}}
    <div class="panel-switcher">
      <button class="panel-btn active" data-panel="settings" onclick="switchPanel('settings')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-9M14 17H5M20 17h-7"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
        Settings
      </button>
      <button class="panel-btn" data-panel="theme" onclick="switchPanel('theme')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4a4.6 4.6 0 0 0 4.6-4.6C20 6.6 16.4 2 12 2z"/></svg>
        Themes
      </button>
      <button class="panel-btn" data-panel="help" onclick="switchPanel('help')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        How it works
      </button>
    </div>

    <div class="layout">
      {{-- Left: controls --}}
      <div id="left-panel" style="display:flex;flex-direction:column;gap:1rem">

        {{-- Settings panel --}}
        <div id="panel-settings" class="panel-card">
          <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:.25rem">
            <div>
              <p style="font-size:.6875rem;font-weight:900;text-transform:uppercase;letter-spacing:.18em;color:#ea580c;margin:0">Build your page</p>
              <h2 style="font-size:1.125rem;font-weight:900;color:#1c1917;margin:0">Personalise the calendar</h2>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d6d3d1" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
          </div>

          <div style="margin-top:1.25rem">
            <label class="field-label">Custom Title</label>
            <input type="text" id="ctrl-title" class="text-input" placeholder="Leave empty for month name" oninput="updatePreview()">
          </div>

          {{-- Banner upload --}}
          <div class="banner-box" style="margin-top:1.25rem">
            <div class="banner-row">
              <div>
                <h3>Add a photo banner</h3>
                <p>Use a family photo, classroom scene, artwork, or seasonal image.</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" style="flex-shrink:0"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <div id="banner-preview" style="display:none">
              <div class="banner-preview">
                <img id="banner-img" src="" alt="Selected calendar banner" />
                <button class="banner-remove" onclick="removeBanner()" aria-label="Remove banner image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <div id="banner-choose">
              <label class="banner-choose">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                Choose image
                <input type="file" accept="image/jpeg,image/png,image/webp" id="banner-file" style="position:absolute;width:1px;height:1px;opacity:0" onchange="handleBannerUpload(event)">
              </label>
            </div>
          </div>

          {{-- Month / Year --}}
          <div class="grid-2" style="margin-top:1.25rem">
            <div>
              <label class="field-label">Month</label>
              <select id="ctrl-month" class="text-input" style="appearance:none;font-weight:500" onchange="updatePreview()">
              </select>
            </div>
            <div>
              <label class="field-label">Year</label>
              <input type="number" id="ctrl-year" class="text-input" min="2000" max="2100" onchange="updatePreview()">
            </div>
          </div>

          {{-- Week starts --}}
          <div style="margin-top:1.25rem">
            <label class="field-label">Week Starts</label>
            <div class="grid-2" style="gap:.5rem">
              <button class="seg-btn active" data-week="0" onclick="setWeekStart(0)">Sunday</button>
              <button class="seg-btn" data-week="1" onclick="setWeekStart(1)">Monday</button>
            </div>
          </div>

          {{-- Cell size --}}
          <div style="margin-top:1.25rem">
            <label class="field-label">Cell Size</label>
            <div class="grid-3">
              <button class="seg-btn" data-size="compact" onclick="setCellSize('compact')">compact</button>
              <button class="seg-btn active" data-size="regular" onclick="setCellSize('regular')">regular</button>
              <button class="seg-btn" data-size="spacious" onclick="setCellSize('spacious')">spacious</button>
            </div>
          </div>

          {{-- Notes --}}
          <div style="margin-top:1.25rem">
            <label class="field-label">Notes Section</label>
            <button class="toggle-btn on" id="toggle-notes" onclick="toggleNotes()">
              <span class="toggle-label" id="notes-status">Enabled</span>
              <div class="toggle-track on"><div class="toggle-knob"></div></div>
            </button>
            <div id="notes-extra" style="margin-top:.75rem;display:flex;flex-direction:column;gap:.75rem">
              <input type="text" id="ctrl-notes-label" class="text-input" placeholder="Notes label" value="Notes" oninput="updatePreview()">
              <div>
                <label class="field-label" style="margin-bottom:.25rem" id="note-rows-label">Lines: 3</label>
                <input type="range" min="1" max="6" value="3" class="range-input" id="ctrl-note-rows" oninput="updateNoteRows(this.value)">
              </div>
            </div>
          </div>

          {{-- Weekend --}}
          <div style="margin-top:1.25rem">
            <label class="field-label">Weekend Shading</label>
            <button class="toggle-btn on" id="toggle-weekend" onclick="toggleWeekend()">
              <span class="toggle-label" id="weekend-status">On</span>
              <div class="toggle-track on"><div class="toggle-knob"></div></div>
            </button>
          </div>

          <button class="reset-btn" style="margin-top:1.25rem" onclick="resetAll()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Reset all
          </button>
        </div>

        {{-- Theme panel --}}
        <div id="panel-theme" class="panel-card simple" style="display:none">
          <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:1rem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2"><path d="M12 3l1.9 5.8L20 10l-5 3.5L16 20l-4-3-4 3 1-6.5L4 10l6.1-1.2L12 3z"/></svg>
            <h2 style="font-size:.875rem;font-weight:700;color:#111827;margin:0">Pick a theme</h2>
          </div>
          <div class="theme-grid" id="theme-grid">
            @foreach ($themes as $t)
            <button class="theme-card {{ $t['id'] === 'clean' ? 'active' : '' }}" data-theme="{{ $t['id'] }}" onclick="setTheme('{{ $t['id'] }}')">
              <div class="theme-swatch" style="background:{{ $t['bg'] }}">
                <div class="theme-colors">
                  <div class="theme-color-dot" style="background:{{ $t['accent'] }}"></div>
                  <div class="theme-color-dot bordered" style="background:{{ $t['headerBg'] }}"></div>
                </div>
                @if ($t['decoration'])<span style="font-size:1.125rem">{{ $t['decoration'] }}</span>@endif
              </div>
              <p class="theme-name">{{ $t['name'] }}</p>
            </button>
            @endforeach
          </div>
        </div>

        {{-- Help panel --}}
        <div id="panel-help" class="panel-card simple" style="display:none">
          <h2 style="font-size:.875rem;font-weight:700;color:#111827;margin:0 0 1rem">How it works</h2>
          <ol class="help-list">
            @foreach (['Choose a month and year for your calendar','Decide if the week starts on Sunday or Monday','Pick a cell size — compact for small calendars, spacious for writing room','Add a notes section with custom label and line count','Switch to Themes to choose a color palette','Download or print your finished calendar'] as $i => $step)
            <li class="help-item">
              <span class="help-num">{{ $i + 1 }}</span>
              <span class="help-text">{{ $step }}</span>
            </li>
            @endforeach
          </ol>
        </div>
      </div>

      {{-- Right: live preview --}}
      <div style="display:flex;flex-direction:column;gap:1rem">
        <div class="preview-card">
          <div class="preview-header">
            <div>
              <h2>Live Preview</h2>
              <p>Your printable page updates as you edit</p>
            </div>
            <span class="preview-badge">A4 Portrait</span>
          </div>

          <div class="preview-stage">
            <div class="preview-paper" id="preview-paper" dir="ltr" style="font-family:Inter,sans-serif">
              <div class="preview-banner no-img" id="preview-banner">
                <div class="preview-banner-empty" id="preview-banner-empty">
                  <div class="preview-banner-empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </div>
                  <div>
                    <p class="preview-banner-empty-title">Make it yours</p>
                    <p class="preview-banner-empty-sub">Add a photo banner to begin</p>
                  </div>
                </div>
                <div class="preview-banner-overlay"><p>Printable monthly planner</p></div>
              </div>
              <div class="preview-cal-header" id="preview-cal-header">
                <h3 id="preview-title">January 2026</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="preview-cal-icon"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div class="preview-day-headers" id="preview-day-headers"></div>
              <div class="preview-grid" id="preview-grid"></div>
              <div class="preview-notes" id="preview-notes" style="display:none">
                <p class="preview-notes-label" id="preview-notes-label">Notes</p>
                <div id="preview-notes-lines"></div>
              </div>
              <div class="preview-footer"><p>Made for your month · PrintAndUse.com</p></div>
            </div>
          </div>

          <div class="action-bar">
            <button class="btn-download" onclick="downloadHTML()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </button>
            <button class="btn-print" onclick="openPrint()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>

    {{-- Related --}}
    <div class="related">
      <h2>More Calendar Generators</h2>
      <div class="related-grid">
        @foreach ($relatedGenerators as $gen)
        <a href="/generators/{{ $gen['slug'] }}" class="related-card">
          <span>{{ $gen['name'] }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
        @endforeach
      </div>
    </div>
  </div>
</div>

{{-- Populate month dropdown --}}
<script>
var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var dayNamesFull = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var dayNamesMonStart = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

var themes = @json($themes);

var state = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  weekStartsOn: 0,
  themeId: 'clean',
  title: '',
  showNotes: true,
  notesLabel: 'Notes',
  noteRows: 3,
  cellSize: 'regular',
  showWeekend: true,
  bannerImage: ''
};

// Populate month dropdown
(function(){
  var sel = document.getElementById('ctrl-month');
  monthNames.forEach(function(m, i){
    var opt = document.createElement('option');
    opt.value = i; opt.textContent = m;
    sel.appendChild(opt);
  });
  sel.value = state.month;
  document.getElementById('ctrl-year').value = state.year;
})();

function getTheme(){ return themes.find(function(t){return t.id===state.themeId}) || themes[0]; }

function getDaysInMonth(y, m){ return new Date(y, m+1, 0).getDate(); }
function getFirstDay(y, m, ws){ return (new Date(y, m, 1).getDay() - ws + 7) % 7; }

function switchPanel(id){
  ['settings','theme','help'].forEach(function(p){
    document.getElementById('panel-'+p).style.display = p===id ? '' : 'none';
  });
  document.querySelectorAll('.panel-btn').forEach(function(b){
    b.classList.toggle('active', b.dataset.panel===id);
  });
}

function setWeekStart(v){
  state.weekStartsOn = v;
  document.querySelectorAll('[data-week]').forEach(function(b){
    b.classList.toggle('active', Number(b.dataset.week)===v);
  });
  updatePreview();
}

function setCellSize(sz){
  state.cellSize = sz;
  document.querySelectorAll('[data-size]').forEach(function(b){
    b.classList.toggle('active', b.dataset.size===sz);
  });
  updatePreview();
}

function setTheme(id){
  state.themeId = id;
  document.querySelectorAll('[data-theme]').forEach(function(b){
    b.classList.toggle('active', b.dataset.theme===id);
  });
  updatePreview();
}

function toggleNotes(){
  state.showNotes = !state.showNotes;
  var btn = document.getElementById('toggle-notes');
  btn.classList.toggle('on', state.showNotes);
  btn.querySelector('.toggle-track').classList.toggle('on', state.showNotes);
  document.getElementById('notes-status').textContent = state.showNotes ? 'Enabled' : 'Disabled';
  document.getElementById('notes-extra').style.display = state.showNotes ? '' : 'none';
  updatePreview();
}

function toggleWeekend(){
  state.showWeekend = !state.showWeekend;
  var btn = document.getElementById('toggle-weekend');
  btn.classList.toggle('on', state.showWeekend);
  btn.querySelector('.toggle-track').classList.toggle('on', state.showWeekend);
  document.getElementById('weekend-status').textContent = state.showWeekend ? 'On' : 'Off';
  updatePreview();
}

function updateNoteRows(v){
  state.noteRows = Number(v);
  document.getElementById('note-rows-label').textContent = 'Lines: ' + v;
  updatePreview();
}

function handleBannerUpload(e){
  var file = e.target.files[0];
  if(!file) return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5*1024*1024) return;
  var reader = new FileReader();
  reader.onload = function(){ state.bannerImage = reader.result; updateBannerUI(); updatePreview(); };
  reader.readAsDataURL(file);
}

function removeBanner(){
  state.bannerImage = '';
  updateBannerUI();
  updatePreview();
}

function updateBannerUI(){
  var pv = document.getElementById('banner-preview');
  var ch = document.getElementById('banner-choose');
  if(state.bannerImage){
    document.getElementById('banner-img').src = state.bannerImage;
    pv.style.display = '';
    ch.style.display = 'none';
  } else {
    pv.style.display = 'none';
    ch.style.display = '';
  }
}

function resetAll(){
  var now = new Date();
  state = { year: now.getFullYear(), month: now.getMonth(), weekStartsOn: 0, themeId: 'clean', title: '', showNotes: true, notesLabel: 'Notes', noteRows: 3, cellSize: 'regular', showWeekend: true, bannerImage: '' };
  document.getElementById('ctrl-title').value = '';
  document.getElementById('ctrl-month').value = state.month;
  document.getElementById('ctrl-year').value = state.year;
  document.getElementById('ctrl-notes-label').value = 'Notes';
  document.getElementById('ctrl-note-rows').value = 3;
  document.getElementById('note-rows-label').textContent = 'Lines: 3';
  setWeekStart(0); setCellSize('regular'); setTheme('clean');
  if(!state.showNotes) toggleNotes();
  if(!state.showWeekend) toggleWeekend();
  updateBannerUI();
  updatePreview();
}

function readControls(){
  state.title = document.getElementById('ctrl-title').value;
  state.month = Number(document.getElementById('ctrl-month').value);
  state.year = Number(document.getElementById('ctrl-year').value);
  state.notesLabel = document.getElementById('ctrl-notes-label').value || 'Notes';
}

var cellHeightMap = { compact:'32px', regular:'48px', spacious:'68px' };
var dateFontMap   = { compact:'13px', regular:'15px', spacious:'17px' };

function updatePreview(){
  readControls();
  var t = getTheme();
  var daysInMonth = getDaysInMonth(state.year, state.month);
  var firstDay = getFirstDay(state.year, state.month, state.weekStartsOn);
  var dayLabels = state.weekStartsOn === 0 ? dayNamesFull : dayNamesMonStart;
  var displayTitle = state.title || (monthNames[state.month] + ' ' + state.year);

  // Paper background
  document.getElementById('preview-paper').style.background = t.bg;

  // Banner
  var banner = document.getElementById('preview-banner');
  var empty = document.getElementById('preview-banner-empty');
  if(state.bannerImage){
    banner.className = 'preview-banner has-img';
    empty.style.display = 'none';
    if(!banner.querySelector('img')){
      var img = document.createElement('img'); img.id='preview-banner-img';
      banner.insertBefore(img, banner.firstChild);
    }
    document.getElementById('preview-banner-img').src = state.bannerImage;
  } else {
    banner.className = 'preview-banner no-img';
    empty.style.display = '';
    var oldImg = banner.querySelector('img');
    if(oldImg) oldImg.remove();
  }

  // Header
  var header = document.getElementById('preview-cal-header');
  header.style.borderColor = t.accent;
  header.style.background = t.headerBg;
  document.getElementById('preview-title').textContent = displayTitle;
  document.getElementById('preview-cal-icon').style.color = t.accent;

  // Day headers
  var dh = document.getElementById('preview-day-headers');
  dh.innerHTML = '';
  dayLabels.forEach(function(d){
    var el = document.createElement('div');
    el.className = 'preview-dh';
    el.style.color = t.accent;
    el.textContent = d;
    dh.appendChild(el);
  });

  // Grid
  var grid = document.getElementById('preview-grid');
  grid.innerHTML = '';
  var cellH = cellHeightMap[state.cellSize];
  var fontSz = dateFontMap[state.cellSize];
  var cells = [];
  for(var i=0;i<firstDay;i++) cells.push(null);
  for(var d=1;d<=daysInMonth;d++) cells.push(d);
  var fillTotal = cells.length <= 35 ? 35 : 42;
  while(cells.length < fillTotal) cells.push(null);

  cells.forEach(function(cell){
    var el = document.createElement('div');
    el.className = 'preview-cell';
    el.style.height = cellH;
    if(cell === null){
      el.classList.add('empty');
    } else {
      var dow = (new Date(state.year, state.month, cell).getDay() - state.weekStartsOn + 7) % 7;
      var isWeekend = dow === 5 || dow === 6;
      el.style.borderColor = '#e5e7eb';
      el.style.background = state.showWeekend && isWeekend ? t.headerBg + '66' : t.cellBg;
      var span = document.createElement('span');
      span.className = 'preview-cell-date';
      span.style.fontSize = fontSz;
      span.textContent = cell;
      el.appendChild(span);
    }
    grid.appendChild(el);
  });

  // Notes
  var notes = document.getElementById('preview-notes');
  if(state.showNotes){
    notes.style.display = '';
    document.getElementById('preview-notes-label').textContent = state.notesLabel;
    document.getElementById('preview-notes-label').style.color = t.accent;
    var lines = document.getElementById('preview-notes-lines');
    lines.innerHTML = '';
    for(var n=0;n<state.noteRows;n++){
      var ln = document.createElement('div');
      ln.className = 'preview-notes-line';
      lines.appendChild(ln);
    }
  } else {
    notes.style.display = 'none';
  }
}

// Print / Download
var printCellHeightMap = { compact:'9mm', regular:'13mm', spacious:'18mm' };
var printDateFontMap   = { compact:'11px', regular:'13px', spacious:'15px' };
var printBannerHeightMap = { compact:'85mm', regular:'75mm', spacious:'60mm' };

function buildPrintHTML(){
  var t = getTheme();
  var daysInMonth = getDaysInMonth(state.year, state.month);
  var firstDay = getFirstDay(state.year, state.month, state.weekStartsOn);
  var dayLabels = state.weekStartsOn === 0 ? dayNamesFull : dayNamesMonStart;
  var displayTitle = state.title || (monthNames[state.month] + ' ' + state.year);

  var cells = [];
  for(var i=0;i<firstDay;i++) cells.push('<div class="cell empty"></div>');
  for(var d=1;d<=daysInMonth;d++){
    var dow = (new Date(state.year, state.month, d).getDay() - state.weekStartsOn + 7) % 7;
    var isWeekend = dow === 5 || dow === 6;
    var wClass = state.showWeekend && isWeekend ? ' weekend' : '';
    cells.push('<div class="cell'+wClass+'"><span class="date">'+d+'</span></div>');
  }
  var fillCount = cells.length <= 35 ? 35 : 42;
  while(cells.length < fillCount) cells.push('<div class="cell empty"></div>');

  var dayHeaderHTML = dayLabels.map(function(d){ return '<div class="dh">'+d+'</div>'; }).join('');
  var bannerHTML = state.bannerImage
    ? '<div class="photo-banner"><img src="'+state.bannerImage+'" alt="Calendar banner" /><div class="photo-overlay"><span>PRINTABLE MONTHLY PLANNER</span></div></div>'
    : '';
  var notesHTML = state.showNotes
    ? '<div class="notes"><div class="notes-label">'+state.notesLabel+'</div>'+
      Array.from({length:state.noteRows}).map(function(){return '<div class="notes-line"></div>';}).join('')+'</div>'
    : '';

  var ch = printCellHeightMap[state.cellSize];
  var dfs = printDateFontMap[state.cellSize];
  var pbh = printBannerHeightMap[state.cellSize];
  var numRows = cells.length / 7;

  return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+displayTitle+'</title>'+
  '<style>'+
  '@page{size:A4 portrait;margin:10mm}'+
  '@media print{html,body{width:190mm;min-height:277mm}.page{page-break-inside:avoid}}'+
  '*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
  'html,body{margin:0;padding:0;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;direction:ltr}'+
  '.page{width:190mm;height:277mm;min-height:277mm;display:flex;flex-direction:column;background:#fff;overflow:hidden;direction:ltr}'+
  '.photo-banner{flex:1 1 0;min-height:'+pbh+';overflow:hidden;position:relative;background:'+t.headerBg+'}'+
  '.photo-banner img{width:100%;height:100%;object-fit:cover;display:block;position:absolute;top:0;left:0}'+
  '.photo-overlay{position:absolute;inset:0;display:flex;align-items:flex-end;padding:12px 20px;background:linear-gradient(180deg,transparent 45%,rgba(17,24,39,.48))}'+
  '.photo-overlay span{font-size:10px;font-weight:800;letter-spacing:2px;color:#fff}'+
  '.cal-header{background:'+t.headerBg+';padding:11px 20px 13px;text-align:left;border-bottom:4px solid '+t.accent+'}'+
  '.cal-header h1{font-size:28px;font-weight:900;color:#111827;margin:0;letter-spacing:-.5px}'+
  '.cal-body{padding:0 4px;flex:0 0 auto}'+
  '.days-row{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin:6px 0 4px}'+
  '.dh{text-align:center;font-size:12px;font-weight:800;color:'+t.accent+';padding:6px 0;text-transform:uppercase;letter-spacing:1.5px}'+
  '.grid{display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat('+numRows+','+ch+');gap:3px}'+
  '.cell{border:1px solid #e5e7eb;padding:3px 5px;display:flex;align-items:flex-start;justify-content:flex-end;background:'+t.cellBg+'}'+
  '.cell.empty{border-color:#f3f4f6;background:transparent}'+
  '.cell.weekend{background:'+t.headerBg+'66}'+
  '.date{font-size:'+dfs+';font-weight:700;color:#1f2937}'+
  '.notes{margin-top:12px;padding:0 4px;flex:0 0 auto}'+
  '.spacer{display:none}'+
  '.notes-label{font-size:13px;font-weight:800;color:'+t.accent+';margin-bottom:3px}'+
  '.notes-line{border-bottom:1px solid #d1d5db;height:14px;margin-bottom:3px}'+
  '.footer{flex:0 0 auto;text-align:center;font-size:9px;color:#9ca3af;padding:8px 0 4px}.footer p{margin:2px 0}.footer p:last-child{margin-bottom:0}'+
  '</style></head><body>'+
  '<div class="page">'+
  bannerHTML+
  '<div class="cal-header"><h1>'+displayTitle+'</h1></div>'+
  '<div class="cal-body"><div class="days-row">'+dayHeaderHTML+'</div><div class="grid">'+cells.join('')+'</div></div>'+
  notesHTML+
  '<div class="spacer"></div>'+
  '<div class="footer"><p>Find more printable resources at PrintAndUse.com</p><p>Copyright &copy;2025 - www.printanduse.com | All rights reserved</p></div>'+
  '</div></body></html>';
}

function openPrint(){
  var html = buildPrintHTML();
  var iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;border:none';
  document.body.appendChild(iframe);
  var doc = iframe.contentWindow ? iframe.contentWindow.document : null;
  if(!doc){ document.body.removeChild(iframe); return; }
  var started = false;
  iframe.onload = function(){
    if(started) return; started = true;
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(function(){ if(iframe.parentNode) iframe.parentNode.removeChild(iframe); }, 1500);
  };
  doc.open(); doc.write(html); doc.close();
}

function downloadHTML(){
  var html = buildPrintHTML();
  var blob = new Blob([html], { type: 'text/html' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  var displayTitle = state.title || (monthNames[state.month] + ' ' + state.year);
  a.href = url;
  a.download = displayTitle.replace(/[^a-zA-Z0-9]/g, '_') + '_calendar.html';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Initial render
updatePreview();
</script>
@endsection

<?php
/**
 * Template Name: Generator - Subtraction
 */
get_header();
wp_enqueue_script( 'pu-subtraction-gen', get_template_directory_uri() . '/assets/js/generators/subtraction-generator.js', array(), '1.0.0', true );
?>

<div class="pu-generator-page">
  <div class="container">
    <nav class="pu-breadcrumb">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      <a href="<?php echo esc_url( home_url( '/generators' ) ); ?>">Worksheet Generator</a>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      <span>Subtraction Generator</span>
    </nav>
    <div class="text-center" style="margin-bottom:1.5rem">
      <h1 style="font-size:clamp(1.5rem,4vw,2.5rem);font-weight:800;color:#111827;margin-bottom:.5rem">Subtraction Generator</h1>
      <p style="color:#6b7280">Keep it to 20 items or less</p>
    </div>
    <div class="pu-gen-top-bar">
      <div class="pu-gen-tabs">
        <button class="pu-gen-tab active" id="tab-generator" onclick="puSubGen.switchTab('generator')" type="button">Generator</button>
        <button class="pu-gen-tab" id="tab-theme" onclick="puSubGen.switchTab('theme')" type="button">Theme</button>
      </div>
      <button class="pu-gen-howto-btn" id="tab-howto" onclick="puSubGen.switchTab('howto')" type="button">
        How to make
        <div class="play-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>
      </button>
    </div>
    <div class="pu-gen-layout">
      <div class="pu-gen-settings-panel">
        <div id="panel-generator">
          <h2 class="pu-form-section-title" style="margin-top:0">Worksheet Settings</h2>
          <div class="pu-form-group"><label class="pu-form-label" for="gen-title">Title</label><input type="text" id="gen-title" class="pu-form-input" value="Subtraction Worksheet"></div>
          <div class="pu-form-checkbox-group" style="margin-bottom:1.5rem">
            <label class="pu-form-checkbox"><input type="checkbox" id="gen-show-name" checked> Show Name</label>
            <label class="pu-form-checkbox"><input type="checkbox" id="gen-show-date" checked> Show Date</label>
          </div>
          <h2 class="pu-form-section-title">Problem Settings</h2>
          <div class="pu-form-grid-2" style="margin-bottom:1rem">
            <div class="pu-form-group" style="margin:0"><label class="pu-form-label" for="gen-difficulty">Number of Digits</label><select id="gen-difficulty" class="pu-form-select"><option value="simple">Simple (1 digit)</option><option value="medium">Medium (2 digits)</option><option value="hard">Hard (3 digits)</option></select></div>
            <div class="pu-form-group" style="margin:0"><label class="pu-form-label" for="gen-orientation">Orientation</label><select id="gen-orientation" class="pu-form-select"><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></select></div>
          </div>
          <div class="pu-form-grid-2" style="margin-bottom:1rem">
            <div class="pu-form-group" style="margin:0"><label class="pu-form-label" for="gen-num-problems">Number of Problems</label><input type="number" id="gen-num-problems" class="pu-form-input" min="1" max="20" value="20"></div>
            <div></div>
          </div>
          <label class="pu-form-checkbox" style="margin-bottom:1.5rem"><input type="checkbox" id="gen-show-number" checked> Show Problem Number</label>
          <div class="pu-gen-actions">
            <button type="button" class="pu-btn-reset" onclick="puSubGen.reset()">Reset</button>
            <button type="button" class="pu-btn-generate" onclick="puSubGen.generate()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
              Regenerate Subtraction
            </button>
          </div>
        </div>
        <div id="panel-theme" style="display:none"><h2 class="pu-form-section-title" style="margin-top:0">Select Theme</h2><div id="theme-grid" class="pu-theme-grid"></div></div>
        <div id="panel-howto" style="display:none"><h2 class="pu-form-section-title" style="margin-top:0">How to Make Subtraction Worksheets</h2><ol style="list-style:decimal;padding-left:1.5rem;display:flex;flex-direction:column;gap:.75rem;color:#374151"><li>Choose your worksheet settings in the Generator tab</li><li>Select a theme/border style in the Theme tab</li><li>Click "Regenerate Subtraction" to create new problems</li><li>Preview your worksheet and answer key</li><li>Download or print your worksheet</li></ol></div>
      </div>
      <div class="pu-gen-preview-panel">
        <div class="pu-preview-header">
          <h2>Worksheet Preview</h2>
          <div class="pu-preview-tabs">
            <button class="pu-preview-tab active" id="preview-tab-worksheet" onclick="puSubGen.switchPreview('worksheet')" type="button">Worksheet</button>
            <button class="pu-preview-tab" id="preview-tab-answer" onclick="puSubGen.switchPreview('answer')" type="button">Answer Key</button>
          </div>
        </div>
        <div id="pu-preview-area"></div>
        <div id="pu-download-wrap" class="pu-preview-actions" style="display:none">
          <button type="button" class="pu-btn-orange-full" onclick="puSubGen.downloadWorksheet()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download Worksheet</button>
          <button type="button" class="pu-btn-outline-orange-full" onclick="puSubGen.downloadAnswerKey()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download Answer Key</button>
          <button type="button" class="pu-btn-outline-orange-full" onclick="puSubGen.print()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>Print</button>
        </div>
      </div>
    </div>
  </div>
</div>
<?php get_footer(); ?>

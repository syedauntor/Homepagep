<?php
/**
 * Template Name: Generator - Name Tracing
 */
get_header();
wp_enqueue_script( 'pu-name-tracing-gen', get_template_directory_uri() . '/assets/js/generators/name-tracing-generator.js', array(), '1.0.0', true );
?>
<div class="pu-generator-page"><div class="container">
  <nav class="pu-breadcrumb"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg><a href="<?php echo esc_url(home_url('/generators')); ?>">Worksheet Generator</a><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg><span>Name Tracing Worksheets</span></nav>
  <div class="text-center" style="margin-bottom:1.5rem"><h1 style="font-size:clamp(1.5rem,4vw,2.5rem);font-weight:800;color:#111827;margin-bottom:.5rem">Name Tracing Worksheets</h1><p style="color:#6b7280">Create custom tracing worksheets for handwriting practice</p></div>
  <div class="pu-gen-top-bar">
    <div class="pu-gen-tabs"><button class="pu-gen-tab active" id="tab-generator" onclick="puNameGen.switchTab('generator')" type="button">Generator</button><button class="pu-gen-tab" id="tab-theme" onclick="puNameGen.switchTab('theme')" type="button">Theme</button></div>
    <button class="pu-gen-howto-btn" id="tab-howto" onclick="puNameGen.switchTab('howto')" type="button">How to make<div class="play-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg></div></button>
  </div>
  <div class="pu-gen-layout">
    <div class="pu-gen-settings-panel">
      <div id="panel-generator">
        <h2 class="pu-form-section-title" style="margin-top:0">Worksheet Settings</h2>
        <div class="pu-form-group"><label class="pu-form-label" for="gen-title">Title</label><input type="text" id="gen-title" class="pu-form-input" value="Name Tracing Generator"></div>
        <div class="pu-form-checkbox-group" style="margin-bottom:1.5rem"><label class="pu-form-checkbox"><input type="checkbox" id="gen-show-name" checked> Show Name</label><label class="pu-form-checkbox"><input type="checkbox" id="gen-show-date" checked> Show Date</label></div>
        <h2 class="pu-form-section-title">Text</h2>
        <div class="pu-form-grid-2" style="margin-bottom:1rem">
          <div class="pu-form-group" style="margin:0"><input type="text" id="gen-text" class="pu-form-input" value="JASMINE" placeholder="Enter text to trace"></div>
          <div class="pu-form-group" style="margin:0"><select id="gen-font" class="pu-form-select"><option value="Codystar">Codystar</option><option value="Raleway Dots">Raleway Dots</option></select></div>
        </div>
        <div class="pu-form-grid-2" style="margin-bottom:1rem">
          <div class="pu-form-group" style="margin:0"><label class="pu-form-label" for="gen-font-size">Size</label><select id="gen-font-size" class="pu-form-select"><option value="30">30</option><option value="40">40</option><option value="50" selected>50</option><option value="60">60</option><option value="70">70</option><option value="80">80</option></select></div>
          <div class="pu-form-group" style="margin:0"><label class="pu-form-label">Color</label><div class="pu-color-group"><input type="color" id="gen-color" value="#000000"><input type="text" id="gen-color-text" class="pu-form-input" value="#000000" style="flex:1"></div></div>
        </div>
        <h2 class="pu-form-section-title">Text Settings</h2>
        <div class="pu-form-grid-2" style="margin-bottom:1rem">
          <div class="pu-form-group" style="margin:0"><label class="pu-form-label" for="gen-lines">Lines</label><select id="gen-lines" class="pu-form-select"><option value="5">5</option><option value="6">6</option><option value="7" selected>7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select></div>
          <div class="pu-form-group" style="margin:0"><label class="pu-form-label" for="gen-spacing">Spacing</label><select id="gen-spacing" class="pu-form-select"><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div>
        </div>
        <h2 class="pu-form-section-title">Layout</h2>
        <div class="pu-radio-group" style="margin-bottom:1.5rem">
          <label class="pu-radio-label"><input type="radio" name="gen-cols" id="gen-col-1" value="1"> 1 column</label>
          <label class="pu-radio-label"><input type="radio" name="gen-cols" id="gen-col-2" value="2"> 2 columns</label>
          <label class="pu-radio-label"><input type="radio" name="gen-cols" id="gen-col-3" value="3" checked> 3 columns</label>
        </div>
        <div class="pu-gen-actions">
          <button type="button" class="pu-btn-reset" onclick="puNameGen.reset()">Reset</button>
          <button type="button" class="pu-btn-generate" onclick="puNameGen.generate()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>Generate Tracing</button>
        </div>
      </div>
      <div id="panel-theme" style="display:none"><h2 class="pu-form-section-title" style="margin-top:0">Select Theme</h2><div id="theme-grid" class="pu-theme-grid"></div></div>
      <div id="panel-howto" style="display:none"><h2 class="pu-form-section-title" style="margin-top:0">How to Make Name Tracing Worksheets</h2><ol style="list-style:decimal;padding-left:1.5rem;display:flex;flex-direction:column;gap:.75rem;color:#374151"><li>Enter the text you want to trace</li><li>Select font, size, and color preferences</li><li>Adjust the number of lines and spacing</li><li>Choose your layout (1, 2, or 3 columns)</li><li>Select a theme in the Theme tab</li><li>Click "Generate Tracing" to create your worksheet</li><li>Download or print your worksheet</li></ol></div>
    </div>
    <div class="pu-gen-preview-panel">
      <div class="pu-preview-header"><h2>Worksheet Preview</h2></div>
      <div id="pu-preview-area"></div>
      <div id="pu-download-wrap" class="pu-preview-actions" style="display:none">
        <button type="button" class="pu-btn-orange-full" onclick="puNameGen.download()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Download Worksheet</button>
        <button type="button" class="pu-btn-outline-orange-full" onclick="puNameGen.print()"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>Print</button>
      </div>
    </div>
  </div>
</div></div>
<?php get_footer(); ?>

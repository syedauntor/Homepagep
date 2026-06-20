<?php
/**
 * Template Name: Generators Page
 */
get_header();
?>

<div class="pu-generators-hero">
    <div class="container">
        <p class="pu-label">FREE TOOLS</p>
        <h1>Worksheet Generators</h1>
        <p>Create custom printable worksheets in seconds with our easy-to-use interactive generators</p>
    </div>
</div>

<div class="pu-section bg-white">
    <div class="container">

        <!-- Math Generators -->
        <div class="pu-gen-group" id="math">
            <div class="pu-gen-group-header">
                <h2>Math Generators</h2>
                <p>Practice arithmetic with customizable difficulty levels and layouts</p>
            </div>
            <div class="pu-generators-grid">
                <?php
                $math_generators = array(
                    array( 'name' => 'Addition Generator',      'desc' => 'Generate addition worksheets with custom difficulty',    'color' => '#3b82f6', 'link' => '/generator/addition',        'img' => '' ),
                    array( 'name' => 'Subtraction Generator',   'desc' => 'Create subtraction practice sheets easily',              'color' => '#22c55e', 'link' => '/generator/subtraction',     'img' => '' ),
                    array( 'name' => 'Multiplication Generator','desc' => 'Multiplication tables and random problems',              'color' => '#f59e0b', 'link' => '/generator/multiplication',  'img' => '' ),
                    array( 'name' => 'Division Generator',      'desc' => 'Long and short division practice worksheets',            'color' => '#ef4444', 'link' => '/generator/division',        'img' => '' ),
                );
                foreach ( $math_generators as $gen ) :
                ?>
                <a href="<?php echo esc_url( home_url( $gen['link'] ) ); ?>" class="pu-gen-card">
                    <div class="pu-gen-card-img">
                        <div class="pu-gen-card-img-placeholder" style="background:linear-gradient(135deg,<?php echo esc_attr($gen['color']); ?>22,<?php echo esc_attr($gen['color']); ?>44)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="<?php echo esc_attr($gen['color']); ?>" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="4" height="4" x="3" y="3" rx=".5"/><rect width="4" height="4" x="10" y="3" rx=".5"/><rect width="4" height="4" x="17" y="3" rx=".5"/><rect width="4" height="4" x="3" y="10" rx=".5"/><rect width="4" height="4" x="10" y="10" rx=".5"/><rect width="4" height="4" x="17" y="10" rx=".5"/><rect width="4" height="4" x="3" y="17" rx=".5"/><rect width="4" height="4" x="10" y="17" rx=".5"/><rect width="4" height="4" x="17" y="17" rx=".5"/></svg>
                        </div>
                    </div>
                    <div class="pu-gen-card-body">
                        <h3><?php echo esc_html( $gen['name'] ); ?></h3>
                        <p><?php echo esc_html( $gen['desc'] ); ?></p>
                        <span class="pu-gen-card-link">
                            Try Now
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </span>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Tracing Generators -->
        <div class="pu-gen-group" id="tracing">
            <div class="pu-gen-group-header">
                <h2>Tracing Practice</h2>
                <p>Beautiful handwriting and letter tracing worksheets</p>
            </div>
            <div class="pu-generators-grid">
                <?php
                $tracing_generators = array(
                    array( 'name' => 'Name Tracing Generator',           'desc' => 'Create personalized name tracing worksheets',             'color' => '#ec4899', 'link' => '/generator/name-tracing' ),
                    array( 'name' => 'Alphabet Tracing Generator',       'desc' => 'Uppercase and lowercase alphabet tracing sheets',          'color' => '#f97316', 'link' => '/generator/alphabet-tracing' ),
                    array( 'name' => 'Name Tracing + Coloring',          'desc' => 'Name tracing with coloring activity combined',             'color' => '#8b5cf6', 'link' => '/generator/name-tracing-coloring' ),
                );
                foreach ( $tracing_generators as $gen ) :
                ?>
                <a href="<?php echo esc_url( home_url( $gen['link'] ) ); ?>" class="pu-gen-card">
                    <div class="pu-gen-card-img">
                        <div class="pu-gen-card-img-placeholder" style="background:linear-gradient(135deg,<?php echo esc_attr($gen['color']); ?>22,<?php echo esc_attr($gen['color']); ?>44)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="<?php echo esc_attr($gen['color']); ?>" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </div>
                    </div>
                    <div class="pu-gen-card-body">
                        <h3><?php echo esc_html( $gen['name'] ); ?></h3>
                        <p><?php echo esc_html( $gen['desc'] ); ?></p>
                        <span class="pu-gen-card-link">Try Now <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Activity Generators -->
        <div class="pu-gen-group" id="activities">
            <div class="pu-gen-group-header">
                <h2>Activity Generators</h2>
                <p>Fun puzzles and activity worksheets — coming soon!</p>
            </div>
            <div class="pu-generators-grid">
                <?php
                $activity_generators = array(
                    array( 'name' => 'Word Search Generator',   'desc' => 'Create custom word search puzzles',                'color' => '#06b6d4', 'link' => '#' ),
                    array( 'name' => 'Crossword Generator',     'desc' => 'Build crossword puzzles with your own words',      'color' => '#84cc16', 'link' => '#' ),
                    array( 'name' => 'Sudoku Generator',        'desc' => 'Generate easy to hard sudoku puzzles',             'color' => '#f59e0b', 'link' => '#' ),
                    array( 'name' => 'Maze Generator',          'desc' => 'Create printable mazes for kids',                  'color' => '#8b5cf6', 'link' => '#' ),
                );
                foreach ( $activity_generators as $gen ) :
                ?>
                <div class="pu-gen-card" style="opacity:.7;cursor:default">
                    <div class="pu-gen-card-img">
                        <div class="pu-gen-card-img-placeholder" style="background:linear-gradient(135deg,<?php echo esc_attr($gen['color']); ?>22,<?php echo esc_attr($gen['color']); ?>44)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="<?php echo esc_attr($gen['color']); ?>" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </div>
                    </div>
                    <div class="pu-gen-card-body">
                        <h3><?php echo esc_html( $gen['name'] ); ?></h3>
                        <p><?php echo esc_html( $gen['desc'] ); ?></p>
                        <span class="pu-gen-card-link" style="color:#9ca3af">Coming Soon</span>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

    </div>
</div>

<?php get_footer(); ?>

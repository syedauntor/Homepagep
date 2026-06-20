<?php get_header(); ?>

<section class="pu-section bg-gray-50">
    <div class="container">
        <!-- Page header -->
        <div class="pu-archive-header">
            <?php if ( is_category() ) : ?>
                <p class="pu-label"><?php single_cat_title( 'CATEGORY: ' ); ?></p>
                <h1><?php single_cat_title(); ?></h1>
                <?php $desc = category_description(); if ( $desc ) : ?><p class="pu-section-desc"><?php echo wp_kses_post( $desc ); ?></p><?php endif; ?>
            <?php elseif ( is_tag() ) : ?>
                <p class="pu-label">TAG</p>
                <h1><?php single_tag_title(); ?></h1>
            <?php elseif ( is_author() ) : ?>
                <p class="pu-label">AUTHOR</p>
                <h1><?php the_author(); ?></h1>
            <?php elseif ( is_search() ) : ?>
                <p class="pu-label">SEARCH RESULTS</p>
                <h1>Results for: "<?php echo esc_html( get_search_query() ); ?>"</h1>
            <?php else : ?>
                <p class="pu-label">BLOG</p>
                <h1>All Blog Posts</h1>
                <p class="pu-section-desc">Discover our complete collection of educational resources</p>
            <?php endif; ?>
        </div>

        <?php if ( have_posts() ) : ?>
        <div class="pu-posts-grid">
            <?php while ( have_posts() ) : the_post(); ?>
                <?php get_template_part( 'template-parts/post', 'card' ); ?>
            <?php endwhile; ?>
        </div>

        <!-- Pagination -->
        <div class="pu-pagination">
            <?php
            echo paginate_links( array(
                'prev_text' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg> Previous',
                'next_text' => 'Next <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
            ) );
            ?>
        </div>

        <?php else : ?>
        <div class="pu-empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <p><?php _e( 'No posts found.', 'printanduse' ); ?></p>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="pu-btn-primary"><?php _e( 'Back to Home', 'printanduse' ); ?></a>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>

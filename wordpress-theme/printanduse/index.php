<?php get_header(); ?>

<section class="pu-section bg-gray-50">
    <div class="container">
        <div class="pu-archive-header">
            <p class="pu-label">BLOG</p>
            <h1>All Blog Posts</h1>
            <p class="pu-section-desc">Discover our complete collection of educational resources and ideas</p>
        </div>

        <?php if ( have_posts() ) : ?>
        <div class="pu-posts-grid">
            <?php while ( have_posts() ) : the_post(); ?>
                <?php get_template_part( 'template-parts/post', 'card' ); ?>
            <?php endwhile; ?>
        </div>
        <div class="pu-pagination">
            <?php echo paginate_links( array(
                'prev_text' => '&larr; Previous',
                'next_text' => 'Next &rarr;',
            ) ); ?>
        </div>
        <?php else : ?>
        <div class="pu-empty-state">
            <p><?php _e( 'No posts found.', 'printanduse' ); ?></p>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>

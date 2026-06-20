<?php get_header(); ?>

<div class="container pu-page-content">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class( 'pu-page-article' ); ?>>
        <h1 class="pu-page-title"><?php the_title(); ?></h1>
        <div class="pu-post-content">
            <?php the_content(); ?>
        </div>
    </article>
    <?php endwhile; endif; ?>
</div>

<?php get_footer(); ?>

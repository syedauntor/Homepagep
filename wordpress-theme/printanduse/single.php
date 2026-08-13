<?php get_header(); ?>

<div class="container pu-page-content">
    <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

    <article id="post-<?php the_ID(); ?>" <?php post_class( 'pu-single-post' ); ?>>

        <?php if ( has_post_thumbnail() ) : ?>
        <div class="pu-single-hero-img">
            <?php the_post_thumbnail( 'large' ); ?>
        </div>
        <?php endif; ?>

        <div class="pu-single-content-wrap">
            <!-- Breadcrumb -->
            <nav class="pu-breadcrumb">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                <a href="<?php echo esc_url( home_url( '/blog' ) ); ?>">Blog</a>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                <span><?php the_title(); ?></span>
            </nav>

            <!-- Post meta -->
            <div class="pu-post-meta">
                <?php $cats = get_the_category(); if ( $cats ) : ?>
                <a href="<?php echo esc_url( get_category_link( $cats[0]->term_id ) ); ?>" class="pu-post-category"><?php echo esc_html( $cats[0]->name ); ?></a>
                <?php endif; ?>
                <span class="pu-post-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <?php echo esc_html( get_the_date( 'd M Y' ) ); ?>
                </span>
                <span class="pu-post-meta-item pu-orange">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    <?php echo number_format( printanduse_get_post_views( get_the_ID() ) ); ?>
                </span>
                <span class="pu-post-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <?php the_author(); ?>
                </span>
            </div>

            <h1 class="pu-single-title"><?php the_title(); ?></h1>

            <div class="pu-post-content">
                <?php the_content(); ?>
                <?php
                wp_link_pages( array(
                    'before' => '<div class="page-links">' . __( 'Pages:', 'printanduse' ),
                    'after'  => '</div>',
                ) );
                ?>
            </div>

            <!-- Tags -->
            <?php $tags = get_the_tags(); if ( $tags ) : ?>
            <div class="pu-post-tags">
                <?php foreach ( $tags as $tag ) : ?>
                <a href="<?php echo esc_url( get_tag_link( $tag->term_id ) ); ?>" class="pu-tag"><?php echo esc_html( $tag->name ); ?></a>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>

            <!-- Author box -->
            <div class="pu-author-box">
                <?php echo get_avatar( get_the_author_meta( 'ID' ), 80, '', '', array( 'class' => 'pu-author-avatar' ) ); ?>
                <div>
                    <p class="pu-author-name"><?php the_author(); ?></p>
                    <p class="pu-author-bio"><?php echo esc_html( get_the_author_meta( 'description' ) ); ?></p>
                </div>
            </div>

            <!-- Prev/Next -->
            <nav class="pu-post-nav">
                <?php
                $prev = get_previous_post();
                $next = get_next_post();
                if ( $prev ) :
                ?>
                <a href="<?php echo esc_url( get_permalink( $prev ) ); ?>" class="pu-post-nav-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    <div>
                        <span class="pu-nav-label">Previous Post</span>
                        <span class="pu-nav-title"><?php echo esc_html( get_the_title( $prev ) ); ?></span>
                    </div>
                </a>
                <?php endif; if ( $next ) : ?>
                <a href="<?php echo esc_url( get_permalink( $next ) ); ?>" class="pu-post-nav-item pu-post-nav-next">
                    <div>
                        <span class="pu-nav-label">Next Post</span>
                        <span class="pu-nav-title"><?php echo esc_html( get_the_title( $next ) ); ?></span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </a>
                <?php endif; ?>
            </nav>

        </div>
    </article>

    <?php comments_template(); ?>
    <?php endwhile; endif; ?>
</div>

<?php get_footer(); ?>

<article <?php post_class( 'pu-post-card' ); ?>>
    <a href="<?php the_permalink(); ?>" class="pu-post-card-img-wrap">
        <?php if ( has_post_thumbnail() ) : ?>
            <?php the_post_thumbnail( 'medium_large', array( 'class' => 'pu-post-card-img' ) ); ?>
        <?php else : ?>
        <div class="pu-post-card-img-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <?php endif; ?>
    </a>
    <div class="pu-post-card-body">
        <div class="pu-post-card-meta">
            <span class="pu-post-card-date">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                <?php echo esc_html( get_the_date( 'd M Y' ) ); ?>
            </span>
            <span class="pu-post-card-views pu-orange">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                <?php echo number_format( printanduse_get_post_views( get_the_ID() ) ); ?>
            </span>
        </div>
        <h3 class="pu-post-card-title">
            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
        </h3>
        <p class="pu-post-card-excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 15 ) ); ?></p>
        <div class="pu-post-card-footer">
            <span class="pu-post-card-author">By <?php the_author(); ?></span>
            <a href="<?php the_permalink(); ?>" class="pu-post-card-read">
                Read
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
        </div>
    </div>
</article>

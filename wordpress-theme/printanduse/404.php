<?php get_header(); ?>

<div class="pu-section bg-gray-50" style="min-height:60vh;display:flex;align-items:center">
    <div class="container text-center">
        <div style="font-size:clamp(5rem,15vw,10rem);font-weight:900;color:#f97316;line-height:1;margin-bottom:1.5rem">404</div>
        <h1 style="font-size:clamp(1.5rem,4vw,2.5rem);font-weight:800;color:#111827;margin-bottom:1rem">Page Not Found</h1>
        <p style="color:#6b7280;font-size:1.125rem;max-width:480px;margin:0 auto 2rem">
            Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="pu-btn-primary">
                <?php echo printanduse_icon( 'home', 20 ); ?>
                Back to Home
            </a>
            <a href="<?php echo esc_url( home_url( '/generators' ) ); ?>" class="pu-btn-secondary">
                Try a Generator
            </a>
        </div>

        <?php
        // Show a search box
        ?>
        <div style="margin-top:3rem;max-width:480px;margin-left:auto;margin-right:auto">
            <p style="color:#6b7280;margin-bottom:1rem;font-weight:500">Or search for what you need:</p>
            <form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
                <div style="display:flex;gap:.5rem">
                    <input type="search" class="pu-form-input" placeholder="<?php esc_attr_e( 'Search worksheets...', 'printanduse' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s" style="flex:1">
                    <button type="submit" class="pu-btn-primary" style="white-space:nowrap">
                        <?php echo printanduse_icon( 'search', 18 ); ?>
                        Search
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<?php get_footer(); ?>

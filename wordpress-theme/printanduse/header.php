<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="pu-header" id="site-header">
    <nav class="pu-nav container">
        <div class="pu-nav-inner">
            <!-- Logo -->
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="pu-logo" aria-label="<?php bloginfo( 'name' ); ?>">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <span class="pu-logo-text">Print<span class="pu-orange">&amp;</span>Use</span>
            </a>

            <!-- Desktop Nav -->
            <div class="pu-nav-links" id="nav-links">
                <?php
                if ( has_nav_menu( 'header-menu' ) ) {
                    wp_nav_menu( array(
                        'theme_location' => 'header-menu',
                        'menu_class'     => 'pu-menu',
                        'container'      => false,
                        'depth'          => 2,
                        'walker'         => new PrintAndUse_Nav_Walker(),
                    ) );
                } else {
                    // Fallback menu
                    echo '<ul class="pu-menu">';
                    echo '<li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li>';
                    echo '<li><a href="' . esc_url( home_url( '/generators' ) ) . '">Generators</a></li>';
                    if ( class_exists( 'WooCommerce' ) ) {
                        echo '<li><a href="' . esc_url( wc_get_page_permalink( 'shop' ) ) . '">Shop</a></li>';
                    }
                    echo '<li><a href="' . esc_url( home_url( '/blog' ) ) . '">Blog</a></li>';
                    echo '<li><a href="' . esc_url( get_page_link( get_page_by_path( 'about' ) ) ) . '">About</a></li>';
                    echo '<li><a href="' . esc_url( get_page_link( get_page_by_path( 'contact' ) ) ) . '">Contact</a></li>';
                    echo '</ul>';
                }
                ?>
                <?php if ( class_exists( 'WooCommerce' ) ) : ?>
                <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="pu-cart-btn" aria-label="Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    <?php $count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0; ?>
                    <?php if ( $count > 0 ) : ?>
                    <span class="pu-cart-count"><?php echo esc_html( $count ); ?></span>
                    <?php endif; ?>
                </a>
                <?php endif; ?>
            </div>

            <!-- Mobile toggle -->
            <button class="pu-mobile-toggle" id="mobile-toggle" aria-label="Toggle menu" aria-expanded="false">
                <svg class="icon-menu" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                <svg class="icon-close hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>

        <!-- Mobile Menu -->
        <div class="pu-mobile-menu hidden" id="mobile-menu">
            <?php
            if ( has_nav_menu( 'header-menu' ) ) {
                wp_nav_menu( array(
                    'theme_location' => 'header-menu',
                    'menu_class'     => 'pu-mobile-menu-list',
                    'container'      => false,
                    'depth'          => 2,
                ) );
            }
            ?>
            <?php if ( class_exists( 'WooCommerce' ) ) : ?>
            <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="pu-mobile-cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                Cart <?php if ( $count > 0 ) echo '(' . $count . ')'; ?>
            </a>
            <?php endif; ?>
        </div>
    </nav>
</header>

<div id="page" class="site">
<main id="main" class="site-main">

<?php
/**
 * WooCommerce compatibility & template tweaks
 */

/**
 * Remove default WooCommerce wrappers and replace with theme wrappers.
 */
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );

add_action( 'woocommerce_before_main_content', 'printanduse_woo_wrapper_start', 10 );
add_action( 'woocommerce_after_main_content', 'printanduse_woo_wrapper_end', 10 );

function printanduse_woo_wrapper_start() {
    echo '<div class="pu-section bg-white"><div class="container">';
}

function printanduse_woo_wrapper_end() {
    echo '</div></div>';
}

/**
 * Remove WooCommerce sidebar from shop pages.
 */
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );

/**
 * Set number of products per row in shop.
 */
add_filter( 'loop_shop_columns', function() { return 3; } );

/**
 * Set number of products per page.
 */
add_filter( 'loop_shop_per_page', function() { return 12; }, 20 );

/**
 * Ensure cart fragments work with AJAX.
 */
add_filter( 'woocommerce_add_to_cart_fragments', 'printanduse_cart_count_fragment' );

function printanduse_cart_count_fragment( $fragments ) {
    ob_start();
    $count = WC()->cart->get_cart_contents_count();
    echo '<span class="pu-cart-count" style="' . ( $count > 0 ? '' : 'display:none' ) . '">' . esc_html( $count ) . '</span>';
    $fragments['.pu-cart-count'] = ob_get_clean();
    return $fragments;
}

/**
 * Add theme support for WooCommerce gallery features.
 */
add_theme_support( 'wc-product-gallery-zoom' );
add_theme_support( 'wc-product-gallery-lightbox' );
add_theme_support( 'wc-product-gallery-slider' );

/**
 * Style WooCommerce notices using theme classes.
 */
add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

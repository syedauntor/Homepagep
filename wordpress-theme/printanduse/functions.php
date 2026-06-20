<?php
/**
 * PrintAndUse Theme Functions
 */

// Theme setup
function printanduse_setup() {
    load_theme_textdomain( 'printanduse', get_template_directory() . '/languages' );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
    add_theme_support( 'customize-selective-refresh-widgets' );
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );

    register_nav_menus( array(
        'header-menu'           => __( 'Header Menu', 'printanduse' ),
        'footer-quick-links'    => __( 'Footer Quick Links', 'printanduse' ),
        'footer-generator-cats' => __( 'Footer Generator Categories', 'printanduse' ),
    ) );
}
add_action( 'after_setup_theme', 'printanduse_setup' );

// Enqueue scripts and styles
function printanduse_scripts() {
    wp_enqueue_style( 'printanduse-style', get_template_directory_uri() . '/assets/css/main.css', array(), '1.0.0' );
    wp_enqueue_script( 'printanduse-main', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0.0', true );

    // Google Fonts
    wp_enqueue_style( 'printanduse-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Codystar&family=Raleway+Dots&display=swap', array(), null );
}
add_action( 'wp_enqueue_scripts', 'printanduse_scripts' );

// Include theme components
require get_template_directory() . '/inc/custom-post-types.php';
require get_template_directory() . '/inc/theme-options.php';
require get_template_directory() . '/inc/template-functions.php';
if ( class_exists( 'WooCommerce' ) ) {
    require get_template_directory() . '/inc/woocommerce.php';
}

// Widget areas
function printanduse_widgets_init() {
    register_sidebar( array(
        'name'          => __( 'Blog Sidebar', 'printanduse' ),
        'id'            => 'blog-sidebar',
        'description'   => __( 'Widgets in this area will be shown on the blog sidebar.', 'printanduse' ),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ) );
}
add_action( 'widgets_init', 'printanduse_widgets_init' );

// Custom excerpt length
function printanduse_excerpt_length() {
    return 20;
}
add_filter( 'excerpt_length', 'printanduse_excerpt_length' );

// Custom excerpt more
function printanduse_excerpt_more( $more ) {
    return '...';
}
add_filter( 'excerpt_more', 'printanduse_excerpt_more' );

// Add view count to posts
function printanduse_track_post_views( $post_id ) {
    if ( ! is_single() ) return;
    if ( empty( $post_id ) ) {
        global $post;
        $post_id = $post->ID;
    }
    $count_key = 'post_views_count';
    $count = get_post_meta( $post_id, $count_key, true );
    if ( $count == '' ) {
        $count = 0;
        delete_post_meta( $post_id, $count_key );
        add_post_meta( $post_id, $count_key, '0' );
    } else {
        $count++;
        update_post_meta( $post_id, $count_key, $count );
    }
}
add_action( 'wp_head', function() {
    if ( is_single() ) {
        global $post;
        printanduse_track_post_views( $post->ID );
    }
});

function printanduse_get_post_views( $post_id ) {
    $count = get_post_meta( $post_id, 'post_views_count', true );
    return $count ? intval($count) : 0;
}

// Flush rewrite rules on theme activation
function printanduse_rewrite_flush() {
    flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'printanduse_rewrite_flush' );

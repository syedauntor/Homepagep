<?php
/**
 * Template helper functions and custom nav walker
 */

/**
 * Render an inline SVG icon by name.
 * Keeps templates clean by centralizing icon markup.
 */
function printanduse_icon( $name, $size = 24, $extra_attrs = '' ) {
    $stroke = 'stroke="currentColor"';
    $base   = sprintf( 'xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 24 24" fill="none" %s stroke-width="2" stroke-linecap="round" stroke-linejoin="round" %s', $size, $size, $stroke, $extra_attrs );

    $icons = array(
        'arrow-right'   => '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        'download'      => '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
        'print'         => '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
        'star'          => '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
        'book'          => '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
        'pencil'        => '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
        'calculator'    => '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/>',
        'grid'          => '<rect width="4" height="4" x="3" y="3" rx=".5"/><rect width="4" height="4" x="10" y="3" rx=".5"/><rect width="4" height="4" x="17" y="3" rx=".5"/><rect width="4" height="4" x="3" y="10" rx=".5"/><rect width="4" height="4" x="10" y="10" rx=".5"/><rect width="4" height="4" x="17" y="10" rx=".5"/><rect width="4" height="4" x="3" y="17" rx=".5"/><rect width="4" height="4" x="10" y="17" rx=".5"/><rect width="4" height="4" x="17" y="17" rx=".5"/>',
        'users'         => '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        'graduation'    => '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
        'eye'           => '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
        'calendar'      => '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
        'clock'         => '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        'tag'           => '<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>',
        'check-circle'  => '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        'mail'          => '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
        'phone'         => '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
        'map-pin'       => '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
        'send'          => '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
        'refresh'       => '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
        'chevron-right' => '<path d="m9 18 6-6-6-6"/>',
        'home'          => '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
        'search'        => '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
        'x'             => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        'menu'          => '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
        'shopping-cart' => '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
        'user'          => '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        'facebook'      => '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
        'instagram'     => '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
        'twitter'       => '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
        'linkedin'      => '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
        'pinterest'     => '<line x1="12" y1="17" x2="12" y2="22"/><path d="M8.56 2.9A7 7 0 1 0 16.15 16"/><path d="m12 17-1-5"/>',
        'youtube'       => '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
    );

    $paths = isset( $icons[ $name ] ) ? $icons[ $name ] : '';
    if ( ! $paths ) return '';

    return sprintf( '<svg %s>%s</svg>', $base, $paths );
}

/**
 * Custom Nav Walker for multi-level dropdown menus
 */
class PrintAndUse_Nav_Walker extends Walker_Nav_Menu {

    private $current_depth = 0;

    public function start_lvl( &$output, $depth = 0, $args = null ) {
        $this->current_depth = $depth + 1;
        $indent  = str_repeat( "\t", $depth );
        $output .= "\n{$indent}<ul class=\"pu-dropdown\" role=\"menu\">\n";
    }

    public function end_lvl( &$output, $depth = 0, $args = null ) {
        $indent  = str_repeat( "\t", $depth );
        $output .= "{$indent}</ul>\n";
    }

    public function start_el( &$output, $data_object, $depth = 0, $args = null, $id = 0 ) {
        $item   = $data_object;
        $indent = ( $depth > 0 ) ? str_repeat( "\t", $depth ) : '';

        $classes   = empty( $item->classes ) ? array() : (array) $item->classes;
        $classes[] = 'menu-item-' . $item->ID;
        if ( $depth === 0 && in_array( 'menu-item-has-children', $classes, true ) ) {
            $classes[] = 'pu-has-dropdown';
        }

        $class_names = implode( ' ', array_filter( array_map( 'sanitize_html_class', $classes ) ) );
        $output .= "{$indent}<li class=\"{$class_names}\">";

        $atts           = array();
        $atts['href']   = ! empty( $item->url ) ? $item->url : '#';
        $atts['target'] = ! empty( $item->target ) ? $item->target : '';
        $atts['rel']    = ! empty( $item->xfn ) ? $item->xfn : '';
        $atts['class']  = $depth === 0 ? 'pu-nav-link' : 'pu-dropdown-link';

        if ( in_array( 'current-menu-item', $classes, true ) ) {
            $atts['class'] .= ' active';
            $atts['aria-current'] = 'page';
        }

        $attr_str = '';
        foreach ( $atts as $attr => $val ) {
            if ( '' !== $val ) {
                $attr_str .= ' ' . $attr . '="' . esc_attr( $val ) . '"';
            }
        }

        $title    = apply_filters( 'the_title', $item->title, $item->ID );
        $chevron  = '';
        if ( $depth === 0 && in_array( 'menu-item-has-children', $classes, true ) ) {
            $chevron = ' <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pu-chevron"><path d="m6 9 6 6 6-6"/></svg>';
        }

        $output .= "<a{$attr_str}>{$title}{$chevron}</a>";
    }

    public function end_el( &$output, $data_object, $depth = 0, $args = null ) {
        $output .= "</li>\n";
    }
}

/**
 * Return related posts (same category, exclude current)
 */
function printanduse_get_related_posts( $post_id, $count = 3 ) {
    $cats = wp_get_post_categories( $post_id );
    if ( empty( $cats ) ) return array();

    return get_posts( array(
        'post_type'           => 'post',
        'post_status'         => 'publish',
        'posts_per_page'      => $count,
        'post__not_in'        => array( $post_id ),
        'category__in'        => $cats,
        'ignore_sticky_posts' => true,
        'orderby'             => 'rand',
    ) );
}

/**
 * Breadcrumb trail for inner pages
 */
function printanduse_breadcrumb() {
    if ( is_front_page() ) return;

    $sep = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

    echo '<nav class="pu-breadcrumb" aria-label="Breadcrumb"><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', 'printanduse' ) . '</a>';

    if ( is_category() ) {
        echo $sep . '<span>' . single_cat_title( '', false ) . '</span>';
    } elseif ( is_tag() ) {
        echo $sep . '<span>' . single_tag_title( '', false ) . '</span>';
    } elseif ( is_search() ) {
        echo $sep . '<span>' . esc_html__( 'Search: ', 'printanduse' ) . get_search_query() . '</span>';
    } elseif ( is_single() ) {
        $cats = get_the_category();
        if ( $cats ) {
            echo $sep . '<a href="' . esc_url( get_category_link( $cats[0]->term_id ) ) . '">' . esc_html( $cats[0]->name ) . '</a>';
        }
        echo $sep . '<span>' . get_the_title() . '</span>';
    } elseif ( is_page() ) {
        $parent = wp_get_post_parent_id( get_the_ID() );
        if ( $parent ) {
            echo $sep . '<a href="' . esc_url( get_permalink( $parent ) ) . '">' . esc_html( get_the_title( $parent ) ) . '</a>';
        }
        echo $sep . '<span>' . get_the_title() . '</span>';
    } else {
        echo $sep . '<span>' . get_the_title() . '</span>';
    }

    echo '</nav>';
}

/**
 * Truncate text at word boundary
 */
function printanduse_excerpt( $length = 20 ) {
    return wp_trim_words( get_the_excerpt(), $length, '&hellip;' );
}

/**
 * Social sharing links for single posts
 */
function printanduse_social_share_links( $post_id = null ) {
    if ( ! $post_id ) $post_id = get_the_ID();
    $url   = urlencode( get_permalink( $post_id ) );
    $title = urlencode( get_the_title( $post_id ) );

    $links = array(
        'facebook'  => 'https://www.facebook.com/sharer/sharer.php?u=' . $url,
        'twitter'   => 'https://twitter.com/intent/tweet?url=' . $url . '&text=' . $title,
        'pinterest'  => 'https://pinterest.com/pin/create/button/?url=' . $url . '&description=' . $title,
        'linkedin'  => 'https://www.linkedin.com/sharing/share-offsite/?url=' . $url,
    );

    return $links;
}

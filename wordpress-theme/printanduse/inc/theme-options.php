<?php
/**
 * Theme Customizer Options
 */

function printanduse_customizer( $wp_customize ) {

    /* ─── Contact Info Panel ─── */
    $wp_customize->add_section( 'pu_contact', array(
        'title'    => __( 'Contact Information', 'printanduse' ),
        'priority' => 130,
    ) );

    $contact_defaults = array(
        'contact_phone'   => '+1 (555) 123-4567',
        'contact_email'   => 'info@printanduse.com',
        'contact_address' => '123 Education St, New York, NY',
    );

    foreach ( $contact_defaults as $key => $default ) {
        $wp_customize->add_setting( $key, array(
            'default'           => $default,
            'sanitize_callback' => 'sanitize_text_field',
        ) );
        $wp_customize->add_control( $key, array(
            'label'   => ucwords( str_replace( '_', ' ', str_replace( 'contact_', '', $key ) ) ),
            'section' => 'pu_contact',
            'type'    => 'text',
        ) );
    }

    /* ─── Footer Panel ─── */
    $wp_customize->add_section( 'pu_footer', array(
        'title'    => __( 'Footer Options', 'printanduse' ),
        'priority' => 135,
    ) );

    $wp_customize->add_setting( 'footer_description', array(
        'default'           => 'Free printable worksheets and generators for teachers, parents, and students.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ) );
    $wp_customize->add_control( 'footer_description', array(
        'label'   => __( 'Footer Description', 'printanduse' ),
        'section' => 'pu_footer',
        'type'    => 'textarea',
    ) );

    $wp_customize->add_setting( 'footer_copyright', array(
        'default'           => '© ' . gmdate( 'Y' ) . ' PrintAndUse. All rights reserved.',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'footer_copyright', array(
        'label'   => __( 'Copyright Text', 'printanduse' ),
        'section' => 'pu_footer',
        'type'    => 'text',
    ) );

    /* ─── Homepage Panel ─── */
    $wp_customize->add_section( 'pu_homepage', array(
        'title'    => __( 'Homepage Settings', 'printanduse' ),
        'priority' => 125,
    ) );

    $wp_customize->add_setting( 'hero_title', array(
        'default'           => 'Free Printable Worksheets & Generators',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'hero_title', array(
        'label'   => __( 'Hero Title', 'printanduse' ),
        'section' => 'pu_homepage',
        'type'    => 'text',
    ) );

    $wp_customize->add_setting( 'hero_subtitle', array(
        'default'           => 'Create, customize, and print professional worksheets for every grade level — completely free.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ) );
    $wp_customize->add_control( 'hero_subtitle', array(
        'label'   => __( 'Hero Subtitle', 'printanduse' ),
        'section' => 'pu_homepage',
        'type'    => 'textarea',
    ) );

    /* ─── Social Links Panel ─── */
    $wp_customize->add_section( 'pu_social', array(
        'title'    => __( 'Social Media Links', 'printanduse' ),
        'priority' => 140,
    ) );

    $socials = array(
        'social_facebook'  => 'Facebook URL',
        'social_instagram' => 'Instagram URL',
        'social_twitter'   => 'X / Twitter URL',
        'social_pinterest' => 'Pinterest URL',
        'social_youtube'   => 'YouTube URL',
    );

    foreach ( $socials as $key => $label ) {
        $wp_customize->add_setting( $key, array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        ) );
        $wp_customize->add_control( $key, array(
            'label'   => __( $label, 'printanduse' ),
            'section' => 'pu_social',
            'type'    => 'url',
        ) );
    }
}
add_action( 'customize_register', 'printanduse_customizer' );

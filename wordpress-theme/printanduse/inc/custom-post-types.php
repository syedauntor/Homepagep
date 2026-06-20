<?php
/**
 * Custom Post Types
 */

function printanduse_register_post_types() {
    register_post_type( 'pu_team_member', array(
        'labels'      => array(
            'name'               => __( 'Team Members', 'printanduse' ),
            'singular_name'      => __( 'Team Member', 'printanduse' ),
            'add_new'            => __( 'Add New', 'printanduse' ),
            'add_new_item'       => __( 'Add New Team Member', 'printanduse' ),
            'edit_item'          => __( 'Edit Team Member', 'printanduse' ),
            'new_item'           => __( 'New Team Member', 'printanduse' ),
            'view_item'          => __( 'View Team Member', 'printanduse' ),
            'search_items'       => __( 'Search Team Members', 'printanduse' ),
            'not_found'          => __( 'No team members found', 'printanduse' ),
            'not_found_in_trash' => __( 'No team members found in Trash', 'printanduse' ),
            'menu_name'          => __( 'Team Members', 'printanduse' ),
        ),
        'public'             => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_nav_menus'  => false,
        'show_in_rest'       => true,
        'supports'           => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
        'menu_position'      => 25,
        'menu_icon'          => 'dashicons-groups',
        'has_archive'        => false,
        'rewrite'            => false,
    ) );
}
add_action( 'init', 'printanduse_register_post_types' );

/**
 * Team member meta boxes
 */
function printanduse_team_meta_boxes() {
    add_meta_box(
        'pu_team_details',
        __( 'Team Member Details', 'printanduse' ),
        'printanduse_team_meta_box_html',
        'pu_team_member',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'printanduse_team_meta_boxes' );

function printanduse_team_meta_box_html( $post ) {
    wp_nonce_field( 'printanduse_team_meta', 'printanduse_team_meta_nonce' );
    $designation = get_post_meta( $post->ID, '_pu_designation', true );
    $show_home   = get_post_meta( $post->ID, '_pu_show_on_home', true );
    $fb          = get_post_meta( $post->ID, '_pu_fb_url', true );
    $ig          = get_post_meta( $post->ID, '_pu_ig_url', true );
    $x_url       = get_post_meta( $post->ID, '_pu_x_url', true );
    $li          = get_post_meta( $post->ID, '_pu_linkedin_url', true );
    ?>
    <table class="form-table">
        <tr>
            <th><label for="_pu_designation"><?php _e( 'Designation / Role', 'printanduse' ); ?></label></th>
            <td><input type="text" id="_pu_designation" name="_pu_designation" value="<?php echo esc_attr( $designation ); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="_pu_show_on_home"><?php _e( 'Show on Homepage', 'printanduse' ); ?></label></th>
            <td><input type="checkbox" id="_pu_show_on_home" name="_pu_show_on_home" value="1" <?php checked( $show_home, '1' ); ?>></td>
        </tr>
        <tr>
            <th><label><?php _e( 'Social Links', 'printanduse' ); ?></label></th>
            <td>
                <p><label style="width:100px;display:inline-block;">Facebook</label><input type="url" name="_pu_fb_url" value="<?php echo esc_attr( $fb ); ?>" class="regular-text" placeholder="https://facebook.com/..."></p>
                <p><label style="width:100px;display:inline-block;">Instagram</label><input type="url" name="_pu_ig_url" value="<?php echo esc_attr( $ig ); ?>" class="regular-text" placeholder="https://instagram.com/..."></p>
                <p><label style="width:100px;display:inline-block;">X / Twitter</label><input type="url" name="_pu_x_url" value="<?php echo esc_attr( $x_url ); ?>" class="regular-text" placeholder="https://x.com/..."></p>
                <p><label style="width:100px;display:inline-block;">LinkedIn</label><input type="url" name="_pu_linkedin_url" value="<?php echo esc_attr( $li ); ?>" class="regular-text" placeholder="https://linkedin.com/..."></p>
            </td>
        </tr>
    </table>
    <?php
}

function printanduse_save_team_meta( $post_id ) {
    if ( ! isset( $_POST['printanduse_team_meta_nonce'] ) ) return;
    if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['printanduse_team_meta_nonce'] ) ), 'printanduse_team_meta' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    $fields = array( '_pu_designation', '_pu_fb_url', '_pu_ig_url', '_pu_x_url', '_pu_linkedin_url' );
    foreach ( $fields as $field ) {
        if ( isset( $_POST[ $field ] ) ) {
            update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
        }
    }

    $show_home = isset( $_POST['_pu_show_on_home'] ) ? '1' : '0';
    update_post_meta( $post_id, '_pu_show_on_home', $show_home );
}
add_action( 'save_post_pu_team_member', 'printanduse_save_team_meta' );

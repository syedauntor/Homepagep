</main><!-- #main -->
</div><!-- #page -->

<footer class="pu-footer">
    <div class="container">
        <div class="pu-footer-grid">
            <!-- Brand -->
            <div class="pu-footer-brand">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="pu-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    <span class="pu-logo-text" style="color:#fff">Print<span class="pu-orange">&amp;</span>Use</span>
                </a>
                <p class="pu-footer-desc"><?php echo esc_html( get_theme_mod( 'footer_description', 'Award winning full-service, creative digital agency, collaborating with brands all over the world.' ) ); ?></p>
            </div>

            <!-- Quick Links -->
            <div class="pu-footer-col">
                <h3 class="pu-footer-heading"><?php _e( 'Quick Links', 'printanduse' ); ?></h3>
                <?php
                if ( has_nav_menu( 'footer-quick-links' ) ) {
                    wp_nav_menu( array(
                        'theme_location' => 'footer-quick-links',
                        'menu_class'     => 'pu-footer-links',
                        'container'      => false,
                        'depth'          => 1,
                    ) );
                } else {
                    echo '<ul class="pu-footer-links">';
                    echo '<li><a href="' . esc_url( home_url( '/' ) ) . '">Home</a></li>';
                    echo '<li><a href="' . esc_url( home_url( '/generators' ) ) . '">Generators</a></li>';
                    echo '<li><a href="' . esc_url( home_url( '/blog' ) ) . '">Blog</a></li>';
                    echo '<li><a href="' . esc_url( home_url( '/about' ) ) . '">About</a></li>';
                    echo '<li><a href="' . esc_url( home_url( '/contact' ) ) . '">Contact</a></li>';
                    echo '</ul>';
                }
                ?>
            </div>

            <!-- Generator Categories -->
            <div class="pu-footer-col">
                <h3 class="pu-footer-heading"><?php _e( 'Generator Categories', 'printanduse' ); ?></h3>
                <?php
                if ( has_nav_menu( 'footer-generator-cats' ) ) {
                    wp_nav_menu( array(
                        'theme_location' => 'footer-generator-cats',
                        'menu_class'     => 'pu-footer-links',
                        'container'      => false,
                        'depth'          => 1,
                    ) );
                } else {
                    echo '<ul class="pu-footer-links">';
                    echo '<li><a href="' . esc_url( home_url( '/generators' ) ) . '">All Generators</a></li>';
                    echo '<li><a href="' . esc_url( home_url( '/generators#math' ) ) . '">Math Generators</a></li>';
                    echo '<li><a href="' . esc_url( home_url( '/generators#tracing' ) ) . '">Tracing Practice</a></li>';
                    echo '<li><a href="' . esc_url( home_url( '/generators#activities' ) ) . '">Activity Generators</a></li>';
                    echo '</ul>';
                }
                ?>
            </div>

            <!-- Contact -->
            <div class="pu-footer-col">
                <h3 class="pu-footer-heading"><?php _e( 'Contact', 'printanduse' ); ?></h3>
                <ul class="pu-footer-contact">
                    <?php $phone = get_theme_mod( 'contact_phone', '+1 (555) 123-4567' ); if ( $phone ) : ?>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <span><?php echo esc_html( $phone ); ?></span>
                    </li>
                    <?php endif; ?>
                    <?php $email = get_theme_mod( 'contact_email', 'info@printanduse.com' ); if ( $email ) : ?>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        <span><?php echo esc_html( $email ); ?></span>
                    </li>
                    <?php endif; ?>
                    <?php $address = get_theme_mod( 'contact_address', '123 Education St, NY' ); if ( $address ) : ?>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span><?php echo esc_html( $address ); ?></span>
                    </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>

        <div class="pu-footer-bottom">
            <p>&copy; <?php echo date( 'Y' ); ?> <?php bloginfo( 'name' ); ?>. <?php _e( 'All rights reserved.', 'printanduse' ); ?></p>
            <div class="pu-footer-legal">
                <a href="<?php echo esc_url( home_url( '/privacy-policy' ) ); ?>"><?php _e( 'Privacy Policy', 'printanduse' ); ?></a>
                <a href="<?php echo esc_url( home_url( '/terms-of-use' ) ); ?>"><?php _e( 'Terms of Use', 'printanduse' ); ?></a>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>

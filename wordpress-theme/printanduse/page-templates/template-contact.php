<?php
/**
 * Template Name: Contact Page
 */
get_header();
?>

<div class="pu-section bg-gray-50">
    <div class="container">
        <div class="pu-archive-header">
            <p class="pu-label">GET IN TOUCH</p>
            <h1>Contact Us</h1>
            <p class="pu-section-desc">Have a question or suggestion? We'd love to hear from you.</p>
        </div>

        <div class="pu-contact-grid">
            <!-- Contact Info -->
            <div class="pu-contact-info">
                <h2>Let's Talk</h2>
                <p>We're here to help! Send us a message and we'll get back to you as soon as possible.</p>

                <div class="pu-contact-item">
                    <div class="pu-contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                        <p class="pu-contact-item-label">Phone</p>
                        <p class="pu-contact-item-value"><?php echo esc_html( get_theme_mod( 'contact_phone', '+1 (555) 123-4567' ) ); ?></p>
                    </div>
                </div>

                <div class="pu-contact-item">
                    <div class="pu-contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <div>
                        <p class="pu-contact-item-label">Email</p>
                        <p class="pu-contact-item-value"><?php echo esc_html( get_theme_mod( 'contact_email', 'info@printanduse.com' ) ); ?></p>
                    </div>
                </div>

                <div class="pu-contact-item">
                    <div class="pu-contact-item-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                        <p class="pu-contact-item-label">Address</p>
                        <p class="pu-contact-item-value"><?php echo esc_html( get_theme_mod( 'contact_address', '123 Education St, New York, NY' ) ); ?></p>
                    </div>
                </div>
            </div>

            <!-- Contact Form -->
            <div class="pu-contact-form-wrap">
                <h3><?php _e( 'Send Us a Message', 'printanduse' ); ?></h3>

                <?php
                // Handle form submission
                if ( isset( $_POST['pu_contact_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['pu_contact_nonce'] ) ), 'pu_contact' ) ) {
                    $name    = sanitize_text_field( $_POST['contact_name'] ?? '' );
                    $email   = sanitize_email( $_POST['contact_email'] ?? '' );
                    $subject = sanitize_text_field( $_POST['contact_subject'] ?? '' );
                    $message = sanitize_textarea_field( $_POST['contact_message'] ?? '' );
                    $errors  = array();

                    if ( empty( $name ) )    $errors[] = 'Name is required.';
                    if ( ! is_email( $email ) ) $errors[] = 'A valid email is required.';
                    if ( empty( $message ) ) $errors[] = 'Message is required.';

                    if ( empty( $errors ) ) {
                        $to      = get_theme_mod( 'contact_email', get_option( 'admin_email' ) );
                        $headers = array( 'Content-Type: text/html; charset=UTF-8', 'Reply-To: ' . $name . ' <' . $email . '>' );
                        $body    = '<p><strong>Name:</strong> ' . esc_html( $name ) . '</p>'
                                 . '<p><strong>Email:</strong> ' . esc_html( $email ) . '</p>'
                                 . '<p><strong>Subject:</strong> ' . esc_html( $subject ) . '</p>'
                                 . '<p><strong>Message:</strong><br>' . nl2br( esc_html( $message ) ) . '</p>';
                        wp_mail( $to, 'Contact: ' . $subject, $body, $headers );
                        echo '<div class="pu-form-success">Thank you! Your message has been sent. We\'ll be in touch soon.</div>';
                    } else {
                        foreach ( $errors as $error ) {
                            echo '<div class="pu-form-error">' . esc_html( $error ) . '</div>';
                        }
                    }
                }
                ?>

                <form class="pu-contact-form" method="post" action="">
                    <?php wp_nonce_field( 'pu_contact', 'pu_contact_nonce' ); ?>
                    <div class="pu-form-grid-2">
                        <div class="pu-form-group">
                            <label class="pu-form-label" for="contact_name">Full Name *</label>
                            <input type="text" id="contact_name" name="contact_name" class="pu-form-input" required placeholder="Your name" value="<?php echo isset($_POST['contact_name']) ? esc_attr(sanitize_text_field($_POST['contact_name'])) : ''; ?>">
                        </div>
                        <div class="pu-form-group">
                            <label class="pu-form-label" for="contact_email">Email *</label>
                            <input type="email" id="contact_email" name="contact_email" class="pu-form-input" required placeholder="your@email.com" value="<?php echo isset($_POST['contact_email']) ? esc_attr(sanitize_email($_POST['contact_email'])) : ''; ?>">
                        </div>
                    </div>
                    <div class="pu-form-group">
                        <label class="pu-form-label" for="contact_subject">Subject</label>
                        <input type="text" id="contact_subject" name="contact_subject" class="pu-form-input" placeholder="How can we help?" value="<?php echo isset($_POST['contact_subject']) ? esc_attr(sanitize_text_field($_POST['contact_subject'])) : ''; ?>">
                    </div>
                    <div class="pu-form-group">
                        <label class="pu-form-label" for="contact_message">Message *</label>
                        <textarea id="contact_message" name="contact_message" class="pu-textarea" required placeholder="Tell us more..."><?php echo isset($_POST['contact_message']) ? esc_textarea(sanitize_textarea_field($_POST['contact_message'])) : ''; ?></textarea>
                    </div>
                    <button type="submit" class="pu-btn-primary" style="width:100%;justify-content:center">
                        Send Message
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<?php get_footer(); ?>

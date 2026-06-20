<?php
/**
 * Template Name: About Page
 */
get_header();
?>

<div class="pu-about-hero">
    <div class="container">
        <p class="pu-label">ABOUT US</p>
        <h1>Empowering Education Through Creative Resources</h1>
        <p>We believe every child deserves access to fun, engaging, and effective learning resources — completely free of charge.</p>
    </div>
</div>

<div class="pu-section bg-white">
    <div class="container">
        <div class="pu-mission-grid">
            <div>
                <p class="pu-label">OUR MISSION</p>
                <h2 style="font-size:clamp(1.5rem,3vw,2.5rem);font-weight:800;color:#111827;margin-bottom:1.5rem">Making Quality Education Accessible to Everyone</h2>
                <p style="color:#4b5563;line-height:1.8;margin-bottom:1.25rem">Our platform was founded by a team of passionate educators who believe that the right learning tools can make all the difference in a child's development. We create resources that are not only educationally sound but also fun and engaging.</p>
                <p style="color:#4b5563;line-height:1.8;margin-bottom:1.5rem">From printable worksheets to interactive generators, every resource on our platform is carefully crafted to support different learning styles and educational needs.</p>
                <a href="<?php echo esc_url( home_url( '/generators' ) ); ?>" class="pu-btn-primary">
                    Explore Our Generators
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
            </div>
            <div class="pu-features-grid" style="grid-template-columns:1fr 1fr">
                <div style="background:#fff7ed;border-radius:1.25rem;padding:1.5rem;text-align:center">
                    <div style="font-size:2.5rem;font-weight:900;color:#f97316;margin-bottom:.5rem">500+</div>
                    <p style="color:#6b7280;font-weight:500">Free Resources</p>
                </div>
                <div style="background:#eff6ff;border-radius:1.25rem;padding:1.5rem;text-align:center">
                    <div style="font-size:2.5rem;font-weight:900;color:#3b82f6;margin-bottom:.5rem">7+</div>
                    <p style="color:#6b7280;font-weight:500">Generators</p>
                </div>
                <div style="background:#f0fdf4;border-radius:1.25rem;padding:1.5rem;text-align:center">
                    <div style="font-size:2.5rem;font-weight:900;color:#22c55e;margin-bottom:.5rem">100K+</div>
                    <p style="color:#6b7280;font-weight:500">Downloads</p>
                </div>
                <div style="background:#fdf4ff;border-radius:1.25rem;padding:1.5rem;text-align:center">
                    <div style="font-size:2.5rem;font-weight:900;color:#a855f7;margin-bottom:.5rem">50K+</div>
                    <p style="color:#6b7280;font-weight:500">Happy Users</p>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="pu-section bg-gray-50">
    <div class="container">
        <div class="pu-section-header">
            <p class="pu-label">OUR VALUES</p>
            <h2>Why Choose PrintAndUse?</h2>
        </div>
        <div class="pu-features-grid">
            <div class="pu-feature-card bg-orange-50">
                <div class="pu-feature-icon bg-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                </div>
                <h3>Expert-Created</h3>
                <p>All resources are developed by qualified teachers and education specialists with years of classroom experience.</p>
            </div>
            <div class="pu-feature-card bg-blue-50">
                <div class="pu-feature-icon bg-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <h3>Always Free</h3>
                <p>We believe education should be accessible to everyone. All our printable resources are available at no cost.</p>
            </div>
            <div class="pu-feature-card bg-green-50">
                <div class="pu-feature-icon bg-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <h3>Highly Customizable</h3>
                <p>Our worksheet generators let you customize difficulty, layout, themes, and more to fit any learning need.</p>
            </div>
        </div>
    </div>
</div>

<!-- Team Section -->
<?php
$team = new WP_Query( array(
    'post_type'      => 'pu_team_member',
    'post_status'    => 'publish',
    'posts_per_page' => -1,
) );
if ( $team->have_posts() ) : ?>
<div class="pu-section bg-white">
    <div class="container text-center">
        <p class="pu-label">THE TEAM</p>
        <h2>Meet the People Behind PrintAndUse</h2>
        <p class="pu-section-desc">A passionate team of educators, designers, and developers</p>
        <div class="pu-team-grid">
            <?php while ( $team->have_posts() ) : $team->the_post();
                $designation = get_post_meta( get_the_ID(), '_pu_designation', true );
                $fb  = get_post_meta( get_the_ID(), '_pu_fb_url', true );
                $ig  = get_post_meta( get_the_ID(), '_pu_ig_url', true );
                $li  = get_post_meta( get_the_ID(), '_pu_linkedin_url', true );
            ?>
            <div class="pu-team-card">
                <?php if ( has_post_thumbnail() ) : ?>
                    <img src="<?php echo esc_url( get_the_post_thumbnail_url( null, 'thumbnail' ) ); ?>" alt="<?php the_title_attribute(); ?>" class="pu-team-avatar">
                <?php else : ?>
                    <div class="pu-team-avatar-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <?php endif; ?>
                <h3><?php the_title(); ?></h3>
                <?php if ( $designation ) : ?><p class="pu-team-role"><?php echo esc_html( $designation ); ?></p><?php endif; ?>
                <?php if ( get_the_excerpt() ) : ?><p class="pu-team-bio"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p><?php endif; ?>
                <div class="pu-team-socials">
                    <?php if ( $fb ) : ?><a href="<?php echo esc_url($fb); ?>" target="_blank" rel="noopener noreferrer" class="pu-social-btn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a><?php endif; ?>
                    <?php if ( $ig ) : ?><a href="<?php echo esc_url($ig); ?>" target="_blank" rel="noopener noreferrer" class="pu-social-btn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a><?php endif; ?>
                    <?php if ( $li ) : ?><a href="<?php echo esc_url($li); ?>" target="_blank" rel="noopener noreferrer" class="pu-social-btn"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a><?php endif; ?>
                </div>
            </div>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>
    </div>
</div>
<?php endif; ?>

<?php get_footer(); ?>

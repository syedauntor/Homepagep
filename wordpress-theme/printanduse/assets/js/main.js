/* PrintAndUse Theme - Main JavaScript */

document.addEventListener('DOMContentLoaded', function () {

    // Mobile menu toggle
    const toggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconMenu = toggle ? toggle.querySelector('.icon-menu') : null;
    const iconClose = toggle ? toggle.querySelector('.icon-close') : null;

    if (toggle && mobileMenu) {
        toggle.addEventListener('click', function () {
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', isOpen);
            if (iconMenu) iconMenu.classList.toggle('hidden', !isOpen);
            if (iconClose) iconClose.classList.toggle('hidden', isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
        });
    }

    // Smooth scroll for hash links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Header scroll effect
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', function () {
            header.style.boxShadow = window.scrollY > 10
                ? '0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1)'
                : '0 1px 2px 0 rgba(0,0,0,.05)';
        });
    }
});

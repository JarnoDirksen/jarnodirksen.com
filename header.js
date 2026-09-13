function initHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const isHome = /index\.htm/i.test(window.location.pathname) ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/');

    function updateHeader() {
        const compact = !isHome || window.scrollY > 40;
        header.classList.toggle('is-compact', compact);
        document.body.classList.toggle('header-compact', compact);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
} else {
    initHeader();
}
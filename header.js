function initHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const isHome = /index\.htm/i.test(window.location.pathname) ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/');

    const SHRINK_AT = 80;
    const EXPAND_AT = 16;
    let compact = header.classList.contains('is-compact');

    function setCompact(next) {
        if (compact === next) return;
        compact = next;
        header.classList.toggle('is-compact', compact);
        document.body.classList.toggle('header-compact', compact);
    }

    function updateHeader() {
        if (!isHome) {
            setCompact(true);
            return;
        }

        const y = window.scrollY;
        if (!compact && y > SHRINK_AT) setCompact(true);
        else if (compact && y < EXPAND_AT) setCompact(false);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
} else {
    initHeader();
}
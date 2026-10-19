// Compact sticky header once the page is scrolled.
(function () {
    const header = document.querySelector('header');
    if (!header) return;
    let ticking = false;
    function update() {
        const y = window.scrollY;
        if (y > 80) header.classList.add('is-compact');
        else if (y < 20) header.classList.remove('is-compact');
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
})();

// About tags: show a one-line fact and jump to the related section.
(function () {
    const fact = document.getElementById('tag-fact');
    const tags = document.querySelectorAll('.tag');
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(tag) {
        fact.textContent = tag.dataset.fact;
    }

    tags.forEach(tag => {
        tag.addEventListener('mouseenter', () => show(tag));
        tag.addEventListener('focus', () => show(tag));
        if (tag.tagName !== 'BUTTON') return;
        tag.addEventListener('click', () => {
            show(tag);
            const target = document.querySelector(tag.dataset.target);
            if (!target) return;
            target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
            target.classList.remove('flash');
            void target.offsetWidth; // restart the highlight animation
            target.classList.add('flash');
            setTimeout(() => target.classList.remove('flash'), 1600);
        });
    });
})();

// Renders writing.json into cards. Uses textContent so data is never parsed as HTML.
function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
}

fetch('/writing.json')
    .then(r => r.json())
    .then(items => {
        const list = document.getElementById('writing-list');
        items.forEach(item => {
            const card = el('article', 'book-card');
            const body = el('div', 'book-body');
            body.append(el('h4', null, item.title));
            body.append(el('p', 'book-author', [item.date, item.platform, item.language].filter(Boolean).join(' · ')));
            if (item.summary) body.append(el('p', 'book-about', item.summary));
            if (item.context) body.append(el('p', 'book-author', item.context));
            if (item.url) {
                const a = el('a', null, 'Read on ' + (item.platform || 'the web') + ' →');
                a.href = item.url;
                a.target = '_blank';
                a.rel = 'noopener';
                body.append(a);
            }
            card.append(body);
            list.append(card);
        });
    })
    .catch(err => console.error('Error loading writing:', err));

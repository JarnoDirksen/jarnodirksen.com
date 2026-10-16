// Renders books.json into cards. Built with DOM APIs so text is never parsed as HTML.
function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
}

function bookCard(book) {
    const card = el('article', 'book-card');
    if (book.cover) {
        const img = el('img', 'book-cover');
        img.src = book.cover;
        img.alt = 'Cover of ' + book.title;
        img.loading = 'lazy';
        card.append(img);
    }
    const body = el('div', 'book-body');
    body.append(el('h4', null, book.title));
    if (book.author) body.append(el('p', 'book-author', book.author));
    if (book.about) body.append(el('p', 'book-about', book.about));
    if (book.notes) {
        const t = el('p', 'book-takeaway');
        t.append(el('strong', null, 'My takeaway: '), book.notes);
        body.append(t);
    }
    if (book.grade) body.append(el('p', 'book-grade', 'Rating: ' + book.grade));
    card.append(body);
    return card;
}

fetch('/books.json')
    .then(r => r.json())
    .then(data => {
        const lists = { read: '#read', reading: '#reading', wantToRead: '#want-to-read' };
        for (const [key, sel] of Object.entries(lists)) {
            const books = (data[key] || []).filter(b => b.title && b.title.trim());
            document.querySelector(sel + ' .book-list').append(...books.map(bookCard));
            document.querySelector(sel + ' h3').textContent += ' (' + books.length + ')';
        }
    })
    .catch(err => console.error('Error loading books:', err));

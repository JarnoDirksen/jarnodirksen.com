// Fills the "Reading" line in the Now section from the "reading" list in books.json.
fetch('/books.json')
    .then(r => r.json())
    .then(data => {
        const titles = (data.reading || []).map(b => b.title).filter(Boolean);
        const li = document.getElementById('now-reading');
        if (!li || !titles.length) return;
        li.querySelector('span').textContent = titles.slice(0, 3).join(', ');
        li.hidden = false;
    })
    .catch(() => {});

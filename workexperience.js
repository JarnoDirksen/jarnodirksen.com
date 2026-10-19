// Renders workexperience.json into the timeline. Uses textContent so data is never parsed as HTML.
function make(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
}

fetch('/workexperience.json')
    .then(r => r.json())
    .then(data => {
        const list = document.getElementById('timeline-list');
        data.forEach(item => {
            const li = make('li');
            if (item.id) li.id = item.id;
            const c = make('div', 'timeline-content');
            c.append(make('p', 'date', item.date));
            const head = make('div', 'heading-with-logo');
            head.append(make('h3', null, item.heading));
            if (item.logo) {
                const img = make('img', 'company-logo-right');
                img.src = item.logo;
                img.alt = item.company + ' logo';
                img.loading = 'lazy';
                head.append(img);
            }
            c.append(head);
            if (item.company) c.append(make('p', 'company', item.company));
            if (item.description) {
                const p = make('p', null, item.description);
                if (item.link) {
                    const a = make('a', null, item.link.text);
                    a.href = item.link.url;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    p.append(a, item.after || '');
                }
                c.append(p);
            }
            if (item.details) {
                const ul = make('ul', 'details');
                item.details.forEach(d => ul.append(make('li', null, d)));
                c.append(ul);
            }
            li.append(c);
            list.append(li);
        });
    })
    .catch(err => console.error('Error loading work experience:', err));

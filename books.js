console.log('Script started');
fetch('books.json')
    .then(response => response.json())
    .then(data => {
        console.log('Books data:', data);

        // Function to create book item with only the cover and data attributes
        function createBookItem(book) {
            // Skip if cover is empty to avoid blank items
            if (!book.cover) return '';
            return `
                <div class="book-item" 
                     data-title="${book.title || ''}" 
                     data-author="${book.author || ''}" 
                     data-genre="${book.genre || ''}" 
                     data-cover="${book.cover || ''}" 
                     data-authorinfo="${book.authorInfo || ''}" 
                     data-startdate="${book.startDate || ''}" 
                     data-enddate="${book.endDate || ''}" 
                     data-pages="${book.pages || ''}" 
                     data-notes="${book.notes || ''}" 
                     data-grade="${book.grade || ''}">
                    <img src="${book.cover}" alt="${book.title} Cover" class="book-cover">
                </div>
            `;
        }

        // Append books to each category
        document.querySelector('#read .book-list').innerHTML = data.read.map(createBookItem).join('');
        document.querySelector('#reading .book-list').innerHTML = data.reading.map(createBookItem).join('');
        document.querySelector('#want-to-read .book-list').innerHTML = data.wantToRead.map(createBookItem).join('');

        // Compute and display statistics
        const readBooks = data.read.filter(book => book.title.trim() !== '');
        const readingBooks = data.reading.filter(book => book.title.trim() !== '');
        const totalRead = readBooks.length;
        const totalPages = readBooks.reduce((sum, book) => sum + (parseInt(book.pages) || 0), 0);
        const avgPages = totalRead > 0 ? (totalPages / totalRead).toFixed(2) : 0;

        // Pages read in 2026: completed in 2026 (from read) + ongoing started in 2026 (from reading)
        let totalPages2026 = 0;
        // From read books finished in 2026
        totalPages2026 += readBooks.reduce((sum, book) => {
            if (book.endDate && new Date(book.endDate).getFullYear() === 2026) {
                return sum + (parseInt(book.pages) || 0);
            }
            return sum;
        }, 0);
        // From reading books started in 2026 (assume full pages as "read" in 2026)
        totalPages2026 += readingBooks.reduce((sum, book) => {
            if (book.startDate && new Date(book.startDate).getFullYear() === 2026) {
                return sum + (parseInt(book.pages) || 0);
            }
            return sum;
        }, 0);

        document.getElementById('totalRead').textContent = totalRead;
        document.getElementById('totalPagesRead').textContent = totalPages;
        document.getElementById('avgPages').textContent = avgPages;
        document.getElementById('totalPages2026').textContent = totalPages2026;

        // Modal elements
        const modal = document.getElementById('bookModal');
        const modalCover = document.getElementById('modalCover');
        const modalTitle = document.getElementById('modalTitle');
        const modalAuthor = document.getElementById('modalAuthor');
        const modalGenre = document.getElementById('modalGenre');
        const modalAuthorInfo = document.getElementById('modalAuthorInfo');
        const modalStartDate = document.getElementById('modalStartDate');
        const modalEndDate = document.getElementById('modalEndDate');
        const modalPages = document.getElementById('modalPages');
        const modalNotes = document.getElementById('modalNotes');
        const modalGrade = document.getElementById('modalGrade');
        const closeBtn = document.querySelector('.close');

        // Add click event to book items
        document.querySelectorAll('.book-item').forEach(item => {
            item.addEventListener('click', () => {
                console.log('Book clicked:', item.getAttribute('data-title'));
                // Populate modal content
                modalCover.src = item.getAttribute('data-cover') || '';
                modalTitle.textContent = item.getAttribute('data-title') || 'Untitled';
                modalAuthor.textContent = item.getAttribute('data-author') || 'Unknown Author';
                modalGenre.textContent = item.getAttribute('data-genre') || 'N/A';
                modalAuthorInfo.textContent = item.getAttribute('data-authorinfo') || 'No info available';
                modalStartDate.textContent = item.getAttribute('data-startdate') || 'N/A';
                modalEndDate.textContent = item.getAttribute('data-enddate') || 'N/A';
                modalPages.textContent = item.getAttribute('data-pages') || 'N/A';
                modalNotes.textContent = item.getAttribute('data-notes') || 'No notes';
                modalGrade.textContent = item.getAttribute('data-grade') || 'Not graded';
                modal.style.display = 'flex'; // Show the modal
            });
        });

        // Close modal on close button click
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    })
    .catch(error => console.error('Error fetching books:', error));
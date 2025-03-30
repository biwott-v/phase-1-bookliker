document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
    const currentUser = { id: 1, username: 'pouros' };

    function fetchBooks() {
        fetch('http://localhost:3000/books')
            .then(res => res.json())
            .then(books => {
                books.forEach(book => renderBookTitle(book));
            });
    }

    function renderBookTitle(book) {
        const li = document.createElement('li');
        li.textContent = book.title;
        li.addEventListener('click', () => showBookDetails(book));
        list.appendChild(li);
    }

    function showBookDetails(book) {
        showPanel.innerHTML = `
            <img src="${book.img_url}" alt="${book.title} cover">
            <h2>${book.title}</h2>
            ${book.subtitle ? `<h3>${book.subtitle}</h3>` : ''}
            <p><strong>Author:</strong> ${book.author}</p>
            <p>${book.description}</p>
            <h4>Liked by:</h4>
            <ul id="users-list"></ul>
            <button id="like-btn">${isLiked(book) ? 'UNLIKE' : 'LIKE'}</button>
        `;

        const usersList = document.getElementById('users-list');
        book.users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.username;
            usersList.appendChild(li);
        });

        document.getElementById('like-btn').addEventListener('click', () => toggleLike(book));
    }

    function isLiked(book) {
        return book.users.some(user => user.id === currentUser.id);
    }

    function toggleLike(book) {
        const newUsers = isLiked(book)
            ? book.users.filter(user => user.id !== currentUser.id)
            : [...book.users, currentUser];

        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({ users: newUsers })
        })
        .then(res => res.json())
        .then(updatedBook => {
            // Update the displayed book details with new data
            book.users = updatedBook.users;
            showBookDetails(book);
        });
    }

    fetchBooks();
});

fetch("data/books.json")
.then(response => response.json())
.then(books => {

const library = document.getElementById("library");

books.forEach(book => {

const percent = Math.round(book.currentPage / book.totalPages * 100);

library.innerHTML += `

<div class="book-card">

<h2>${book.title}</h2>

<p><strong>Author:</strong> ${book.author}</p>

<p>${book.currentPage} / ${book.totalPages} pages</p>

<p>${percent}% Complete</p>

<p>${book.notes.length} Notes</p>

<button onclick="location.href='book.html?id=${book.id}'">

Open Book

</button>

</div>

`;

});

});

/* ==========================================
   THE STUDY LEDGER CMS
========================================== */

const panels = document.querySelectorAll(".panel");
const navButtons = document.querySelectorAll(".nav-btn");
const cards = document.querySelectorAll(".card");

const titles = {
    dashboard: "Dashboard",
    books: "Books",
    notes: "Notes",
    logs: "Daily Log",
    profile: "Profile",
    export: "Export"
};

/* ==========================================
   Navigation
========================================== */

function openPanel(panelName) {

    panels.forEach(panel => panel.classList.remove("active"));
    navButtons.forEach(button => button.classList.remove("active"));

    document.getElementById(panelName)?.classList.add("active");

    document
        .querySelector(`.nav-btn[data-panel="${panelName}"]`)
        ?.classList.add("active");

    document.getElementById("pageTitle").textContent =
        titles[panelName] || "Dashboard";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        openPanel(button.dataset.panel);

    });

});

cards.forEach(card => {

    card.addEventListener("click", () => {

        openPanel(card.dataset.open);

    });

});

openPanel("dashboard");

/* ==========================================
   Books Manager
========================================== */

let books = [];
let editingBook = null;

const bookId = document.getElementById("bookId");
const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookPages = document.getElementById("bookPages");
const bookCurrentPage = document.getElementById("bookCurrentPage");
const bookStarted = document.getElementById("bookStarted");
const bookStatus = document.getElementById("bookStatus");

const saveBook = document.getElementById("saveBook");
const clearBook = document.getElementById("clearBook");
const bookList = document.getElementById("bookList");
const booksPreview = document.getElementById("booksPreview");
const copyBooks = document.getElementById("copyBooks");
const downloadBooks = document.getElementById("downloadBooks");

function nextBookId() {
    return books.length === 0
        ? 1
        : Math.max(...books.map(b => b.id)) + 1;
}

function clearBookForm() {

    editingBook = null;

    bookId.value = nextBookId();
    bookTitle.value = "";
    bookAuthor.value = "";
    bookPages.value = "";
    bookCurrentPage.value = "";
    bookStarted.value = "";
    bookStatus.value = "reading";

}

function renderBooks() {

    if (books.length === 0) {

        bookList.innerHTML = "<p>No books yet.</p>";
        return;

    }

    bookList.innerHTML = "";

    books.forEach(book => {
      

        const card = document.createElement("div");

        card.className = "book-card";

        card.innerHTML = `
            <div>

                <h4>${book.title}</h4>

                <p>${book.author}</p>

                <small>
                    ${book.currentPage}/${book.pages} pages
                </small>

                <br>

                <small>${book.status}</small>

            </div>

            <div class="book-buttons">

                <button onclick="editBook(${book.id})">
                    ✏ Edit
                </button>

                <button onclick="deleteBook(${book.id})">
                    🗑 Delete
                </button>

            </div>
        `;

        bookList.appendChild(card);

    });
    booksPreview.textContent =
    JSON.stringify(books, null, 4);

}

saveBook.onclick = () => {

    if (bookTitle.value.trim() === "") {

        alert("Please enter a title.");
        return;

    }

    const book = {

        id: editingBook ?? nextBookId(),

        title: bookTitle.value.trim(),

        author: bookAuthor.value.trim(),

        pages: Number(bookPages.value),

        currentPage: Number(bookCurrentPage.value),

        started: bookStarted.value,

        status: bookStatus.value

    };

    if (editingBook) {

        const index = books.findIndex(b => b.id === editingBook);

        books[index] = book;

    } else {

        books.push(book);

    }

    renderBooks();
   populateBookDropdown();

    clearBookForm();

};

clearBook.onclick = clearBookForm;

function deleteBook(id) {

    books = books.filter(book => book.id !== id);

    renderBooks();
   populateBookDropdown();

    clearBookForm();

}

function editBook(id) {

    const book = books.find(b => b.id === id);

    if (!book) return;

    editingBook = id;

    bookId.value = book.id;
    bookTitle.value = book.title;
    bookAuthor.value = book.author;
    bookPages.value = book.pages;
    bookCurrentPage.value = book.currentPage;
    bookStarted.value = book.started;
    bookStatus.value = book.status;

}

window.editBook = editBook;
window.deleteBook = deleteBook;
copyBooks.onclick = () => {

    navigator.clipboard.writeText(
        JSON.stringify(books, null, 4)
    );

    alert("books.json copied!");

};

downloadBooks.onclick = () => {

    const blob = new Blob(

        [JSON.stringify(books, null, 4)],

        {type:"application/json"}

    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "books.json";

    a.click();

    URL.revokeObjectURL(a.href);

};
clearBookForm();
populateBookDropdown();
clearNoteForm();

/* ==========================================
   Notes Manager
========================================== */
let notes = [];
let editingNote = null;

const noteId = document.getElementById("noteId");
const noteBook = document.getElementById("noteBook");
const noteTitle = document.getElementById("noteTitle");
const noteDate = document.getElementById("noteDate");
const notePages = document.getElementById("notePages");
const noteContent = document.getElementById("noteContent");

const saveNote = document.getElementById("saveNote");
const clearNote = document.getElementById("clearNote");
const noteList = document.getElementById("noteList");

const notesPreview = document.getElementById("notesPreview");
const copyNotes = document.getElementById("copyNotes");
const downloadNotes = document.getElementById("downloadNotes");
function nextNoteId() {
    return notes.length === 0
        ? 1
        : Math.max(...notes.map(n => n.id)) + 1;
}

function populateBookDropdown() {

    noteBook.innerHTML = `
        <option value="">Select a book...</option>
    `;

    books.forEach(book => {

        const option = document.createElement("option");

        option.value = book.id;
        option.textContent = book.title;

        noteBook.appendChild(option);

    });

}

function clearNoteForm() {

    editingNote = null;

    noteId.value = nextNoteId();
    noteBook.value = "";
    noteTitle.value = "";
    noteDate.value = "";
    notePages.value = "";
    noteContent.value = "";

}

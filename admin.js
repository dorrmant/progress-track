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
   NAVIGATION
========================================== */

function openPanel(panelName) {

    panels.forEach(panel =>
        panel.classList.remove("active")
    );

    navButtons.forEach(button =>
        button.classList.remove("active")
    );

    document
        .getElementById(panelName)
        ?.classList.add("active");

    document
        .querySelector(
            `.nav-btn[data-panel="${panelName}"]`
        )
        ?.classList.add("active");

    const pageTitle =
        document.getElementById("pageTitle");

    if (pageTitle) {

        pageTitle.textContent =
            titles[panelName] || "Dashboard";

    }

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
   GLOBAL DATA
========================================== */

let books = [];
let notes = [];
let logs = [];

let editingBook = null;
let editingNote = null;
let editingLog = null;


/* ==========================================
   JSON LOADER
========================================== */

async function loadJSON(path) {

    try {

        const response =
            await fetch(
                `${path}?v=${Date.now()}`
            );

        if (!response.ok) {

            throw new Error(
                `${path}: HTTP ${response.status}`
            );

        }

        const data =
            await response.json();

        if (!Array.isArray(data)) {

            throw new Error(
                `${path} must contain a JSON array.`
            );

        }

        return data;

    }

    catch (error) {

        console.error(
            "JSON loading error:",
            error
        );

        return [];

    }

}


/* ==========================================
   JSON DOWNLOAD
========================================== */

function downloadJSON(filename, data) {

    const blob =
        new Blob(
            [
                JSON.stringify(
                    data,
                    null,
                    4
                )
            ],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


/* ==========================================
   HTML ESCAPE
========================================== */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   BOOKS MANAGER
========================================== */

const bookId =
    document.getElementById("bookId");

const bookTitle =
    document.getElementById("bookTitle");

const bookAuthor =
    document.getElementById("bookAuthor");

const bookPages =
    document.getElementById("bookPages");

const bookCurrentPage =
    document.getElementById("bookCurrentPage");

const bookStarted =
    document.getElementById("bookStarted");

const bookStatus =
    document.getElementById("bookStatus");

const saveBook =
    document.getElementById("saveBook");

const clearBook =
    document.getElementById("clearBook");

const bookList =
    document.getElementById("bookList");

const booksPreview =
    document.getElementById("booksPreview");

const copyBooks =
    document.getElementById("copyBooks");

const downloadBooks =
    document.getElementById("downloadBooks");


function nextBookId() {

    if (books.length === 0) {

        return 1;

    }

    return Math.max(
        ...books.map(
            book =>
                Number(book.id) || 0
        )
    ) + 1;

}


function clearBookForm() {

    editingBook = null;

    if (bookId)
        bookId.value =
            nextBookId();

    if (bookTitle)
        bookTitle.value = "";

    if (bookAuthor)
        bookAuthor.value = "";

    if (bookPages)
        bookPages.value = "";

    if (bookCurrentPage)
        bookCurrentPage.value = "";

    if (bookStarted)
        bookStarted.value = "";

    if (bookStatus)
        bookStatus.value = "reading";

}


function renderBooks() {

    if (!bookList || !booksPreview)
        return;


    if (books.length === 0) {

        bookList.innerHTML =
            "<p>No books yet.</p>";

        booksPreview.textContent =
            "[]";

        return;

    }


    bookList.innerHTML = "";


    books.forEach(book => {

        const card =
            document.createElement("div");

        card.className =
            "book-card";


        card.innerHTML = `

            <div>

                <h4>
                    ${escapeHTML(book.title)}
                </h4>

                <p>
                    ${escapeHTML(book.author)}
                </p>

                <small>
                    ${Number(book.currentPage) || 0}
                    /
                    ${Number(book.pages) || 0}
                    pages
                </small>

                <br>

                <small>
                    ${escapeHTML(book.status)}
                </small>

            </div>


            <div class="book-buttons">

                <button
                    type="button"
                    onclick="editBook(${Number(book.id)})"
                >
                    ✏ Edit
                </button>

                <button
                    type="button"
                    onclick="deleteBook(${Number(book.id)})"
                >
                    🗑 Delete
                </button>

            </div>

        `;


        bookList.appendChild(card);

    });


    booksPreview.textContent =
        JSON.stringify(
            books,
            null,
            4
        );

}


if (saveBook) {

    saveBook.addEventListener(
        "click",
        () => {

            if (
                !bookTitle.value.trim()
            ) {

                alert(
                    "Please enter a title."
                );

                return;

            }


            const book = {

                id:
                    editingBook !== null
                        ? Number(editingBook)
                        : nextBookId(),

                title:
                    bookTitle.value.trim(),

                author:
                    bookAuthor.value.trim(),

                pages:
                    Number(
                        bookPages.value || 0
                    ),

                currentPage:
                    Number(
                        bookCurrentPage.value || 0
                    ),

                started:
                    bookStarted.value,

                status:
                    bookStatus.value

            };


            if (
                editingBook !== null
            ) {

                const index =
                    books.findIndex(
                        book =>
                            Number(book.id) ===
                            Number(editingBook)
                    );


                if (index !== -1) {

                    books[index] =
                        book;

                }

            }

            else {

                books.push(book);

            }


            renderBooks();

            clearBookForm();

        }
    );

}


if (clearBook) {

    clearBook.addEventListener(
        "click",
        clearBookForm
    );

}


function editBook(id) {

    const book =
        books.find(
            book =>
                Number(book.id) ===
                Number(id)
        );


    if (!book)
        return;


    editingBook =
        Number(book.id);


    bookId.value =
        book.id;

    bookTitle.value =
        book.title || "";

    bookAuthor.value =
        book.author || "";

    bookPages.value =
        book.pages ?? "";

    bookCurrentPage.value =
        book.currentPage ?? "";

    bookStarted.value =
        book.started || "";

    bookStatus.value =
        book.status || "reading";

}


function deleteBook(id) {

    books =
        books.filter(
            book =>
                Number(book.id) !==
                Number(id)
        );


    renderBooks();

    clearBookForm();

}


window.editBook =
    editBook;

window.deleteBook =
    deleteBook;


if (copyBooks) {

    copyBooks.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    JSON.stringify(
                        books,
                        null,
                        4
                    )
                );

                alert(
                    "books.json copied!"
                );

            }

            catch (error) {

                console.error(error);

                alert(
                    "Could not copy books.json."
                );

            }

        }
    );

}


if (downloadBooks) {

    downloadBooks.addEventListener(
        "click",
        () => {

            downloadJSON(
                "books.json",
                books
            );

        }
    );

}


/* ==========================================
   NOTES MANAGER
========================================== */

const noteId =
    document.getElementById("noteId");

const noteBook =
    document.getElementById("noteBook");

const noteTitle =
    document.getElementById("noteTitle");

const noteDate =
    document.getElementById("noteDate");

const notePages =
    document.getElementById("notePages");

const noteContent =
    document.getElementById("noteContent");

const saveNote =
    document.getElementById("saveNote");

const clearNote =
    document.getElementById("clearNote");

const noteList =
    document.getElementById("noteList");

const notesPreview =
    document.getElementById("notesPreview");

const copyNotes =
    document.getElementById("copyNotes");

const downloadNotes =
    document.getElementById("downloadNotes");


function nextNoteId() {

    if (notes.length === 0) {

        return 1;

    }

    return Math.max(
        ...notes.map(
            note =>
                Number(note.id) || 0
        )
    ) + 1;

}


function clearNoteForm() {

    editingNote = null;


    if (noteId)
        noteId.value =
            nextNoteId();


    if (noteBook)
        noteBook.value = "";


    if (noteTitle)
        noteTitle.value = "";


    if (noteDate)
        noteDate.value =
            new Date()
                .toISOString()
                .slice(0, 10);


    if (notePages)
        notePages.value = "";


    if (noteContent)
        noteContent.value = "";

}


function renderNotes() {

    if (!noteList || !notesPreview)
        return;


    if (notes.length === 0) {

        noteList.innerHTML =
            "<p>No notes yet.</p>";

        notesPreview.textContent =
            "[]";

        return;

    }


    noteList.innerHTML = "";


    notes.forEach(note => {

        const card =
            document.createElement("div");

        card.className =
            "book-card";


        card.innerHTML = `

            <div>

                <h4>
                    ${escapeHTML(note.title)}
                </h4>

                <p>
                    ${escapeHTML(note.date)}
                </p>

                <small>
                    Pages
                    ${escapeHTML(note.pages)}
                </small>

                <br>

                <small>
                    Book ID:
                    ${Number(note.book) || 0}
                </small>

            </div>


            <div class="book-buttons">

                <button
                    type="button"
                    onclick="editNote(${Number(note.id)})"
                >
                    ✏ Edit
                </button>

                <button
                    type="button"
                    onclick="deleteNote(${Number(note.id)})"
                >
                    🗑 Delete
                </button>

            </div>

        `;


        noteList.appendChild(card);

    });


    notesPreview.textContent =
        JSON.stringify(
            notes,
            null,
            4
        );

}


if (saveNote) {

    saveNote.addEventListener(
        "click",
        () => {

            if (
                !noteTitle.value.trim()
            ) {

                alert(
                    "Enter a title."
                );

                return;

            }


            if (
                !noteBook.value.trim()
            ) {

                alert(
                    "Enter Book ID."
                );

                return;

            }


            const bookNumber =
                Number(
                    noteBook.value
                );


            if (
                !Number.isFinite(
                    bookNumber
                )
            ) {

                alert(
                    "Book ID must be a number."
                );

                return;

            }


            const note = {

                id:
                    editingNote !== null
                        ? Number(editingNote)
                        : nextNoteId(),

                book:
                    bookNumber,

                date:
                    noteDate.value,

                pages:
                    notePages.value.trim(),

                title:
                    noteTitle.value.trim(),

                content:
                    noteContent.value

            };


            if (
                editingNote !== null
            ) {

                const index =
                    notes.findIndex(
                        note =>
                            Number(note.id) ===
                            Number(editingNote)
                    );


                if (index !== -1) {

                    notes[index] =
                        note;

                }

            }

            else {

                notes.push(note);

            }


            renderNotes();

            clearNoteForm();

        }
    );

}


if (clearNote) {

    clearNote.addEventListener(
        "click",
        clearNoteForm
    );

}


function editNote(id) {

    const note =
        notes.find(
            note =>
                Number(note.id) ===
                Number(id)
        );


    if (!note)
        return;


    editingNote =
        Number(note.id);


    noteId.value =
        note.id;

    noteBook.value =
        note.book ?? "";

    noteDate.value =
        note.date || "";

    notePages.value =
        note.pages || "";

    noteTitle.value =
        note.title || "";

    noteContent.value =
        note.content || "";

}


function deleteNote(id) {

    notes =
        notes.filter(
            note =>
                Number(note.id) !==
                Number(id)
        );


    renderNotes();

    clearNoteForm();

}


window.editNote =
    editNote;

window.deleteNote =
    deleteNote;


if (copyNotes) {

    copyNotes.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    JSON.stringify(
                        notes,
                        null,
                        4
                    )
                );

                alert(
                    "notes.json copied!"
                );

            }

            catch (error) {

                console.error(error);

                alert(
                    "Could not copy notes.json."
                );

            }

        }
    );

}


if (downloadNotes) {

    downloadNotes.addEventListener(
        "click",
        () => {

            downloadJSON(
                "notes.json",
                notes
            );

        }
    );

}


/* ==========================================
   DAILY LOG MANAGER
========================================== */

const logId =
    document.getElementById("logId");

const logDate =
    document.getElementById("logDate");

const logStatus =
    document.getElementById("logStatus");

const logHours =
    document.getElementById("logHours");

const logPages =
    document.getElementById("logPages");

const logNotes =
    document.getElementById("logNotes");

const topicInputs =
    document.getElementById("topicInputs");

const addTopic =
    document.getElementById("addTopic");

const saveLog =
    document.getElementById("saveLog");

const clearLog =
    document.getElementById("clearLog");

const logList =
    document.getElementById("logList");

const logsPreview =
    document.getElementById("logsPreview");

const copyLogs =
    document.getElementById("copyLogs");

const downloadLogs =
    document.getElementById("downloadLogs");


function nextLogId() {

    if (logs.length === 0) {

        return 1;

    }

    return Math.max(
        ...logs.map(
            log =>
                Number(log.id) || 0
        )
    ) + 1;

}


function addTopicInput(
    value = ""
) {

    if (!topicInputs)
        return;


    const input =
        document.createElement(
            "input"
        );


    input.type =
        "text";


    input.className =
        "topic-input";


    input.placeholder =
        "Topic studied...";


    input.value =
        value;


    topicInputs.appendChild(
        input
    );

}


function resetTopicInputs() {

    if (!topicInputs)
        return;


    topicInputs.innerHTML =
        "";


    addTopicInput();

}


function getTopics() {

    if (!topicInputs)
        return [];


    return Array.from(
        topicInputs.querySelectorAll(
            ".topic-input"
        )
    )
        .map(
            input =>
                input.value.trim()
        )
        .filter(
            topic =>
                topic !== ""
        );

}


function clearLogForm() {

    editingLog = null;


    if (logId) {

        logId.value =
            nextLogId();

    }


    if (logDate) {

        logDate.value =
            new Date()
                .toISOString()
                .slice(0, 10);

    }


    if (logStatus) {

        logStatus.value =
            "good";

    }


    if (logHours) {

        logHours.value =
            "";

    }


    if (logPages) {

        logPages.value =
            "";

    }


    if (logNotes) {

        logNotes.value =
            "";

    }


    resetTopicInputs();

}


function renderLogs() {

    if (!logList || !logsPreview)
        return;


    if (logs.length === 0) {

        logList.innerHTML =
            "<p>No logs yet.</p>";

        logsPreview.textContent =
            "[]";

        return;

    }


    logList.innerHTML =
        "";


    logs.forEach(log => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "book-card";


        const topics =
            Array.isArray(log.topics)
                ? log.topics
                : [];


        card.innerHTML = `

            <div>

                <h4>
                    ${escapeHTML(
                        log.date
                    )}
                </h4>

                <p>
                    Status:
                    ${escapeHTML(
                        log.status
                    )}
                </p>

                <small>
                    Hours:
                    ${Number(log.hours) || 0}
                </small>

                <br>

                <small>
                    Pages:
                    ${Number(log.pages) || 0}
                </small>

                <br>

                <small>
                    Notes:
                    ${Number(log.notes) || 0}
                </small>

                <br><br>

                <small>
                    ${topics
                        .map(
                            topic =>
                                escapeHTML(
                                    topic
                                )
                        )
                        .join(" • ")}
                </small>

            </div>


            <div class="book-buttons">

                <button
                    type="button"
                    onclick="editLog(${Number(log.id)})"
                >
                    ✏ Edit
                </button>

                <button
                    type="button"
                    onclick="deleteLog(${Number(log.id)})"
                >
                    🗑 Delete
                </button>

            </div>

        `;


        logList.appendChild(
            card
        );

    });


    logsPreview.textContent =
        JSON.stringify(
            logs,
            null,
            4
        );

}


if (addTopic) {

    addTopic.addEventListener(
        "click",
        () => {

            addTopicInput();

        }
    );

}


if (saveLog) {

    saveLog.addEventListener(
        "click",
        () => {

            const topics =
                getTopics();


            if (!logDate.value) {

                alert(
                    "Please select a date."
                );

                return;

            }


            if (
                topics.length === 0
            ) {

                alert(
                    "Please enter at least one topic."
                );

                return;

            }


            const log = {

                id:
                    editingLog !== null
                        ? Number(
                            editingLog
                        )
                        : nextLogId(),

                date:
                    logDate.value,

                status:
                    logStatus.value,

                hours:
                    Number(
                        logHours.value || 0
                    ),

                pages:
                    Number(
                        logPages.value || 0
                    ),

                topics:
                    topics,

                notes:
                    Number(
                        logNotes.value || 0
                    )

            };


            if (
                editingLog !== null
            ) {

                const index =
                    logs.findIndex(
                        log =>
                            Number(
                                log.id
                            ) ===
                            Number(
                                editingLog
                            )
                    );


                if (
                    index !== -1
                ) {

                    logs[index] =
                        log;

                }

            }

            else {

                logs.push(
                    log
                );

            }


            renderLogs();

            clearLogForm();

        }
    );

}


function editLog(id) {

    const log =
        logs.find(
            log =>
                Number(log.id) ===
                Number(id)
        );


    if (!log)
        return;


    editingLog =
        Number(log.id);


    logId.value =
        log.id;

    logDate.value =
        log.date || "";

    logStatus.value =
        log.status || "good";

    logHours.value =
        log.hours ?? "";

    logPages.value =
        log.pages ?? "";

    logNotes.value =
        log.notes ?? "";


    topicInputs.innerHTML =
        "";


    if (
        Array.isArray(
            log.topics
        ) &&
        log.topics.length
    ) {

        log.topics.forEach(
            topic =>
                addTopicInput(
                    topic
                )
        );

    }

    else {

        addTopicInput();

    }

}


function deleteLog(id) {

    logs =
        logs.filter(
            log =>
                Number(log.id) !==
                Number(id)
        );


    renderLogs();

    clearLogForm();

}


window.editLog =
    editLog;

window.deleteLog =
    deleteLog;


if (clearLog) {

    clearLog.addEventListener(
        "click",
        clearLogForm
    );

}


if (copyLogs) {

    copyLogs.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    JSON.stringify(
                        logs,
                        null,
                        4
                    )
                );

                alert(
                    "logs.json copied!"
                );

            }

            catch (error) {

                console.error(error);

                alert(
                    "Could not copy logs.json."
                );

            }

        }
    );

}


if (downloadLogs) {

    downloadLogs.addEventListener(
        "click",
        () => {

            downloadJSON(
                "logs.json",
                logs
            );

        }
    );

}


/* ==========================================
   INITIALIZATION
========================================== */

async function initializeCMS() {

    books =
        await loadJSON(
            "data/books.json"
        );

    notes =
        await loadJSON(
            "data/notes.json"
        );

    logs =
        await loadJSON(
            "data/logs.json"
        );


    renderBooks();

    renderNotes();

    renderLogs();


    clearBookForm();

    clearNoteForm();

    clearLogForm();


    console.log(
        "Study Ledger CMS initialized."
    );

    console.log(
        "Books:",
        books
    );

    console.log(
        "Notes:",
        notes
    );

    console.log(
        "Logs:",
        logs
    );

}


initializeCMS();

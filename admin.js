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
    booksPreview.textContent = "[]";
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

/*notemanager*/

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
    noteBook.innerHTML = `<option value="">Select a book...</option>`;

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
    noteDate.value = new Date().toISOString().slice(0,10);
    notePages.value = "";
    noteContent.value = "";
}

function renderNotes() {

    if(notes.length===0){

        noteList.innerHTML="<p>No notes yet.</p>";
        notesPreview.textContent="[]";
        return;

    }

    noteList.innerHTML="";

    notes.forEach(note=>{

        const card=document.createElement("div");

        card.className="book-card";

        card.innerHTML=`
            <div>
                <h4>${note.title}</h4>
                <p>${note.date}</p>
                <small>${note.pages}</small>
            </div>

            <div class="book-buttons">
                <button onclick="editNote(${note.id})">✏ Edit</button>
                <button onclick="deleteNote(${note.id})">🗑 Delete</button>
            </div>
        `;

        noteList.appendChild(card);

    });

    notesPreview.textContent =
        JSON.stringify(notes,null,4);

}

saveNote.onclick = () => {

    if(noteTitle.value.trim()===""){
        alert("Enter a title.");
        return;
    }

if(noteBook.value.trim()===""){
    alert("Enter Book ID.");
    return;
}

    const note = {

        id: editingNote ?? nextNoteId(),

        book: Number(noteBook.value),

        date: noteDate.value,

        pages: notePages.value.trim(),

        title: noteTitle.value.trim(),

        content: noteContent.value

    };

    if(editingNote){

        const i=notes.findIndex(n=>n.id===editingNote);
        notes[i]=note;

    }else{

        notes.push(note);

    }

    renderNotes();
    clearNoteForm();

};

function editNote(id){

    const note=notes.find(n=>n.id===id);

    if(!note) return;

    editingNote=id;

    noteId.value=note.id;
    noteBook.value=note.book;
    noteDate.value=note.date;
    notePages.value=note.pages;
    noteTitle.value=note.title;
    noteContent.value=note.content;

}

function deleteNote(id){

  notes = notes.filter(n => n.id !== id);

clearNoteForm();
renderNotes();

}

window.editNote=editNote;
window.deleteNote=deleteNote;

clearNote.onclick=clearNoteForm;

copyNotes.onclick=()=>{

    navigator.clipboard.writeText(
        JSON.stringify(notes,null,4)
    );

    alert("notes.json copied.");

};

downloadNotes.onclick=()=>{

    const blob=new Blob(
        [JSON.stringify(notes,null,4)],
        {type:"application/json"}
    );

    const a=document.createElement("a");

    a.href=URL.createObjectURL(blob);
    a.download="notes.json";
    a.click();

    URL.revokeObjectURL(a.href);

};
/* ==========================================
   DAILY LOG MANAGER
========================================== */

let logs = [];
let editingLog = null;


/* ==========================================
   Elements
========================================== */

const logId = document.getElementById("logId");
const logDate = document.getElementById("logDate");
const logStatus = document.getElementById("logStatus");
const logHours = document.getElementById("logHours");
const logPages = document.getElementById("logPages");
const logNotes = document.getElementById("logNotes");

const topicInputs = document.getElementById("topicInputs");
const addTopic = document.getElementById("addTopic");

const saveLog = document.getElementById("saveLog");
const clearLog = document.getElementById("clearLog");

const logList = document.getElementById("logList");
const logsPreview = document.getElementById("logsPreview");

const copyLogs = document.getElementById("copyLogs");
const downloadLogs = document.getElementById("downloadLogs");


/* ==========================================
   Next Log ID
========================================== */

function nextLogId() {

    if (logs.length === 0) {
        return 1;
    }

    return Math.max(
        ...logs.map(log => Number(log.id) || 0)
    ) + 1;

}


/* ==========================================
   Add Topic Input
========================================== */

function addTopicInput(value = "") {

    const input = document.createElement("input");

    input.type = "text";

    input.className = "topic-input";

    input.placeholder = "Topic studied...";

    input.value = value;

    topicInputs.appendChild(input);

}


/* ==========================================
   Reset Topic Inputs
========================================== */

function resetTopicInputs() {

    topicInputs.innerHTML = "";

    addTopicInput();

}


/* ==========================================
   Get Topics
========================================== */

function getTopics() {

    return Array.from(
        topicInputs.querySelectorAll(".topic-input")
    )
        .map(input => input.value.trim())
        .filter(topic => topic !== "");

}


/* ==========================================
   Clear Form
========================================== */

function clearLogForm() {

    editingLog = null;

    logId.value = nextLogId();

    logDate.value = new Date()
        .toISOString()
        .slice(0, 10);

    logStatus.value = "good";

    logHours.value = "";

    logPages.value = "";

    logNotes.value = "";

    resetTopicInputs();

}


/* ==========================================
   Render Logs
========================================== */

function renderLogs() {

    if (logs.length === 0) {

        logList.innerHTML =
            "<p>No logs yet.</p>";

        logsPreview.textContent =
            "[]";

        return;

    }


    logList.innerHTML = "";


    logs.forEach(log => {

        const card =
            document.createElement("div");

        card.className = "book-card";


        const topics =
            Array.isArray(log.topics)
                ? log.topics
                : [];


        card.innerHTML = `

            <div>

                <h4>${log.date}</h4>

                <p>
                    Status: ${log.status}
                </p>

                <small>
                    Hours: ${log.hours}
                </small>

                <br>

                <small>
                    Pages: ${log.pages}
                </small>

                <br>

                <small>
                    Notes: ${log.notes}
                </small>

                <br><br>

                <small>
                    ${topics.join(" • ")}
                </small>

            </div>


            <div class="book-buttons">

                <button
                    onclick="editLog(${log.id})"
                >
                    ✏ Edit
                </button>

                <button
                    onclick="deleteLog(${log.id})"
                >
                    🗑 Delete
                </button>

            </div>

        `;

        logList.appendChild(card);

    });


    logsPreview.textContent =
        JSON.stringify(logs, null, 4);

}


/* ==========================================
   Add Topic Button
========================================== */

addTopic.addEventListener("click", () => {

    addTopicInput();

});


/* ==========================================
   Save Log
========================================== */

saveLog.addEventListener("click", () => {

    const topics = getTopics();


    if (!logDate.value) {

        alert("Please select a date.");

        return;

    }


    if (topics.length === 0) {

        alert("Please enter at least one topic.");

        return;

    }


    const log = {

        id:
            editingLog !== null
                ? editingLog
                : nextLogId(),

        date:
            logDate.value,

        status:
            logStatus.value,

        hours:
            Number(logHours.value || 0),

        pages:
            Number(logPages.value || 0),

        topics:
            topics,

        notes:
            Number(logNotes.value || 0)

    };


    if (editingLog !== null) {

        const index =
            logs.findIndex(
                item =>
                    Number(item.id) ===
                    Number(editingLog)
            );


        if (index !== -1) {

            logs[index] = log;

        }

    } else {

        logs.push(log);

    }


    renderLogs();

    clearLogForm();

});


/* ==========================================
   Edit Log
========================================== */

function editLog(id) {

    const log =
        logs.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!log) {
        return;
    }


    editingLog = log.id;


    logId.value = log.id;

    logDate.value = log.date;

    logStatus.value = log.status;

    logHours.value = log.hours;

    logPages.value = log.pages;

    logNotes.value = log.notes;


    topicInputs.innerHTML = "";


    if (
        Array.isArray(log.topics) &&
        log.topics.length > 0
    ) {

        log.topics.forEach(topic => {

            addTopicInput(topic);

        });

    } else {

        addTopicInput();

    }

}


/* ==========================================
   Delete Log
========================================== */

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


window.editLog = editLog;

window.deleteLog = deleteLog;


/* ==========================================
   Clear Button
========================================== */

clearLog.addEventListener(
    "click",
    clearLogForm
);


/* ==========================================
   Copy JSON
========================================== */

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

            alert("logs.json copied!");

        }

        catch (error) {

            console.error(error);

            alert("Could not copy JSON.");

        }

    }
);


/* ==========================================
   Download JSON
========================================== */

downloadLogs.addEventListener(
    "click",
    () => {

        const json =
            JSON.stringify(
                logs,
                null,
                4
            );


        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const a =
            document.createElement("a");


        a.href = url;

        a.download = "logs.json";


        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);


        URL.revokeObjectURL(url);

    }
);


/* ==========================================
   Initialize
========================================== */

clearLogForm();

renderLogs();
// Initialize
clearBookForm();
clearNoteForm();

populateBookDropdown();

renderBooks();
renderNotes();

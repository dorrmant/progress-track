/* ==========================================
   THE STUDY LEDGER
========================================== */

console.clear();
console.log("The Study Ledger Loaded");

/* ==========================================
   Today's Date
========================================== */

const currentDate = document.getElementById("currentDate");

currentDate.textContent =
    new Date().toLocaleDateString("en-US",{
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"
    });

/* ==========================================
   Greeting
========================================== */

const greeting = document.getElementById("greeting");

const hour = new Date().getHours();

let text = "";

if (hour >= 5 && hour < 12) {

    text = "☀️ Good Morning";

}
else if (hour >= 12 && hour < 17) {

    text = "🌤️ Good Afternoon";

}
else if (hour >= 17 && hour < 20) {

    text = "🌇 Good Evening";

}
else {

    text = "🌙 Good Night";

}

greeting.textContent = text; 

/* ==========================================
   Load Profile
========================================== */

async function loadProfile() {

    try {

        const response = await fetch("data/profile.json");

        if (!response.ok) return;

        const profile = await response.json();

        document.title = profile.siteTitle;

        const logo = document.querySelector(".logo h1");

        if (logo) {
            logo.textContent = profile.siteTitle;
        }

        const subtitle = document.querySelector(".logo p");

        if (subtitle) {
            subtitle.textContent = profile.subtitle;
        }

    }

    catch (error) {

        console.error(error);

    }

}

loadProfile();

/* ==========================================
   Load Current Book
========================================== */

async function loadBooks() {

    try {

        const response = await fetch("data/books.json");

        if (!response.ok) return;

        const books = await response.json();

        const currentBook = books.find(book => book.status === "reading");

        const container = document.getElementById("currentBook");

        if (!container) return;

        if (!currentBook) {

            container.innerHTML = `
                <p>No book is currently being read.</p>
            `;

            return;

        }

        const percent = Math.round(
            (currentBook.currentPage / currentBook.pages) * 100
        );

        container.innerHTML = `
            <div class="book-preview">

                <div class="cover">
                    📘
                </div>

                <div class="book-info">

                    <h3>${currentBook.title}</h3>

                    <p>${currentBook.author}</p>

                    <div class="progress">
                        <div class="progress-fill" style="width:${percent}%"></div>
                    </div>

                    <small>
                        ${currentBook.currentPage} / ${currentBook.pages} pages (${percent}%)
                    </small>

                </div>

            </div>
        `;

    }

    catch (error) {

        console.error(error);

    }

}

loadBooks();
/* ==========================================
   Statistics
========================================== */

async function loadStatistics() {

    try {

        const response = await fetch("data/books.json");

        if (!response.ok) {
            console.error("Couldn't load books.json");
            return;
        }

        const books = await response.json();

        console.log("Books:", books);

        const booksCount = document.getElementById("booksCount");
        const pagesRead = document.getElementById("pagesRead");

        console.log("booksCount element:", booksCount);
        console.log("pagesRead element:", pagesRead);

        if (booksCount) {
            booksCount.textContent = books.length;
        }

        const totalPages = books.reduce((sum, book) => {
            return sum + Number(book.currentPage || 0);
        }, 0);

        if (pagesRead) {
            pagesRead.textContent = totalPages;
        }

    } catch (error) {

        console.error("Statistics Error:", error);

    }

}

loadStatistics();
/* ==========================================
   Recent Notes
========================================== */

async function loadNotes() {

    try {

        const response = await fetch("data/notes.json");

        if (!response.ok) return;

        const notes = await response.json();
       document.getElementById("notesCount").textContent = notes.length;

        const container = document.getElementById("recentNotes");

        if (!container) return;

        if (notes.length === 0) {

            container.innerHTML = `
                <p style="color:#777;">No notes yet.</p>
            `;

            return;

        }

        container.innerHTML = "";

        notes.forEach(note => {

            container.innerHTML += `
                <div class="note">

                    <div>

                        <strong>${note.date}</strong>

                        <p>${note.title}</p>

                        <small>Pages ${note.pages}</small>

                    </div>

                   <button onclick="location.href='note.html?id=${note.id}'">

Read →

</button>

                </div>
            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

loadNotes();
/* ==========================================
   Fade Cards
========================================== */

const cards = document.querySelectorAll(".card");

cards.forEach((card, index) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {

        card.style.transition = ".6s";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";

    }, index * 120);

});

console.log("Ready");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

if(menuToggle && sidebar){

    menuToggle.addEventListener("click",()=>{

        sidebar.classList.toggle("active");

    });

    document.addEventListener("click",(e)=>{

        if(
            window.innerWidth <= 900 &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)
        ){

            sidebar.classList.remove("active");

        }

    });

}

/* ==========================================
   THE STUDY LEDGER
========================================== */

console.clear();
console.log("The Study Ledger Loaded");

/* ==========================================
   Today's Date
========================================== */

function updateDate() {

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const today = new Date();

    const element = document.querySelector(".date-box span");

    if (element) {
        element.textContent = today.toLocaleDateString("en-US", options);
    }

}

updateDate();

/* ==========================================
   Greeting
========================================== */

function greeting() {

    const hour = new Date().getHours();

    let text = "Welcome";

    if (hour < 12) {

        text = "Good Morning";

    } else if (hour < 18) {

        text = "Good Afternoon";

    } else {

        text = "Good Evening";

    }

    const hero = document.querySelector(".hero h2");

    if (hero) {
        hero.textContent = text;
    }

}

greeting();

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

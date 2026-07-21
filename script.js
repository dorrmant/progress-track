/* ==========================================
   THE STUDY LEDGER
   Phase 1
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

    if(element){

        element.textContent = today.toLocaleDateString("en-US", options);

    }

}

updateDate();

/* ==========================================
   Load Profile
========================================== */

async function loadProfile(){

    try{

        const response = await fetch("data/profile.json");

        if(!response.ok) return;

        const profile = await response.json();

        document.title = profile.siteTitle;

        const logo = document.querySelector(".logo h1");

        if(logo){

            logo.textContent = profile.siteTitle;

        }

        const subtitle = document.querySelector(".logo p");

        if(subtitle){

            subtitle.textContent = profile.subtitle;

        }

    }

    catch(error){

        console.log(error);

    }

}

loadProfile();

/* ==========================================
   Load Books
========================================== */

async function loadBooks(){

    try{

        const response = await fetch("data/books.json");

        if(!response.ok) return;

        const books = await response.json();

        if(books.length === 0){

            return;

        }

        const currentBook = books.find(book => book.status === "reading");

        if(!currentBook){

            return;

        }

        const title = document.querySelector(".book-info h3");

        if(title){

            title.textContent = currentBook.title;

        }

        const author = document.querySelector(".book-info p");

        if(author){

            author.textContent = currentBook.author;

        }

        const progressText = document.querySelector(".book-info small");

        if(progressText){

           const percent = Math.round(
    currentBook.currentPage /
    currentBook.pages *
    100
);

progressText.textContent =
`${currentBook.currentPage} / ${currentBook.pages} pages (${percent}%)`;

            const fill = document.querySelector(".progress-fill");

            if(fill){

                fill.style.width = percent + "%";

            }

        }

    }

    catch(error){

        console.log(error);

    }

}

loadBooks();

/* ==========================================
   Fade Cards
========================================== */

const cards = document.querySelectorAll(".card");

cards.forEach((card,index)=>{

    card.style.opacity="0";

    card.style.transform="translateY(30px)";

    setTimeout(()=>{

        card.style.transition=".6s";

        card.style.opacity="1";

        card.style.transform="translateY(0)";

    },index*120);

});

/* ==========================================
   Greeting
========================================== */

function greeting(){

    const hour = new Date().getHours();

    let text = "Welcome";

    if(hour < 12){

        text = "Good Morning";

    }

    else if(hour < 18){

        text = "Good Afternoon";

    }

    else{

        text = "Good Evening";

    }

    const hero = document.querySelector(".hero h2");

    if(hero){

        hero.textContent = text;

    }

}

greeting();

/* ==========================================
   Placeholder
========================================== */

console.log("Ready for Phase 2");

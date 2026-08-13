// ==========================================
// NOTE.JS
// The Study Ledger
// ==========================================


// ==========================================
// PASSWORD
// ==========================================

// CHANGE THIS TO YOUR PASSWORD
const NOTE_PASSWORD = "0807";


// ==========================================
// PASSWORD GATE
// ==========================================

function showPasswordGate() {

    document.body.innerHTML = `

        <div id="passwordGate">

            <div class="password-box">

                <div class="lock-icon">
                    🔒
                </div>

                <h1>
                    Private Notes
                </h1>

                <p>
                    Enter the password to access this note.
                </p>

                <input
                    type="password"
                    id="notePassword"
                    placeholder="Password"
                    autocomplete="off"
                >

                <button id="unlockNotes">
                    Unlock
                </button>

                <p id="passwordError"></p>

            </div>

        </div>

    `;


    const input =
        document.getElementById("notePassword");

    const button =
        document.getElementById("unlockNotes");

    const error =
        document.getElementById("passwordError");


    function attemptUnlock() {

        if (input.value === NOTE_PASSWORD) {

            sessionStorage.setItem(
                "notesUnlocked",
                "true"
            );

            location.reload();

        } else {

            error.textContent =
                "Incorrect password.";

            input.value = "";

            input.focus();

        }

    }


    button.addEventListener(
        "click",
        attemptUnlock
    );


    input.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                attemptUnlock();

            }

        }
    );

}


// ==========================================
// NOTE ID
// ==========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    Number(params.get("id"));


// ==========================================
// LOAD NOTE
// ==========================================

async function loadNote() {

    try {

        const response =
            await fetch("data/notes.json");


        if (!response.ok) {

            throw new Error(
                "Failed to load notes."
            );

        }


        const notes =
            await response.json();


        const note =
            notes.find(
                n => n.id === id
            );


        // ==================================
        // NOTE NOT FOUND
        // ==================================

        if (!note) {

            document.title =
                "Note not found";


            document.getElementById(
                "noteTitle"
            ).textContent =
                "Note not found.";


            document.getElementById(
                "noteMeta"
            ).textContent =
                "";


            document.getElementById(
                "noteContent"
            ).innerHTML =
                "<p>This note does not exist.</p>";


            return;

        }


        // ==================================
        // NOTE DATA
        // ==================================

        document.title =
            note.title;


        document.getElementById(
            "noteTitle"
        ).textContent =
            note.title;


        document.getElementById(
            "noteMeta"
        ).textContent =
            `${note.date} • Pages ${note.pages}`;


        // ==================================
        // MARKDOWN
        // ==================================

        const content =
            document.getElementById(
                "noteContent"
            );


        if (
            typeof marked !== "undefined"
        ) {

            content.innerHTML =
                marked.parse(
                    note.content
                );

        } else {

            // Fallback if marked.js
            // is unavailable

            content.textContent =
                note.content;

        }

    }


    catch (error) {

        console.error(error);


        const title =
            document.getElementById(
                "noteTitle"
            );

        const meta =
            document.getElementById(
                "noteMeta"
            );

        const content =
            document.getElementById(
                "noteContent"
            );


        if (title) {

            title.textContent =
                "Error";

        }


        if (meta) {

            meta.textContent =
                "";

        }


        if (content) {

            content.innerHTML =
                "<p>Unable to load note.</p>";

        }

    }

}


// ==========================================
// ACCESS CHECK
// ==========================================

if (
    sessionStorage.getItem(
        "notesUnlocked"
    ) === "true"
) {

    loadNote();

} else {

    showPasswordGate();

}


// ==========================================
// MOBILE SIDEBAR
// ==========================================

const menuToggle =
    document.getElementById(
        "menuToggle"
    );


const sidebar =
    document.querySelector(
        ".sidebar"
    );


if (
    menuToggle &&
    sidebar
) {


    menuToggle.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "active"
            );

        }
    );


    document.addEventListener(
        "click",
        (e) => {

            if (

                window.innerWidth <= 900 &&

                !sidebar.contains(
                    e.target
                ) &&

                !menuToggle.contains(
                    e.target
                )

            ) {

                sidebar.classList.remove(
                    "active"
                );

            }

        }
    );

}

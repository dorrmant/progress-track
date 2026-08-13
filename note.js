// ==========================================
// THE STUDY LEDGER
// PRIVATE NOTE.JS
// ==========================================


// ==========================================
// PASSWORD
// ==========================================

const NOTE_PASSWORD = "0807";


// ==========================================
// START
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("NOTE.JS LOADED");

    checkPassword();

});


// ==========================================
// PASSWORD CHECK
// ==========================================

function checkPassword() {

    const unlocked =
        sessionStorage.getItem("notesUnlocked");

    if (unlocked === "true") {

        loadNote();

        return;

    }

    showPasswordScreen();

}


// ==========================================
// PASSWORD SCREEN
// ==========================================

function showPasswordScreen() {

    const gate =
        document.createElement("div");

    gate.id = "passwordGate";

    gate.innerHTML = `

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

    `;

    document.body.appendChild(gate);


    const input =
        document.getElementById("notePassword");

    const button =
        document.getElementById("unlockNotes");

    const error =
        document.getElementById("passwordError");


    function attemptUnlock() {

        if (
            input.value ===
            NOTE_PASSWORD
        ) {

            sessionStorage.setItem(
                "notesUnlocked",
                "true"
            );

            gate.remove();

            loadNote();

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
        event => {

            if (event.key === "Enter") {

                attemptUnlock();

            }

        }
    );


    input.focus();

}


// ==========================================
// LOAD NOTE
// ==========================================

async function loadNote() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        Number(
            params.get("id")
        );


    console.log(
        "Loading note ID:",
        id
    );


    try {

        const response =
            await fetch(
                "data/notes.json"
            );


        if (!response.ok) {

            throw new Error(
                "Could not load notes.json"
            );

        }


        const notes =
            await response.json();


        const note =
            notes.find(
                n => Number(n.id) === id
            );


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


        const content =
            document.getElementById(
                "noteContent"
            );


        if (
            typeof marked !==
            "undefined"
        ) {

            content.innerHTML =
                marked.parse(
                    note.content
                );

        } else {

            content.textContent =
                note.content;

        }

    }


    catch (error) {

        console.error(
            "NOTE ERROR:",
            error
        );


        document.getElementById(
            "noteTitle"
        ).textContent =
            "Error";


        document.getElementById(
            "noteMeta"
        ).textContent =
            "";


        document.getElementById(
            "noteContent"
        ).innerHTML =
            `<p>
                Unable to load note.
            </p>`;

    }

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
        event => {

            if (

                window.innerWidth <= 900 &&

                !sidebar.contains(
                    event.target
                ) &&

                !menuToggle.contains(
                    event.target
                )

            ) {

                sidebar.classList.remove(
                    "active"
                );

            }

        }
    );

}

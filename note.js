// ==========================================
// NOTE.JS
// The Study Ledger
// ==========================================

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

async function loadNote() {

    try {

        const response = await fetch("data/notes.json");

        if (!response.ok)
            throw new Error("Failed to load notes.");

        const notes = await response.json();

        const note = notes.find(n => n.id === id);

        if (!note) {

            document.title = "Note not found";

            document.getElementById("noteTitle").textContent =
                "Note not found.";

            document.getElementById("noteMeta").textContent = "";

            document.getElementById("noteContent").innerHTML =
                "<p>This note does not exist.</p>";

            return;

        }

        document.title = note.title;

        document.getElementById("noteTitle").textContent =
            note.title;

        document.getElementById("noteMeta").textContent =
            `${note.date} • Pages ${note.pages}`;

        // Markdown Rendering
        document.getElementById("noteContent").innerHTML =
            marked.parse(note.content);

    }

    catch (error) {

        console.error(error);

        document.getElementById("noteTitle").textContent =
            "Error";

        document.getElementById("noteMeta").textContent = "";

        document.getElementById("noteContent").innerHTML =
            "<p>Unable to load note.</p>";

    }

}

loadNote();

// ==========================================
// Mobile Sidebar
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

    document.addEventListener("click", (e) => {

        if (
            window.innerWidth <= 900 &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {

            sidebar.classList.remove("active");

        }

    });

}

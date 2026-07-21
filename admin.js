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

function openPanel(panelName) {

    // Hide all panels
    panels.forEach(panel => {
        panel.classList.remove("active");
    });

    // Remove active nav button
    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    // Show selected panel
    document.getElementById(panelName).classList.add("active");

    // Highlight sidebar button
    document
        .querySelector(`.nav-btn[data-panel="${panelName}"]`)
        ?.classList.add("active");

    // Update page title
    document.getElementById("pageTitle").textContent =
        titles[panelName] || "Dashboard";

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

// Sidebar buttons
navButtons.forEach(button => {

    button.addEventListener("click", () => {

        openPanel(button.dataset.panel);

    });

});

// Dashboard cards
cards.forEach(card => {

    card.addEventListener("click", () => {

        openPanel(card.dataset.open);

    });

});

// Default page
openPanel("dashboard");
let currentBookJSON = "";

document.getElementById("generateBook").onclick = () => {

    const book = {

        id: Date.now(),

        title: document.getElementById("bookTitle").value,

        author: document.getElementById("bookAuthor").value,

        status: document.getElementById("bookStatus").value,

        started: document.getElementById("bookStarted").value,

        finished: document.getElementById("bookFinished").value,

        cover: document.getElementById("bookCover").value

    };

    currentBookJSON = JSON.stringify(book, null, 4);

    document.getElementById("bookPreview").textContent = currentBookJSON;

};

document.getElementById("copyBook").onclick = () => {

    navigator.clipboard.writeText(currentBookJSON);

    alert("Copied!");

};

document.getElementById("downloadBook").onclick = () => {

    const blob = new Blob([currentBookJSON], {
        type: "application/json"
    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "book.json";

    a.click();

};

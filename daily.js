// ==========================================
// DAILY.JS
// The Study Ledger
// ==========================================

// ---------- Elements ----------

const calendarGrid = document.getElementById("calendarGrid");
const currentMonth = document.getElementById("currentMonth");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

const tooltip = document.getElementById("dayTooltip");

const tipDate = document.getElementById("tipDate");
const tipStatus = document.getElementById("tipStatus");
const tipHours = document.getElementById("tipHours");
const tipPages = document.getElementById("tipPages");
const tipBooks = document.getElementById("tipBooks");
const tipNotes = document.getElementById("tipNotes");

// ---------- Variables ----------

let logs = [];

const today = new Date();

let currentYear = today.getFullYear();
let currentMonthIndex = today.getMonth();

// ---------- Month Names ----------

const MONTHS = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",

    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

];

// ==========================================
// Format Date
// ==========================================

function formatDate(year, month, day) {

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

}

// ==========================================
// Load Logs
// ==========================================

async function loadLogs() {

    try {

        const response = await fetch("data/logs.json");

        logs = await response.json();

        renderCalendar();

    } catch (error) {

        console.error("Unable to load logs.json", error);

        renderCalendar();

    }

}

// ==========================================
// Render Calendar
// ==========================================

function renderCalendar() {

    calendarGrid.innerHTML = "";

    currentMonth.textContent =
        `${MONTHS[currentMonthIndex]} ${currentYear}`;

    const firstDay =
        new Date(currentYear, currentMonthIndex, 1);

    const lastDay =
        new Date(currentYear, currentMonthIndex + 1, 0);

    let startDay = firstDay.getDay();

    // Monday first

    startDay = (startDay + 6) % 7;

    const totalDays = lastDay.getDate();

    // Empty cells

    for (let i = 0; i < startDay; i++) {

        const empty = document.createElement("div");

        empty.className = "empty";

        calendarGrid.appendChild(empty);

    }

    // Days

    for (let day = 1; day <= totalDays; day++) {

        const cell = document.createElement("div");

        cell.className = "day-cell";

        cell.textContent = day;

        const date =
            formatDate(currentYear, currentMonthIndex, day);

        cell.dataset.date = date;

        colorCell(cell, date);

        calendarGrid.appendChild(cell);

    }

}

// ==========================================
// Color Day Cell
// ==========================================

function colorCell(cell, date) {

    const todayString = formatDate(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    if (date > todayString) {

        cell.classList.add("future");
        return;

    }

    const log =
        logs.find(entry => entry.date === date);

    if (!log) {

        cell.classList.add("missing");
        return;

    }

    switch (log.status) {

        case "excellent":

            cell.classList.add("excellent");
            break;

        case "good":

            cell.classList.add("good");
            break;

        case "nostudy":

            cell.classList.add("nostudy");
            break;

        default:

            cell.classList.add("missing");

    }

}

// ==========================================
// Navigation
// ==========================================

prevMonth.addEventListener("click", () => {

    currentMonthIndex--;

    if (currentMonthIndex < 0) {

        currentMonthIndex = 11;
        currentYear--;

    }

    renderCalendar();

});

nextMonth.addEventListener("click", () => {

    currentMonthIndex++;

    if (currentMonthIndex > 11) {

        currentMonthIndex = 0;
        currentYear++;

    }

    renderCalendar();

});

// ==========================================
// Start
// ==========================================

loadLogs();

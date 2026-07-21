// ==========================================
// DAILY.JS
// The Study Ledger
// ==========================================

// Elements

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

// ------------------------------------------

let logs = [];

let today = new Date();

let currentYear = today.getFullYear();
let currentMonthIndex = today.getMonth();

// ==========================================
// Month Names
// ==========================================

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

    // Convert Sunday = 0 to Monday = 0

    startDay = (startDay + 6) % 7;

    const totalDays = lastDay.getDate();

    // Empty cells

    for (let i = 0; i < startDay; i++) {

        const empty = document.createElement("div");

        empty.className = "empty";

        calendarGrid.appendChild(empty);

    }

    // Day cells

    for (let day = 1; day <= totalDays; day++) {

        const cell = document.createElement("div");

        cell.className = "day-cell";

        cell.textContent = day;

        cell.dataset.date =
            formatDate(currentYear, currentMonthIndex, day);

        calendarGrid.appendChild(cell);

    }

}

// ==========================================
// Date Formatter
// ==========================================

function formatDate(year, month, day) {

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

}

// ==========================================
// Navigation
// ==========================================

prevMonth.onclick = () => {

    currentMonthIndex--;

    if (currentMonthIndex < 0) {

        currentMonthIndex = 11;

        currentYear--;

    }

    renderCalendar();

};

nextMonth.onclick = () => {

    currentMonthIndex++;

    if (currentMonthIndex > 11) {

        currentMonthIndex = 0;

        currentYear++;

    }

    renderCalendar();

};

// ==========================================

renderCalendar();

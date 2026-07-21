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
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

// ==========================================
// Format Date
// ==========================================

function formatDate(year, month, day){

    return `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

}

// ==========================================
// Load JSON
// ==========================================

async function loadLogs(){

    try{

        const response = await fetch("data/logs.json");

        logs = await response.json();

    }catch(error){

        console.error(error);

        logs=[];

    }

    renderCalendar();

}

// ==========================================
// Render Calendar
// ==========================================

function renderCalendar(){

    calendarGrid.innerHTML="";

    currentMonth.textContent=`${MONTHS[currentMonthIndex]} ${currentYear}`;

    const firstDay=new Date(currentYear,currentMonthIndex,1);

    const lastDay=new Date(currentYear,currentMonthIndex+1,0);

    let start=(firstDay.getDay()+6)%7;

    // Empty cells

    for(let i=0;i<start;i++){

        const empty=document.createElement("div");

        empty.className="empty";

        calendarGrid.appendChild(empty);

    }

    // Days

    for(let day=1;day<=lastDay.getDate();day++){

        const cell=document.createElement("div");

        cell.className="day-cell";

        cell.textContent=day;

        const date=formatDate(currentYear,currentMonthIndex,day);

        cell.dataset.date=date;

        colorCell(cell,date);

        // Today

        const todayString=formatDate(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        if(date===todayString){

            cell.classList.add("today");

        }

        // Hover

        cell.addEventListener("mouseenter",e=>{

            showTooltip(e,date);

        });

        cell.addEventListener("mousemove",moveTooltip);

        cell.addEventListener("mouseleave",hideTooltip);

        // Mobile

        cell.addEventListener("click",e=>{

            e.stopPropagation();

            showTooltip(e,date);

        });

        calendarGrid.appendChild(cell);

    }

}

// ==========================================
// Color Cell
// ==========================================

function colorCell(cell,date){

    const todayString=formatDate(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    if(date>todayString){

        cell.classList.add("future");

        return;

    }

    const log=logs.find(l=>l.date===date);

    if(!log){

        cell.classList.add("missing");

        return;

    }

    switch(log.status){

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
// Tooltip
// ==========================================

function showTooltip(event,date){

    const log=logs.find(l=>l.date===date);

    tipBooks.innerHTML="";

    if(!log){

        tipDate.textContent=date;
        tipStatus.textContent="No log submitted";
        tipHours.textContent="";
        tipPages.textContent="";
        tipNotes.textContent="";

    }else{

        tipDate.textContent=date;

        tipStatus.textContent=
            "Status: "+capitalize(log.status);

        tipHours.textContent=
            "Hours: "+log.hours;

        tipPages.textContent=
            "Pages: "+log.pages;

        if(log.books.length){

            tipBooks.innerHTML=
                "<strong>Books</strong><br>"+log.books.join("<br>");

        }

        tipNotes.textContent=
            "Notes: "+log.notes;

    }

    tooltip.classList.remove("hidden");

    moveTooltip(event);

}

function moveTooltip(event){

    let x=event.clientX+18;
    let y=event.clientY+18;

    if(x+tooltip.offsetWidth>window.innerWidth){

        x=window.innerWidth-tooltip.offsetWidth-12;

    }

    if(y+tooltip.offsetHeight>window.innerHeight){

        y=window.innerHeight-tooltip.offsetHeight-12;

    }

    tooltip.style.left=x+"px";
    tooltip.style.top=y+"px";

}

function hideTooltip(){

    tooltip.classList.add("hidden");

}

document.addEventListener("click",hideTooltip);

// ==========================================
// Helpers
// ==========================================

function capitalize(text){

    return text.charAt(0).toUpperCase()+text.slice(1);

}

// ==========================================
// Navigation
// ==========================================

prevMonth.addEventListener("click",()=>{

    currentMonthIndex--;

    if(currentMonthIndex<0){

        currentMonthIndex=11;
        currentYear--;

    }

    renderCalendar();

});

nextMonth.addEventListener("click",()=>{

    currentMonthIndex++;

    if(currentMonthIndex>11){

        currentMonthIndex=0;
        currentYear++;

    }

    renderCalendar();

});

// ==========================================
// Start
// ==========================================

loadLogs();

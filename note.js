const params = new URLSearchParams(window.location.search);

const id = Number(params.get("id"));

async function loadNote(){

    const response = await fetch("data/notes.json");

    const notes = await response.json();

    const note = notes.find(n => n.id === id);

    if(!note){

        document.getElementById("noteTitle").textContent="Note not found.";

        return;

    }

    document.title = note.title;

    document.getElementById("noteTitle").textContent = note.title;

    document.getElementById("noteMeta").textContent =
        `${note.date} • Pages ${note.pages}`;

    document.getElementById("noteContent").innerHTML =
        note.content
        .replace(/\n/g,"<br>");

}

loadNote();

const menuToggle=document.getElementById("menuToggle");

const sidebar=document.querySelector(".sidebar");

if(menuToggle && sidebar){

menuToggle.addEventListener("click",()=>{

sidebar.classList.toggle("active");

});

document.addEventListener("click",(e)=>{

if(window.innerWidth<=900 &&
!sidebar.contains(e.target) &&
!menuToggle.contains(e.target))

sidebar.classList.remove("active");

});

}

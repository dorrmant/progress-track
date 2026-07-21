const visuals = [

{

title:"Spatial Extension",

description:"Interactive visualization of spatial extension, hadd, jihah, contraction and expansion.",

thumbnail:"assets/visuals/spatial.png",

page:"visuals/spatial_extension.html"

}

];

const grid=document.getElementById("visualGrid");

visuals.forEach(v=>{

grid.innerHTML+=`

<div class="book-card">

<img src="${v.thumbnail}" class="visual-thumb">

<h2>${v.title}</h2>

<p>${v.description}</p>

<a href="${v.page}">
Open →
</a>

</div>

`;

});

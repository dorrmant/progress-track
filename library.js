async function loadLibrary() {

    const books = await (await fetch("data/books.json")).json();
    const notes = await (await fetch("data/notes.json")).json();

    const grid = document.getElementById("libraryGrid");

    grid.innerHTML = "";

    books.forEach(book => {

        const percent = Math.round(
            (book.currentPage / book.pages) * 100
        );

        const note = notes.find(n => n.book === book.id);

        const card = document.createElement("div");

        card.className = "book-card";

        card.innerHTML = `

        <div class="book-cover">
            📘
        </div>

        <span class="badge ${book.status}">
            ${
                book.status === "completed"
                    ? "✓ Completed"
                    : book.status === "reading"
                    ? "📖 Reading"
                    : "📚 Planned"
            }
        </span>

        <h2>${book.title}</h2>

        <p>${book.author}</p>

        <div class="progress">
            <div class="progress-fill"
                 style="width:${percent}%">
            </div>
        </div>

        <small>
            ${book.currentPage} /
            ${book.pages}
            pages
            (${percent}%)
        </small>

        <br><br>

        ${
            book.status === "completed"
                ? (
                    note
                        ? `<button onclick="location.href='note.html?id=${note.id}'">
                                📝 View Notes
                           </button>`
                        : `<button class="disabled-btn" disabled>
                                No Notes
                           </button>`
                  )
                : book.status === "reading"
                ? `<button disabled>
                        📖 Continue Reading
                   </button>`
                : `<button disabled>
                        📚 Start Reading
                   </button>`
        }

        `;

        grid.appendChild(card);

    });

}

loadLibrary();

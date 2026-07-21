async function loadLibrary(){

    const response = await fetch("data/books.json");

    const books = await response.json();

    const grid = document.getElementById("libraryGrid");

    grid.innerHTML = "";

    books.forEach(book => {

        const percent = Math.round(
            book.currentPage / book.pages * 100
        );

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

        <h2>

            ${book.title}

        </h2>

        <p>

            ${book.author}

        </p>

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

        <button onclick="location.href='book.html?id=${book.id}'">

            ${
                book.status === "completed"
                ? "View Notes"
                : book.status === "reading"
                ? "Continue Reading"
                : "Start Reading"
            }

        </button>

        `;

        grid.appendChild(card);

    });

}

loadLibrary();

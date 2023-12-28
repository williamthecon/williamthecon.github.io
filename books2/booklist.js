function addPage() {
    // TODO: Implement pagination logic here (will be called when user scrolls to the bottom of the results)
}

async function setResults(query) {
    const page = 0;
    const response = await request("/books/book/list", "GET", true, { query, page });
    if (response.success) {
        if (response.data.results.length == 0) {
            const message = document.getElementById("content-block--content--message");
            message.style.display = "block";
            message.innerHTML = "Es wurden keine Ergebnisse gefunden. Versuchen Sie es erneut.";
        } else {
            const results = document.getElementById("content-block--content--results");
            results.innerHTML = "";
            response.data.results.forEach(book => {
                const result = document.createElement("div");
                result.id = "book-" + book.id;
                result.classList.add("result");
                const userID = getLST("user-id");
                if (userID in book.readers || userID in book.owners || userID in book.wishers)
                result.innerHTML = `
                    <div class="result--top">
                        <div class="result--top--header">
                            <h4><a href="./book.html?id=${book.id}">${book.title}</a></h4>
                            <h5><a href="./author.html?author=${book.author.id}">${book.author.name}</a></h5>
                        </div>
                        <div class="result--top--attributes>
                            <span class="material-symbols-outlined` + (userID in book.readers ? " material-symbols-outlined-filled" : "") + `">bookmark</span>
                            <span class="material-symbols-outlined` + (userID in book.favourites ? " material-symbols-outlined-filled" : "") + `">favorite</span>
                            <span class="material-symbols-outlined` + (userID in book.owners ? " material-symbols-outlined-filled" : "") + `">folder</span>
                            <span class="material-symbols-outlined` + (userID in book.wishers ? " material-symbols-outlined-filled" : "") + `">star</span>
                        </div>
                    </div>
                    <div class="result--body"></div>
                    <div class="result--footer">
                        <div class="result--footer--rating">
                            <span class="material-symbols-outlined">star</span>
                            <span>${book.rating}</span>
                        </div>
                        <div class="result--footer--user">
                            <span class="material-symbols-outlined">person</span>
                            <span>${book.readers.length}</span>
                        </div>
                    </div>
                `;
                results.appendChild(result);
            })
        }

    } else {
        const message = document.getElementById("content-block--content--message");
        message.classList.add("error");
        message.style.display = "block";
        message.innerHTML = "Ein unerwarteter Fehler ist beim Laden der Daten aufgetreten: '" + response.cause + "'";
    }
}

function init() {
    // Initial page setup
    if (getParam("query")) {
        // Get param
        const query = getParam("query");

        // Set input value
        document.getElementById("content-block--content--form--search--input").value = query;

        // Set results
        setResults(query);
    }
}

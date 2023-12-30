function addPage() {
    // TODO: Implement pagination logic here (will be called when user scrolls to the bottom of the results)
}

async function setResults(query="") {
    const page = 0;
    const response = await request("/books/book/list", "GET", true, { query, page, visualize: true });
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
                result.innerHTML = `
                    <div class="result--top">
                    <div class="result--top--attributes">
                        <span class="result--top--attributes--attribute material-symbols-outlined` + (book.readers.includes(userID) ? "" : " material-symbols-outlined-unfilled") + `">bookmark</span>
                        <span class="result--top--attributes--attribute material-symbols-outlined` + (book.favourites.includes(userID) ? "" : " material-symbols-outlined-unfilled") + `">favorite</span>
                        <span class="result--top--attributes--attribute material-symbols-outlined` + (book.owners.includes(userID) ? "" : " material-symbols-outlined-unfilled") + `">folder</span>
                        <span class="result--top--attributes--attribute material-symbols-outlined` + (Object.keys(book.wishers).includes(userID) ? "" : " material-symbols-outlined-unfilled") + `">star</span>
                    </div>
                        <div class="result--top--header">
                            <h4 class="result--top--header--title"><a href="./book?id=${book.id}">${book.title}</a></h4>
                            <h5 class="result--top--header--authors">` + book.authors.map(author => `<a href="./author?author=${author.id}">${author.name}</a>`).join(', ') + `</h5>
                        </div>
                    </div>
                    <div class="result--body"></div>
                    <div class="result--bottom">
                        <div class="result--bottom--attribute result--bottom--rating">
                            <span class="material-symbols-outlined">star</span>
                            <span>${book.ratings.length /* Only temporary */}</span>
                        </div>
                        <div class="result--bottom--attribute result--bottom--user">
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

        // Set header title
        document.getElementById("content-block--content--header--title").innerHTML = query;

        // Set search parameters
        document.getElementById("search-popup--form--query--input").value = query;
        // TODO: Add more search parameters

        // Set results
        setResults(query);
    } else {
        // Set results
        setResults();
    }
}

function toggleSearch() {
    if (document.getElementById("search-popup").style.display == "flex") {
        document.body.style.overflow = "auto";
        document.getElementById("overlay").style.display = "none";
        // document.getElementById("content-block--content").style.display = "block";
        document.getElementById("search-popup").style.display = "none";
    } else {
        document.body.style.overflow = "hidden";
        document.getElementById("overlay").style.display = "flex";
        // document.getElementById("content-block--content").style.display = "none";
        document.getElementById("search-popup").style.display = "flex";
    }
}

function sendToSearch(event) {
    event.preventDefault();

    const query = document.getElementById("content-block--content--form--search--input").value;

    redirect("./booklist?query=" + query);
}

function sendToNextPage() {
    const query = document.getElementById("content-block--content--form--search--input").value;
    const page = getParam("page");
    console.log(page);
    if (!page) {
        console.log("redirecting");
        redirect("./booklist?query=" + query + "&page=2");
        return;
    }
    redirect("./booklist?query=" + query + "&page=" + (parseInt(page) + 1));
}

function sendToPreviousPage() {
    const query = document.getElementById("content-block--content--form--search--input").value;
    const page = getParam("page");
    if (!page || page == 1) {
        redirect("./booklist?query=" + query);
    }
    redirect("./booklist?query=" + query + "&page=" + parseInt(page) - 1);
}

function prepareBookDescription(description) {
    if (description.length > 100) {
        return description.substring(0, 100) + "...";
    } else {
        return description;
    }
}

async function setResults(query, page=0) {
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
                result.innerHTML = `
                    <div class="result--header">
                        <h4><a href="./book.html?id=${book.id}">${book.title}</a></h4>
                        <h5><a href="./author.html?author=${book.author.id}">${book.author.name}</a></h5>
                    </div>
                    <div class="result--image">
                        <img src="${book.image} width="100" height="180">
                    </div>
                    <div class="result--description">
                        ${prepareBookDescription(book.description)}
                    </div>
                    <div class="result--footer">
                        <div class="result--footer--rating">
                            <span class="material-symbols-outlined">star</span>
                            <span>${book.rating}</span>
                        </div>
                        <div class="result--footer--user">
                            <span class="material-symbols-outlined">person</span>
                            <span>${book.readers.length}</span>
                        </div>
                        <div class="result--footer--date">
                            <span class="material-symbols-outlined">event</span>
                            <span>${book.date}</span>
                        </div>
                        <div class="result--footer--price">
                            <span class="material-symbols-outlined">monetization_on</span>
                            <span>${book.price}</span>
                        </div>
                        <div class="result--footer--pages">
                            <span class="material-symbols-outlined">pageview</span>
                            <span>${book.pages}</span>
                        </div>
                        <div class="result--footer--language">
                            <span class="material-symbols-outlined">language</span>
                            <span>${book.language}</span>
                        </div>
                    </div>
                `;
                results.appendChild(result);
            })
        }

    } else {
        const error = document.getElementById("content-block--content--error");
        error.style.display = "block";
        error.innerHTML = "Ein unerwarteter Fehler ist beim Laden der Daten aufgetreten: '" + response.cause + "'";
    }
}

// Initial page setup
if (getParam("query")) {
    // Get params
    const query = getParam("query");

    // Set input value
    document.getElementById("content-block--content--form--search--input").value = query;

    // Set results
    const page = getParam("page");
    if (page) {
        setResults(query, page - 1);
    } else {
        setResults(query);
    }
}
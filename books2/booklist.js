async function search(event) {
    event.preventDefault();

    const query = document.getElementById("content-block--content--form--search--input").value;

    redirect("./booklist?query=" + query);
}

function nextPage() {
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

function previousPage() {
    const query = document.getElementById("content-block--content--form--search--input").value;
    const page = getParam("page");
    if (!page || page == 1) {
        redirect("./booklist?query=" + query);
    }
    redirect("./booklist?query=" + query + "&page=" + parseInt(page) - 1);
}
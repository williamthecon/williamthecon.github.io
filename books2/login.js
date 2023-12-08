async function login(event) {
    event.preventDefault();

    const username = document.getElementById("content-block--content--form--username--input").value;
    const password = document.getElementById("content-block--content--form--password--input").value;

    const response = await request("/books/login", "POST", {}, { username, password }, true);
    if (response.success) {
        TODO: setLST("token", response.data["token"]);
        window.location.href = getLST("redirect-to");
    } else {
        const error = document.getElementById("content-block--content--form--error");
        error.style.display = "block";
        if (response.cause === "invalid username/password") {
            error.innerHTML = "Benutzername oder Passwort ungültig";
        } else {
            error.innerHTML = "Anmeldung fehlgeschlagen: '" + response.cause + "'";
        }
    }

    return false;
}
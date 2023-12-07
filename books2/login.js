async function login(event) {
    event.preventDefault();

    const username = document.getElementById("content-block--content--form--username--input").value;
    const password = document.getElementById("content-block--content--form--password--input").value;

    request("/books/login", "POST", {}, { username, password }, true)
    .then(data => {
        if (data.success) {
            window.location.href = getLST("redirect-to");
        } else {
            const error = document.getElementById("content-block--content--form--error");
            error.style.display = "block";
            if (data.cause === "invalid username/password") {
                error.innerHTML = "Benutzername oder Passwort ungültig";
            } else {
                error.innerHTML = "Anmeldung fehlgeschlagen: '" + data.cause + "'";
            }
        }
    })

    return false;
}
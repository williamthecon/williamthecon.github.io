setLST("last-request", Math.round(Date.now() / 1000 - 2.5));

async function login(event) {
    event.preventDefault();

    const now = Math.round(Date.now() / 1000);
    if (parseInt(getLST("last-request")) + 2.5 > now) {
        const error = document.getElementById("content-block--content--form--error");
        error.style.display = "block";
        error.innerHTML = "Bitte warten Sie noch einen Moment!";
        return false;
    }
    setLST("last-request", now);

    const username = document.getElementById("content-block--content--form--username--input").value;
    const password = document.getElementById("content-block--content--form--password--input").value;

    const response = await request("/books/login", "POST", false, {}, { username, password });
    if (response.success) {
        setLST("session-id", response.data["session-id"]);
        setLST("user-id", response.data["user-id"]);
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
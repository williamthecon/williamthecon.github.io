const loginForm = document.getElementById("login-form");
const loginFormUsername = document.getElementById("login-form--username");
const loginFormPassword = document.getElementById("login-form--password");

async function doLogin() {
    let username = loginFormUsername.value;
    let password = loginFormPassword.value;

    let response = await fetch("https://mgp-api.j9zwm20di.repl.co/school/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    }).json();

    if (response.success) {
        setLocalStorage("token", response.data.token);
        window.location.href = getLocalStorage("redirect-to");
    } else {
        if (response.message === undefined) {
            document.getElementById("login-form--error").innerHTML = response.cause;
        } else {
            document.getElementById("login-form--error").innerHTML = response.cause + ": " + response.message;
        }
    }
}

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    doLogin();
})
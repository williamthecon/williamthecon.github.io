// Check if already logged in or page is already the login page
var username = localStorage.getItem('username');
if (username === null && window.location.href !== "https://williamthecon.github.io/books/login") {
    window.location.href = "https://williamthecon.github.io/books/login";
}

const urlParams = new URLSearchParams(window.location.search);

function get(name) {
    // Return the parameter value or the default value "" if it does not exist.
    return urlParams.get(name) || "";
}

function getLocalStorage(key) {
    return localStorage.getItem(key) || "";
}

function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function deleteLocalStorage(key) {
    localStorage.removeItem(key);
}

function logIn(username, password) {
    setLocalStorage('username', username);
}

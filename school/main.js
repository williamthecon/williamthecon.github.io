// Check if already logged in or page is already the login page
const username = localStorage.getItem("user");

if (username === null) {
    if (!window.location.href.startsWith("https://williamthecon.github.io/school/login")) {
        localStorage.setItem('redirect-to', window.location.href);
        window.location.href = "https://williamthecon.github.io/school/login";
    } else if ([null, "", undefined].includes(localStorage.getItem('redirect-to'))) {
        localStorage.setItem('redirect-to', "https://williamthecon.github.io/school/");
    }
}

const urlParams = new URLSearchParams(window.location.search);

// Some default methods for retrieving data
function get(name) {
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

function popLocalStorage(key) {
    const value = localStorage.getItem(key);
    localStorage.removeItem(key);
    return value;
}

// Some simple methods for moving between pages
function redirect(url) {
    window.location.href = url;
}

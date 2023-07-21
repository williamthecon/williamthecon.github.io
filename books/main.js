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

function toggleFold() {
    var div = document.getElementById("helpful-links");
    var chevron_down = document.getElementById("chevron-down")
    var chevron_up = document.getElementById("chevron-up")
    if (div.style.display === "none") {
        div.style.display = "block";
        chevron_down.style.display = "none";
        chevron_up.style.display = "inline-block";
        localStorage.setItem('helpfulLinksFolded', "false");
    } else {
        div.style.display = "none";
        chevron_down.style.display = "inline-block";
        chevron_up.style.display = "none";
        localStorage.setItem('helpfulLinksFolded', "true");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const helpfulLinksFolded = localStorage.getItem('helpfulLinksFolded');
    if (helpfulLinksFolded !== null) {
        if (helpfulLinksFolded === "true") {
            toggleFold();
        }
    } else {
        localStorage.setItem('helpfulLinksFolded', "false");
    }
});

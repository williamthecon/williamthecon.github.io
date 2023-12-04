// Initial check and setup
if (!window.location.href.startsWith("file:///")) {
    // Check if already logged in or page is already the login page
    const token = localStorage.getItem("token");

    if (token === null) {
        if (!window.location.href.endsWith("/school/login")) {
            localStorage.setItem('redirect-to', window.location.href);
            window.location.href = "/school/login";
        } else if ([null, "", undefined].includes(localStorage.getItem('redirect-to'))) {
            localStorage.setItem('redirect-to', "/school/");
        }
    } else {
        if (window.location.href.endsWith("/school/login")) {
            if ([null, "", undefined].includes(localStorage.getItem('redirect-to'))) {
                window.location.href = "/school/";
            } else {
                let redirectTo = localStorage.getItem('redirect-to');
                localStorage.removeItem('redirect-to');
                window.location.href = redirectTo;
            }
        }
    }
}

const urlParams = new URLSearchParams(window.location.search);

// Navbar (sidebar) toggler
function toggleNavbar() {
    document.getElementById("header-block--nav-bar").classList.toggle("sidebar-active");
}

// Some default methods for retrieving data
function getParam(name) {
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
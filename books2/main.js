// Initial methods
const urlParams = new URLSearchParams(window.location.search);

// Navbar (sidebar) toggler
function toggleNavbar() {
    document.getElementById("header-block--nav-bar").classList.toggle("sidebar-active");
}

document.addEventListener('click', function(e) { // Closes the sidebar when clicking outside
    const navbar = document.getElementById('header-block--nav-bar');
    if (navbar !== null) {
        if (navbar.classList.contains('sidebar-active')) {
            const activator = document.getElementById('header-block--nav-bar--activator');
            if (e.target !== navbar && e.target !== activator) {
                toggleNavbar();
            }
        }
    }
});


// Some default methods for retrieving data
function getParam(name) {
    return urlParams.get("books2--" + name) || "";
}

function getLST(key) {
    return localStorage.getItem("books2--" + key) || "";
}

function setLST(key, value) {
    localStorage.setItem("books2--" + key, value);
}

function delLST(key) {
    localStorage.removeItem("books2--" + key);
}

function popLST(key) {
    const value = localStorage.getItem("books2--" + key);
    localStorage.removeItem("books2--" + key);
    return value;
}

// Some simple methods for moving between pages
function redirect(url) {
    window.location.href = url;
}

// Initial check and setup
if (window.location.protocol === "https:") {
    if (window.location.href.endsWith(".html")) {
        redirect(window.location.href.substring(0, window.location.href.length - 5));
    }

    // Check if already logged in or page is already the login page
    const token = getLST("token");

    if (token === null) { // Not logged in
        if (!window.location.href.endsWith("/login")) { // Not on login page -> redirect to login
            setLST('redirect-to', window.location.href);
            redirect("./login");
        } else if ([null, "", undefined].includes(localStorage.getItem('redirect-to'))) { // On login page but no redirect set -> set redirect to home
            setLST('redirect-to', "./");
        }
    } else { // Already logged in
        if (window.location.href.endsWith("/login")) { // On login page although being logged in
            redirect("./");
        }
    }
}

// Fetch data
async function request(url, method, body=null, returnJSON=true) {
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: body
    });
    if (returnJSON) {
        return response.json();
    } else {
        return response;
    }
}
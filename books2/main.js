// Initial check and setup
if (!window.location.href.startsWith("file:///")) {
    // Check if already logged in or page is already the login page
    const token = localStorage.getItem("token");

    if (token === null) {
        if (!window.location.href.endsWith("./login")) {
            localStorage.setItem('redirect-to', window.location.href);
            window.location.href = "./login";
        } else if ([null, "", undefined].includes(localStorage.getItem('redirect-to'))) {
            localStorage.setItem('redirect-to', "./");
        }
    } else {
        if (window.location.href.endsWith("./login")) {
            if ([null, "", undefined].includes(localStorage.getItem('redirect-to'))) {
                window.location.href = "./";
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

document.addEventListener('click', function(e) {
    const navbar = document.getElementById('header-block--nav-bar');
    if (navbar.classList.contains('sidebar-active')) {
        const activator = document.getElementById('header-block--nav-bar--activator');
        if (e.target !== navbar && e.target !== activator) {
            toggleNavbar();
        }
    }
});


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
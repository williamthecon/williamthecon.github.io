// Initial methods
const urlParams = new URLSearchParams(window.location.search);

// Some default methods for retrieving data
function getParam(name) {
    return urlParams.get(name) || "";
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

// Fetch data
async function request(endpoint, method, authorized=false, args={}, body=null, headers={}) {
    // Check appropriate method and body
    if (method.toLowerCase() !== "get" && body === null) {
        body = {};
    }

    // Add session ID if required
    if (authorized) {
        if (method.toLowerCase() === "get") {
            if (!args.hasOwnProperty("session-id")) {
                args["session-id"] = getLST("session-id");
            }
        } else {
            if (!body.hasOwnProperty("session-id")) {
                body["session-id"] = getLST("session-id");
            }
        }
    }

    // Prepare URL
    var url = "https://mgp-api--j9zwm20di.repl.co" + endpoint
    if (Object.keys(args).length > 0) {
        url += "?";
        for (const [key, value] of Object.entries(args)) {
            url += key + "=" + value + "&";
        }
        url = url.substring(0, url.length - 1);
    }

    // Prepare headers
    const _headers = {
        "Content-Type": "application/json; charset=utf-8"
    }
    if (Object.keys(headers).length > 0) {
        for (const [key, value] of Object.entries(headers)) {
            _headers[key] = value;
        }
    }

    if (body !== null) {
        body = JSON.stringify(body);
    }

    // Fetch data
    const response = await fetch(url, {
        method: method,
        headers: _headers,
        body: body,
    });

    // Return JSON
    return response.json();
}

// Initial check and setup
if (window.location.protocol === "https:") {
    if (window.location.href.endsWith(".html")) {
        redirect(window.location.href.substring(0, window.location.href.length - 5));
    }

    // Check if already logged in or page is already the login page
    const sessionID = getLST("session-id");

    if ([null, "", undefined].includes(sessionID)) {
        // Not logged in
        if (!window.location.href.endsWith("/login")) {
            // Not on login page -> redirect to login
            setLST("redirect-to", window.location.href);
            redirect("./login");
        } else if ([null, "", undefined].includes(getLST("redirect-to"))) {
            // On login page but no redirect set -> set redirect to home
            setLST("redirect-to", "./");
        }
    } else {
        // Session Token is set -> needs to be verified
        request("/books/validate", "get", true)
        .then((responseJSON) => {
            if (!responseJSON.success) {
                delLST("session-id");
                alert("Fehler: Sitzung ist nicht (mehr) gültig. Bitte melde dich (erneut) an.");
                setLST("redirect-to", window.location.href);
                redirect("./login");
            } else if (window.location.href.endsWith("/login")) {
                // On login page although being logged in -> redirect to home
                redirect("./");
            }
        });
    }
}

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

// Theme toggler
function setTheme(theme) {
    if (theme === "light") {
        document.body.classList.add('light-theme');
        document.getElementById("footer-block--theme-switcher--light").classList.add("theme-switcher--active");
        document.getElementById("footer-block--theme-switcher--dark").classList.remove("theme-switcher--active");
    } else if (theme === "dark") {
        document.body.classList.remove('light-theme');
        document.getElementById("footer-block--theme-switcher--light").classList.remove("theme-switcher--active");
        document.getElementById("footer-block--theme-switcher--dark").classList.add("theme-switcher--active");
    }
}
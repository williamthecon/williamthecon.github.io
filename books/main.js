// Check if already logged in or page is already the login page
const username = localStorage.getItem('username');
if (username === null && window.location.href !== "https://williamthecon.github.io/books/login") {
    window.location.href = "https://williamthecon.github.io/books/login";
}

const urlParams = new URLSearchParams(window.location.search);

// Some default methods for retrieving data
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

function loadJSON(url) {
    return fetch(url).then(response => response.json());
}

function saveJSON(data, url) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());
}

// User related methods
const crypto = require('crypto');

function hash_password(password) {
    const hash = crypto.createHash('sha3-256');
    hash.update(password);
    return hash.digest('hex');
}

function login(username, password) {
    const users = loadJSON("https://williamthecon.github.io/books/data/users.json");
    const user = users.find(user => user.name === username);
    if (user) {
        if (hash_password(password) === user.password) {
            setLocalStorage('username', username);
            return true;
        }
    }
    return false;
}

function logout() {
    deleteLocalStorage('username');
}

function changePassword(currentPassword, newPassword1, newPassword2) {
    const users = loadJSON("https://williamthecon.github.io/books/data/users.json");
    const user = users.find(user => user.name === username);
    if (user) {
        if (hash_password(currentPassword) === user.password) {
            if (newPassword1 === newPassword2) {
                user.password = hash_password(newPassword1);
                return true;
            }
        }
    }
    return false;
}

function changeUsername(currentUsername, newUsername) {
    const users = loadJSON("https://williamthecon.github.io/books/data/users.json");
    const user = users.find(user => user.name === currentUsername);
    if (user) {
        user.name = newUsername;
        return true;
    }
    return false;
}

const random = require('random');
const string = require('string');

function generate_token(length = 13) {
    let tokens = Array.from(getLocalStorage('tokens'));
    let token = '';

    const characters = string.ascii_letters + string.digits;

    do {
        token = '';
        for (let i = 0; i < length; i++) {
            token += characters.charAt(random.int(0, characters.length - 1));
        }
    } while (tokens.includes(token));

    tokens.push(token);
    return token;
}

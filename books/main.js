// Check if already logged in or page is already the login page
const username = localStorage.getItem("user");

if (username === null) {
    if (!window.location.href.startsWith("https://williamthecon.github.io/books/login")) {
        localStorage.setItem('redirect-to', window.location.href);
        window.location.href = "https://williamthecon.github.io/books/login";
    } else if ([null, "", undefined].includes(localStorage.getItem('redirect-to'))) {
        localStorage.setItem('redirect-to', "https://williamthecon.github.io/books/");
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

function loadData(type, define) {
    fetch("https://my-book-api.wtc248.repl.co/load/" + type)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                define(data.data);
                console.log("Success loading " + type);
            } else {
                define([]);
                console.log("No success loading " + type);
            };
        })
        .catch(error => {
            define([]);
            console.log(error);
        });
}

function saveData(data, type, define = (_) => {}) {
    fetch('https://my-book-api.wtc248.repl.co/save/' + type, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({"data": data}),
    }).then(response => response.json())
        .then(data => {
            define(data);
            if (data.success) {
                console.log("Success saving " + type);
            } else {
                console.log("No success saving " + type);
            };
        })
        .catch(error => console.log(error));
}

function addItem(item, type, define = (_) => {}) {
    fetch('https://my-book-api.wtc248.repl.co/add/' + type, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({"item": item}),
    }).then(response => response.json())
        .then(data => {
            define(data);
            if (data.success) {
                console.log("Success adding " + type);
            } else {
                console.log("No success adding " + type);
            };
        })
        .catch(error => console.log(error));
}

function editItem(item, newItem, type, define = (_) => {}) {
    fetch('https://my-book-api.wtc248.repl.co/edit/' + type, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({"item": item, "new-item": newItem}),
    }).then(response => response.json())
        .then(data => {
            define(data);
            if (data.success) {
                console.log("Success editing " + type);
            } else {
                console.log("No success editing " + type);
            };
        })
        .catch(error => console.log(error));
}

function delItem(item, type, define = (_) => {}) {
    fetch('https://my-book-api.wtc248.repl.co/del/' + type, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({"item": item}),
    }).then(response => response.json())
        .then(data => {
            define(data);
            if (data.success) {
                console.log("Success deleting " + type);
            } else {
                console.log("No success deleting " + type);
            };
        })
        .catch(error => console.log(error));
}

// User related methods
// `hash_password` requires to import CryptoJS inside of the HTML:
//   -> '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>'
function hash_password(password) {
    const hash = CryptoJS.SHA3(password, { outputLength: 256 });
    return hash.toString(CryptoJS.enc.Hex);
}

function login(username, password) {
    const user = loaded.users.find(user => user.name === username);

    if (user) {
        if (hash_password(password) === user.password) {
            setLocalStorage("user", user.token);
            return true;
        }
        alert("Das Passwort ist falsch!");
    }
    alert("Authentifizierung fehlgeschlagen!");
    return false;
}

function changePassword(currentPassword, newPassword1, newPassword2) {
    const user = loaded.users.find(user => user.token === getLocalStorage("user"));

    if (user) {
        if (hash_password(currentPassword) === user.password) {
            if (newPassword1 === newPassword2) {
                user.password = hash_password(newPassword1);
                saveData(loaded.users, "users");
                alert("Das Passwort wurde erfolgreich geändert!");
                return true;
            }
            alert("Das neue Passwort ist nicht identisch!");
        }
        alert("Das aktuelle Passwort ist falsch!");
    }
    alert("Authentifizierung fehlgeschlagen!");
    return false;
}

function changeUsername(newUsername, password) {
    const user = loaded.users.find(user => user.token === getLocalStorage("user"));

    if (user) {
        if (hash_password(password) === user.password) {
            user.name = newUsername;
            saveData(loaded.users, "users");
            alert("Das Benutzername wurde erfolgreich geändert!");
            return true;
        }
        alert("Das Passwort ist falsch!");
        return true;
    }
    alert("Authentifizierung fehlgeschlagen!");
    return false;
}

function generate_token(length = 13) {
    let token = '';

    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    do {
        token = '';
        for (let i = 0; i < length; i++) {
            token += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    } while (loaded.tokens.includes(token));

    loaded.tokens.push(token);
    saveData(loaded.tokens, "tokens");
    return token;
}

// Books related methods
class Listionary {
    /**
     * Parses a query string and returns an object containing the parsed information.
     *
     * @param {string} query - The query string to be parsed.
     * @return {object} info - An object containing the parsed information.
     *         {array} info.args - An array of lowercase arguments extracted from the query string.
     *         {object} info.kwargs - An object mapping lowercase keys to lowercase values extracted from the query string.
     */
    static parse_query(query) {
        const info = { args: [], kwargs: {} };
        let currentStr = "";
        let inStr = false;

        for (const char of query) {
            if (char === '"') {
                inStr = !inStr;
            } else if (char === " " && !inStr) {
                currentStr = currentStr.toLowerCase();
                if (currentStr.includes(":")) {
                    const [key, value] = currentStr.split(":");
                    info.kwargs[key] = value;

                } else {
                    info.args.push(currentStr);
                }
                currentStr = "";
            } else {
                currentStr += char;
            }
        }
        if (currentStr) {
            currentStr = currentStr.toLowerCase();
            if (currentStr.includes(":")) {
                var [key, value] = currentStr.split(":");
                info.kwargs[key] = value;

            } else {
                info.args.push(currentStr);
            }
        }

        return info;
    }

    /**
     * Searches for specific values in an array of objects based on given criteria.
     *
     * @param {Array} data - The array of objects to search.
     * @param {Object} info - An object containing search criteria.
     *         {array} info.args - An array of lowercase arguments to search for.
     *         {object} info.kwargs - An object mapping lowercase keys to lowercase values to search for.
     * @param {number} [maxResults = -1] - The maximum number of search results to return.
     * @param {boolean} [equals = false] - Search for values that are equal to the given criteria.
     * @param {Array} [ignoreKeys = []] - An array of keys to ignore during the search with arguments without keys.
     * @return {Array} An array of objects that match the search criteria.
     */
    static search(data, info, maxResults = -1, equals = false, ignoreKeys = []) {
        // NOTE: info.args as well as info.kwargs is expected to only contain lowercase strings
        if (maxResults === -1) {
            maxResults = data.length;
        }

        const keys = Object.keys(data[0]);
        const args = info.args;
        const kwargs = info.kwargs;

        const test = (s1, s2) => (equals ? s1 === s2 : s2.includes(s1));
        const doIgnoreKeys = (obj) => Object.fromEntries(Object.entries(obj).filter(([key, _]) => !ignoreKeys.includes(key)));

        const results = [];
        for (let value of data) {
            let lowerValue = Object.fromEntries(Object.entries(value).map(([k, v]) => [k.toLowerCase(), v.toLowerCase()]));
            let approved = true;

            for (const [k, v] of Object.entries(kwargs)) {
                if (!keys.includes(k) || !test(v, lowerValue[k])) {
                    approved = false;
                    break;
                }
            }

            if (approved) {
                lowerValue = Object.entries(doIgnoreKeys(lowerValue));

                for (const arg of args) {
                    if (!lowerValue.some(([_, v]) => test(arg.toLowerCase(), v))) {
                        approved = false;
                        break;
                    }
                }

                if (approved) {
                    results.push(value);

                    if (results.length === maxResults) {
                        break;
                    }
                }
            }
        }

        return results
    }

    static searchQuery(data, query, maxResults = -1, equals = false, ignoreKeys = []) {
        return this.search(data, this.parse_query(query), maxResults, equals, ignoreKeys);
    }

    static find(data, info, equals = false, ignoreKeys = []) {
        const args = info.args;
        const kwargs = info.kwargs;

        const test = (s1, s2) => (equals ? s1 === s2 : s2.includes(s1));
        const doIgnoreKeys = (obj) => Object.fromEntries(Object.entries(obj).filter(([key, _]) => !ignoreKeys.includes(key)));

        for (let value of data) {
            let lowerValue = Object.fromEntries(Object.entries(value).map(([k, v]) => [k.toLowerCase(), v.toLowerCase()]));
            let approved = true;

            for (const [k, v] of Object.entries(kwargs)) {
                if (!test(v, lowerValue[k])) {
                    approved = false;
                    break;
                }
            }

            if (approved) {
                lowerValue = Object.entries(doIgnoreKeys(lowerValue));

                for (const arg of args) {
                    if (!lowerValue.some(([_, v]) => test(arg.toLowerCase(), v))) {
                        approved = false;
                        break;
                    }
                }

                if (approved) {
                    return value;
                }
            }
        }

        return null;
    }
}

function parseQuery(query) {
    const info = {
        "args": [],
        "kwargs": {}
    };
    let currentStr = "";
    let inStr = false;
    const handleStr = (str) => {
        if (currentStr.includes(":")) {
            const [key, value] = str.split(":");
            info.kwargs[key] = value;
        } else {
            info.args.push(str);
        }
    }

    for (const char of query) {
        if (char === '"') {
            inStr = !inStr;
        } else if (char === " " && !inStr) {
            handleStr(currentStr);
            currentStr = "";
        } else {
            currentStr += char;
        }
    }

    if (currentStr) {
        handleStr(currentStr);
    }

    return info;
}

function searchQueryListionary(listionary, query, maxResults = -1, equals = false, keysToIgnore = []) {
    return searchListionary(listionary, parseQuery(query), maxResults, equals, keysToIgnore);
}

function searchListionary(listionary, info, maxResults = -1, equals = false, keysToIgnore = []) {
    if (maxResults === -1) {
        maxResults = listionary.length;
    }

    const keys = Object.keys(listionary[0]);
    const test = (s1, s2) => (equals ? s1 === s2 : s2.includes(s1));
    const ignoreKeys = (obj) => Object.keys(obj).filter((key) => !keysToIgnore.includes(key)).map((key) => obj[key]);

    let resultsCount = 0;
    return listionary.filter(item => {
        if (resultsCount >= maxResults) {
            return false;
        }

        let approved = true;
        Object.entries(info.kwargs).forEach(([k, v]) => {
            k = k.toLowerCase();
            if (!keys.includes(k) || !test(v.toLowerCase(), item[k].toLowerCase())) {
                approved = false;
                return;
            }
        });

        if (!approved) {
            return false;
        }

        const itemValues = ignoreKeys(item);

        info.args.forEach(arg => {
            arg = arg.toLowerCase();
            if (!itemValues.some(v => test(arg, v.toLowerCase()))) {
                approved = false;
                return;
            }
        });

        if (!approved) {
            return false;
        }

        resultsCount++;
        return true;
    });
}

// Books functions
function searchBooks(query) {
    return searchQueryListionary(loaded.convertedBooks, query, -1, false, ["isbn", "id", "beschreibung", "bild-link", "umschlag"]).map(book => ({
        "title": book.titel,
        "series": book.reihe,
        "volume": book.band,
        "author": book.autor,
        "cover": book.umschlag,
        "isbn": book.isbn,
        "description": book.beschreibung,
        "image": book["bild-link"],
        "token": book.id,
        "username": book.benutzer
    }));
}

function findBookById(token) {
    return loaded.books.find(book => book.token === token);
}

async function asyncFindBookById(token) {
    while (!loaded.hasOwnProperty('books')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    return loaded.books.find(book => book.token === token);
}

function addBook(title, series, volume, author, cover, isbn, description, image) {
    addItem({
        "titel": title,
        "series": series,
        "volume": volume,
        "author": author,
        "cover": cover,
        "isbn": isbn,
        "description": description,
        "image": image,
        "user": getLocalStorage("user"),
        "token": generate_token()
    }, "books");
}

async function asyncAddBook(title, series, volume, author, cover, isbn, description, image) {
    let data = null;
    addItem({
        "title": title,
        "series": series,
        "volume": volume,
        "author": author,
        "cover": cover,
        "isbn": isbn,
        "description": description,
        "image": image,
        "user": getLocalStorage("user"),
        "token": generate_token()
    }, "books", (d) => { data = d; });

    while (data === null) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }
    return data;
}

function editBook(book, newBook) {
    editItem(book, newBook, "books");
}

async function asyncEditBook(book, newBook) {
    let data = null;
    editItem(book, newBook, "books", (d) => { data = d; });

    while (data === null) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }
    return data;
}

function findBooksByUser(user) {
    return loaded.books.filter(book => book.user === user);
}

function findSeriesByUser(user) {
    return [...new Set(loaded.books.filter(book => book.user === user).map(book => book.series))];
}

function findAuthorsByUser(user) {
    return [...new Set(loaded.books.filter(book => book.user === user).map(book => book.author))];
}

async function convertBooks() {
    while (!loaded.hasOwnProperty('books')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    while (!loaded.hasOwnProperty('users')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    loaded.convertedBooks = loaded.books.map(book => ({
        "titel": book.title,
        "reihe": book.series,
        "band": book.volume,
        "autor": book.author,
        "umschlag": book.cover,
        "isbn": book.isbn,
        "beschreibung": book.description,
        "bild-link": book.image,
        "benutzer": findUserById(book.user).name,
        "id": book.token
    }));

    console.log("Successfully converted books");
}

// Wishes functions
function searchWishes(query) {
    return searchQueryListionary(loaded.convertedWishes, query, -1, false, keysToIgnore=["isbn", "id", "beschreibung", "bild-link", "umschlag"]).map(book => ({
        "title": book.titel,
        "series": book.reihe,
        "volume": book.band,
        "author": book.autor,
        "cover": book.umschlag,
        "isbn": book.isbn,
        "description": book.beschreibung,
        "image": book["bild-link"],
        "importance": book.relevanz,
        "token": book.id,
        "username": book.benutzer
    }))
}

function findWishById(token) {
    return loaded.wishes.find(book => book.token === token);
}

async function asyncFindWishById(token) {
    while (!loaded.hasOwnProperty('wishes')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    return loaded.wishes.find(book => book.token === token);
}

function newWish(title, series, volume, author, cover, isbn, description, image, importance) {
    addItem({
        "titel": title,
        "series": series,
        "volume": volume,
        "author": author,
        "cover": cover,
        "isbn": isbn,
        "description": description,
        "image": image,
        "importance": importance,
        "user": getLocalStorage("user"),
        "token": generate_token()
    }, "wishes");
}

async function asyncNewWish(title, series, volume, author, cover, isbn, description, image, importance) {
    let data = null;
    addItem({
        "title": title,
        "series": series,
        "volume": volume,
        "author": author,
        "cover": cover,
        "isbn": isbn,
        "description": description,
        "image": image,
        "importance": importance,
        "user": getLocalStorage("user"),
        "token": generate_token()
    }, "wishes", (d) => { data = d; });

    while (data === null) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }
    return data;
}

function rewish(book, newBook) {
    editItem(book, newBook, "wishes");
}

async function asyncRewish(book, newBook) {
    let data = null;
    editItem(book, newBook, "wishes", (d) => { data = d; });

    while (data === null) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }
    return data;
}

function findWishesByUser(user) {
    return loaded.wishes.filter(book => book.user === user);
}

async function convertWishes() {
    while (!loaded.hasOwnProperty('wishes')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    while (!loaded.hasOwnProperty('users')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    loaded.convertedWishes = loaded.wishes.map(book => ({
        "titel": book.title,
        "reihe": book.series,
        "band": book.volume,
        "autor": book.author,
        "umschlag": book.cover,
        "isbn": book.isbn,
        "beschreibung": book.description,
        "bild-link": book.image,
        "relevanz": book.importance,
        "benutzer": findUserById(book.user).name,
        "id": book.token
    }));
    console.log("Successfully converted wishes");
}

// Wish + books functions
function searchAll(query) {
    return searchQueryListionary(loaded.convertedWishes.concat(loaded.convertedBooks), query, -1, false, keysToIgnore=["isbn", "id", "beschreibung", "bild-link", "umschlag", "relevanz"]).map(book => {
        if (book.hasOwnProperty("relevanz")) {
            return {
                "title": book.titel,
                "series": book.reihe,
                "volume": book.band,
                "author": book.autor,
                "cover": book.umschlag,
                "isbn": book.isbn,
                "description": book.beschreibung,
                "image": book["bild-link"],
                "importance": book.relevanz,
                "token": book.id,
                "username": book.benutzer
            }
        }
        return {
            "title": book.titel,
            "series": book.reihe,
            "volume": book.band,
            "author": book.autor,
            "cover": book.umschlag,
            "isbn": book.isbn,
            "description": book.beschreibung,
            "image": book["bild-link"],
            "token": book.id,
            "username": book.benutzer
        }
    });
}

// Users functions
function findUserById(token) {
    return loaded.users.find(user => user.token === token);
}

async function asyncFindUserById(token) {
    while (!loaded.hasOwnProperty('users')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    return loaded.users.find(user => user.token === token);
}

function findConvertedUserById(token) {
    return loaded.convertedUsers.find(user => user.id === token);
}

function findUserByName(name) {
    return loaded.users.find(user => user.name === name);
}

// Externally needed
async function loadUsername() {
    while (!loaded.hasOwnProperty('users')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    const usernameContainer = document.getElementById("username-container");
    usernameContainer.innerHTML = findUserById(getLocalStorage("user")).name;
}

async function convertUsers() {
    while (!loaded.hasOwnProperty('books')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    while (!loaded.hasOwnProperty('wishes')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    while (!loaded.hasOwnProperty('users')) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Check every 100 milliseconds
    }

    loaded.convertedUsers = loaded.users.map(user => ({
        "name": user.name,
        "bücher": findBooksByUser(user.token).length.toString(),
        "reihen": findSeriesByUser(user.token).length.toString(),
        "autoren": findAuthorsByUser(user.token).length.toString(),
        "wünsche": findWishesByUser(user.token).length.toString(),
        "id": user.token
    }));

    console.log("Successfully converted users");
}

function searchUsers(query) {
    const results = searchQueryListionary(loaded.convertedUsers, query, -1, false, keysToIgnore=["id"]);
    return results.map(user => ({
        "name": user.name,
        "books": user.bücher,
        "series": user.reihen,
        "authors": user.autoren,
        "wishes": user.wünsche,
        "token": user.id
    }));
}

// Loading
const loaded = {};

if (typeof requiredLoaders !== 'undefined') {
    if (requiredLoaders.includes("convertedUsers")) {
        requiredLoaders.splice(requiredLoaders.indexOf("convertedUsers"), 1);
        requiredLoaders.push("users");
        convertUsers();
    }
    if (requiredLoaders.includes("convertedBooks")) {
        requiredLoaders.splice(requiredLoaders.indexOf("convertedBooks"), 1);
        requiredLoaders.push("books");
        convertBooks();
    }
    if (requiredLoaders.includes("convertedWishes")) {
        requiredLoaders.splice(requiredLoaders.indexOf("convertedWishes"), 1);
        requiredLoaders.push("wishes");
        convertWishes();
    }

    requiredLoaders.forEach(loader => loadData(loader, value => {loaded[loader] = value;}));
}

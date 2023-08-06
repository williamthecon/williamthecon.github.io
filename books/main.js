// Check if already logged in or page is already the login page
const username = localStorage.getItem('username');

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
        .catch(error => console.log(error));
}

// async function searchData(type, max_results = -1, equals = false, ignore_indices = [], args = [], kwargs = {}) {
//     return await fetch("https://my-book-api.wtc248.repl.co/search/" + type, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json; charset=utf-8'
//         },
//         body: JSON.stringify({"max_results": max_results, "equals": equals, "ignore_indices": ignore_indices, "args": args, "kwargs": kwargs}),
//     }).then(response => {d = response.json(); if (d.success) {return d.data}; return []}).catch(error => console.log(error));
// }

// async function findData(type, equals = false, ignore_indices = [], args = [], kwargs = {}) {
//     return await fetch("https://my-book-api.wtc248.repl.co/find/" + type, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json; charset=utf-8'
//         },
//         body: JSON.stringify({"equals": equals, "ignore_indices": ignore_indices, "args": args, "kwargs": kwargs}),
//     }).then(response => {d = response.json(); if (d.success) {return d.item}; return null}).catch(error => console.log(error));
// }

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

const loaded = {};
if (typeof requiredLoaders !== 'undefined') {
    requiredLoaders.forEach(loader => loadData(loader, value => {loaded[loader] = value;}));
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
            setLocalStorage('username', username);
            console.log("Login successful");
            return true;
        }
    }
    console.log("Login failed");
    return false;
}

function logout() {
    deleteLocalStorage('username');
}

function changePassword(currentPassword, newPassword1, newPassword2) {
    const user = loaded.users.find(user => user.name === username);

    if (user) {
        if (hash_password(currentPassword) === user.password) {
            if (newPassword1 === newPassword2) {
                user.password = hash_password(newPassword1);
                saveData(loaded.users, "users");
                return true;
            }
        }
    }
    return false;
}

function changeUsername(username, newUsername) {
    const user = loaded.users.find(user => user.name === username);

    if (user) {
        user.name = newUsername;
        saveData(loaded.users, "users");
        return true;
    }
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
    static parse_query(keys, query) {
        const info = { args: [], kwargs: {} };
        let currentStr = "";
        let inStr = false;

        for (const char of query) {
            if (char === '"') {
                inStr = !inStr;
            } else if (char === " " && !inStr) {
                if (currentStr.includes(":")) {
                    const [key, value] = currentStr.split(":");
                    if (Object.keys(keys).includes(key.toLowerCase())) {
                        key = keys[key]
                    }
                    info.kwargs[key.toLowerCase()] = value.toLowerCase();
                } else {
                    info.args.push(currentStr.toLowerCase());
                }
                currentStr = "";
            } else {
                currentStr += char;
            }
        }
        if (currentStr) {
            if (currentStr.includes(":")) {
                const [key, value] = currentStr.split(":");
                if (Object.keys(keys).includes(key.toLowerCase())) {
                    key = keys[key]
                }
                info.kwargs[key.toLowerCase()] = value.toLowerCase();
            } else {
                info.args.push(currentStr.toLowerCase());
            }
        }

        return info;
    }

    static search(data, info, max_results = -1, equals = false, ignore_keys = []) {
        if (max_results === -1) {
            max_results = data.length;
        }

        console.log("Info: " + info);

        const keys = Object.keys(data[0]);
        const args = info.args;
        const kwargs = info.kwargs;

        const test = (s1, s2) => (equals ? s1 === s2 : s2.includes(s1));
        const ignore_columns = keys.reduce((acc, ks, n) => {
            if (
                ignore_keys.some(
                    (ignore_key) => ks.some((key) => key.toLowerCase().includes(ignore_key))
                )
            ) {
                acc.push(n);
            }
            return acc;
        }, []);
        const search_columns = (row) => Object.values(row).filter((key, n) => !ignore_columns.includes(key));

        const results = [];
        for (const value of data) {
            let approved = true;

            for (const [k, v] of Object.entries(kwargs)) {
                const key_index = keys.findIndex((ks) =>
                    ks.some((key) => key.toLowerCase().includes(k))
                );

                if (key_index === -1 || !test(v.toLowerCase(), Object.values(value.__keys)[key_index].toLowerCase())) {
                    approved = false;
                    break;
                }
            }

            if (approved) {
                for (const arg of args) {
                    if (
                        !search_columns(value)
                            .map((i) => i.toLowerCase())
                            .some((i) => test(arg.toLowerCase(), i))
                    ) {
                        approved = false;
                        break;
                    }
                }

                if (approved) {
                    results.push(value);

                    if (results.length === max_results) {
                        break;
                    }
                }
            }
        }

        return results
    }

    static searchQuery(data, keys, query, max_results = -1, equals = false, ignore_keys = []) {
        return this.search(data, this.parse_query(keys, query), max_results, equals, ignore_keys);
    }

    static find(data, keys, info, equals = false, ignore_keys = []) {
        const args = info.args;
        const kwargs = info.kwargs;

        const test = (s1, s2) => (equals ? s1 === s2 : s2.includes(s1));
        const ignore_columns = keys.reduce((acc, keys, n) => {
            if (
                ignore_keys.some(
                    (ignore_key) => keys.some((key) => key.toLowerCase().includes(ignore_key))
                )
            ) {
                acc.push(n);
            }
            return acc;
        }, []);
        const search_columns = (row) => Object.values(row).filter((_, n) => !ignore_columns.includes(n));

        for (const value of data) {
            let approved = true;

            for (const [k, v] of Object.entries(kwargs)) {
                // Check if the key exists
                const key_index = keys.findIndex((ks) =>
                    ks.some((key) => key.toLowerCase().includes(k))
                );

                // If the key doesn't exist or the query-value doesn't match the data value, skip
                if (key_index === -1 || !test(v.toLowerCase(), Object.values(value.__keys)[key_index].toLowerCase())) {
                    approved = false;
                    break;
                }
            }

            if (approved) {
                for (const arg of args) {
                    if (
                        !search_columns(value.__keys)
                            .map((i) => i.toLowerCase())
                            .some((i) => test(arg.toLowerCase(), i))
                    ) {
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

function searchBooks(query) {
    if (!query) {
        return loaded.books;
    }
    
    return Listionary.searchQuery(loaded.books, {"titel": "title", "reihe": "series", "band": "volume", "autor": "author", "benutzer": "username", "umschlag": "cover", "isbn": "isbn", "beschreibung": "description", "bild-link": "image", "token": "token"}, query, ignore_keys=["token", "description", "image", "cover"]);
}

function findBookById(id) {
    // return Listionary.find(loaded.books, {"titel": "title", "reihe": "series", "band": "volume", "autor": "author", "benutzer": "username", "umschlag": "cover", "isbn": "isbn", "beschreibung": "description", "bild-link": "image", "token": "token"}, {"args": [], "kwargs": {"id": id}}, true, ignore_keys=["token", "description", "image", "cover"]);
    return loaded.books.find(book => book.id === id);
}

function addBook(title, author, username, cover, series = "", volume = "", description = "", image = "", isbn = "", token = generate_token()) {
    return addItem({ title, author, username, cover, series, volume, description, image, isbn, token }, "books");
}

function editBook(book, newBook) {
    editItem(book, newBook, "books");
}

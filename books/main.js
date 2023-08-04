// Check if already logged in or page is already the login page
const username = localStorage.getItem('username');
if (username === null) {
    if (window.location.href !== "https://williamthecon.github.io/books/login") {
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

async function loadData(type, define) {
    return await fetch("https://my-book-api.wtc248.repl.co/load/" + type, // {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json; charset=utf-8',
    //         'Host': 'my-book-api.wtc248.repl.co',
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0',
    //         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    //         'Accept-Language': 'en-GB,en;q=0.5',
    //         'Accept-Encoding': 'gzip, deflate, br',
    //         'Prefer': 'safe',
    //         'DNT': '1',
    //         'Connection': 'keep-alive',
    //         'Upgrade-Insecure-Requests': '1',
    //         'Sec-Fetch-Dest': 'document',
    //         'Sec-Fetch-Mode': 'navigate',
    //         'Sec-Fetch-Site': 'none',
    //         'Sec-Fetch-User': '?1',
    //         'TE': 'trailers'
    //     }
    // }
    ).then(response => response.json()).then(data => {if (data.success) {define(data.data)} else { define([])};}).catch(error => console.log(error));
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

async function saveData(data, type, define) {
    return await fetch('https://my-book-api.wtc248.repl.co/save/' + type, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({"data": data}),
    }).then(response => define(response.json())).catch(error => console.log(error));
}

async function addItem(item, type, define) {
    return await fetch('https://my-book-api.wtc248.repl.co/add/' + type, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({"item": item}),
    }).then(response => define(response.json())).catch(error => console.log(error));
}

async function editItem(item, newItem, type, define) {
    return await fetch('https://my-book-api.wtc248.repl.co/edit/' + type, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({"item": item, "new-item": newItem}),
    }).then(response => define(response.json())).catch(error => console.log(error));
}

async function delItem(item, type, define) {
    return await fetch('https://my-book-api.wtc248.repl.co/del/' + type, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({"item": item}),
    }).then(response => define(response.json())).catch(error => console.log(error));
}

const loaded = {};
if (requireLoaders !== undefined) {
    requiredLoaders.forEach(loader => loadData(loader, value => {loaded[loader] = value}));
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
    console.log(user);
    if (user) {
        console.log(hash_password(password));
        if (hash_password(password) === user.password) {
            setLocalStorage('username', username);
            console.log("Login successful");
            return true;
        }
    }
    console.log("Login failed");
    setLocalStorage('-login--input-username', username)
    setLocalStorage('-login--input-password', password)
    return false;
}

function logout() {
    deleteLocalStorage('username');
}

function changePassword(currentPassword, newPassword1, newPassword2) {
    const user = Object.keys(loaded.users).find(user => user.name === username);
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

function changeUsername(currentUsername, newUsername) {
    const user = Object.keys(loaded.users).find(user => user.name === username);
    // const users = loadData("users");
    // const user = users.find(user => user.name === currentUsername);
    if (user) {
        user.name = newUsername;
        return true;
    }
    return false;
}

// `generate_token` requires to import Random inside of the HTML:
//   -> '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/random-js/2.1.0/random.min.js"></script>'
function generate_token(length = 13) {
    const random = Random()

    let tokens = Array.from(getLocalStorage('tokens'));
    let token = '';

    const characters = string.ascii_letters + string.digits;

    do {
        token = '';
        for (let i = 0; i < length; i++) {
            // token += characters.charAt(random.integer(0, characters.length - 1));
            token += random.pick(random.nativeMath, characters.split(""));
        }
    } while (tokens.includes(token));

    tokens.push(token);
    setLocalStorage('tokens', tokens.toString());
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
                if (currentStr.includes(":")) {
                    const [key, value] = currentStr.split(":");
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

        const keys = Object.keys(data[0]);
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

        const search_columns = (row) =>
            Object.values(row).filter((_, n) => !ignore_columns.includes(n));

        const results = [];
        for (const value of data) {
            let approved = true;
            for (const [k, v] of Object.entries(kwargs)) {
                const key_index = keys.findIndex((keys) =>
                    keys.some((key) => key.toLowerCase().includes(k))
                );
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
                    results.push(value.__dump__());

                    if (results.length === max_results) {
                        break;
                    }
                }
            }
        }

        return results
    }

    static searchQuery(data, query, max_results = -1, equals = false, ignore_keys = []) {
        return;
    }

    static find(data, equals = false, ignore_keys = [], ...args) {
        return;
    }
}

function addBook(title, author, username, cover, series = "", volume = "", description = "", image = "", isbn = "", token = generate_token()) {
    addItem({ title, author, username, cover, series, volume, description, image, isbn, token }, "books");
}

function editBook(book, newBook) {
    editItem(book, newBook, "books");
}

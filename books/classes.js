class ClassObject {
        constructor(parent, keys) {
            this.__parent = parent;
            this.__keys = keys; // Is a Map
        }

    get(key) {
        if (typeof key === 'string') {
            key = key.toLowerCase();
            for (const [keys, value] of this.__keys.entries()) {
                if (keys.includes(key)) {
                    return value;
                }
            }
        } else if (typeof key === 'number') {
            if (key < this.__keys.size) {
                return Array.from(this.__keys.values())[key];
            }
        }
        return null;
    }

    set(key, value) {
        for (const k of this.__keys.keys()) {
            if (k.includes(key)) {
                this.__keys.set(k, value);
                this.__parent.save();
                return;
            }
        }
        throw new Error(`could not find key '${key}'`);
    }

    toString() {
        return JSON.stringify(this.__dump__());
    }

    __dump__() {
        const dump = {};
        for (const [k, v] of this.__keys.entries()) {
            dump[k[0]] = v;
        }
        return dump;
    }

    *[Symbol.iterator]() {
        yield* Object.values(this.__keys);
    }

    equals(other) {
        if (Array.isArray(other)) {
            const otherValues = Object.values(other);
            const thisValues = Object.values(this.__keys);
            for (let i = 0; i < thisValues.length; i++) {
                if (thisValues[i] !== otherValues[i]) {
                    return false;
                }
            }
        } else if (typeof other === 'object') {
            const otherEntries = Object.entries(other);
            const thisEntries = Object.entries(this.__keys);
            for (let i = 0; i < thisEntries.length; i++) {
                const [k1, v1] = thisEntries[i];
                const [k2, v2] = otherEntries[i];
                if (!k2.includes(k1) || v1 !== v2) {
                    return false;
                }
            }
        } else {
            const otherEntries = Object.entries(other.__keys);
            const thisEntries = Object.entries(this.__keys);
            for (let i = 0; i < thisEntries.length; i++) {
                const [k1, v1] = thisEntries[i];
                const [k2, v2] = otherEntries[i];
                if (k1 !== k2 || v1 !== v2) {
                    return false;
                }
            }
        }

        return true;
    }

    delete() {
        this.__parent.remove(this);
        this.__parent.save();
        delete this;
    }
}

class Book extends ClassObject {
    constructor(parent, title, author, username, cover, series = "", volume = "", description = "", image = "", isbn = "", token = "") {
      super(parent, new Map([
            [["title", "titel"], title],
            [["series", "reihe"], series],
            [["volume", "band"], volume],
            [["author", "autor"], author],
            [["username", "benutzer"], username],
            [["cover", "umschlag"], cover],
            [["description", "beschreibung"], description],
            [["image", "bild"], image],
            [["isbn"], isbn],
            [["token", "id"], generate_token() || token]
        ]));
    }
}

class Wish extends ClassObject {
    constructor(parent, title, author, username, importance, cover, series = "", volume = "", description = "", image = "", isbn = "", token = "") {
        super(parent, new Map([
            [["title", "titel"], title],
            [["series", "reihe"], series],
            [["volume", "band"], volume],
            [["author", "autor"], author],
            [["username", "benutzer"], username],
            [["importance", "wichtigkeit"], importance],
            [["cover", "umschlag"], cover],
            [["description", "beschreibung"], description],
            [["image", "bild"], image],
            [["isbn"], isbn],
            [["token", "id"], generate_token() || token]
        ]));
    }
}

class User extends ClassObject {
    constructor(parent, name, history, password, token = "") {
        super(parent, new Map([
            [["name", "name"], name],
            [["history", "verlauf"], history],
            [["password", "passwort"], password],
            [["token", "id"], generate_token() || token]
        ]));
    }
}

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

class ClassList {
    constructor(object_type, data, keys = null, database_key = null, ...kwargs) {
        this.__object_type = object_type;
        this.__kwargs = kwargs;
        this.__orig_data = data;
        this.__data = data.map((d) => new object_type(this, { ...d, ...kwargs }));
        this.__keys = this.__data.length > 0 ? Object.keys(this.__data[0].__keys) : [];
        this.__database_key = database_key;
    }

    get(key) {
        if (typeof key === "number") {
            return this.__data[key];
        }
        return this.get(key);
    }

    set(key, value) {
        if (typeof key === "number") {
            return this.set(key, value);
        }

        const key_index = this.index(key);
        if (key_index !== -1 && !this.includes(value)) {
            return this.set(key_index, value);
        }

        return false;
    }

    del(key) {
        if (typeof key === "number") {
            this.__data[key].delete();
            this.__data.splice(key, 1);
            return true;
        }

        const value_index = this.index(key);
        if (value_index !== -1) {
            this.__data[value_index].delete();
            this.__data.splice(value_index, 1);
            return true;
        }

        return false;
    }

    __iter__() {
        return this.__data[Symbol.iterator]();
    }

    __len__() {
        return this.__data.length;
    }

    __str__() {
        return JSON.stringify({
            object_type: this.__object_type.toString(),
            data: this.__data.map((i) => i.__dump__()),
            kwargs: this.__kwargs,
            database_key: this.__database_key,
        });
    }

    __repr__() {
        return this.__str__();
    }

    __contains__(target_value) {
        return this.get(target_value) !== null;
    }

    __add__(other) {
        const data = this.__orig_data.concat(other.__orig_data);
        if (this.__object_type !== other.__object_type) {
            return null;
        }
        const database_key =
            this.__database_key === other.__database_key
            ? this.__database_key
            : null;
        return new ClassList(this.__object_type, data, database_key, ...this.__kwargs);
    }

    get(target_value) {
        if (typeof target_value === "object" && target_value !== null) {
            target_value = Object.values(target_value);
        } else if (target_value instanceof ClassObject) {
            target_value = Object.values(target_value.__keys);
        } else if (!Array.isArray(target_value)) {
            return null;
        }

        for (const value of this.__data) {
            if (
                target_value.every(
                    (i1, index) => i1 === Object.values(value.__keys)[index]
                )
            ) {
                return value;
            }
        }
        return null;
    }

    set(index, value) {
        if (Array.isArray(value)) {
            this.__data[index] = new this.__object_type(
            this,
            Object.fromEntries(
                this.__keys.map((k, i) => [k[0], value[i]])
            ),
            ...this.__kwargs
            );
        } else if (typeof value === "object" && value !== null) {
            this.__data[index] = new this.__object_type(this, value, ...this.__kwargs);
        } else if (value instanceof this.__object_type) {
            this.__data[index] = value;
        } else {
            return false;
        }

        return this.save();
    }

    index(target_value) {
        const f = this.get(target_value);
        if (f !== null) {
            return this.__data.indexOf(f);
        }
        return -1;
    }

    add(new_value) {
        if (!this.includes(new_value)) {
            if (Array.isArray(new_value)) {
                this.__data.push(
                    new this.__object_type(
                    this,
                    Object.fromEntries(
                        this.__keys.map((k, i) => [k[0], new_value[i]])
                    ),
                    ...this.__kwargs
                    )
                );
            } else if (typeof new_value === "object" && new_value !== null) {
                this.__data.push(new this.__object_type(this, new_value, ...this.__kwargs));
            } else if (new_value instanceof this.__object_type) {
                this.__data.push(new_value);
            } else {
                return false;
            }
            this.save();
            return true;
        }
        return false;
    }

    remove(value) {
        const value_index = this.index(value);
        if (value_index !== -1) {
            this.__data[value_index].delete();
            this.__data.splice(value_index, 1);
            this.save();
            return true;
        }
        return false;
    }

    search(max_results = -1, equals = false, ignore_keys = [], ...args) {
        if (max_results === -1) {
            max_results = this.__data.length;
        }

        const test = (s1, s2) => (equals ? s1 === s2 : s2.includes(s1));
        const ignore_columns = this.__keys.reduce((acc, keys, n) => {
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
        for (const value of this.__data) {
            let approved = true;
            for (const [k, v] of Object.entries(kwargs)) {
                const key_index = this.__keys.findIndex((keys) =>
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

        return new ClassList(this.__object_type, results, this.__database_key, ...this.__kwargs);
    }

    __parse_query(q) {
        const info = { args: [], kwargs: {} };
        let cstr = "";
        let instr = false;
        for (const c of q) {
            if (c === '"') {
                instr = !instr;
            } else if (c === " " && !instr) {
                if (cstr.includes(":")) {
                    const [key, value] = cstr.split(":");
                    info.kwargs[key.toLowerCase()] = value.toLowerCase();
                } else {
                    info.args.push(cstr.toLowerCase());
                }
                cstr = "";
            } else {
                cstr += c;
            }
        }
        if (cstr) {
            if (cstr.includes(":")) {
                const [key, value] = cstr.split(":");
                info.kwargs[key.toLowerCase()] = value.toLowerCase();
            } else {
                info.args.push(cstr.toLowerCase());
            }
        }

        return info;
    }

    search_query(q, max_results = -1, equals = false, ignore_keys = []) {
        const query = this.__parse_query(q);

        return this.search(
            max_results,
            equals,
            ignore_keys,
            ...query.args,
            query.kwargs
        );
    }

    find(equals = false, ignore_keys = [], ...args) {
        const f = this.search(1, equals, ignore_keys, ...args);
        if (f.length > 0) {
            return f[0];
        }
        return null;
    }

    save() {
        if (this.__database_key !== null) {
            db[this.__database_key] = this.__repr__();
            return true;
        }
        return false;
    }

    static load(data) {
        data.object_type = eval(data.object_type.split(".").slice(1).join("."));
        const kwargs = { ...data.kwargs };
        delete data.kwargs;
        return new ClassList(data.object_type, data.data, data.database_key, ...kwargs);
    }
}

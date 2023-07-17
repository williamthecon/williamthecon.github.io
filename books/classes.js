class ClassObject {
        constructor(parent, keys) {
            this.__parent = parent;
            this.__keys = keys;
        }

    __getitem__(key) {
        if (typeof key === 'string') {
            key = key.toLowerCase();
            for (const [keys, value] of Object.entries(this.__keys)) {
                if (keys.includes(key)) {
                    return value;
                }
            }
        } else if (typeof key === 'number') {
            if (key < Object.keys(this.__keys).length) {
                return Object.values(this.__keys)[key];
            }
        }
        return null;
    }

    __setitem__(key, value) {
        for (const [k, v] of Object.entries(this.__keys)) {
            if (k.includes(key)) {
                this.__keys[k] = value;
                this.__parent.save();
                return;
            }
        }
        throw new Error(`could not find key '${key}'`);
    }

    __is_class_attribute(name) {
        return name.startsWith('_') && name.includes('__');
    }

    __getattr__(key) {
        if (this.__is_class_attribute(key)) {
            if (key.startsWith('_ClassList__')) {
                key = key.replace('_ClassList__', '_ClassObject__');
            }
            return super[key];
        }

        key = key.toLowerCase();
        for (const [keys, value] of Object.entries(this.__keys)) {
            if (keys.includes(key)) {
                return value;
            }
        }
        return null;
    }

    __setattr__(key, value) {
        if (this.__is_class_attribute(key)) {
            super[key] = value;
            return;
        }

        for (const [k, v] of Object.entries(this.__keys)) {
            if (k.includes(key)) {
                this.__keys[k] = value;
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
        for (const [k, v] of Object.entries(this.__keys)) {
            dump[k[0]] = v;
        }
        return dump;
    }

    *[Symbol.iterator]() {
        yield* Object.values(this.__keys);
    }

    __eq__(other) {
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

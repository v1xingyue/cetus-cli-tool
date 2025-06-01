import fs from "fs";
export class MemoryCache {
    constructor() {
        this.data = new Map();
    }
    set(key, value, expireSeconds = 600) {
        const expire = expireSeconds ? Date.now() + expireSeconds * 1000 : 0;
        const item = {
            value,
            expire,
        };
        this.data.set(key, item);
    }
    get(key) {
        const item = this.data.get(key);
        if (!item) {
            return null;
        }
        if (item.expire && item.expire < Date.now()) {
            this.data.delete(key);
            return null;
        }
        return item.value;
    }
    del(key) {
        this.data.delete(key);
    }
    clear() {
        this.data.clear();
    }
    clean_expired() {
        for (const [key, item] of this.data) {
            if (item.expire && item.expire < Date.now()) {
                this.data.delete(key);
            }
        }
    }
    load_from_file(file) {
        try {
            const data = fs.readFileSync(file, "utf8");
            this.data = new Map(JSON.parse(data));
            this.clean_expired();
        }
        catch (error) { }
    }
    save_to_file(file) {
        fs.writeFileSync(file, JSON.stringify(Array.from(this.data.entries())));
    }
}

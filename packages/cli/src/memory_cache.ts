import fs from "fs";

interface CacheItem {
  value: any;
  expire: number;
}

export class MemoryCache {
  private data: Map<string, any>;

  constructor() {
    this.data = new Map<string, any>();
  }

  set(key: string, value: any, expireSeconds: number = 600) {
    const expire = expireSeconds ? Date.now() + expireSeconds * 1000 : 0;
    const item: CacheItem = {
      value,
      expire,
    };
    this.data.set(key, item);
  }

  get(key: string) {
    const item: CacheItem | undefined = this.data.get(key);
    if (!item) {
      return null;
    }
    if (item.expire && item.expire < Date.now()) {
      this.data.delete(key);
      return null;
    }
    return item.value;
  }

  del(key: string) {
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

  load_from_file(file: string) {
    try {
      const data = fs.readFileSync(file, "utf8");
      this.data = new Map<string, any>(JSON.parse(data));
      this.clean_expired();
    } catch (error) {}
  }

  save_to_file(file: string) {
    fs.writeFileSync(file, JSON.stringify(Array.from(this.data.entries())));
  }
}

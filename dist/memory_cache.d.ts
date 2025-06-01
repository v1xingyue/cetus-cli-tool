export declare class MemoryCache {
    private data;
    constructor();
    set(key: string, value: any, expireSeconds?: number): void;
    get(key: string): any;
    del(key: string): void;
    clear(): void;
    clean_expired(): void;
    load_from_file(file: string): void;
    save_to_file(file: string): void;
}

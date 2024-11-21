export class StorageService {
    static STORAGE_KEY = 'shoppingItems';

    static getItems() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};
    }

    static saveItems(items) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }

    static clearAll() {
        localStorage.clear();
    }
}

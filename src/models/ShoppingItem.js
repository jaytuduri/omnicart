export class ShoppingItem {
    constructor(name, translation = '', icon = '', quantity = 1) {
        this.name = name;
        this.translation = translation;
        this.icon = icon;
        this.id = Date.now();
        this.purchased = false;
        this.quantity = quantity;
        this.isNew = true;
    }
}

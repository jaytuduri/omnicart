class ShoppingList {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('shoppingItems')) || {};
        this.setupEventListeners();
        this.renderLists();
    }

    setupEventListeners() {
        document.getElementById('addItem').addEventListener('click', () => this.addItem());
        document.getElementById('itemInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
        document.getElementById('clearAllItems').addEventListener('click', () => this.clearAll());
        document.getElementById('targetLang').addEventListener('change', () => this.updateTranslations());
    }

    async addItem() {
        const input = document.getElementById('itemInput');
        const itemName = input.value.trim();
        
        if (!itemName) return;

        const targetLang = document.getElementById('targetLang').value;
        const translation = await this.translateText(itemName, targetLang);
        const { category, icon } = categorizeItem(itemName);

        if (!this.items[category]) {
            this.items[category] = [];
        }

        this.items[category].push({
            name: itemName,
            translation,
            icon,
            id: Date.now(),
            purchased: false
        });

        this.saveToLocalStorage();
        this.renderLists();
        input.value = '';
    }

    async translateText(text, targetLang) {
        try {
            // Using a free translation API (you might want to replace this with a more reliable service)
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
            const data = await response.json();
            return data.responseData.translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Return original text if translation fails
        }
    }

    async updateTranslations() {
        const targetLang = document.getElementById('targetLang').value;
        
        for (const category in this.items) {
            for (const item of this.items[category]) {
                item.translation = await this.translateText(item.name, targetLang);
            }
        }

        this.saveToLocalStorage();
        this.renderLists();
    }

    deleteItem(category, id) {
        this.items[category] = this.items[category].filter(item => item.id !== id);
        if (this.items[category].length === 0) {
            delete this.items[category];
        }
        this.saveToLocalStorage();
        this.renderLists();
    }

    togglePurchased(category, id) {
        const item = this.items[category].find(item => item.id === id);
        if (item) {
            item.purchased = !item.purchased;
            this.saveToLocalStorage();
            this.renderLists();
        }
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all items?')) {
            this.items = {};
            this.saveToLocalStorage();
            this.renderLists();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('shoppingItems', JSON.stringify(this.items));
    }

    renderLists() {
        const container = document.querySelector('.lists-container');
        container.innerHTML = '';

        Object.entries(this.items).sort().forEach(([category, items]) => {
            const section = document.createElement('div');
            section.className = 'category-section';
            
            section.innerHTML = `
                <div class="category-header">
                    <h2 class="category-title">${categories[category]?.icon || '📦'} ${category}</h2>
                    <span class="item-count">${items.length} items</span>
                </div>
                ${items.map(item => `
                    <div class="shopping-item${item.purchased ? ' purchased' : ''}" data-id="${item.id}">
                        <div class="item-info">
                            <input type="checkbox" class="item-checkbox" 
                                ${item.purchased ? 'checked' : ''} 
                                onchange="shoppingList.togglePurchased('${category}', ${item.id})">
                            <span class="item-name">${item.name}</span>
                            <span class="translated-text">${item.translation}</span>
                        </div>
                        <button class="delete-item" onclick="shoppingList.deleteItem('${category}', ${item.id})">
                            ✕
                        </button>
                    </div>
                `).join('')}
            `;

            container.appendChild(section);
        });
    }
}

// Initialize the app
const shoppingList = new ShoppingList();

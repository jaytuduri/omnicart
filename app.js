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
            purchased: false,
            quantity: 1,
            isNew: true // Mark as new for animation
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
            section.className = 'mb-6';
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'text-lg font-semibold mb-2';
            categoryHeader.innerHTML = `
                <h2 class="category-title">${category}</h2>
                <span class="item-count">${items.length} items</span>
            `;

            const itemsList = document.createElement('div');
            itemsList.className = 'space-y-2';

            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = `flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded item-hover dark-mode-transition ${item.isNew ? 'new-item' : ''}`;
                
                // Remove the isNew flag after animation
                if (item.isNew) {
                    setTimeout(() => {
                        item.isNew = false;
                        this.saveToLocalStorage();
                    }, 300);
                }
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.purchased;
                checkbox.className = 'w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary';
                checkbox.addEventListener('change', () => this.togglePurchased(category, item.id));

                const textContainer = document.createElement('div');
                textContainer.className = 'flex-1';

                const itemName = document.createElement('div');
                itemName.className = item.purchased ? 'line-through text-gray-500' : '';
                itemName.textContent = item.name;

                const translatedName = document.createElement('div');
                translatedName.className = 'text-sm text-gray-500 dark:text-gray-400';
                translatedName.textContent = item.translation !== item.name ? item.translation : '';

                const controls = document.createElement('div');
                controls.className = 'flex items-center gap-2';

                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.value = item.quantity;
                quantityInput.min = '1';
                quantityInput.className = 'w-16 p-1 text-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
                quantityInput.addEventListener('change', (e) => this.updateQuantity(category, item.id, e.target.value));

                const deleteButton = document.createElement('button');
                deleteButton.className = 'p-2 text-red-500 hover:text-red-600 transition-colors';
                deleteButton.textContent = '×';
                deleteButton.addEventListener('click', () => this.deleteItem(category, item.id));

                textContainer.appendChild(itemName);
                if (item.translation !== item.name) {
                    textContainer.appendChild(translatedName);
                }

                controls.appendChild(quantityInput);
                controls.appendChild(deleteButton);

                itemElement.appendChild(checkbox);
                itemElement.appendChild(textContainer);
                itemElement.appendChild(controls);

                itemsList.appendChild(itemElement);
            });

            section.appendChild(categoryHeader);
            section.appendChild(itemsList);
            container.appendChild(section);
        });
    }

    updateQuantity(category, id, quantity) {
        const item = this.items[category].find(item => item.id === id);
        if (item) {
            item.quantity = Math.max(1, parseInt(quantity) || 1);
            this.saveToLocalStorage();
            this.renderLists();
        }
    }
}

// Initialize the app
const shoppingList = new ShoppingList();

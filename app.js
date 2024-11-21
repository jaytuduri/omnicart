/**
 * Shopping list app
 * 
 * @class ShoppingList
 */
class ShoppingList {
    /**
     * Constructor
     * 
     * @constructor
     */
    constructor() {
        this.items = JSON.parse(localStorage.getItem('shoppingItems')) || {};
        this.setupEventListeners();
        this.renderLists();
        this.setupSpeechRecognition();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        document.getElementById('addItem').addEventListener('click', () => this.addItem());
        document.getElementById('itemInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
        document.getElementById('clearAllItems').addEventListener('click', () => this.clearAll());
        document.getElementById('targetLang').addEventListener('change', () => this.updateTranslations());

        // Settings modal event listeners
        document.getElementById('settingsButton').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.remove('hidden');
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.add('hidden');
        });

        document.getElementById('deleteLocalStorage').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
                localStorage.clear();
                this.items = {};
                this.renderLists();
                document.getElementById('settingsModal').classList.add('hidden');
            }
        });

        // Close modal when clicking outside
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('settingsModal')) {
                document.getElementById('settingsModal').classList.add('hidden');
            }
        });

        const voiceButton = document.getElementById('voiceInput');
        if (voiceButton) {
            if (this.recognition) {
                voiceButton.addEventListener('click', () => {
                    try {
                        this.recognition.start();
                        voiceButton.classList.add('animate-pulse');
                        voiceButton.querySelector('i').classList.add('text-primary');
                    } catch (e) {
                        console.error('Speech recognition error:', e);
                    }
                });

                this.recognition.onend = () => {
                    voiceButton.classList.remove('animate-pulse');
                    voiceButton.querySelector('i').classList.remove('text-primary');
                };
            } else {
                voiceButton.addEventListener('click', () => {
                    alert('Speech recognition is not supported in your browser. Please try using Chrome or Safari.');
                });
            }
        }
    }

    /**
     * Parse the input string and extract the item name and quantity
     * 
     * @param {string} text The input string
     * @returns An object with the item name and quantity
     */
    parseInput(text) {
        // Convert common unit words to their numeric values
        const unitMap = {
            'a': '1',
            'an': '1',
            'one': '1',
            'two': '2',
            'three': '3',
            'four': '4',
            'five': '5',
            'six': '6',
            'seven': '7',
            'eight': '8',
            'nine': '9',
            'ten': '10'
        };

        // Replace word numbers with digits
        let processedText = text.toLowerCase().trim();
        Object.entries(unitMap).forEach(([word, num]) => {
            processedText = processedText.replace(new RegExp(`^${word}\\s+`, 'i'), `${num} `);
            processedText = processedText.replace(new RegExp(`\\s+${word}$`, 'i'), ` ${num}`);
        });

        // Common measurement units to strip from item name
        const units = ['kg', 'g', 'lb', 'lbs', 'oz', 'l', 'ml'];
        
        let quantity = 1;
        let itemName = processedText;

        // Try to match number at start (e.g., "3 bananas")
        let match = processedText.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
        if (match) {
            quantity = parseFloat(match[1]);
            itemName = match[2].trim();
        } else {
            // Try to match number at end (e.g., "bananas 3")
            match = processedText.match(/^(.+?)\s+(\d+(?:\.\d+)?)$/);
            if (match) {
                itemName = match[1].trim();
                quantity = parseFloat(match[2]);
            }
        }

        // Clean up the item name - remove units if they're part of the name
        units.forEach(unit => {
            itemName = itemName.replace(new RegExp(`\\s*${unit}\\s*$`, 'i'), '');
        });

        // Capitalize first letter of each word in item name
        itemName = itemName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return { itemName, quantity };
    }

    /**
     * Add an item to the list
     */
    async addItem() {
        const input = document.getElementById('itemInput');
        const inputText = input.value.trim();
        
        if (!inputText) return;

        const { itemName, quantity } = this.parseInput(inputText);

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
            quantity: quantity,
            isNew: true
        });

        this.saveToLocalStorage();
        this.renderLists();
        input.value = '';
    }

    /**
     * Translate the given text to the given language
     * 
     * @param {string} text The text to translate
     * @param {string} targetLang The target language
     * @returns The translated text
     */
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

    /**
     * Update the translations for all items
     */
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

    /**
     * Delete an item
     * 
     * @param {string} category The category of the item to delete
     * @param {number} id The ID of the item to delete
     */
    deleteItem(category, id) {
        this.items[category] = this.items[category].filter(item => item.id !== id);
        if (this.items[category].length === 0) {
            delete this.items[category];
        }
        this.saveToLocalStorage();
        this.renderLists();
    }

    /**
     * Toggle the purchased status of an item
     * 
     * @param {string} category The category of the item to toggle
     * @param {number} id The ID of the item to toggle
     */
    togglePurchased(category, id) {
        const item = this.items[category].find(item => item.id === id);
        if (item) {
            item.purchased = !item.purchased;
            this.saveToLocalStorage();
            this.renderLists();
        }
    }

    /**
     * Clear all items
     */
    clearAll() {
        if (confirm('Are you sure you want to clear all items?')) {
            this.items = {};
            this.saveToLocalStorage();
            this.renderLists();
        }
    }

    /**
     * Save the items to local storage
     */
    saveToLocalStorage() {
        localStorage.setItem('shoppingItems', JSON.stringify(this.items));
    }

    /**
     * Update item quantity
     * 
     * @param {string} category The category of the item
     * @param {number} id The ID of the item
     * @param {number} newQuantity The new quantity
     */
    updateQuantity(category, id, newQuantity) {
        const item = this.items[category].find(item => item.id === id);
        if (item) {
            item.quantity = Math.max(1, newQuantity); // Ensure quantity is at least 1
            this.saveToLocalStorage();
            this.renderLists();
        }
    }

    /**
     * Render the lists
     */
    renderLists() {
        const container = document.querySelector('.lists-container');
        container.innerHTML = '';

        Object.entries(this.items).sort().forEach(([category, items]) => {
            const section = document.createElement('div');
            section.className = 'mb-6';
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.innerHTML = `
                <h2 class="category-title">${category}</h2>
                <span class="item-count">(${items.length})</span>
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
                checkbox.className = 'form-checkbox h-5 w-5 text-primary rounded border-gray-300 dark:border-gray-600 focus:ring-primary';
                checkbox.addEventListener('change', () => this.togglePurchased(category, item.id));
                
                itemElement.appendChild(checkbox);

                // Add item icon and text
                const itemContent = document.createElement('div');
                itemContent.className = 'flex-1';
                if (item.icon) {
                    const icon = document.createElement('i');
                    icon.className = `bx ${item.icon} mr-2`;
                    itemContent.appendChild(icon);
                }

                // Create a container for item name and translation
                const textContainer = document.createElement('div');
                textContainer.className = 'flex flex-col';

                // Add item name
                const itemText = document.createElement('span');
                itemText.textContent = item.name;
                if (item.purchased) {
                    itemText.className = 'line-through text-gray-500';
                }
                textContainer.appendChild(itemText);

                // Add translation if available and different from original
                if (item.translation && item.translation !== item.name) {
                    const translationText = document.createElement('span');
                    translationText.className = 'text-sm text-gray-500 dark:text-gray-400';
                    translationText.textContent = item.translation;
                    textContainer.appendChild(translationText);
                }

                itemContent.appendChild(textContainer);
                itemElement.appendChild(itemContent);

                // Add quantity input
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.inputMode = 'numeric';
                quantityInput.pattern = '[0-9]*';
                quantityInput.min = '1';
                quantityInput.value = item.quantity;
                quantityInput.className = 'w-16 p-1 text-center rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-primary focus:border-primary';
                quantityInput.addEventListener('change', (e) => {
                    const newQuantity = parseInt(e.target.value) || 1;
                    this.updateQuantity(category, item.id, newQuantity);
                });
                itemElement.appendChild(quantityInput);

                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.className = 'text-red-500 hover:text-red-700 focus:outline-none ml-2';
                deleteButton.innerHTML = '<i class="bx bx-x text-xl"></i>';
                deleteButton.addEventListener('click', () => this.deleteItem(category, item.id));
                itemElement.appendChild(deleteButton);

                itemsList.appendChild(itemElement);
            });

            section.appendChild(categoryHeader);
            section.appendChild(itemsList);
            container.appendChild(section);
        });
    }
}

// Initialize the app
const shoppingList = new ShoppingList();

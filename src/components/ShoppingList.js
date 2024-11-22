import { ShoppingItem } from '../models/ShoppingItem.js';
import { TranslationService } from '../services/TranslationService.js';
import { StorageService } from '../services/StorageService.js';
import { InputParser } from '../utils/InputParser.js';
import { categorizeItem } from '../utils/CategoryUtils.js';
import { ListRenderer } from './ListRenderer.js';
import { SpeechService } from '../services/SpeechService.js';

export class ShoppingList {
    constructor() {
        this.items = StorageService.getItems();
        this.setupEventListeners();
        this.renderLists();
        this.initSpeechRecognition();
    }

    setupEventListeners() {
        document.getElementById('addItem').addEventListener('click', () => this.addItem());
        document.getElementById('itemInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
        document.getElementById('clearAllItems').addEventListener('click', () => this.clearAll());
        document.getElementById('targetLang').addEventListener('change', () => this.updateTranslations());

        // Translate dropdown
        document.getElementById('translateButton').addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = document.getElementById('translateDropdown');
            dropdown.classList.toggle('hidden');
        });

        // Close translate dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('translateDropdown');
            if (!dropdown.contains(e.target) && !e.target.closest('#translateButton')) {
                dropdown.classList.add('hidden');
            }
        });

        // Settings modal
        document.getElementById('settingsButton').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.remove('hidden');
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.add('hidden');
        });

        document.getElementById('deleteLocalStorage').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
                StorageService.clearAll();
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
    }

    initSpeechRecognition() {
        this.speechService = new SpeechService((text) => {
            document.getElementById('itemInput').value = text;
            this.addItem();
        });

        const voiceButton = document.getElementById('voiceInput');
        if (voiceButton) {
            if (this.speechService.isSupported()) {
                voiceButton.addEventListener('click', () => {
                    this.speechService.start();
                });
            } else {
                voiceButton.style.display = 'none';
            }
        }
    }

    async addItem() {
        const input = document.getElementById('itemInput');
        const inputText = input.value.trim();
        
        if (!inputText) return;

        const { itemName, quantity } = InputParser.parse(inputText);
        const targetLang = document.getElementById('targetLang').value;
        const translation = await TranslationService.translate(itemName, targetLang);
        const { category, icon } = categorizeItem(itemName);

        if (!this.items[category]) {
            this.items[category] = [];
        }

        const newItem = new ShoppingItem(itemName, translation, icon, quantity);
        this.items[category].push(newItem);

        StorageService.saveItems(this.items);
        this.renderLists();
        input.value = '';
    }

    async updateTranslations() {
        const targetLang = document.getElementById('targetLang').value;
        this.items = await TranslationService.updateTranslations(this.items, targetLang);
        StorageService.saveItems(this.items);
        this.renderLists();
    }

    deleteItem(category, id) {
        this.items[category] = this.items[category].filter(item => item.id !== id);
        if (this.items[category].length === 0) {
            delete this.items[category];
        }
        StorageService.saveItems(this.items);
        this.renderLists();
    }

    togglePurchased(category, id) {
        const item = this.items[category].find(item => item.id === id);
        if (item) {
            item.purchased = !item.purchased;
            StorageService.saveItems(this.items);
            this.renderLists();
        }
    }

    updateQuantity(category, id, newQuantity) {
        const item = this.items[category].find(item => item.id === id);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            StorageService.saveItems(this.items);
            this.renderLists();
        }
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all items?')) {
            this.items = {};
            StorageService.saveItems(this.items);
            this.renderLists();
        }
    }

    renderLists() {
        ListRenderer.render(this.items, {
            onToggle: (category, id) => this.togglePurchased(category, id),
            onDelete: (category, id) => this.deleteItem(category, id),
            onQuantityChange: (category, id, quantity) => this.updateQuantity(category, id, quantity),
            onItemDrop: (itemId, sourceCategory, targetCategory, newIndex) => this.handleItemDrop(itemId, sourceCategory, targetCategory, newIndex),
            onItemEdit: (category, id, newName) => this.handleItemEdit(category, id, newName),
            onCategoryEdit: (oldCategory, newCategory) => this.handleCategoryEdit(oldCategory, newCategory)
        });
    }

    handleItemDrop(itemId, sourceCategory, targetCategory, newIndex) {
        // Guard against invalid data
        if (!itemId || !sourceCategory || !targetCategory || !this.items[sourceCategory]) {
            return;
        }

        // Find the item to move
        const itemToMove = this.items[sourceCategory].find(item => item.id === itemId);
        if (!itemToMove) return;

        // If the item is dropped in the same category
        if (sourceCategory === targetCategory) {
            const items = this.items[sourceCategory];
            const filteredItems = items.filter(item => item.id !== itemId);
            
            // Insert the item at the new position
            filteredItems.splice(newIndex, 0, itemToMove);
            this.items[sourceCategory] = filteredItems;
        } else {
            // Remove item from source category
            this.items[sourceCategory] = this.items[sourceCategory].filter(item => item.id !== itemId);
            
            // Remove the source category if it's empty
            if (this.items[sourceCategory].length === 0) {
                delete this.items[sourceCategory];
            }

            // Create target category if it doesn't exist
            if (!this.items[targetCategory]) {
                this.items[targetCategory] = [];
            }

            // Create a copy of the item for the new category
            const itemForNewCategory = { ...itemToMove };

            // Insert the item at the new position in the target category
            this.items[targetCategory].splice(newIndex, 0, itemForNewCategory);
        }

        // Save the updated items and re-render
        StorageService.saveItems(this.items);
        this.renderLists();
    }

    async handleItemEdit(category, id, newName) {
        const item = this.items[category].find(item => item.id === id);
        if (item) {
            item.name = newName;
            const targetLang = document.getElementById('targetLang').value;
            item.translation = await TranslationService.translate(newName, targetLang);
            const { category: newCategory, icon } = categorizeItem(newName);
            item.icon = icon;

            // If the category has changed, move the item
            if (newCategory !== category) {
                this.items[category] = this.items[category].filter(i => i.id !== id);
                if (this.items[category].length === 0) {
                    delete this.items[category];
                }
                
                if (!this.items[newCategory]) {
                    this.items[newCategory] = [];
                }
                this.items[newCategory].push(item);
            }

            StorageService.saveItems(this.items);
            this.renderLists();
        }
    }

    handleCategoryEdit(oldCategory, newCategory) {
        if (oldCategory === newCategory || !this.items[oldCategory]) return;

        // If the new category already exists, merge items
        if (this.items[newCategory]) {
            this.items[newCategory] = [...this.items[newCategory], ...this.items[oldCategory]];
        } else {
            this.items[newCategory] = this.items[oldCategory];
        }

        delete this.items[oldCategory];
        StorageService.saveItems(this.items);
        this.renderLists();
    }
}

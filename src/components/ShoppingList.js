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
        this.setupSpeechRecognition();
    }

    setupEventListeners() {
        document.getElementById('addItem').addEventListener('click', () => this.addItem());
        document.getElementById('itemInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
        document.getElementById('clearAllItems').addEventListener('click', () => this.clearAll());
        document.getElementById('targetLang').addEventListener('change', () => this.updateTranslations());

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

        // Voice input
        this.setupVoiceInput();
    }

    setupVoiceInput() {
        const voiceButton = document.getElementById('voiceInput');
        if (!voiceButton) return;

        this.speechService = new SpeechService((text) => {
            document.getElementById('itemInput').value = text;
            this.addItem();
        });

        if (this.speechService.isSupported()) {
            voiceButton.addEventListener('click', () => {
                this.speechService.start();
                voiceButton.classList.add('animate-pulse');
                voiceButton.querySelector('i').classList.add('text-primary');
            });

            this.speechService.recognition.onend = () => {
                voiceButton.classList.remove('animate-pulse');
                voiceButton.querySelector('i').classList.remove('text-primary');
            };
        } else {
            voiceButton.addEventListener('click', () => {
                alert('Speech recognition is not supported in your browser. Please try using Chrome or Safari.');
            });
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
            onQuantityChange: (category, id, quantity) => this.updateQuantity(category, id, quantity)
        });
    }
}

const categories = {
    'Fruits': {
        keywords: ['apple', 'banana', 'orange', 'grape', 'berry', 'pear', 'peach', 'plum', 'mango', 'kiwi', 'melon']
    },
    'Vegetables': {
        keywords: ['carrot', 'broccoli', 'lettuce', 'tomato', 'potato', 'onion', 'garlic', 'pepper', 'cucumber', 'spinach']
    },
    'Dairy': {
        keywords: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg']
    },
    'Meat & Fish': {
        keywords: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'meat', 'sausage', 'ham']
    },
    'Pantry': {
        keywords: ['rice', 'pasta', 'flour', 'sugar', 'oil', 'vinegar', 'sauce', 'spice', 'herb', 'can', 'bread']
    },
    'Frozen': {
        keywords: ['frozen', 'ice cream', 'pizza', 'vegetables frozen']
    },
    'Household': {
        keywords: ['paper', 'soap', 'detergent', 'cleaner', 'tissue', 'toilet', 'bag']
    },
    'Beverages': {
        keywords: ['water', 'juice', 'soda', 'coffee', 'tea', 'drink']
    }
};

function categorizeItem(item) {
    const itemLower = item.toLowerCase();
    
    for (const [category, data] of Object.entries(categories)) {
        if (data.keywords.some(keyword => itemLower.includes(keyword))) {
            return {
                category
            };
        }
    }
    
    return {
        category: 'Other'
    };
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { categories, categorizeItem };
}

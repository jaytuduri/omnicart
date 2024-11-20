const categories = {
    'Fruits': {
        keywords: ['apple', 'banana', 'orange', 'grape', 'berry', 'pear', 'peach', 'plum', 'mango', 'kiwi', 'melon'],
        icon: '🍎'
    },
    'Vegetables': {
        keywords: ['carrot', 'broccoli', 'lettuce', 'tomato', 'potato', 'onion', 'garlic', 'pepper', 'cucumber', 'spinach'],
        icon: '🥕'
    },
    'Dairy': {
        keywords: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg'],
        icon: '🥛'
    },
    'Meat & Fish': {
        keywords: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'meat', 'sausage', 'ham'],
        icon: '🥩'
    },
    'Pantry': {
        keywords: ['rice', 'pasta', 'flour', 'sugar', 'oil', 'vinegar', 'sauce', 'spice', 'herb', 'can', 'bread'],
        icon: '🥫'
    },
    'Frozen': {
        keywords: ['frozen', 'ice cream', 'pizza', 'vegetables frozen'],
        icon: '❄️'
    },
    'Household': {
        keywords: ['paper', 'soap', 'detergent', 'cleaner', 'tissue', 'toilet', 'bag'],
        icon: '🏠'
    },
    'Beverages': {
        keywords: ['water', 'juice', 'soda', 'coffee', 'tea', 'drink'],
        icon: '🥤'
    }
};

function categorizeItem(item) {
    const itemLower = item.toLowerCase();
    
    for (const [category, data] of Object.entries(categories)) {
        if (data.keywords.some(keyword => itemLower.includes(keyword))) {
            return {
                category,
                icon: data.icon
            };
        }
    }
    
    return {
        category: 'Other',
        icon: '📦'
    };
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { categories, categorizeItem };
}

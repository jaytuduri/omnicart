export function categorizeItem(itemName) {
    const categories = {
        'Fruits & Vegetables': {
            keywords: ['apple', 'banana', 'orange', 'carrot', 'tomato', 'fruit', 'vegetable'],
            icon: 'bx-food-menu'
        },
        'Dairy & Eggs': {
            keywords: ['milk', 'cheese', 'yogurt', 'egg', 'butter', 'cream'],
            icon: 'bx-cheese'
        },
        'Meat & Fish': {
            keywords: ['chicken', 'beef', 'pork', 'fish', 'meat', 'salmon'],
            icon: 'bx-restaurant'
        },
        'Pantry': {
            keywords: ['rice', 'pasta', 'flour', 'sugar', 'oil', 'spice'],
            icon: 'bx-cabinet'
        },
        'Beverages': {
            keywords: ['water', 'juice', 'soda', 'coffee', 'tea', 'drink'],
            icon: 'bx-drink'
        },
        'Household': {
            keywords: ['paper', 'soap', 'detergent', 'cleaner', 'tissue'],
            icon: 'bx-home'
        }
    };

    const lowercaseItem = itemName.toLowerCase();
    
    for (const [category, data] of Object.entries(categories)) {
        if (data.keywords.some(keyword => lowercaseItem.includes(keyword))) {
            return { category, icon: data.icon };
        }
    }

    return { category: 'Other', icon: 'bx-package' };
}

export function categorizeItem(itemName) {
    const categories = {
        'Fruits': {
            keywords: ['apple', 'banana', 'orange', 'grape', 'berry', 'pear', 'peach', 'plum', 'mango', 'kiwi', 'melon', 
                'strawberry', 'blueberry', 'raspberry', 'blackberry', 'pineapple', 'watermelon', 'cantaloupe', 'fig', 'pomegranate', 
                'apricot', 'cherry', 'coconut', 'lime', 'lemon', 'tangerine', 'papaya', 'guava', 'dragonfruit', 'passion fruit']
        },
        'Vegetables': {
            keywords: ['carrot', 'broccoli', 'lettuce', 'tomato', 'potato', 'onion', 'garlic', 'pepper', 'cucumber', 'spinach',
                'celery', 'asparagus', 'zucchini', 'eggplant', 'cabbage', 'cauliflower', 'mushroom', 'corn', 'peas', 'beans',
                'kale', 'radish', 'beet', 'squash', 'pumpkin', 'sweet potato', 'yam', 'brussels sprout', 'artichoke', 'leek',
                'ginger', 'shallot', 'turnip', 'bok choy', 'arugula']
        },
        'Dairy': {
            keywords: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg', 'sour cream', 'cottage cheese', 'mozzarella',
                'cheddar', 'parmesan', 'cream cheese', 'whipped cream', 'buttermilk', 'half and half', 'almond milk',
                'soy milk', 'oat milk', 'coconut milk', 'greek yogurt', 'ricotta', 'gouda', 'brie', 'feta', 'swiss cheese']
        },
        'Meat & Fish': {
            keywords: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'meat', 'sausage', 'ham', 'turkey', 'lamb',
                'shrimp', 'bacon', 'ground beef', 'steak', 'tilapia', 'cod', 'crab', 'lobster', 'duck', 'veal',
                'ribs', 'meatball', 'hot dog', 'salami', 'pepperoni', 'prosciutto', 'anchovy', 'sardine', 'mussels',
                'scallop', 'oyster', 'halibut', 'trout']
        },
        'Pantry': {
            keywords: ['rice', 'pasta', 'flour', 'sugar', 'oil', 'vinegar', 'sauce', 'spice', 'herb', 'can', 'bread',
                'cereal', 'noodle', 'bean', 'lentil', 'quinoa', 'oatmeal', 'honey', 'syrup', 'peanut butter',
                'jam', 'jelly', 'mustard', 'ketchup', 'mayonnaise', 'soy sauce', 'olive oil', 'vegetable oil',
                'salt', 'pepper', 'cinnamon', 'oregano', 'basil', 'thyme', 'curry', 'paprika', 'cumin',
                'baking powder', 'baking soda', 'vanilla', 'chocolate', 'cracker', 'chip', 'nut', 'seed']
        },
        'Frozen': {
            keywords: ['frozen', 'ice cream', 'pizza', 'vegetables frozen', 'frozen dinner', 'frozen meal', 'frozen fruit',
                'frozen fish', 'frozen chicken', 'frozen beef', 'frozen dessert', 'frozen pie', 'frozen waffle',
                'frozen breakfast', 'frozen sandwich', 'frozen burrito', 'frozen pizza', 'popsicle', 'ice', 'sorbet',
                'frozen yogurt', 'frozen appetizer']
        },
        'Household': {
            keywords: ['paper', 'soap', 'detergent', 'cleaner', 'tissue', 'toilet', 'bag', 'trash bag', 'paper towel',
                'dishwasher', 'laundry', 'bleach', 'sponge', 'brush', 'mop', 'broom', 'vacuum', 'air freshener',
                'light bulb', 'battery', 'aluminum foil', 'plastic wrap', 'zip bag', 'storage container',
                'napkin', 'dish soap', 'hand soap', 'shampoo', 'conditioner', 'toothpaste', 'deodorant',
                'lotion', 'sunscreen', 'insect repellent']
        },
        'Beverages': {
            keywords: ['water', 'juice', 'soda', 'coffee', 'tea', 'drink', 'milk', 'beer', 'wine', 'alcohol',
                'sparkling water', 'energy drink', 'sports drink', 'lemonade', 'iced tea', 'hot chocolate',
                'cider', 'smoothie', 'protein shake', 'coconut water', 'kombucha', 'soft drink', 'punch',
                'espresso', 'cappuccino', 'latte', 'green tea', 'black tea', 'herbal tea']
        }
    };

    const lowercaseItem = itemName.toLowerCase();
    
    for (const [category, data] of Object.entries(categories)) {
        if (data.keywords.some(keyword => lowercaseItem.includes(keyword))) {
            return { category };
        }
    }

    return { category: 'Other' };
}

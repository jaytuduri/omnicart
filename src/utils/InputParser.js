export class InputParser {
    static unitMap = {
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

    static units = ['kg', 'g', 'lb', 'lbs', 'oz', 'l', 'ml'];

    static parse(text) {
        let processedText = text.toLowerCase().trim();
        
        // Replace word numbers with digits
        Object.entries(this.unitMap).forEach(([word, num]) => {
            processedText = processedText.replace(new RegExp(`^${word}\\s+`, 'i'), `${num} `);
            processedText = processedText.replace(new RegExp(`\\s+${word}$`, 'i'), ` ${num}`);
        });

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

        // Clean up the item name - remove units
        this.units.forEach(unit => {
            itemName = itemName.replace(new RegExp(`\\s*${unit}\\s*$`, 'i'), '');
        });

        // Capitalize first letter of each word
        itemName = itemName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return { itemName, quantity };
    }
}

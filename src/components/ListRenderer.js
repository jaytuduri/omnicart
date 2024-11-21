export class ListRenderer {
    static render(items, callbacks) {
        const container = document.querySelector('.lists-container');
        container.innerHTML = '';

        Object.entries(items).sort().forEach(([category, categoryItems]) => {
            container.appendChild(this.createCategorySection(category, categoryItems, callbacks));
        });
    }

    static createCategorySection(category, items, { onToggle, onDelete, onQuantityChange }) {
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
            itemsList.appendChild(
                this.createItemElement(category, item, { onToggle, onDelete, onQuantityChange })
            );
        });

        section.appendChild(categoryHeader);
        section.appendChild(itemsList);
        return section;
    }

    static createItemElement(category, item, { onToggle, onDelete, onQuantityChange }) {
        const itemElement = document.createElement('div');
        itemElement.className = `flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded item-hover dark-mode-transition ${item.isNew ? 'new-item' : ''}`;
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.purchased;
        checkbox.className = 'form-checkbox h-5 w-5 text-primary rounded border-gray-300 dark:border-gray-600 focus:ring-primary';
        checkbox.addEventListener('change', () => onToggle(category, item.id));
        itemElement.appendChild(checkbox);

        // Item content
        const itemContent = document.createElement('div');
        itemContent.className = 'flex-1';
        
        // Text container
        const textContainer = document.createElement('div');
        textContainer.className = 'flex flex-col';

        // Item name
        const itemText = document.createElement('span');
        itemText.textContent = item.name;
        if (item.purchased) {
            itemText.className = 'line-through text-gray-500';
        }
        textContainer.appendChild(itemText);

        // Translation
        if (item.translation && item.translation !== item.name) {
            const translationText = document.createElement('span');
            translationText.className = 'text-sm text-gray-500 dark:text-gray-400';
            translationText.textContent = item.translation;
            textContainer.appendChild(translationText);
        }

        itemContent.appendChild(textContainer);
        itemElement.appendChild(itemContent);

        // Quantity input
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.inputMode = 'numeric';
        quantityInput.pattern = '[0-9]*';
        quantityInput.min = '1';
        quantityInput.value = item.quantity;
        quantityInput.className = 'w-16 p-1 text-center rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-primary focus:border-primary';
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = parseInt(e.target.value) || 1;
            onQuantityChange(category, item.id, newQuantity);
        });
        itemElement.appendChild(quantityInput);

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'text-red-500 hover:text-red-700 focus:outline-none ml-2';
        deleteButton.innerHTML = '<i class="iconoir-xmark text-xl"></i>';
        deleteButton.addEventListener('click', () => onDelete(category, item.id));
        itemElement.appendChild(deleteButton);

        return itemElement;
    }
}

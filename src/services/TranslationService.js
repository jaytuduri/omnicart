export class TranslationService {
    static async translate(text, targetLang) {
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
            );
            const data = await response.json();
            return data.responseData.translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Return original text if translation fails
        }
    }

    static async updateTranslations(items, targetLang) {
        for (const category in items) {
            for (const item of items[category]) {
                item.translation = await this.translate(item.name, targetLang);
            }
        }
        return items;
    }
}

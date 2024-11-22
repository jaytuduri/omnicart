# OmniCart - Multilingual Shopping List PWA

A Progressive Web App for creating shopping lists with automatic item categorization and real-time translations.

## Features

- 📱 Progressive Web App (installable on mobile devices)
- 🌍 Real-time item translation
- 📊 Automatic item categorization
- 💾 Offline support
- 🔄 Sync across devices (via LocalStorage)
- 📱 Mobile-first design

## Supported Languages

- English (base)
- Spanish
- French
- German
- Italian
- Portuguese
- Swedish

## Technical Details

- Pure JavaScript (no framework dependencies)
- LocalStorage for data persistence
- Service Worker for offline functionality
- MyMemory Translation API for translations

## Getting Started

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd omnicart
   ```

2. Serve the application:
   ```bash
   # Using Python's built-in server
   python3 -m http.server 8000
   
   # Or using Node's http-server if installed
   npx http-server
   ```

3. Open in browser:
   ```
   http://localhost:8000
   ```

## Project Structure

```
omnicart/
├── index.html          # Main HTML file
├── styles.css          # Styles and layout
├── app.js             # Core application logic
├── sw.js             # Service Worker for offline support
├── manifest.json      # PWA manifest
└── src/              # Source code directory
    ├── components/   # UI components
    ├── models/       # Data models
    ├── services/     # Core services (translation, storage, etc.)
    └── utils/        # Utility functions including category logic
```


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [MyMemory Translation API](https://mymemory.translated.net) for providing translation services
- Icons from Phosphor Icons - [phosphoricons.com](https://phosphoricons.com)

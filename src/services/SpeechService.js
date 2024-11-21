export class SpeechService {
    constructor(onResult) {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                onResult(text);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
        }
    }

    isSupported() {
        return !!this.recognition;
    }

    start() {
        if (this.recognition) {
            try {
                this.recognition.start();
            } catch (e) {
                console.error('Speech recognition error:', e);
            }
        }
    }

    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}

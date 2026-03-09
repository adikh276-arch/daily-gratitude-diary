const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'AIzaSyDgyWwwmHOROsPZclCm-LGzZs_uoYNhVDk';
const LANGUAGES = [
    'en', 'es', 'fr', 'pt', 'de', 'ar', 'hi', 'bn', 'zh', 'ja', 'id', 'tr', 'vi', 'ko', 'ru', 'it', 'pl', 'th', 'tl'
];

const SOURCE_STRINGS = {
    "app_title": "Daily Gratitude Diary",
    "app_subtitle": "Noticing Small Good Things",
    "intro_text_1": "Gratitude does not mean ignoring difficult emotions.",
    "intro_text_2": "It simply means gently noticing moments - big or small - that feel steady, comforting, or meaningful.",
    "intro_text_3": "Some days it may be something very small.",
    "intro_text_italic": "That is enough.",
    "start_button": "Start Today's Entry",
    "grateful_title": "Today, I'm Grateful For...",
    "grateful_step_1": "Think about today.",
    "grateful_step_2": "What is one small thing you appreciate right now?",
    "grateful_step_3": "It can be something simple.",
    "placeholder_grateful": "Today, I'm grateful for...",
    "placeholder_reason": "This matters to me because... (optional)",
    "add_another": "Add Another",
    "continue": "Continue",
    "reflection_title": "Pause and Notice",
    "reflection_text": "When you focus on this moment, what do you notice in yourself?",
    "placeholder_feeling": "When I think about this, I feel...",
    "save_entry": "Save Entry",
    "closing_title": "You Took a Moment",
    "closing_text_1": "Taking time to reflect is an act of care.",
    "closing_text_2": "You can return to this space anytime.",
    "closing_italic": "Even small gratitude counts.",
    "view_past": "View Past Entries",
    "done": "Done",
    "past_entries_title": "Past Entries",
    "no_entries": "No entries yet. Start your first one today.",
    "feeling_label": "Feeling: ",
    "back": "Back",
    "not_found_title": "404",
    "not_found_text": "Oops! Page not found",
    "return_home": "Return to Home"
};

const localesDir = path.join(__dirname, '../src/i18n/locales');

if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
}

async function translateBatch(texts, targetLang) {
    if (targetLang === 'en') {
        const res = {};
        Object.keys(SOURCE_STRINGS).forEach((key, i) => {
            res[key] = texts[i];
        });
        return res;
    }

    const lang = targetLang === 'zh' ? 'zh-CN' : targetLang;

    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            q: texts,
            target: lang,
            format: 'text'
        });

        const options = {
            hostname: 'translation.googleapis.com',
            path: `/language/translate/v2?key=${API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseBody);
                    if (parsed.data && parsed.data.translations) {
                        const result = {};
                        Object.keys(SOURCE_STRINGS).forEach((key, i) => {
                            result[key] = parsed.data.translations[i].translatedText;
                        });
                        resolve(result);
                    } else {
                        console.error(`Error translating to ${targetLang}:`, responseBody);
                        resolve(null);
                    }
                } catch (e) {
                    console.error(`Parse error for ${targetLang}:`, responseBody);
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function generate() {
    const keys = Object.keys(SOURCE_STRINGS);
    const texts = Object.values(SOURCE_STRINGS);

    for (const lang of LANGUAGES) {
        console.log(`Generating translations for ${lang}...`);
        const translations = await translateBatch(texts, lang);
        if (translations) {
            fs.writeFileSync(
                path.join(localesDir, `${lang}.json`),
                JSON.stringify(translations, null, 2),
                'utf8'
            );
            console.log(`Finished ${lang}.`);
        } else {
            console.error(`Failed ${lang}, using English fallback.`);
            fs.writeFileSync(
                path.join(localesDir, `${lang}.json`),
                JSON.stringify(SOURCE_STRINGS, null, 2),
                'utf8'
            );
        }
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 200));
    }
}

generate().catch(console.error);

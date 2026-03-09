import { useTranslation } from 'react-i18next';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect } from 'react';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ko', name: '한국어' },
    { code: 'ru', name: 'Русский' },
    { code: 'it', name: 'Italiano' },
    { code: 'pl', name: 'Polski' },
    { code: 'th', name: 'ไทย' },
    { code: 'tl', name: 'Filipino' },
];

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <Select value={i18n.language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm border-primary/20 rounded-full h-9 shadow-sm hover:border-primary/40 transition-all">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-primary/10 overflow-hidden">
                    {languages.map((lang) => (
                        <SelectItem
                            key={lang.code}
                            value={lang.code}
                            className="focus:bg-primary/10 focus:text-primary cursor-pointer py-2 px-4"
                        >
                            {lang.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default LanguageSelector;

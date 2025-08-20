// context/LanguageContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const languages = {
    en: { label: "English", countryCode: "US" },
    ru: { label: "Русский", countryCode: "RU" },
    uz: { label: "O‘zbekcha", countryCode: "UZ" },
};



const userLabels = {
    ru: { profile: "Профиль", settings: "Настройки", logout: "Выйти", name: "Аббос Ибрагимов" },
    uz: { profile: "Profil", settings: "Sozlamalar", logout: "Chiqish", name: "Abbos Ibragimov" },
    en: { profile: "Profile", settings: "Settings", logout: "Log out", name: "Abbos Ibragimov" },
};



export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("ru"); // default ruscha

    useEffect(() => {
        const savedLang = localStorage.getItem("app-language");
        if (savedLang) setLanguage(savedLang);
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem("app-language", lang);
    };

    const getLabels = () => userLabels[language];

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, languages, getLabels }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

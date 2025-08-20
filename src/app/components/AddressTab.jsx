"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function AddressTab({ inputStyle, clubId }) {
    const { language } = useLanguage();
    const [countryName, setCountryName] = useState("");
    const [cityName, setCityName] = useState("");
    const [streetName, setStreetName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [message, setMessage] = useState(null);
    const [isExisting, setIsExisting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Tilga qarab matnlar
    const texts = {
        uz: {
            title: "Adres ma'lumotlari",
            country: "Davlat",
            city: "Shahar / Hudud",
            street: "Ko‘cha nomi",
            district: "Tuman",
            lat: "Kenglik",
            long: "Uzunlik",
            save: "Saqlash",
            noClub: "❌ clubId yoki token yo‘q",
            notFound: "ℹ️ Ma'lumotlar topilmadi. Yangi ma'lumot kiriting.",
            success: "✅ Ma'lumotlar muvaffaqiyatli yuborildi.",
            error: "❌ Xatolik",
            serverError: "❌ Server bilan bog‘lanishda xatolik yuz berdi.",
        },
        ru: {
            title: "Адресные данные",
            country: "Страна",
            city: "Город / Район",
            street: "Название улицы",
            district: "Район",
            lat: "Широта",
            long: "Долгота",
            save: "Сохранить",
            noClub: "❌ clubId или токен отсутствует",
            notFound: "ℹ️ Данные не найдены. Введите новые.",
            success: "✅ Данные успешно отправлены.",
            error: "❌ Ошибка",
            serverError: "❌ Ошибка соединения с сервером.",
        },
        en: {
            title: "Address Information",
            country: "Country",
            city: "City / Region",
            street: "Street Name",
            district: "District",
            lat: "Latitude",
            long: "Longitude",
            save: "Save",
            noClub: "❌ clubId or token missing",
            notFound: "ℹ️ No data found. Please enter new information.",
            success: "✅ Data submitted successfully.",
            error: "❌ Error",
            serverError: "❌ Server connection error.",
        },
    };

    const t = texts[language];

    // API orqali ma’lumot olish
    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!clubId || !token) {
            setMessage(t.noClub);
            setLoading(false);
            return;
        }

        const fetchAddress = async () => {
            try {
                const response = await fetch(
                    `http://backend.gamefit.uz/address?id=${clubId}&lang=${language}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();
                console.log("✅ API javobi:", data);

                if (response.ok && data?.content) {
                    const a = data.content;
                    setCountryName(a.countryName || "");
                    setCityName(a.cityName || "");
                    setStreetName(a.streetName || "");
                    setDistrictName(a.districtName || "");
                    setLatitude(a.latitude?.toString() || "");
                    setLongitude(a.longitude?.toString() || "");
                    setIsExisting(true);
                    setMessage(null);
                } else {
                    setIsExisting(false);
                    setMessage(t.notFound);
                }
            } catch (error) {
                console.error("❌ Fetch error:", error);
                setMessage(t.serverError);
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, [clubId, language]);

    // Yangi ma’lumot yuborish
    const handleSubmit = async () => {
        const token = localStorage.getItem("accessToken");

        if (!clubId || !token) {
            alert(t.noClub);
            return;
        }

        const data = {
            clubId: Number(clubId),
            countryName,
            cityName,
            streetName,
            districtName,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            lang: language,
        };

        console.log("📤 Yuborilayotgan ma'lumotlar:", data);

        try {
            const res = await fetch("http://backend.gamefit.uz/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            console.log("📥 API javobi:", result);

            if (res.ok) {
                setMessage(t.success);
                setIsExisting(true);
            } else {
                setMessage(t.error + ": " + (result.message || "Unknown error"));
            }
        } catch (err) {
            console.error("❌ Yuborishda xatolik:", err);
            setMessage(t.serverError);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ color: "#f0f0f0", fontSize: "16px" }}>{t.title}</h2>

            <input
                type="text"
                placeholder={t.country}
                style={inputStyle}
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
            />
            <input
                type="text"
                placeholder={t.city}
                style={inputStyle}
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
            />
            <input
                type="text"
                placeholder={t.street}
                style={inputStyle}
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
            />
            <input
                type="text"
                placeholder={t.district}
                style={inputStyle}
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
            />
            <input
                type="text"
                placeholder={t.lat}
                style={inputStyle}
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
            />
            <input
                type="text"
                placeholder={t.long}
                style={inputStyle}
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
            />

            {!loading && !isExisting && (
                <button
                    onClick={handleSubmit}
                    style={{
                        marginTop: "12px",
                        background: "#4aa8ff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px",
                        color: "#fff",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                >
                    {t.save}
                </button>
            )}

            {message && (
                <div
                    style={{
                        marginTop: "10px",
                        color: message.startsWith("✅")
                            ? "#4caf50"
                            : message.startsWith("❌")
                                ? "red"
                                : "orange",
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
}

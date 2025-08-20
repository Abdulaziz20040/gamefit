"use client";

import React, { useState, useEffect } from "react";
import { FaChartBar, FaStar, FaTrophy, FaRegEdit } from "react-icons/fa";
import EditTariff from "./EditTariff";
import { useLanguage } from "../context/LanguageContext";
import { API } from "@/config/api";

export default function TariffsTab({ clubId }) {
    const { language } = useLanguage(); // tanlangan til (uz, ru, en)
    const [tariffs, setTariffs] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    // Ikonkalar
    const serviceIcons = {
        0: <FaChartBar />,
        1: <FaStar />,
        2: <FaTrophy />,
    };

    // Nomi 3 tilda
    const serviceNames = {
        ru: {
            0: "Стандарт",
            1: "Премиум",
            2: "ВИП",
        },
        uz: {
            0: "Standart",
            1: "Premium",
            2: "VIP",
        },
        en: {
            0: "Standard",
            1: "Premium",
            2: "VIP",
        },
    };

    // API dan tariflar olish
    useEffect(() => {
        const fetchTariffs = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.warn("Token topilmadi");
                    return;
                }

                const data = await API.getClubFutures({ clubId, lang: language, accessToken: token });

                const sortedTariffs = [0, 1, 2].map((index) => {
                    const found = data.find((t) => t.serviceNameIndex === index);
                    return {
                        id: found?.id || null,
                        serviceNameIndex: index,
                        name: serviceNames[language][index], // tilga qarab nomlanadi
                        icon: serviceIcons[index],
                        active: Boolean(found),
                    };
                });

                setTariffs(sortedTariffs);
            } catch (err) {
                console.error("❌ fetchTariffs error:", err);
            }
        };

        fetchTariffs();
    }, [clubId, language]);


    // Edit bosilganda EditTariff sahifasiga o'tish
    if (editingIndex !== null) {
        const editingTariff = tariffs.find(t => t.serviceNameIndex === editingIndex);
        return (
            <EditTariff
                clubId={clubId}
                serviceNameIndex={editingIndex}
                tariffId={editingTariff?.id}
                onBack={() => setEditingIndex(null)}
            />
        );
    }

    // Switch toggle (faqat UI ichida)
    const toggleTariff = (id) => {
        setTariffs((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, active: !t.active } : t
            )
        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {tariffs.map((tariff) => (
                <div
                    key={tariff.serviceNameIndex}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#151520",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        opacity: tariff.active ? 1 : 0.4,
                    }}
                >
                    {/* Chap tomonda icon + nom */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ color: "#00BFFF", fontSize: "20px" }}>
                            {tariff.icon}
                        </span>
                        <span
                            style={{
                                color: tariff.active ? "#00BFFF" : "#aaa",
                                fontSize: "16px",
                            }}
                        >
                            {tariff.name}
                        </span>
                    </div>

                    <div className=" flex items-center gap-4">
                        {/* Edit icon */}
                        <div
                            style={{
                                color: tariff.active ? "#00BFFF" : "#555",
                                fontSize: "18px",
                                cursor: tariff.active ? "pointer" : "not-allowed",
                                opacity: tariff.active ? 1 : 0.5,
                            }}
                            onClick={() => {
                                if (tariff.active) {
                                    setEditingIndex(tariff.serviceNameIndex);
                                }
                            }}
                        >
                            <FaRegEdit />
                        </div>


                        {/* Switch tugma */}
                        <div
                            onClick={() => toggleTariff(tariff.id)}
                            style={{
                                width: "40px",
                                height: "20px",
                                background: tariff.active ? "#00BFFF" : "#555",
                                borderRadius: "20px",
                                position: "relative",
                                cursor: "pointer",
                                transition: "0.3s",
                            }}
                        >
                            <div
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    background: "#222",
                                    borderRadius: "50%",
                                    position: "absolute",
                                    top: "2px",
                                    left: tariff.active ? "22px" : "2px",
                                    transition: "0.3s",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

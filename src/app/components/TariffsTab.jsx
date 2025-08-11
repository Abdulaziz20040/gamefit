"use client";

import React, { useState, useEffect } from "react";
import { FaChartBar, FaStar, FaTrophy, FaRegEdit } from "react-icons/fa";
import EditTariff from "./EditTariff";

export default function TariffsTab({ clubId }) {
    const [tariffs, setTariffs] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null); // 0,1,2 saqlanadi

    // Ikonkalar va nomlar
    const serviceIcons = {
        0: <FaChartBar />,
        1: <FaStar />,
        2: <FaTrophy />,
    };
    const serviceNames = {
        0: "Standart",
        1: "Premium",
        2: "VIP",
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

                const res = await fetch(
                    `http://backend.gamefit.uz/club-futures/by-club?clubId=${clubId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();

                if (data.success && Array.isArray(data.content)) {
                    // Har doim 0,1,2 bo‘yicha ro‘yxat yasash
                    const sortedTariffs = [0, 1, 2].map((index) => {
                        const found = data.content.find((t) => t.serviceNameIndex === index);
                        return {
                            id: found?.id || null,
                            serviceNameIndex: index,
                            name: serviceNames[index],
                            icon: serviceIcons[index],
                            active: Boolean(found), // topilsa active = true
                        };
                    });
                    setTariffs(sortedTariffs);
                } else {
                    console.error("API noto‘g‘ri format qaytardi:", data);
                }
            } catch (err) {
                console.error("Tariff fetch error:", err);
            }
        };

        fetchTariffs();
    }, [clubId]);

    // Edit bosilganda EditTariff sahifasiga o'tish
    if (editingIndex !== null) {
        const editingTariff = tariffs.find(t => t.serviceNameIndex === editingIndex);
        return (
            <EditTariff
                clubId={clubId}
                serviceNameIndex={editingIndex} // 0,1,2 yuboriladi
                tariffId={editingTariff?.id} // agar yo‘q bo‘lsa null
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

                    {/* Edit icon */}
                    <div
                        style={{ color: "#00BFFF", fontSize: "18px", cursor: "pointer" }}
                        onClick={() => setEditingIndex(tariff.serviceNameIndex)}
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
            ))}
        </div>
    );
}

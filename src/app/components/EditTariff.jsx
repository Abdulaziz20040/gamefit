"use client";

import React, { useEffect, useState } from "react";
import { Card, Input, Typography, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLanguage } from "../context/LanguageContext";

const { Title, Text } = Typography;

export default function EditTariff({ clubId, serviceNameIndex, onBack }) {
    const { language } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [tariff, setTariff] = useState(null);

    // Tariff fieldlari tillar bo‘yicha
    const fieldsByLang = {
        ru: [
            { key: "cpu", label: "Процессор (CPU)" },
            { key: "gpu", label: "Видеокарта (GPU)" },
            { key: "storage", label: "Хранилище (SSD / HDD)" },
            { key: "ram", label: "Оперативная память (RAM)" },
            { key: "keyboard", label: "Клавиатура" },
            { key: "mouse", label: "Мышь" },
            { key: "monitor", label: "Монитор" },
            { key: "headPhones", label: "Наушники" },
            { key: "hourlyPrice", label: "Почасовая цена (сум)" },
        ],
        uz: [
            { key: "cpu", label: "Protsessor (CPU)" },
            { key: "gpu", label: "Videokarta (GPU)" },
            { key: "storage", label: "Xotira (SSD / HDD)" },
            { key: "ram", label: "Operativ xotira (RAM)" },
            { key: "keyboard", label: "Klaviatura" },
            { key: "mouse", label: "Sichqoncha" },
            { key: "monitor", label: "Monitor" },
            { key: "headPhones", label: "Quloqchin" },
            { key: "hourlyPrice", label: "Soatbay narx (so‘m)" },
        ],
        en: [
            { key: "cpu", label: "Processor (CPU)" },
            { key: "gpu", label: "Graphics Card (GPU)" },
            { key: "storage", label: "Storage (SSD / HDD)" },
            { key: "ram", label: "Memory (RAM)" },
            { key: "keyboard", label: "Keyboard" },
            { key: "mouse", label: "Mouse" },
            { key: "monitor", label: "Monitor" },
            { key: "headPhones", label: "Headphones" },
            { key: "hourlyPrice", label: "Hourly Price (UZS)" },
        ],
    };

    // Tariff nomlari
    const serviceNameMap = {
        ru: { 0: "Стандарт", 1: "Премиум", 2: "ВИП" },
        uz: { 0: "Standart", 1: "Premium", 2: "VIP" },
        en: { 0: "Standard", 1: "Premium", 2: "VIP" },
    };

    // Back tugmasi
    const backText = {
        ru: "Назад",
        uz: "Orqaga",
        en: "Back",
    };

    const fields = fieldsByLang[language] || fieldsByLang["ru"];

    useEffect(() => {
        const fetchTariff = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.error("Token topilmadi");
                    return;
                }

                const res = await fetch(
                    `http://backend.gamefit.uz/club-futures/by-club?clubId=${clubId}&lang=${language}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (data.success && Array.isArray(data.content)) {
                    const found = data.content.find(
                        (t) => t.serviceNameIndex === serviceNameIndex
                    );

                    setTariff(
                        found || {
                            serviceNameIndex,
                            ...fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}),
                        }
                    );
                } else {
                    setTariff({
                        serviceNameIndex,
                        ...fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}),
                    });
                }
            } catch (err) {
                console.error("Tariff fetch error:", err);
                setTariff({
                    serviceNameIndex,
                    ...fields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {}),
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTariff();
    }, [clubId, serviceNameIndex, language]);

    if (loading) {
        return (
            <div
                style={{
                    background: "#0F111A",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", padding: 10 }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
                {/* Back */}
                <div className=" flex gap-4 items-center" style={{
                    marginBottom: "20px"

                }}

                    onClick={onBack}
                >
                    <ArrowLeftOutlined className=" cursor-pointer" />
                    <span>{backText[language]}</span>
                </div>

                <div
                    title={
                        <Title level={4} style={{ color: "#00C3FF", margin: 0 }}>
                            💻 {serviceNameMap[language][tariff.serviceNameIndex] || "Tariff"}
                        </Title>
                    }
                    style={{
                        background: "#131624",
                        color: "white",
                        marginBottom: 24,
                        borderRadius: 12,
                        padding: "10px"
                    }}
                    headStyle={{ borderBottom: "1px solid #3A3D4A" }}
                >
                    {fields.map((field) => (
                        <div key={field.key} style={{ marginBottom: 16 }}>
                            <Text style={{ color: "#A3A3A3" }}>{field.label}</Text>
                            <Input
                                value={tariff[field.key]}
                                readOnly
                                style={{
                                    marginTop: 4,
                                    background: "transparent",
                                    border: "1px solid #3A3D4A",
                                    color: "white",
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { Card, Input, Typography, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function EditTariff({ clubId, serviceNameIndex, onBack }) {
    const [loading, setLoading] = useState(true);
    const [tariff, setTariff] = useState(null);

    const fields = [
        { key: "cpu", label: "Процессор (CPU)" },
        { key: "gpu", label: "Видеокарта (GPU)" },
        { key: "storage", label: "Хранилище (SSD / HDD)" },
        { key: "ram", label: "Оперативная память (RAM)" },
        { key: "keyboard", label: "Клавиатура" },
        { key: "mouse", label: "Мышь" },
        { key: "monitor", label: "Монитор" },
        { key: "headPhones", label: "Наушники" },
        { key: "hourlyPrice", label: "Почасовая цена (сум)" },
    ];

    const serviceNameMap = {
        0: "Standart",
        1: "Premium",
        2: "VIP",
    };

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
                    `http://backend.gamefit.uz/club-futures/by-club?clubId=${clubId}`,
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

                    // Agar topilmasa ham bo‘sh forma ochamiz
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
    }, [clubId, serviceNameIndex]);

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
        <div style={{ background: "#0F111A", minHeight: "100vh", padding: 24 }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
                {/* Back */}
                <div
                    style={{
                        color: "#A3A3A3",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        marginBottom: 24,
                        fontSize: 16,
                    }}
                    onClick={onBack}
                >
                    <ArrowLeftOutlined />
                    <span>Назад</span>
                </div>

                <Card
                    title={
                        <Title level={4} style={{ color: "#00C3FF", margin: 0 }}>
                            💻 {serviceNameMap[tariff.serviceNameIndex] || "Тариф"}
                        </Title>
                    }
                    style={{
                        background: "#131624",
                        color: "white",
                        marginBottom: 24,
                        borderRadius: 12,
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
                </Card>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import dayjs from "dayjs";
import {
    UserOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
    FileTextOutlined,
    DollarOutlined,
    AppstoreOutlined,
} from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";
import RoomTable from "./RoomTable";
import AccountTab from "@/app/components/AccountTab";
import AddressTab from "@/app/components/AddressTab";
import PaymentTab from "@/app/components/PaymentTab";
import RequisitesTab from "@/app/components/RequisitesTab";
import TariffsTab from "@/app/components/TariffsTab";


export default function Page() {
    const [activeTab, setActiveTab] = useState("account");
    const [status, setStatus] = useState(true);
    const [date, setDate] = useState(dayjs("2025-07-14"));
    const [activeTariffs, setActiveTariffs] = useState([]);

    const tabs = [
        { key: "account", label: "Аккаунт", icon: <UserOutlined /> },
        { key: "address", label: "Адрес", icon: <EnvironmentOutlined /> },
        { key: "payment", label: "Платёж", icon: <CreditCardOutlined /> },
        { key: "requisites", label: "Реквизиты", icon: <FileTextOutlined /> },
        { key: "tariffs", label: "Тарифы", icon: <DollarOutlined /> },
        { key: "layout", label: "Рассадка", icon: <AppstoreOutlined /> },
    ];

    const inputStyle = {
        width: "100%",
        height: "42px",
        background: "#141421",
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "0 12px",
        color: "#f0f0f0",
        fontSize: "14px",
        outline: "none",
    };

    const textareaStyle = {
        width: "100%",
        background: "#141421",
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "10px 12px",
        color: "#f0f0f0",
        fontSize: "14px",
        outline: "none",
    };
    const paginationBtnStyle = {
        background: "transparent",
        color: "#ccc",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
    };


    /** Ong paneldagi kontentlarni alohida ko‘rsatish */
    const renderContent = () => {
        switch (activeTab) {
            case "account":
                return (
                    <AccountTab date={date} setDate={setDate} status={status} setStatus={setStatus} inputStyle={inputStyle} />
                );

            case "address":
                return (
                    <AddressTab inputStyle={inputStyle} />

                );

            case "payment":
                return (
                    <PaymentTab />

                );

            case "requisites":
                return (
                    <RequisitesTab inputStyle={inputStyle} />
                );

            case "tariffs":
                return (
                    <TariffsTab activeTariffs={activeTariffs} setActiveTariffs={setActiveTariffs} clubId={clubId} />

                );

            case "layout":
                return (
                    <RoomTable />
                );

            default:
                return (
                    <div style={{ textAlign: "center", color: "#888" }}>
                        Tanlangan tab bo‘yicha kontent yo‘q
                    </div>
                );
        }
    };

    return (
        <div
            style={{
                minHeight: "87vh",
                color: "#f0f0f0",
                padding: "24px 32px",
                fontFamily: "sans-serif",
            }}
        >
            {/* bu yerga ichki content */}

            <h1 style={{ fontSize: "20px", marginBottom: "24px" }}>
                Игроклубы / Настройки
            </h1>


            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr 7fr", gap: "18px" }}>
                {/* Chap panel */}
                <div
                    style={{
                        background: "#0F0F1A",
                        borderRadius: "12px",
                        border: "1px solid #333",
                        padding: "18px",
                    }}
                >
                    {/* Актив + edit icon */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span style={{ color: "#4caf50", fontSize: "14px" }}>Актив</span>
                        <FaRegEdit
                            style={{
                                fontSize: "16px",
                                color: "#4aa8ff",
                                cursor: "pointer",
                                transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.target.style.color = "#66c2ff")}
                            onMouseLeave={(e) => (e.target.style.color = "#4aa8ff")}
                            onClick={() => alert("Chap panel statusini tahrirlash")}
                        />
                    </div>

                    <div
                        style={{
                            width: "100%",
                            height: "150px",
                            background: "#141421",
                            borderRadius: "10px",
                            marginTop: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            color: "#aaa",
                        }}
                    >
                        Club Image
                    </div>
                    <input
                        type="text"
                        defaultValue="Trillion"
                        placeholder="Игроклуб"
                        style={{ ...inputStyle, marginTop: "14px" }}
                    />
                    <textarea
                        defaultValue="Trillion"
                        placeholder="Описание"
                        rows="3"
                        style={{ ...textareaStyle, marginTop: "14px" }}
                    />
                    <input
                        type="text"
                        defaultValue="Sergeli"
                        placeholder="Филиал"
                        style={{ ...inputStyle, marginTop: "14px" }}
                    />
                    <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                        <input type="time" defaultValue="02:00" style={inputStyle} />
                        <input type="time" defaultValue="02:00" style={inputStyle} />
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                        {["Standart", "Premium", "VIP"].map((tariff) => (
                            <button
                                key={tariff}
                                onClick={() =>
                                    setActiveTariffs((prev) =>
                                        prev.includes(tariff)
                                            ? prev.filter((t) => t !== tariff)
                                            : [...prev, tariff]
                                    )
                                }
                                style={{
                                    flex: 1,
                                    height: "42px",
                                    borderRadius: "8px",
                                    border: activeTariffs.includes(tariff)
                                        ? "1px solid #4aa8ff"
                                        : "1px solid #444",
                                    background: activeTariffs.includes(tariff) ? "#2b2c32" : "transparent",
                                    color: activeTariffs.includes(tariff) ? "#4aa8ff" : "#ddd",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    transition: "all 0.3s",
                                }}
                            >
                                {tariff}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabs panel */}
                <div
                    style={{
                        background: "#0F0F1A",
                        borderRadius: "12px",
                        border: "1px solid #333",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                background: activeTab === tab.key ? "#2b2c32" : "transparent",
                                border: activeTab === tab.key ? "1px solid #4aa8ff" : "none",
                                borderRadius: "8px",
                                color: activeTab === tab.key ? "#4aa8ff" : "#ddd",
                                padding: "10px 12px",
                                textAlign: "left",
                                fontSize: "14px",
                                cursor: "pointer",
                                transition: "all 0.3s",
                            }}
                        >
                            <span style={{ fontSize: "16px" }}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Ong content panel */}
                <div className="no-scrollbar"
                    style={{
                        background: "#0F0F1A",
                        borderRadius: "12px",
                        border: "1px solid #333",
                        padding: "22px",
                        overflow: "auto", height: "570px",
                    }}
                >
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

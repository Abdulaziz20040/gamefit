"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import {
    UserOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    DollarOutlined,
    AppstoreOutlined,
} from "@ant-design/icons";
import { FaRegEdit } from "react-icons/fa";

import AccountTab from "@/app/components/AccountTab";
import AddressTab from "@/app/components/AddressTab";
import RequisitesTab from "@/app/components/RequisitesTab";
import TariffsTab from "@/app/components/TariffsTab";
import RoomTable from "../settings/RoomTable";
import { useLanguage } from "@/app/context/LanguageContext";
import { API } from "@/config/api";

// === Labels uch tilda ===
const labels = {
    ru: {
        title: "Игроклубы / Настройки",
        active: "Актив",
        inactive: "Неактив",
        club: "Игроклуб",
        description: "Описание",
        branch: "Филиал",
        workTime: "Рабочее время",
        tabs: {
            account: "Аккаунт",
            address: "Адрес",
            requisites: "Реквизиты",
            tariffs: "Тарифы",
            layout: "Рассадка",
        },
        loading: "⏳ Загрузка...",
        error: "❌ Ошибка:",
        notFound: "Данные не найдены",
    },
    uz: {
        title: "Game Club / Sozlamalar",
        active: "Faol",
        inactive: "Faol emas",
        club: "Game Club",
        description: "Tavsif",
        branch: "Filial",
        workTime: "Ish vaqti",
        tabs: {
            account: "Profil",
            address: "Manzil",
            requisites: "Rekvizitlar",
            tariffs: "Tariflar",
            layout: "Joylashuv",
        },
        loading: "⏳ Yuklanmoqda...",
        error: "❌ Xato:",
        notFound: "Ma'lumot topilmadi",
    },
    en: {
        title: "Game Club / Settings",
        active: "Active",
        inactive: "Inactive",
        club: "Game Club",
        description: "Description",
        branch: "Branch",
        workTime: "Working hours",
        tabs: {
            account: "Account",
            address: "Address",
            requisites: "Requisites",
            tariffs: "Tariffs",
            layout: "Layout",
        },
        loading: "⏳ Loading...",
        error: "❌ Error:",
        notFound: "No data found",
    },
};

export default function Page() {
    const { id } = useParams();
    const { language } = useLanguage(); // 🔥 Foydalanuvchi tanlagan til
    const t = labels[language]; // 🔥 Tarjimalar

    const [activeTab, setActiveTab] = useState("account");
    const [status, setStatus] = useState(true);
    const [date, setDate] = useState(dayjs());
    const [activeTariffs, setActiveTariffs] = useState([]);
    const [clubData, setClubData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("Token mavjud emas. Iltimos, tizimga qayta kiring.");
                }

                const data = await API.getGameClubById({ id, accessToken: token });

                if (data) {
                    setClubData(data);
                } else {
                    throw new Error("API javobida content topilmadi");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (id) {
            localStorage.setItem("gameclubId", id);
        }
    }, [id]);

    const tabs = [
        { key: "account", label: t.tabs.account, icon: <UserOutlined /> },
        { key: "address", label: t.tabs.address, icon: <EnvironmentOutlined /> },
        { key: "requisites", label: t.tabs.requisites, icon: <FileTextOutlined /> },
        { key: "tariffs", label: t.tabs.tariffs, icon: <DollarOutlined /> },
        { key: "layout", label: t.tabs.layout, icon: <AppstoreOutlined /> },
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

    const renderContent = () => {
        switch (activeTab) {
            case "account":
                return <AccountTab date={date} setDate={setDate} clubId={id} status={status} setStatus={setStatus} inputStyle={inputStyle} language={language} />;
            case "address":
                return <AddressTab inputStyle={inputStyle} clubId={id} language={language} />;
            case "requisites":
                return <RequisitesTab inputStyle={inputStyle} clubId={id} language={language} />;
            case "tariffs":
                return <TariffsTab activeTariffs={activeTariffs} setActiveTariffs={setActiveTariffs} clubId={id} language={language} />;
            case "layout":
                return <RoomTable language={language} clubId={id} />;
            default:
                return <div style={{ textAlign: "center", color: "#888" }}>No content</div>;
        }
    };

    if (loading) return <div style={{ padding: "24px", color: "#fff" }}>{t.loading}</div>;
    if (error) return <div style={{ padding: "24px", color: "red" }}>{t.error} {error}</div>;
    if (!clubData) return <div style={{ padding: "24px", color: "#fff" }}>{t.notFound}</div>;

    return (
        <div style={{ minHeight: "87vh", color: "#f0f0f0", padding: "24px 32px", fontFamily: "sans-serif" }}>
            <h1 style={{ fontSize: "20px", marginBottom: "24px" }}>{t.title}</h1>

            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr 7fr", gap: "18px" }}>
                {/* Chap panel */}
                <div style={{ background: "#0F0F1A", borderRadius: "12px", border: "1px solid #333", padding: "18px" }}>
                    {/* Status */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ color: clubData.statusIndex === 0 ? "#4caf50" : "#f44336", fontSize: "14px" }}>
                            {clubData.statusIndex === 0 ? t.active : t.inactive}
                        </span>
                        <FaRegEdit style={{ fontSize: "16px", color: "#4aa8ff", cursor: "pointer" }} />
                    </div>

                    {/* Image */}
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
                            overflow: "hidden",
                        }}
                    >
                        {clubData.fileGameClubs?.length > 0 ? (
                            <img
                                src={clubData.fileGameClubs[0]?.contentUrl}
                                alt={clubData.title || "Club Image"}
                                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                            />
                        ) : (
                            <span style={{ color: "#aaa", fontSize: "14px" }}>Club Image</span>
                        )}
                    </div>

                    {/* Title */}
                    <label style={{ fontSize: "12px", color: "#888", marginTop: "14px", display: "block" }}>
                        {t.club}
                    </label>
                    <input type="text" value={clubData.title || ""} readOnly style={{ ...inputStyle }} />

                    {/* Description */}
                    <label style={{ fontSize: "12px", color: "#888", marginTop: "14px", display: "block" }}>
                        {t.description}
                    </label>
                    <textarea value={clubData.description || ""} readOnly rows="3" style={{ ...textareaStyle }} />

                    {/* Branch */}
                    <label style={{ fontSize: "12px", color: "#888", marginTop: "14px", display: "block" }}>
                        {t.branch}
                    </label>
                    <input type="text" value={clubData.clubBranch || ""} readOnly style={{ ...inputStyle }} />

                    {/* Time */}
                    <label style={{ fontSize: "12px", color: "#888", marginTop: "14px", display: "block" }}>
                        {t.workTime}
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input type="time" value={clubData.startAt ? clubData.startAt.slice(0, 5) : ""} readOnly style={inputStyle} />
                        <input type="time" value={clubData.endAt ? clubData.endAt.slice(0, 5) : ""} readOnly style={inputStyle} />
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
                <div
                    className="no-scrollbar"
                    style={{
                        background: "#0F0F1A",
                        borderRadius: "12px",
                        border: "1px solid #333",
                        padding: "22px",
                        overflow: "auto",
                        height: "570px",
                    }}
                >
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

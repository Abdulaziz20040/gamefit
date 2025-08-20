"use client";

import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function AccountTab({ inputStyle, clubId, language }) {
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [date, setDate] = useState(null);
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isExisting, setIsExisting] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 🌍 Tarjima matnlari
    const translations = {
        ru: {
            username: "Пользователь",
            fullName: "Имя",
            password: "Пароль",
            selectDate: "Выберите дату",
            status: "Статус",
            active: "Актив",
            inactive: "Неактив",
            save: "Сохранить",
            saving: "Сохраняется...",
            fillAll: "Заполните все поля!",
            success: "✅ Аккаунт успешно создан!",
            duplicate: "❌ Этот username уже существует!",
            error: "❌ Ошибка сохранения",
            checking: "⏳ Проверка...",
        },
        uz: {
            username: "Foydalanuvchi",
            fullName: "Ism",
            password: "Parol",
            selectDate: "Sanani tanlang",
            status: "Holat",
            active: "Faol",
            inactive: "Faol emas",
            save: "Saqlash",
            saving: "Saqlanmoqda...",
            fillAll: "Barcha maydonlarni to‘ldiring!",
            success: "✅ Akkaunt muvaffaqiyatli yaratildi!",
            duplicate: "❌ Bu username allaqachon mavjud!",
            error: "❌ Saqlashda xatolik",
            checking: "⏳ Tekshirilmoqda...",
        },
        en: {
            username: "Username",
            fullName: "Full Name",
            password: "Password",
            selectDate: "Select Date",
            status: "Status",
            active: "Active",
            inactive: "Inactive",
            save: "Save",
            saving: "Saving...",
            fillAll: "Please fill all fields!",
            success: "✅ Account created successfully!",
            duplicate: "❌ This username already exists!",
            error: "❌ Error while saving",
            checking: "⏳ Checking...",
        },
    };

    const t = translations[language] || translations.ru;

    // 🔄 Ma'lumotlarni yuklab olish
    useEffect(() => {
        const fetchAccount = async () => {
            if (!clubId) return;
            setFetching(true);
            try {
                const res = await fetch(
                    `http://backend.gamefit.uz/club-account/by-club-id?clubId=${clubId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );

                const data = await res.json();
                console.log("📥 Kelgan ma'lumot:", data);

                if (res.ok && data?.content) {
                    const a = data.content;
                    setUsername(a.username || "");
                    setFullName(a.fullName || "");
                    setDate(dayjs(a.addedAt));
                    setStatus(a.statusIndex === 1);
                    setIsExisting(true);
                } else {
                    setIsExisting(false);
                }
            } catch (error) {
                console.error("❌ Fetch xatosi:", error);
                setIsExisting(false);
            } finally {
                setFetching(false);
            }
        };

        fetchAccount();
    }, [clubId]);

    // 📝 Akkaunt saqlash
    const handleSave = async () => {
        if (!username || !fullName || !password || !date) {
            alert(t.fillAll);
            return;
        }

        const payload = {
            gameClubId: Number(clubId),
            fullName: fullName.trim(),
            username: username.trim(),
            password: password.trim(),
            addedAt: dayjs(date).format("YYYY-MM-DD"),
            status: status ? 1 : 0,
        };

        console.log("📤 Yuborilayotgan ma'lumot:", payload);
        setLoading(true);

        try {
            const res = await fetch("http://backend.gamefit.uz/club-account", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("✅ Yuborilgan javob:", data);

            if (res.ok) {
                alert(t.success);
                setPassword("");
                setIsExisting(true);
            } else {
                if (data.message === "Account already exists") {
                    alert(t.duplicate);
                } else {
                    alert(`${t.error}: ${data.message || "Unknown error"}`);
                }
            }
        } catch (error) {
            console.error("❌ POST xatosi:", error);
            alert(t.error);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div style={{ color: "#aaa" }}>{t.checking}</div>;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <input
                type="text"
                placeholder={t.username}
                style={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isExisting}
            />

            <input
                type="text"
                placeholder={t.fullName}
                style={inputStyle}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isExisting}
            />

            <input
                type="password"
                placeholder={t.password}
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isExisting}
            />

            <DatePicker
                style={inputStyle}
                placeholder={t.selectDate}
                format="YYYY-MM-DD"
                value={date}
                onChange={(val) => setDate(val)}
                disabled={isExisting}
            />

            {/* Status toggle */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                }}
            >
                <span style={{ fontSize: "14px", color: "#ccc" }}>{t.status}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: status ? "#4caf50" : "#f44336",
                        }}
                    >
                        {status ? t.active : t.inactive}
                    </span>
                    <div
                        onClick={() => !isExisting && setStatus(!status)}
                        style={{
                            width: "38px",
                            height: "20px",
                            borderRadius: "20px",
                            background: status ? "#4caf50" : "#555",
                            position: "relative",
                            cursor: isExisting ? "not-allowed" : "pointer",
                            transition: "background 0.3s",
                        }}
                    >
                        <div
                            style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: "#fff",
                                position: "absolute",
                                top: "2px",
                                left: status ? "20px" : "2px",
                                transition: "left 0.3s",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Save button */}
            {!isExisting && (
                <button
                    onClick={handleSave}
                    disabled={loading}
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        background: "#1e88e5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    {loading ? t.saving : t.save}
                </button>
            )}
        </div>
    );
}

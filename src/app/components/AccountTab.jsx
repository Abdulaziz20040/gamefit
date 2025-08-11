"use client";

import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

export default function AccountTab({ inputStyle, clubId }) {
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [date, setDate] = useState(null);
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isExisting, setIsExisting] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 🔄 Ma'lumotlarni yuklab olish
    useEffect(() => {
        const fetchAccount = async () => {
            if (!clubId) return;
            setFetching(true);
            try {
                const res = await fetch(`http://backend.gamefit.uz/club-account/by-club-id?clubId=${clubId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });

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
            alert("Barcha maydonlarni to‘ldiring!");
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
                alert("✅ Akkaunt muvaffaqiyatli yaratildi!");
                setPassword("");
                setIsExisting(true);
            } else {
                if (data.message === "Account already exists") {
                    alert("❌ Bu username allaqachon mavjud!");
                } else {
                    alert(`❌ Xatolik: ${data.message || "Noma'lum muammo"}`);
                }
            }
        } catch (error) {
            console.error("❌ POST xatosi:", error);
            alert("❌ Ulanishda xatolik!");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div style={{ color: "#aaa" }}>⏳ Tekshirilmoqda...</div>;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>


            <input
                type="text"
                placeholder="Пользователь"
                style={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isExisting}
            />

            <input
                type="text"
                placeholder="Имя"
                style={inputStyle}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isExisting}
            />

            <input
                type="password"
                placeholder="Пароль"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isExisting}
            />

            <DatePicker
                style={inputStyle}
                placeholder="Сана танланг"
                format="YYYY-MM-DD"
                value={date}
                onChange={(val) => setDate(val)}
                disabled={isExisting}
            />

            {/* Status toggle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <span style={{ fontSize: "14px", color: "#ccc" }}>Статус</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: status ? "#4caf50" : "#f44336",
                        }}
                    >
                        {status ? "Актив" : "Неактив"}
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
                    {loading ? "Saqlanmoqda..." : "Saqlash"}
                </button>
            )}
        </div>
    );
}

"use client";

import React, { useState, useEffect } from "react";

export default function AddressTab({ inputStyle, clubId }) {
    const [countryName, setCountryName] = useState("");
    const [cityName, setCityName] = useState("");
    const [streetName, setStreetName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [message, setMessage] = useState(null);
    const [isExisting, setIsExisting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!clubId || !token) {
            setMessage("❌ clubId yoki token yo‘q");
            return;
        }

        const fetchAddress = async () => {
            try {
                const response = await fetch(`http://backend.gamefit.uz/address?id=${clubId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

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
                } else {
                    setIsExisting(false);
                    setMessage("ℹ️ Ma'lumotlar topilmadi. Yangi ma'lumot kiriting.");
                }
            } catch (error) {
                console.error("❌ Fetch error:", error);
                setMessage("❌ Ma'lumotlarni olishda xatolik.");
            } finally {
                setLoading(false);
            }
        };

        fetchAddress();
    }, [clubId]); // clubId o‘zgarsa, qayta fetch qiladi

    const handleSubmit = async () => {
        const token = localStorage.getItem("accessToken");

        const data = {
            clubId: Number(clubId),
            countryName,
            cityName,
            streetName,
            districtName,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
        };

        console.log("Yuborilayotgan ma'lumotlar:", data);

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
            console.log("API javobi:", result);

            if (res.ok) {
                alert("✅ Ma'lumotlar muvaffaqiyatli yuborildi.");
            } else {
                alert("❌ Xatolik: " + (result.message || "Noma'lum xatolik"));
            }
        } catch (err) {
            console.error("Yuborishda xatolik:", err);
            alert("❌ Server bilan bog‘lanishda xatolik yuz berdi.");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ color: "#f0f0f0", fontSize: "16px" }}>Адрес ma'lumotlari</h2>

            <input type="text" placeholder="Страна" style={inputStyle} value={countryName} onChange={(e) => setCountryName(e.target.value)} />
            <input type="text" placeholder="Город / Район" style={inputStyle} value={cityName} onChange={(e) => setCityName(e.target.value)} />
            <input type="text" placeholder="Название улицы" style={inputStyle} value={streetName} onChange={(e) => setStreetName(e.target.value)} />
            <input type="text" placeholder="Район" style={inputStyle} value={districtName} onChange={(e) => setDistrictName(e.target.value)} />
            <input type="text" placeholder="Широта" style={inputStyle} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            <input type="text" placeholder="Долгота" style={inputStyle} value={longitude} onChange={(e) => setLongitude(e.target.value)} />

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
                    Saqlash
                </button>
            )}

            {message && (
                <div style={{ marginTop: "10px", color: message.startsWith("✅") ? "#4caf50" : "orange" }}>
                    {message}
                </div>
            )}
        </div>
    );
}

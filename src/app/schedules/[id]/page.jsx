"use client";

import React from "react";
import "antd/dist/reset.css";

export default function UserDetailPage() {
    const user = {
        avatar: "https://i.pinimg.com/736x/01/07/8c/01078c4a824ea92e1bb3e742ccd6f216.jpg",
        name: "Qosimov Rustam",
        token: "CP000001",
        email: "P.andrey93@gmail.com",
        phone: "+99899 123 45 67",
        remaining: "00:05:12",
        status: "red",
    };

    const data = [
        {
            date: "25.05.2025",
            start: "16:00",
            end: "19:30",
            amount: 10,
            room: "P-12",
            rate: "Premium",
            price: "270 000",
        },
    ];

    return (
        <div
            style={{
                display: "flex",
                gap: 24,
                padding: 24,
                minHeight: "86vh",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {/* Left card */}
            <div
                style={{
                    width: 300,
                    background: "#0F0F1A",
                    padding: 20,
                    borderRadius: 12,
                    color: "#fff",
                }}
            >
                {/* Avatar */}
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <img
                            src={user.avatar}
                            alt="avatar"
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                        {/* Status bar */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: "4px solid red",
                                borderRadius: "50%",
                                pointerEvents: "none",
                            }}
                        />
                    </div>
                    <p style={{ marginTop: 8, color: "#aaa", fontSize: 14 }}>
                        Оставшееся время
                    </p>
                    <h3 style={{ margin: 0, fontSize: 20 }}>{user.remaining}</h3>
                </div>

                {/* Name */}
                <h2 style={{ fontSize: 18, textAlign: "center", marginBottom: 16 }}>
                    {user.name}
                </h2>

                {/* Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                        <p style={{ margin: 0, fontSize: 14, color: "#888" }}>Токен</p>
                        <input
                            type="text"
                            value={user.token}
                            readOnly
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
                            Электронная почта
                        </p>
                        <input
                            type="text"
                            value={user.email}
                            readOnly
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: 14, color: "#888" }}>
                            Номер телефона
                        </p>
                        <input
                            type="text"
                            value={user.phone}
                            readOnly
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Buttons */}
                <button
                    style={{
                        marginTop: 16,
                        width: "100%",
                        height: 40,
                        background: "#3D7BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 500,
                        cursor: "pointer",
                    }}
                >
                    Начать игру
                </button>
                <button
                    style={{
                        marginTop: 8,
                        width: "100%",
                        height: 40,
                        background: "transparent",
                        color: "#aaa",
                        border: "1px solid #444",
                        borderRadius: 8,
                        cursor: "pointer",
                    }}
                >
                    Блокировать
                </button>
            </div>

            {/* Right table */}
            <div
                style={{
                    flex: 1,
                    background: "",
                    borderRadius: 12,
                    overflow: "hidden",
                    padding: 16,
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#0F0F1A", color: "#fff", height: 48 }}>
                            <th style={thStyle}>Дата</th>
                            <th style={thStyle}>Начала</th>
                            <th style={thStyle}>Окончания</th>
                            <th style={thStyle}>Количество</th>
                            <th style={thStyle}>Комната</th>
                            <th style={thStyle}>Тариф</th>
                            <th style={thStyle}>Стоимость (сум)</th>
                        </tr>
                    </thead>
                    <tbody style={{
                    }}>
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                style={{
                                    background: "#0C0C1F",
                                    color: "#ddd",
                                    textAlign: "center",
                                    height: 48,
                                    borderRadius: "10px"
                                }}
                            >
                                <td>{row.date}</td>
                                <td>{row.start}</td>
                                <td>{row.end}</td>
                                <td>{row.amount}</td>
                                <td>{row.room}</td>
                                <td>{row.rate}</td>
                                <td>{row.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    background: "#0B0B16",
    border: "1px solid #333",
    borderRadius: 8,
    padding: "6px 10px",
    color: "#fff",
};

const thStyle = {
    textAlign: "center",
    fontWeight: 500,
    fontSize: 14,
    border: "none",
    padding: "0 8px",
};

"use client";

import React, { useEffect, useState } from "react";

export default function RequisitesTab({ inputStyle, clubId }) {
    const [formData, setFormData] = useState({
        branchId: "",
        paymentMfo: "",
        transitMfo: "",
        clickCntrgId: "",
        transitAccount: "",
        contractNumber: "",
        paymentAccount: "",
        createdAt: "",
        commissionPercent: "",
    });

    const [dataExists, setDataExists] = useState(false);

    // API orqali ma'lumot olish
    useEffect(() => {
        if (!clubId) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            console.error("Token topilmadi");
            return;
        }

        fetch(`http://backend.gamefit.uz/banking-info/by-club-id?clubId=${clubId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.success && data?.content) {
                    const d = data.content;
                    setFormData({
                        branchId: d.branchId || "",
                        paymentMfo: d.paymentMfo || "",
                        transitMfo: d.transitMfo || "",
                        clickCntrgId: d.clickCntrgId || "",
                        transitAccount: d.transitAccount || "",
                        contractNumber: d.contractNumber || "",
                        paymentAccount: d.paymentAccount || "",
                        createdAt: d.createdAt ? d.createdAt.slice(0, 10) : "",
                        commissionPercent: d.commissionPercent || "",
                    });
                    setDataExists(true);
                } else {
                    setDataExists(false);
                }
            })
            .catch((err) => {
                console.error("API Error:", err);
                setDataExists(false);
            });
    }, [clubId]);

    // Inputlar o'zgarishini yozib boradi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // POST orqali saqlash
    const handleSubmit = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Token topilmadi");
            return;
        }

        const body = {
            ...formData,
            clubId: clubId,
            active: true,
        };

        const res = await fetch("http://backend.gamefit.uz/banking-info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        if (data?.success) {
            alert("Ma'lumotlar saqlandi!");
            setDataExists(true);
        } else {
            alert("Xatolik: " + data.message || "Noma'lum xatolik");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ color: "#f0f0f0", fontSize: "16px" }}>Реквизиты</h2>

            <input type="text" name="branchId" placeholder="Идентификатор филиала" style={inputStyle} value={formData.branchId} onChange={handleChange} />
            <input type="text" name="paymentMfo" placeholder="МФО для платежей" style={inputStyle} value={formData.paymentMfo} onChange={handleChange} />
            <input type="text" name="transitMfo" placeholder="Транзитный МФО" style={inputStyle} value={formData.transitMfo} onChange={handleChange} />
            <input type="text" name="clickCntrgId" placeholder="Click Cntrg ID" style={inputStyle} value={formData.clickCntrgId} onChange={handleChange} />
            <input type="text" name="transitAccount" placeholder="Транзитный счёт" style={inputStyle} value={formData.transitAccount} onChange={handleChange} />
            <input type="text" name="contractNumber" placeholder="Номер договора" style={inputStyle} value={formData.contractNumber} onChange={handleChange} />
            <input type="text" name="paymentAccount" placeholder="Платёжный счёт" style={inputStyle} value={formData.paymentAccount} onChange={handleChange} />
            <input type="date" name="createdAt" placeholder="Дата добавления" style={inputStyle} value={formData.createdAt} onChange={handleChange} />
            <input type="number" name="commissionPercent" placeholder="Процент комиссии (%)" style={inputStyle} value={formData.commissionPercent} onChange={handleChange} />

            {!dataExists && (
                <button
                    onClick={handleSubmit}
                    style={{
                        marginTop: "10px",
                        padding: "10px",
                        backgroundColor: "#22c55e",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Saqlash
                </button>
            )}
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { API } from "@/config/api";

export default function RequisitesTab({ inputStyle, clubId }) {
    const { language } = useLanguage(); // 🔥 Contextdan tilni olish

    const texts = {
        uz: {
            title: "Rekvizitlar",
            branchId: "Filial identifikatori",
            paymentMfo: "To‘lov uchun MFO",
            transitMfo: "Tranzit MFO",
            clickCntrgId: "Click Cntrg ID",
            transitAccount: "Tranzit hisob raqami",
            contractNumber: "Shartnoma raqami",
            paymentAccount: "To‘lov hisob raqami",
            createdAt: "Qo‘shilgan sana",
            commissionPercent: "Komissiya foizi (%)",
            save: "Saqlash",
            success: "✅ Ma'lumotlar saqlandi!",
            error: "❌ Xatolik",
            tokenMissing: "❌ Token topilmadi",
        },
        ru: {
            title: "Реквизиты",
            branchId: "Идентификатор филиала",
            paymentMfo: "МФО для платежей",
            transitMfo: "Транзитный МФО",
            clickCntrgId: "Click Cntrg ID",
            transitAccount: "Транзитный счёт",
            contractNumber: "Номер договора",
            paymentAccount: "Платёжный счёт",
            createdAt: "Дата добавления",
            commissionPercent: "Процент комиссии (%)",
            save: "Сохранить",
            success: "✅ Данные сохранены!",
            error: "❌ Ошибка",
            tokenMissing: "❌ Токен отсутствует",
        },
        en: {
            title: "Requisites",
            branchId: "Branch ID",
            paymentMfo: "Payment MFO",
            transitMfo: "Transit MFO",
            clickCntrgId: "Click Cntrg ID",
            transitAccount: "Transit Account",
            contractNumber: "Contract Number",
            paymentAccount: "Payment Account",
            createdAt: "Created At",
            commissionPercent: "Commission Percent (%)",
            save: "Save",
            success: "✅ Data saved!",
            error: "❌ Error",
            tokenMissing: "❌ Token missing",
        },
    };

    const t = texts[language]; // 🔥 tanlangan til

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

        const fetchBankingInfo = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error(t.tokenMissing);
                return;
            }

            try {
                const d = await API.getBankingInfoByClubId({ clubId, accessToken: token });
                if (d) {
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
            } catch (err) {
                console.error("❌ fetchBankingInfo error:", err);
                setDataExists(false);
            }
        };

        fetchBankingInfo();
    }, [clubId, language]);


    // Inputlar o'zgarishini yozib boradi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // POST orqali saqlash
    const handleSubmit = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert(t.tokenMissing);
            return;
        }

        const body = {
            ...formData,
            clubId,
            active: true,
        };

        try {
            const data = await API.saveBankingInfo({ body, accessToken: token });

            if (data?.success) {
                alert(t.success);
                setDataExists(true);
            } else {
                alert(t.error + ": " + (data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("❌ handleSubmit error:", err);
            alert(t.error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <h2 style={{ color: "#f0f0f0", fontSize: "16px" }}>{t.title}</h2>

            <input type="text" name="branchId" placeholder={t.branchId} style={inputStyle} value={formData.branchId} onChange={handleChange} />
            <input type="text" name="paymentMfo" placeholder={t.paymentMfo} style={inputStyle} value={formData.paymentMfo} onChange={handleChange} />
            <input type="text" name="transitMfo" placeholder={t.transitMfo} style={inputStyle} value={formData.transitMfo} onChange={handleChange} />
            <input type="text" name="clickCntrgId" placeholder={t.clickCntrgId} style={inputStyle} value={formData.clickCntrgId} onChange={handleChange} />
            <input type="text" name="transitAccount" placeholder={t.transitAccount} style={inputStyle} value={formData.transitAccount} onChange={handleChange} />
            <input type="text" name="contractNumber" placeholder={t.contractNumber} style={inputStyle} value={formData.contractNumber} onChange={handleChange} />
            <input type="text" name="paymentAccount" placeholder={t.paymentAccount} style={inputStyle} value={formData.paymentAccount} onChange={handleChange} />
            <input type="date" name="createdAt" placeholder={t.createdAt} style={inputStyle} value={formData.createdAt} onChange={handleChange} />
            <input type="number" name="commissionPercent" placeholder={t.commissionPercent} style={inputStyle} value={formData.commissionPercent} onChange={handleChange} />

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
                    {t.save}
                </button>
            )}
        </div>
    );
}

"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import React, { useState } from "react";

// 🔹 Room modal uchun tarjimalar
const roomModalLabels = {
    ru: {
        title: "Рассадка мест",
        roomNumber: "Номер комнаты",
        seatCount: "Количество мест",
        serviceName: "Название услуги",
        cancel: "Отмена",
        save: "Сохранить",
        services: ["Стандарт", "Премиум", "VIP"],
    },
    uz: {
        title: "Joylashuv sozlamalari",
        roomNumber: "Xona raqami",
        seatCount: "O‘rinlar soni",
        serviceName: "Xizmat nomi",
        cancel: "Bekor qilish",
        save: "Saqlash",
        services: ["Standart", "Premium", "VIP"],
    },
    en: {
        title: "Seat Arrangement",
        roomNumber: "Room number",
        seatCount: "Number of seats",
        serviceName: "Service name",
        cancel: "Cancel",
        save: "Save",
        services: ["Standard", "Premium", "VIP"],
    },
};

export default function EditRoomModal({ room, onClose, onSave }) {
    const { language } = useLanguage();
    const t = roomModalLabels[language];

    // 🔹 Boshlang‘ich qiymatlar
    const [roomNumber, setRoomNumber] = useState(room.roomNumber ?? "");
    const [seatCount, setSeatCount] = useState(room.seatCount ?? "");
    const [service, setService] = useState(room.serviceNameIndex ?? 0); // 0=Standart, 1=Premium, 2=VIP

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `http://backend.gamefit.uz/seat-plan?id=${room.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        roomNumber: Number(roomNumber),
                        seatCount: Number(seatCount),
                        serviceNameIndex: service, // 🔹 tanlangan button raqami
                    }),
                }
            );

            const data = await res.json();
            if (data.success) {
                onSave(data.content);
                onClose();
            } else {
                console.error("Update error:", data);
            }
        } catch (err) {
            console.error("API error:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#14151D] p-6 rounded-xl w-[420px] shadow-lg">
                <h2 className="text-white text-xl font-semibold mb-6">{t.title}</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Room Number */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">{t.roomNumber}</label>
                        <input
                            type="number"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(Number(e.target.value))}
                            className="w-full p-3 rounded-md bg-transparent border border-gray-400 text-white outline-none"
                        />
                    </div>

                    {/* Seat Count */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">{t.seatCount}</label>
                        <input
                            type="number"
                            value={seatCount}
                            onChange={(e) => setSeatCount(Number(e.target.value))}
                            className="w-full p-3 rounded-md bg-transparent border border-gray-400 text-white outline-none"
                        />
                    </div>

                    {/* Service Name */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">{t.serviceName}</label>
                        <div className="flex gap-3">
                            {t.services.map((name, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setService(index)} // 🔹 shu yerda service = index bo‘ladi
                                    className={`flex-1 py-2 rounded-md border transition 
                                        ${service === index
                                            ? "bg-[#00A3FF] text-white border-[#00A3FF]"
                                            : "bg-transparent text-white border-gray-400 hover:border-white"
                                        }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between mt-6 gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-md border border-gray-400 text-white hover:bg-[#1E1F2A]"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-md bg-[#00A3FF] text-white font-semibold hover:opacity-90"
                        >
                            {t.save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

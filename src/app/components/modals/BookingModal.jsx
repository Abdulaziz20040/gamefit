"use client";
import React, { useState } from "react";
import { DatePicker, TimePicker, message } from "antd";
import dayjs from "dayjs";

export default function SeatConfirmModal({
  isOpen,
  onCancel,
  selectedSeats,
  date,
  startTime,
  endTime,
  clubId,
  activeTab,
  onSuccess
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!firstName || !lastName || !phoneNumber || !totalPrice) {
      message.error("Barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Avval foydalanuvchini yaratamiz
      const userRes = await fetch("http://backend.gamefit.uz/club-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          clubId: Number(clubId),
          firstName,
          lastName,
          phoneNumber
        })
      });

      const userData = await userRes.json();
      if (!userRes.ok || !userData.success) throw new Error(userData.message || "Foydalanuvchi qo'shilmadi");

      const userId = userData.content.id;

      // 2️⃣ Endi subscription yaratamiz
      const subRes = await fetch("http://backend.gamefit.uz/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          userId,
          clubId: Number(clubId),
          date,
          startAt: startTime,
          endAt: endTime,
          seatNumbers: selectedSeats, // [6,7,8...]
          serviceNameIndex: activeTab,
          totalPrice: Number(totalPrice),
          gamerCount: selectedSeats.length,
          sessionType: 1
        })
      });

      const subData = await subRes.json();
      if (!subRes.ok || !subData.success) throw new Error(subData.message || "Bron qilishda xatolik");

      message.success("Bron muvaffaqiyatli saqlandi!");
      onSuccess?.();
      onCancel();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0E0F1A] text-white rounded-xl px-8 py-6 w-[420px] shadow-xl border border-white/10">
        <h2 className="text-white font-semibold text-xl mb-3">Бронирование</h2>

        {/* Joylar */}
        <div className="flex items-center gap-3 mb-5">
          <img src="/seat-icon.png" alt="seat" className="w-8 h-8 object-contain" />
          <span className="text-cyan-400 font-medium">{selectedSeats.join(", ")}</span>
        </div>

        {/* Sana */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Дата</label>
          <DatePicker className="w-full bg-transparent border border-white/20 text-white rounded-md"
            format="YYYY-MM-DD"
            value={date ? dayjs(date) : null}
            disabled
          />
        </div>

        {/* Vaqtlar */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Начало</label>
            <TimePicker className="w-full bg-transparent border border-white/20 text-white rounded-md"
              format="HH:mm"
              value={startTime ? dayjs(startTime, "HH:mm") : null}
              disabled
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Окончание</label>
            <TimePicker className="w-full bg-transparent border border-white/20 text-white rounded-md"
              format="HH:mm"
              value={endTime ? dayjs(endTime, "HH:mm") : null}
              disabled
            />
          </div>
        </div>

        {/* Foydalanuvchi ma'lumotlari */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Имя</label>
          <input className="w-full bg-transparent border border-white/20 text-white rounded-md px-3 py-2"
            value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Abdurahmon" />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Фамилия</label>
          <input className="w-full bg-transparent border border-white/20 text-white rounded-md px-3 py-2"
            value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Eshmatov" />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Телефон</label>
          <input className="w-full bg-transparent border border-white/20 text-white rounded-md px-3 py-2"
            value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+998 90 123 45 67" />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Цена</label>
          <input type="number" className="w-full bg-transparent border border-white/20 text-white rounded-md px-3 py-2"
            value={totalPrice} onChange={e => setTotalPrice(e.target.value)} placeholder="100000" />
        </div>

        {/* Tugmalar */}
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="border border-white/20 text-white px-5 py-2 rounded-md hover:bg-white/10">Отмена</button>
          <button onClick={handleSave} disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-md">
            {loading ? "Saqlanmoqda..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

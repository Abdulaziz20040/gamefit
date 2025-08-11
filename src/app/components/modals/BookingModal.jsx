"use client";
import React from "react";

export default function SeatConfirmModal({ isOpen, seatToConfirm, onCancel, onConfirm }) {
  if (!isOpen || !seatToConfirm) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0E0F1A] text-white rounded-xl px-8 py-6 w-[400px] shadow-xl border border-white/10">
        <h2 className="text-white font-semibold text-xl mb-5">Бронирование</h2>

        <div className="text-sm text-white/60 mb-1">Комната: <span className="text-cyan-400 font-medium">{seatToConfirm.room}</span></div>
        <div className="text-sm text-white/60 mb-6">Время : <span className="text-cyan-400 font-medium">{seatToConfirm.time}</span></div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Имя</label>
            <input
              className="w-full bg-transparent border border-white/20 text-white rounded-md px-3 py-2 placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Abdurahmon"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Фамилия</label>
            <input
              className="w-full bg-transparent border border-white/20 text-white rounded-md px-3 py-2 placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Eshmatov"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Телефон</label>
            <input
              className="w-full bg-transparent border border-white/20 text-white rounded-md px-3 py-2 placeholder:text-white/50 outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="+998 90 123 45 67"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="border border-white/20 text-white px-5 py-2 rounded-md hover:bg-white/10"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-md"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
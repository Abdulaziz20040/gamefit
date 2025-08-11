"use client";

import React from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { BsPlus } from "react-icons/bs";

const data = [
    { room: "P-1", seats: 10, service: "Premium" },
    { room: "Зал", seats: 50, service: "Standart" },
    { room: "V-2", seats: 10, service: "VIP" },
    { room: "P-3", seats: 10, service: "Premium" },
    { room: "Z-1", seats: 12, service: "VIP" },
    { room: "K-2", seats: 15, service: "Standart" },
    { room: "L-3", seats: 20, service: "Premium" },
    { room: "M-1", seats: 8, service: "VIP" },
    { room: "N-4", seats: 18, service: "Premium" },
    { room: "O-5", seats: 14, service: "Standart" },
    { room: "Q-6", seats: 9, service: "VIP" },
    { room: "R-7", seats: 11, service: "Premium" },
    { room: "S-8", seats: 16, service: "Standart" }
];

export default function RoomTable() {
    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg">Комнаты</h2>
                <button className="bg-[#00A3FF] flex items-center gap-1 px-4 py-2 rounded-lg text-white hover:opacity-90">
                    <BsPlus size={20} /> Добавить
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg">
                <table className="w-full table-auto text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="bg-[#1E1F2A] text-sm text-[#CCCCCC]">
                            <th className="p-3">Комнаты</th>
                            <th className="p-3">Мест</th>
                            <th className="p-3">Услуги</th>
                            <th className="p-3">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, idx) => (
                            <tr key={idx} className="bg-[#171822] rounded-lg">
                                <td className="p-3">{item.room}</td>
                                <td className="p-3">{item.seats}</td>
                                <td className="p-3">{item.service}</td>
                                <td className="p-3 flex gap-4">
                                    <button className="text-[#FF4A4A] hover:opacity-80">
                                        <FiTrash2 />
                                    </button>
                                    <button className="text-[#4AA8FF] hover:opacity-80">
                                        <FiEdit />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

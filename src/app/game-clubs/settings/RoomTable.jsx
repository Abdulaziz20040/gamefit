"use client";

import React, { useEffect, useState } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { BsPlus } from "react-icons/bs";
import { useLanguage } from "@/app/context/LanguageContext";
import EditRoomModal from "@/app/components/modals/EditRoomModal";
import CreateRoomModal from "@/app/components/modals/CreatRoommodal";

export default function RoomTable({ clubId }) {
    const { language } = useLanguage();

    const labels = {
        ru: {
            rooms: "Комнаты",
            add: "Добавить",
            colRoom: "Комната",
            colSeats: "Мест",
            colService: "Услуги",
            colActions: "Действия",
            loading: "Загрузка...",
            empty: "Комнат нет",
            services: ["Стандарт", "Премиум", "VIP"],
        },
        uz: {
            rooms: "Xonalar",
            add: "Qo‘shish",
            colRoom: "Xona",
            colSeats: "O‘rinlar",
            colService: "Xizmatlar",
            colActions: "Amallar",
            loading: "Yuklanmoqda...",
            empty: "Xonalar yo‘q",
            services: ["Standart", "Premium", "VIP"],
        },
        en: {
            rooms: "Rooms",
            add: "Add",
            colRoom: "Room",
            colSeats: "Seats",
            colService: "Services",
            colActions: "Actions",
            loading: "Loading...",
            empty: "No rooms",
            services: ["Standard", "Premium", "VIP"],
        },
    };
    const t = labels[language] || labels.en;

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRoom, setEditingRoom] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, [clubId]);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `http://backend.gamefit.uz/seat-plan/by-club?clubId=${clubId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            if (data.success) setRooms(data.content);
        } catch (err) {
            console.error("API error:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Delete room
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(
                `http://backend.gamefit.uz/seat-plan?id=${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.ok) {
                setRooms((prev) => prev.filter((r) => r.id !== id));
            } else {
                console.error("Failed to delete room");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    // 🔹 Update room after edit
    const handleUpdate = (updatedRoom) => {
        setRooms((prev) =>
            prev.map((r) => (r.id === updatedRoom.id ? updatedRoom : r))
        );
    };

    // 🔹 Add room after create
    const handleCreate = (newRoom) => {
        setRooms((prev) => [...prev, newRoom]);
    };

    const getServiceName = (index) =>
        typeof index === "number" ? t.services[index] || "?" : "?";

    const getRoomName = (roomNumber, serviceIndex) => {
        if (roomNumber === 0) return "Zal";
        switch (serviceIndex) {
            case 1:
                return `Premium - ${roomNumber}`;
            case 2:
                return `VIP - ${roomNumber}`;
            default:
                return `${t.colRoom} ${roomNumber}`;
        }
    };

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg">{t.rooms}</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-[#00A3FF] flex items-center gap-1 px-4 py-2 rounded-lg text-white hover:opacity-90"
                >
                    <BsPlus size={20} /> {t.add}
                </button>
            </div>

            <div className="overflow-y-auto h-[400px] rounded-lg">
                <table className="w-full table-auto text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr className="bg-[#1E1F2A] text-sm text-[#CCCCCC]">
                            <th className="p-3">{t.colRoom}</th>
                            <th className="p-3">{t.colSeats}</th>
                            <th className="p-3">{t.colService}</th>
                            <th className="p-3">{t.colActions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-3 text-center">
                                    {t.loading}
                                </td>
                            </tr>
                        ) : rooms.length > 0 ? (
                            rooms.map((item) => (
                                <tr key={item.id} className="bg-[#171822] rounded-lg">
                                    <td className="p-3">
                                        {getRoomName(item.roomNumber, item.serviceNameIndex)}
                                    </td>
                                    <td className="p-3">{item.seatCount}</td>
                                    <td className="p-3">{getServiceName(item.serviceNameIndex)}</td>
                                    <td className="p-3 flex gap-4">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-[#FF4A4A] hover:opacity-80"
                                        >
                                            <FiTrash2 />
                                        </button>
                                        <button
                                            onClick={() => setEditingRoom(item)}
                                            className="text-[#4AA8FF] hover:opacity-80"
                                        >
                                            <FiEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-3 text-center">
                                    {t.empty}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 🔹 Edit Modal */}
            {editingRoom && (
                <EditRoomModal
                    room={editingRoom}
                    onClose={() => setEditingRoom(null)}
                    onSave={handleUpdate}
                />
            )}

            {/* 🔹 Create Modal */}
            {isCreating && (
                <CreateRoomModal
                    clubId={clubId}
                    onClose={() => setIsCreating(false)}
                    onSave={handleCreate}
                />
            )}
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ScheduleDetailsPage() {
    const { subToken } = useParams();
    const [data, setData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔹 Mapping
    const roomNames = {
        0: "P-12",
        1: "P-13",
        2: "VIP-1"
    };

    const serviceNames = {
        0: "Premium",
        1: "Standard",
        2: "Econom"
    };

    // 🔹 Vaqt formatlash (faqat soat va minut)
    const formatTime = (timeString) => {
        if (!timeString) return "—";
        const date = new Date(`1970-01-01T${timeString}`);
        return date.toLocaleTimeString("ru-RU", { hour12: false, hour: "2-digit", minute: "2-digit" }); // HH:mm
    };

    useEffect(() => {
        if (!subToken) return setLoading(false);

        (async () => {
            setLoading(true);
            try {
                const clubId = localStorage.getItem("clubId") || "1";
                const accessToken = localStorage.getItem("accessToken") || "";

                const json = await API.getSubscriptionByToken({ clubId, subToken, accessToken });

                if (json?.success) {
                    setData(json.content);

                    if (json.content?.userId) {
                        const userJson = await API.getUserById({
                            userId: json.content.userId,
                            accessToken,
                        });
                        if (userJson?.success) {
                            setUserData(userJson.content);
                        }
                    }
                } else {
                    setData(json.content || null);
                }
            } catch (err) {
                console.error("Xato:", err);
                setData(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [subToken]);


    if (loading) {
        return <div className="text-white p-10">Yuklanmoqda...</div>;
    }

    if (!data) {
        return <div className="text-white p-10">Ma'lumot topilmadi</div>;
    }

    return (
        <div className="min-h-screen text-white p-6 flex gap-4">
            {/* Chap panel */}
            <div className="bg-[#11111A] p-6 rounded-lg w-[300px] flex flex-col items-center shadow-lg">
                <img
                    src={userData?.fileToUsers?.contentUrl || "/default-avatar.png"}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#1E1E28]"
                />
                <p className="text-sm text-gray-400 mt-2">Оставшееся время</p>
                <p className="text-2xl font-bold text-white">00:05:12</p>

                <h2 className="mt-4 font-semibold">{userData?.fullName || "—"}</h2>

                <div className="w-full mt-4 space-y-3">
                    <div>
                        <label className="text-sm text-gray-400">Токен</label>
                        <input
                            value={data.subToken}
                            readOnly
                            className="w-full mt-1 bg-transparent border border-gray-600 rounded px-3 py-1 text-white"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Электронная почта</label>
                        <input
                            value={userData?.email || ""}
                            readOnly
                            className="w-full mt-1 bg-transparent border border-gray-600 rounded px-3 py-1 text-white"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Номер телефона</label>
                        <input
                            value={userData?.phoneNumber || ""}
                            readOnly
                            className="w-full mt-1 bg-transparent border border-gray-600 rounded px-3 py-1 text-white"
                        />
                    </div>
                </div>

                <button className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl py-2 mt-4 font-semibold">
                    Начать игру
                </button>
                <button className="w-full bg-transparent border border-gray-500 hover:bg-gray-800 rounded-xl py-2 mt-2 font-semibold">
                    Блокировать
                </button>
            </div>

            {/* O'ng panel - jadval */}
            <div className="flex-1">
                <h2 className="text-lg font-semibold mb-4">График</h2>
                <table className="w-full border-collapse bg-[#11111A] rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-[#15151F] text-gray-300 text-sm">
                            <th className="py-3 px-4 text-left">Дата</th>
                            <th className="py-3 px-4 text-left">Начало</th>
                            <th className="py-3 px-4 text-left">Окончания</th>
                            <th className="py-3 px-4 text-left">Количество</th>
                            <th className="py-3 px-4 text-left">Комната</th>
                            <th className="py-3 px-4 text-left">Тариф</th>
                            <th className="py-3 px-4 text-left">Стоимость (сум)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t border-gray-700">
                            <td className="py-3 px-4">{data.date || "—"}</td>
                            <td className="py-3 px-4">{formatTime(data.startAt)}</td>
                            <td className="py-3 px-4">{formatTime(data.endAt)}</td>
                            <td className="py-3 px-4">{data.gamerCount || "—"}</td>
                            <td className="py-3 px-4">{roomNames[data.roomNumber] || "—"}</td>
                            <td className="py-3 px-4">{serviceNames[data.serviceNameIndex] || "—"}</td>
                            <td className="py-3 px-4">
                                {Number(data.totalPrice || 0).toLocaleString("ru-RU")}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

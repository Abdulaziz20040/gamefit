"use client";

import { useState, useEffect } from "react";
import { FaCrown, FaFire, FaStar } from "react-icons/fa";
import SeatConfirmModal from "../components/modals/BookingModal";

// O‘rindiq rasmlari
const img = {
  right: {
    active: "/rightSelected.png",
    inactive: "/rightDefault.png",
    pending: "/pendingLeft.png",
  },
  left: {
    active: "/leftSelected.png",
    inactive: "/leftDefault.png",
    pending: "/pendingRight.png",
  },
};

export default function CinemaBooking() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [activeTab, setActiveTab] = useState(0);
  const [seatsData, setSeatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingSeats, setPendingSeats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const clubId =
    typeof window !== "undefined" ? localStorage.getItem("clubId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const tabs = [
    { index: 0, name: "Standart", icon: <FaFire /> },
    { index: 1, name: "Premium", icon: <FaStar /> },
    { index: 2, name: "VIP", icon: <FaCrown /> },
  ];

  // API orqali o‘rindiqlarni olish
  const fetchSeatsData = async () => {
    setLoading(true);
    try {
      const url = `http://backend.gamefit.uz/club-seat/by-active-seat?clubId=${clubId}&date=${selectedDate}&startAt=${startTime}&endAt=${endTime}&serviceNameIndex=${activeTab}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.success) {
        setSeatsData(
          data.content.filter((seat) => seat.serviceNameIndex === activeTab)
        );
        setPendingSeats([]);
      } else {
        setSeatsData([]);
      }
    } catch (error) {
      console.error("API xatolik:", error);
      setSeatsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatsData();
  }, [selectedDate, startTime, endTime, activeTab]);

  const handleSeatClick = (seatId, isAvailable) => {
    if (!isAvailable) return;
    setPendingSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const getSeatImage = (seat, isLeft) => {
    const side = isLeft ? img.left : img.right;
    if (pendingSeats.includes(seat.id)) return side.pending;
    if (!seat.isAvailable) return side.inactive;
    return side.active;
  };

  return (
    <div className="text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4 relative">
          {/* Sana, vaqt tanlash */}
          <div className="flex flex-col gap-2 absolute left-0 top-10">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="text-gray-400 text-sm flex flex-col">
                Sana:
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm mt-1"
                  max={today}
                />
              </label>
              <label className="text-gray-400 text-sm flex flex-col">
                Boshlanish:
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm mt-1"
                />
              </label>
              <label className="text-gray-400 text-sm flex flex-col">
                Tugash:
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm mt-1"
                />
              </label>
            </div>
          </div>

          {/* Tablar */}
          <div className="flex gap-4 mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.index}
                onClick={() => setActiveTab(tab.index)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === tab.index
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow max-w-7xl overflow-y-auto mt-14 no-scrollbar h-[70vh] py-10 mx-auto w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-400">
            Yuklanmoqda...
          </div>
        ) : seatsData.length === 0 ? (
          <div className="text-center text-gray-400">O'rindiqlar topilmadi</div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: Math.ceil(seatsData.length / 10) }).map(
              (_, groupIndex) => {
                const groupSeats = seatsData.slice(
                  groupIndex * 10,
                  groupIndex * 10 + 10
                );
                const leftSeats = groupSeats.slice(0, 5);
                const rightSeats = groupSeats.slice(5, 10);

                return (
                  <div key={groupIndex} className="flex flex-col items-center">
                    {activeTab !== 0 && (
                      <div className="mb-3 px-4 py-1 border border-cyan-500 rounded-md text-cyan-400 font-semibold text-sm">
                        {tabs[activeTab].name}-{groupIndex + 1}
                      </div>
                    )}

                    <div className="flex gap-4 max-h-[323px] overflow-y-auto no-scrollbar p-2 rounded-lg">
                      {/* Chap */}
                      <div className="flex flex-col">
                        {leftSeats.map((seat, i) => (
                          <button
                            key={seat.id}
                            onClick={() =>
                              handleSeatClick(seat.id, seat.isAvailable)
                            }
                            disabled={!seat.isAvailable}
                            className="relative w-14 h-14 p-1 rounded flex items-center justify-center text-xs"
                          >
                            <img
                              src={getSeatImage(seat, true)}
                              alt="seat"
                              className="w-full h-10 object-contain transform scale-x-[-1]"
                            />
                            <span className="absolute inset-0 flex items-center justify-center font-bold text-white">
                              {groupIndex * 10 + i + 1}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Bo‘luvchi chiziq */}
                      <div className="w-[13px] border border-gray-600"></div>

                      {/* O‘ng */}
                      <div className="flex flex-col">
                        {rightSeats.map((seat, i) => (
                          <button
                            key={seat.id}
                            onClick={() =>
                              handleSeatClick(seat.id, seat.isAvailable)
                            }
                            disabled={!seat.isAvailable}
                            className="w-14 h-14 p-1 rounded relative"
                          >
                            <img
                              src={getSeatImage(seat, false)}
                              alt="seat"
                              className="w-full h-10 object-contain transform rotate-180"
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold pointer-events-none">
                              {groupIndex * 10 + 5 + i + 1}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        {/* Tanlangan o‘rindiqlar paneli */}
        {pendingSeats.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-xl w-52">
            <h3 className="font-semibold text-sm mb-2">Tanlangan o'rindiqlar:</h3>
            <div className="flex flex-wrap gap-1 mb-3 max-h-24 overflow-y-auto">
              {pendingSeats.map((id) => {
                const seat = seatsData.find((s) => s.id === id);
                return (
                  <span
                    key={id}
                    className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs border border-cyan-500/30"
                  >
                    {seat?.seatNumber ?? id}
                  </span>
                );
              })}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded"
            >
              Davom etish ({pendingSeats.length})
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      <SeatConfirmModal
        isOpen={isModalOpen}
        selectedSeats={pendingSeats.map(
          (id) => seatsData.find((s) => s.id === id)?.seatNumber || id
        )}
        date={selectedDate}
        startTime={startTime}
        endTime={endTime}
        clubId={clubId}
        activeTab={activeTab}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => {
          setPendingSeats([]);
          fetchSeatsData();
        }}
      />
    </div>
  );
}

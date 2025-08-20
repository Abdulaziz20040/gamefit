"use client";

import { useState, useEffect } from "react";
import { FaCrown, FaFire, FaStar } from "react-icons/fa";
import SeatConfirmModal from "../components/modals/BookingModal";
import { useLanguage } from "../context/LanguageContext"; // 🔑 til context
import CustomCalendar from "../components/CustomCalendar";

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

  // 🔑 til konteksti
  const { language } = useLanguage();

  // 🔑 tarjimalar
  const translations = {
    date: { uz: "Sana", ru: "Дата", en: "Date" },
    start: { uz: "Boshlanish", ru: "Начало", en: "Start" },
    end: { uz: "Tugash", ru: "Конец", en: "End" },
    loading: { uz: "Yuklanmoqda...", ru: "Загрузка...", en: "Loading..." },
    notFound: {
      uz: "O‘rindiqlar topilmadi",
      ru: "Места не найдены",
      en: "Seats not found",
    },
    selectedSeats: {
      uz: "Tanlangan o‘rindiqlar",
      ru: "Выбранные места",
      en: "Selected seats",
    },
    continue: { uz: "Davom etish", ru: "Продолжить", en: "Continue" },
    tabs: {
      uz: ["Standart", "Premium", "VIP"],
      ru: ["Стандарт", "Премиум", "VIP"],
      en: ["Standard", "Premium", "VIP"],
    },
  };

  // API orqali o‘rindiqlarni olish
  const fetchSeatsData = async () => {
    setLoading(true);
    try {
      const url = `http://backend.gamefit.uz/club-seat/by-active-seat?clubId=${clubId}&date=${selectedDate}&startAt=${startTime}&endAt=${endTime}&serviceNameIndex=${activeTab}&lang=${language}`;
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
  }, [selectedDate, startTime, endTime, activeTab, language]); // 🔑 til o‘zgarsa qayta fetch bo‘lsin

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
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          {/* Sana va vaqt tanlash */}
          {/* Sana va vaqt tanlash */}
          <CustomCalendar
            translations={translations}
            language={language}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />



          {/* Tablar (o‘ng tomonda) */}
          <div className="flex gap-4">
            {[0, 1, 2].map((idx) => {
              const images = [
                { active: "/wtab3.png", inactive: "tab2.png" },
                { active: "wtab1.png", inactive: "tab1.png" },
                { active: "wtab2.png", inactive: "tab3.png" },
              ];

              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 cursor-pointer px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === idx
                    ? "bg-cyan-500 text-white"
                    : "bg-[#0C0C14] text-[#4A4C56] hover:bg-[#0f0f1abb]"
                    }`}
                >
                  <span className="w-5 h-5">
                    <img
                      src={activeTab === idx ? images[idx].active : images[idx].inactive}
                      alt={`tab-${idx}`}
                      className="w-5 h-5 object-contain"
                    />
                  </span>
                  {translations.tabs[language][idx]}
                </button>
              );
            })}
          </div>

        </div>
      </header>


      {/* Main */}
      <main className="flex-grow max-w-7xl overflow-y-auto mt-14 no-scrollbar h-[70vh] mx-auto w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-400">
            {translations.loading[language]}
          </div>
        ) : seatsData.length === 0 ? (
          <div className="text-center text-gray-400">
            {translations.notFound[language]}
          </div>
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
                        {translations.tabs[language][activeTab]}-{groupIndex + 1}
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
            <h3 className="font-semibold text-sm mb-2">
              {translations.selectedSeats[language]}:
            </h3>
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
              {translations.continue[language]} ({pendingSeats.length})
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

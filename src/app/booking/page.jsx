"use client";
import React, { useState } from "react";
import { FaRegStar, FaCrown, FaGem } from "react-icons/fa";
import BookingModal from "../components/modals/BookingModal";

export default function BookingInterface() {
  const [activeTab, setActiveTab] = useState("Premium");
  const [selectedSeats, setSelectedSeats] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [seatToConfirm, setSeatToConfirm] = useState(null);

  const seatImages = {
    left: {
      default: "/rightDefault.png",
      selected: "/rightSelected.png",
    },
    right: {

      default: "/leftDefault.png",
      selected: "/leftSelected.png",
    },
  };

  const tabs = ["Standart", "Premium", "VIP"];

  const tabData = {
    Premium: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Premium-${i + 1}`,
    })),
    Standart: Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `Standart-${i + 1}`,
    })),
    VIP: Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      name: `VIP-${i + 1}`,
    })),
  };

  const isSeatSelected = (pkgId, seatNum) =>
    selectedSeats[`${activeTab}-${pkgId}-${seatNum}`] || false;

  const handleSeatClick = (pkgId, seatNum) => {
    setSeatToConfirm({ pkgId, seatNum, tab: activeTab });
    setModalOpen(true);
  };

  const confirmSeat = () => {
    if (seatToConfirm) {
      const key = `${seatToConfirm.tab}-${seatToConfirm.pkgId}-${seatToConfirm.seatNum}`;
      setSelectedSeats((prev) => ({
        ...prev,
        [key]: true,
      }));
    }
    setModalOpen(false);
    setSeatToConfirm(null);
  };

  const currentPackages = tabData[activeTab];

  return (
    <div className="h-[87vh] text-white flex flex-col ">
      {/* Tabs */}
      <h2 style={{ fontWeight: 600, fontSize: 22, color: "white", marginBottom: 20 }}>        Бронирование</h2>
      <div className="flex justify-center gap-10 mb-6 pb-2 shrink-0 mt-10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const Icon =
            tab === "Standart"
              ? FaRegStar
              : tab === "Premium"
                ? FaCrown
                : FaGem;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex flex-col items-center gap-1 pb-2 cursor-pointer`}
            >
              <div
                className={`flex items-center gap-2 text-base font-medium ${isActive ? "text-cyan-400" : "text-[#A1A3AD]"}`}
              >
                <Icon size={20} />
                <span>{tab}</span>
              </div>
              <div
                className={`absolute -bottom-[2px] h-[3px] w-full rounded-full transition-all ${isActive ? "bg-cyan-400" : "bg-transparent"}`}
              />
            </button>
          );
        })}
      </div>

      {/* Scrollable content */}
      <div className="overflow-y-auto px-4 pb-4 flex-1 scroll-hidden">
        <div className="grid grid-cols-4 gap-6 max-w-[1000px] mx-auto">
          {currentPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-[#14141F] rounded-lg p-4 flex flex-col items-center"
            >
              {/* Paket nomi */}
              <div className="mb-3 text-center text-sm font-semibold border border-[#2A2C36] text-cyan-400 px-4 py-1 rounded">
                {pkg.name}
              </div>

              {/* O‘rindiqlar */}
              <div className="relative flex gap-3">
                {/* Chap o‘rindiqlar */}
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 5 }, (_, i) => {
                    const leftSeatNum = i + 1;
                    return (
                      <button
                        key={leftSeatNum}
                        onClick={() => handleSeatClick(pkg.id, leftSeatNum)}
                        className="relative w-10 h-10 cursor-pointer"
                      >
                        <img
                          src={
                            isSeatSelected(pkg.id, leftSeatNum)
                              ? seatImages.left.selected
                              : seatImages.left.default
                          }
                          className="w-full h-full"
                          alt="seat"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-white">
                          {leftSeatNum}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* O‘rta chiziq */}
                <div className="w-[14px] border-[#4A4C56] border-1 h-full rounded-sm" />

                {/* O‘ng o‘rindiqlar */}
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 5 }, (_, i) => {
                    const rightSeatNum = i + 6;
                    return (
                      <button
                        key={rightSeatNum}
                        onClick={() => handleSeatClick(pkg.id, rightSeatNum)}
                        className="relative w-10 h-10 cursor-pointer"
                      >
                        <img
                          src={
                            isSeatSelected(pkg.id, rightSeatNum)
                              ? seatImages.right.selected
                              : seatImages.right.default
                          }
                          className="w-full h-full"
                          alt="seat"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[12px] font-semibold text-white">
                          {rightSeatNum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - unchanged */}

      <BookingModal
        isOpen={modalOpen}
        seatToConfirm={seatToConfirm}
        onCancel={() => setModalOpen(false)}
        onConfirm={confirmSeat}
      />
    </div>

  );
}

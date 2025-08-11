"use client";

import {
  MdDashboard,
  MdDateRange,
  MdEditCalendar,
  MdSportsEsports,
  MdAccountBalance,
  MdLogout,
} from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Modal } from "antd";

export default function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleOk = () => {
    localStorage.clear(); // 🔴 LOCALSTORAGE TOZALANADI
    window.location.reload(); // 🔁 SAHIFA YANGILANADI
  };

  const menuItems = [
    { label: "Панель", icon: <MdDashboard size={20} />, href: "/" },
    { label: "График", icon: <MdDateRange size={20} />, href: "/schedules" },
    { label: "Бронирование", icon: <MdEditCalendar size={20} />, href: "/booking" },
    {
      label: "Игроклубы",
      icon: <MdSportsEsports size={20} />,
      href: "/game-clubs",
    },
    {
      label: "Статистика",
      icon: <MdAccountBalance size={20} />,
      href: "/club-account",
    }
  ];

  return (
    <div style={{
      color: "white",
      borderRadius: "0px 10px 10px 0px"
    }} className="w-60 h-screen bg-[#0F0F1A] text-white flex flex-col justify-between ">
      {/* Logo */}
      <div>
        <div className="px-6 py-6">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Menu List */}
        <ul className="pl-4 flex flex-col gap-2 mt-6">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li
                key={item.label}
                onClick={() => router.push(item.href)}
                style={{ borderRadius: "10px 0px 0px 10px" }}
                className={`flex items-center gap-3 text-sm px-4 py-3 cursor-pointer transition-all duration-200 ${isActive
                  ? "bg-[#141421] text-blue-600 font-semibold"
                  : "text-gray-300 hover:bg-gray-700"
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="px-4 py-4">
        <button
          onClick={showModal}
          className="w-full flex items-center cursor-pointer justify-center gap-2 text-red-500 text-sm py-2 px-4 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
        >
          <MdLogout size={18} />
          Log out
        </button>
      </div>

      {/* Logout Modal - DARK MODE MOS */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={353}
        style={{ backgroundColor: "#1a1a2e", borderRadius: "10px" }}
        bodyStyle={{
          color: "#fff",
          padding: "24px",
        }}
        closable={false}
      >
        <div className="flex flex-col justify-between h-full">
          <p className="text-center text-lg font-medium text-black mb-4">
            Do you want to leave?
          </p>

          <div className="flex justify-end gap-3">
            <Button
              style={{
                backgroundColor: "#2c2f48",
                color: "#ffffff",
                borderRadius: "7px",
                border: "1px solid #444",
                fontWeight: "500",
              }}
              className=" w-[154.5px] h-[45px] "
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className=" w-[154.5px] h-[45px]"
              type="primary"
              danger
              onClick={handleOk}
            >
              Exit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

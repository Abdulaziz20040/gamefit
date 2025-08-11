"use client";

import { IoSearch } from "react-icons/io5";
import { MdOutlineQrCode } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Avatar, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

const items = [
  { key: "profile", label: "Profile" },
  { key: "settings", label: "Settings" },
  { key: "logout", label: "Log out" },
];

export default function Navbar() {
  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      console.log("Logging out...");
    } else {
      console.log(`You clicked on ${e.key}`);
    }
  };

  return (
    <div className="w-full h-16 flex items-center justify-end px-6 ">
      <Dropdown
        menu={{ items, onClick: handleMenuClick }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <div className="flex items-center mt-4 gap-2 cursor-pointer px-4 py-2 bg-[#1F1F2A] hover:bg-[#2A2A3C] rounded-[10px] transition-all">
          <Avatar
            src="https://i.pinimg.com/736x/a4/63/46/a463462744d1b20920903ef2180c90c0.jpg"
            size={32}
            style={{
              width: "35px",
              height: "34px",
              borderRadius: "8px",
            }}
          />
          <span className="text-sm font-medium text-white">
            Abbos Ibragimov
          </span>
          <DownOutlined style={{ color: "#9CA3AF", fontSize: "12px" }} />
        </div>
      </Dropdown>
    </div>
  );
}

"use client";
import { Avatar, Dropdown, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useLanguage } from "../context/LanguageContext";
import ReactCountryFlag from "react-country-flag";

const menuItems = (labels) => [
  { key: "profile", label: labels.profile },
  { key: "settings", label: labels.settings },
  { key: "logout", label: labels.logout },
];

export default function Navbar() {
  const { language, changeLanguage, languages, getLabels } = useLanguage();
  const labels = getLabels();

  const handleMenuClick = (e) => {
    if (e.key === "logout") console.log("Logging out...");
    else console.log(`Clicked on ${e.key}`);
  };

  return (
    <div className="w-full h-16 flex items-center justify-end px-6 gap-4">
      {/* Language Select */}
      <Select
        value={language}
        onChange={changeLanguage}
        className="dark-select"
        classNames={{
          popup: { root: "dark-select-dropdown" }, // yangi usul
        }}
        suffixIcon={<DownOutlined style={{ color: "#9CA3AF" }} />}
        optionLabelProp="label"
        style={{ minWidth: 160 }}
      >
        {Object.keys(languages).map((key) => (
          <Select.Option
            key={key}
            value={key}
            label={
              <div className="flex items-center gap-2">
                <ReactCountryFlag
                  countryCode={languages[key].countryCode}
                  svg
                  style={{ width: "22px", height: "22px", borderRadius: "3px" }}
                />
                <span>{languages[key].label}</span>
              </div>
            }
          >
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={languages[key].countryCode}
                svg
                style={{ width: "22px", height: "22px", borderRadius: "3px" }}
              />
              <span>{languages[key].label}</span>
            </div>
          </Select.Option>
        ))}
      </Select>

      {/* Profile Dropdown */}
      <Dropdown
        menu={{ items: menuItems(labels), onClick: handleMenuClick }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <div className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-[#1F1F2A] hover:bg-[#2A2A3C] rounded-[10px] transition-all">
          <Avatar
            src="https://i.pinimg.com/736x/a4/63/46/a463462744d1b20920903ef2180c90c0.jpg"
            size={32}
            style={{ width: "35px", height: "34px", borderRadius: "8px" }}
          />
          <span className="text-sm font-medium text-white">{labels.name}</span>
          <DownOutlined style={{ color: "#9CA3AF", fontSize: "12px" }} />
        </div>
      </Dropdown>
    </div>
  );
}

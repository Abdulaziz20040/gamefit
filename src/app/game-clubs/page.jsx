"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  Select,
  Typography,
  ConfigProvider,
  Spin,
  Tag,
} from "antd";
import "antd/dist/reset.css";
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/navigation";
import CreateGameClubModal from "../components/modals/CreateGameClubsModal";
import { useLanguage } from "../context/LanguageContext";
import { API } from "@/config/api";

// 🔹 Shu pagening ichida local labels
const gameClubLabels = {
  ru: {
    title: "Игроклубы",
    add: "Добавить",
    club: "Игроклуб",
    branch: "Филиал",
    user: "Пользователь",
    status: "Статус",
    active: "Актив",
    inactive: "Неактив",
    noData: "Данные не найдены",
    rowsPerPage: "Строк на странице",
    noAddress: "Адрес не указан",
    unknown: "Неизвестно",
  },
  uz: {
    title: "Game klublar",
    add: "Qo‘shish",
    club: "Klub",
    branch: "Filial",
    user: "Foydalanuvchi",
    status: "Holat",
    active: "Faol",
    inactive: "Nofaol",
    noData: "Ma'lumot topilmadi",
    rowsPerPage: "Satrlar soni",
    noAddress: "Manzil mavjud emas",
    unknown: "Noma'lum",
  },
  en: {
    title: "Game Clubs",
    add: "Add",
    club: "Club",
    branch: "Branch",
    user: "User",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    noData: "No data found",
    rowsPerPage: "Rows per page",
    noAddress: "No address available",
    unknown: "Unknown",
  },
};

export default function GameClub() {
  const { language } = useLanguage(); // 🔹 faqat tilni olib ishlatamiz
  const t = gameClubLabels[language]; // 🔹 bu page uchun labelni tanlaymiz

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalElements, setTotalElements] = useState(0);
  const [status, setStatus] = useState(0); // 0 = active, 1 = inactive

  const router = useRouter();


  async function fetchGameClubs(page = currentPage, size = pageSize, currentStatus = status) {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const data = await API.getGameClubsByStatus({
        page,
        size,
        status: currentStatus,
        language,
        accessToken: token,
      });

      if (data) {
        const mappedData = data.content.content.map((club) => {
          const address = club.address;
          return {
            key: club.id,
            image: club.fileGameClubs?.[0]?.contentUrl || "/placeholder.png",
            club: club.title || t.unknown,
            branch: club.clubBranch || "-",
            user: club.account?.username || "—",
            status: club.statusIndex === 0 ? t.active : t.inactive,
            location: address
              ? `${address.cityName || ""}, ${address.districtName || ""}, ${address.streetName || ""}`
              : t.noAddress,
          };
        });
        setDataSource(mappedData);
        setTotalElements(data.content.page.totalElements);
      } else {
        setDataSource([]);
      }
    } catch (err) {
      console.error("❌ fetchGameClubs error:", err);
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchGameClubs(page, pageSize, status);
  }, [page, pageSize, status, language]); // 🔹 til o‘zgarsa reload qilinsin

  const columns = [
    {
      title: <span style={{ color: "#E4E6EB" }}>{t.club}</span>,
      dataIndex: "club",
      key: "club",
      width: "30%",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.image}
            alt="club"
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
          <span style={{ color: "#E4E6EB" }}>{record.club}</span>
        </div>
      ),
    },
    {
      title: <span style={{ color: "#E4E6EB" }}>{t.branch}</span>,
      dataIndex: "branch",
      key: "branch",
      width: "20%",
      render: (text) => <span style={{ color: "#E4E6EB" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#E4E6EB" }}>{t.user}</span>,
      dataIndex: "user",
      key: "user",
      width: "20%",
      render: (text) => <span style={{ color: "#B0B3B8" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#E4E6EB" }}>{t.status}</span>,
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) =>
        status === t.active ? (
          <Tag color="green">{status}</Tag>
        ) : (
          <Tag color="red">{status}</Tag>
        ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: "#1C1C28",
          colorText: "#E4E6EB",
          colorTextSecondary: "#B0B3B8",
          colorPrimary: "#3F8CFF",
          borderRadius: 8,
          colorBorder: "transparent",
        },
        components: {
          Table: {
            headerBg: "#101018",
            headerColor: "#E4E6EB",
            rowHoverBg: "#2A2A38",
            borderColor: "transparent",
          },
        },
      }}
    >
      <div style={{ padding: 24, minHeight: "80vh", color: "#E4E6EB" }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 style={{ fontWeight: 600, fontSize: 24 }}>{t.title}</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 bg-[#3F8CFF] w-[120px] h-[40px] rounded-lg"
          >
            <IoMdAdd style={{ color: "white", fontSize: 19 }} />
            <span className="text-white text-[13px] font-semibold">
              {t.add}
            </span>
          </button>
        </div>

        {/* Tabs */}
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <div
            className={`min-w-[140px] text-center px-5 py-3 rounded-xl cursor-pointer text-sm font-medium shadow-md transition-all duration-300
      ${status === 0
                ? "bg-[#3F8CFF] text-white shadow-lg shadow-[#3F8CFF]/40 scale-105"
                : "bg-[#2A2A38] text-[#B0B3B8] hover:bg-[#3A3A4D] hover:text-white"
              }`}
            onClick={() => {
              setStatus(0);
              setPage(1);
            }}
          >
            {t.active}
          </div>

          <div
            className={`min-w-[140px] text-center px-6 py-3 rounded-xl cursor-pointer text-sm font-medium shadow-md transition-all duration-300
      ${status === 1
                ? "bg-[#3F8CFF] text-white shadow-lg shadow-[#3F8CFF]/40 scale-105"
                : "bg-[#2A2A38] text-[#B0B3B8] hover:bg-[#3A3A4D] hover:text-white"
              }`}
            onClick={() => {
              setStatus(1);
              setPage(1);
            }}
          >
            {t.inactive}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            style={{ background: "transparent" }}
            locale={{ emptyText: t.noData }}
            onRow={(record) => ({
              onClick: () => {
                router.push(`/game-clubs/${record.key}`);
              },
            })}
          />
        )}

        {/* Bottom controls */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2">
            <Select
              value={pageSize.toString()}
              style={{ width: 80 }}
              onChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
            >
              <Select.Option value="6">6</Select.Option>
              <Select.Option value="10">10</Select.Option>
              <Select.Option value="20">20</Select.Option>
              <Select.Option value="50">50</Select.Option>
            </Select>
            <Typography.Text style={{ color: "#3F8CFF", fontWeight: 500 }}>
              {t.rowsPerPage}
            </Typography.Text>
          </div>

          <Pagination
            current={page}
            total={totalElements}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={(p) => setPage(p)}
          />
        </div>

        {/* Modal */}
        <CreateGameClubModal
          isModalOpen={isModalOpen}
          handleOk={() => {
            setIsModalOpen(false);
            fetchGameClubs(page, pageSize, status);
          }}
          handleCancel={() => setIsModalOpen(false)}
        />
      </div>
    </ConfigProvider>
  );
}

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

export default function GameClub() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalElements, setTotalElements] = useState(0);
  const [status, setStatus] = useState(0); // 🔹 0 = Актив, 1 = Неактив

  const router = useRouter();

  const fetchGameClubs = async (
    currentPage = page,
    size = pageSize,
    currentStatus = status
  ) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://backend.gamefit.uz/game-club/by-page?size=${size}&page=${currentPage - 1
        }&status=${currentStatus}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (json?.success && json?.content?.content) {
        const mappedData = json.content.content.map((club) => {
          const address = club.address;
          return {
            key: club.id,
            image:
              club.fileGameClubs?.[0]?.contentUrl || "/placeholder.png", // 🔹 Rasm
            club: club.title || "Noma'lum",
            branch: club.clubBranch || "-",
            user: club.account?.username || "—", // 🔹 Username
            status: club.statusIndex === 0 ? "Актив" : "Неактив",
            location: address
              ? `${address.cityName || ""}, ${address.districtName || ""}, ${address.streetName || ""
              }`
              : "Manzil mavjud emas",
          };
        });
        setDataSource(mappedData);
        setTotalElements(json.content.page.totalElements);
      } else {
        setDataSource([]);
      }
    } catch (err) {
      console.log("API xato:", err);
      setDataSource([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameClubs(page, pageSize, status);
  }, [page, pageSize, status]);

  const columns = [
    {
      title: <span style={{ color: "#E4E6EB" }}>Игроклуб</span>,
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
      title: <span style={{ color: "#E4E6EB" }}>Филиал</span>,
      dataIndex: "branch",
      key: "branch",
      width: "20%",
      render: (text) => <span style={{ color: "#E4E6EB" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#E4E6EB" }}>Пользователь</span>,
      dataIndex: "user",
      key: "user",
      width: "20%",
      render: (text) => <span style={{ color: "#B0B3B8" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#E4E6EB" }}>Статус</span>,
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) =>
        status === "Актив" ? (
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
          <h2 style={{ fontWeight: 600, fontSize: 24 }}>Игроклубы</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-3 bg-[#3F8CFF] w-[120px] h-[40px] rounded-lg"
          >
            <IoMdAdd style={{ color: "white", fontSize: 19 }} />
            <span className="text-white text-[13px] font-semibold">
              Добавить
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4">
          <div
            className={`px-4 py-2 rounded-lg cursor-pointer ${status === 0
              ? "bg-[#3F8CFF] text-white"
              : "bg-[#2A2A38] text-[#B0B3B8]"
              }`}
            onClick={() => {
              setStatus(0);
              setPage(1);
            }}
          >
            Актив
          </div>
          <div
            className={`px-4 py-2 rounded-lg cursor-pointer ${status === 1
              ? "bg-[#3F8CFF] text-white"
              : "bg-[#2A2A38] text-[#B0B3B8]"
              }`}
            onClick={() => {
              setStatus(1);
              setPage(1);
            }}
          >
            Неактив
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
            locale={{ emptyText: "Ma'lumot topilmadi" }}
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
              Сatrlar soni
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

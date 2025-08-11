"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  Select,
  Typography,
  Input,
  message,
  DatePicker,
  ConfigProvider,
  theme,
} from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import "../styles/globals.css";
import { useRouter } from "next/navigation";
import "../../app/styles/globals.css";

const { Option } = Select;

const getStatusColor = (index) => {
  switch (index) {
    case 0:
      return "#00D26A"; // Успешно
    case 1:
      return "#FFD93B"; // Истек срок
    case 2:
      return "#FF3B3B"; // Заблокировано
    default:
      return "#888";
  }
};

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        message.error("Access token topilmadi!");
        setTableData([]);
        setTotalElements(0);
        return;
      }

      const url = `http://backend.gamefit.uz/subscription/by-graphic?clubId=1&date=${selectedDate.format(
        "YYYY-MM-DD"
      )}&stateIndex=${activeTab}&size=${pageSize}&page=${currentPage}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setTableData([]);
        setTotalElements(0);
        throw new Error(`API xatosi: ${res.status}`);
      }

      const data = await res.json();
      const content = data?.content?.content || [];

      const mappedData = content.map((item, index) => ({
        key: index,
        token: item.subToken,
        club: item.clubName,
        branch: item.clubFilial,
        date: item.subsDate,
        name: item.subsOwner,
        room: item.roomNumber,
        rate:
          item.serviceNameIndex === 0
            ? "Успешно"
            : item.serviceNameIndex === 1
              ? "Истек срок"
              : "Заблокировано",
        price: item.subsPrice.toLocaleString("ru-RU"),
        status: item.serviceNameIndex,
        avatar: item.fileToUsers?.contentUrl || "",
      }));

      setTableData(mappedData);
      setTotalElements(data?.content?.page?.totalElements || 0);
    } catch (error) {
      console.error("Ma'lumot olishda xato:", error);
      message.error("Ma'lumotlarni olishda xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, pageSize, currentPage, selectedDate]);

  const filteredData = tableData.filter((item) =>
    (item.token + item.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "",
      dataIndex: "status",
      key: "status",
      width: 10,
      render: (status) => (
        <div
          style={{
            width: 6,
            height: 38,
            backgroundColor: getStatusColor(status),
            borderRadius: 4,
          }}
        />
      ),
    },
    {
      title: "",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img
          src={avatar}
          alt="avatar"
          style={{ width: 32, height: 32, borderRadius: "50%" }}
        />
      ),
    },
    { title: "Токен", dataIndex: "token", key: "token" },
    { title: "Игроклуб", dataIndex: "club", key: "club" },
    { title: "Филиал", dataIndex: "branch", key: "branch" },
    { title: "Дата", dataIndex: "date", key: "date" },
    { title: "Имя", dataIndex: "name", key: "name" },
    { title: "Комната", dataIndex: "room", key: "room" },
    { title: "Тариф", dataIndex: "rate", key: "rate" },
    { title: "Стоимость (сум)", dataIndex: "price", key: "price" },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: "#0F0F1A",
          colorText: "#fff",
          colorBorder: "#333",
          colorPrimary: "#3D7BFF",
        },
      }}
    >
      <div style={{ padding: 24, minHeight: "86vh", fontFamily: "Inter, sans-serif" }}>
        <h2
          style={{
            fontWeight: 600,
            fontSize: 22,
            color: "white",
            marginBottom: 10,
          }}
        >
          График
        </h2>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          {[
            { key: 0, label: "Успешно" },
            { key: 1, label: "Истек срок" },
            { key: 2, label: "Заблокировано" },
          ].map((tab) => (
            <div
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSearchTerm("");
                setCurrentPage(0);
              }}
              style={{
                background: activeTab === tab.key ? "#3D7BFF" : "transparent",
                color: activeTab === tab.key ? "#fff" : "#ccc",
                padding: "6px 18px",
                borderRadius: 8,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Calendar + Search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <DatePicker
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date || dayjs());
              setCurrentPage(0);
            }}
            format="YYYY-MM-DD"
            suffixIcon={<CalendarOutlined />}
          />

          <Input
            placeholder="Поиск токен или имя"
            prefix={<SearchOutlined style={{ color: "#999" }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: 280,
              borderRadius: 8,
              height: 36,
            }}
          />
        </div>

        {/* Table */}
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          bordered={false}
          loading={loading}
          locale={{
            emptyText: "Ma'lumot yo‘q",
          }}
          style={{
            marginTop: 10,
            borderRadius: 10,
            overflow: "hidden",
          }}
          rowClassName={() => "custom-table-row"}
          className="custom-table pt-5"
          onRow={(record) => ({
            onClick: () => router.push(`/schedules/${record.token}`),
          })}
        />

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(0);
              }}
              style={{ width: 80, height: 36 }}
            >
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="50">50</Option>
            </Select>
            <Typography.Text style={{ color: "#3D7BFF", fontWeight: 500 }}>
              Количество строк
            </Typography.Text>
          </div>

          <Pagination
            current={currentPage + 1}
            total={totalElements}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page - 1)}
            showSizeChanger={false}
            itemRender={(page, type) => {
              if (type === "prev")
                return <span style={{ color: "#3D7BFF" }}>{"<"}</span>;
              if (type === "next")
                return <span style={{ color: "#3D7BFF" }}>{"Далее"}</span>;
              return <span>{page}</span>;
            }}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}

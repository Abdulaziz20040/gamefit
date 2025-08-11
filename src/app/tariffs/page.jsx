"use client";

import React, { useState } from "react";
import { Table, Select, Pagination, Tabs } from "antd";
import { FaRegEdit } from "react-icons/fa";
import {
  MdSignalCellularAlt,
  MdSignalCellularAlt2Bar,
  MdSignalCellularAlt1Bar,
} from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const { TabPane } = Tabs;

const tariffs = [
  {
    key: "00001",
    id: "00001",
    gameClub: "Trillon",
    branch: "Sergeli",
    room: "Premium-1",
    rate: "Premium",
    cpu: "Intel Core i3-12100F",
    gpu: "Intel Arc A380 / NVIDIA GTX 1650",
    storage: "512GB NVMe SSD",
    ram: "16GB (2x8GB) DDR4 3200MHz",
    keyboard: "Redragon K552 Mechanical",
    seatCount: 10,
    price: "10$",
  },
  {
    key: "00002",
    id: "00002",
    gameClub: "Trillon",
    branch: "Sergeli",
    room: "Premium-2",
    rate: "Premium",
    cpu: "Intel Core i3-12100F",
    gpu: "Intel Arc A380 / NVIDIA GTX 1650",
    storage: "512GB NVMe SSD",
    ram: "16GB (2x8GB) DDR4 3200MHz",
    keyboard: "Redragon K552 Mechanical",
    seatCount: 10,
    price: "10$",
  },
  // ... 00003 - 00006 yozilsa bo'ladi
];

const TariffsPage = () => {
  const [activeTab, setActiveTab] = useState("premium");

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Game Club", dataIndex: "gameClub", key: "gameClub" },
    { title: "Branch", dataIndex: "branch", key: "branch" },
    { title: "Room", dataIndex: "room", key: "room" },
    { title: "Rates", dataIndex: "rate", key: "rate" },
    { title: "CPU", dataIndex: "cpu", key: "cpu" },
    { title: "GPU", dataIndex: "gpu", key: "gpu" },
    { title: "Storage", dataIndex: "storage", key: "storage" },
    { title: "RAM", dataIndex: "ram", key: "ram" },
    { title: "Keyboard", dataIndex: "keyboard", key: "keyboard" },
    { title: "Seat count", dataIndex: "seatCount", key: "seatCount" },
    { title: "Hourly Price", dataIndex: "price", key: "price" },
    {
      title: "Action",
      key: "action",
      render: () => (
        <FaRegEdit className="text-[#6984FF] text-[18px] cursor-pointer" />
      ),
    },
  ];

  return (
    <div className="px-6 py-4  ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[28px] font-bold text-[#1A1A1A]">Tariffs</h2>
        <button className="flex items-center gap-2 px-6 py-2 rounded-[10px] bg-[#3F8CFF] text-white text-[16px]">
          <IoMdAdd className="text-white text-[19px]" />
          Add Tariff
        </button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        tabBarGutter={40}
        className="mb-6"
        items={[
          {
            label: (
              <span className="flex items-center gap-2 text-[16px] font-medium">
                <MdSignalCellularAlt className="text-[#1E40AF]" size={20} />
                Standart
              </span>
            ),
            key: "standart",
            children: (
              <Table
                dataSource={tariffs}
                columns={columns}
                pagination={false}
              />
            ),
          },
          {
            label: (
              <span className="flex items-center gap-2 text-[16px] font-medium">
                <MdSignalCellularAlt2Bar className="text-[#9333EA]" size={20} />
                Premium
              </span>
            ),
            key: "premium",
            children: (
              <Table
                dataSource={tariffs}
                columns={columns}
                pagination={false}
              />
            ),
          },
          {
            label: (
              <span className="flex items-center gap-2 text-[16px] font-medium">
                <MdSignalCellularAlt1Bar className="text-[#F59E0B]" size={20} />
                VIP
              </span>
            ),
            key: "vip",
            children: (
              <Table
                dataSource={tariffs}
                columns={columns}
                pagination={false}
              />
            ),
          },
        ]}
      />

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Select defaultValue="12" style={{ width: 80 }}>
            <Select.Option value="12">12</Select.Option>
            <Select.Option value="24">24</Select.Option>
          </Select>
          <span className="text-[#3D7BFF] font-medium">Satirlar soni</span>
        </div>
        <Pagination
          current={1}
          pageSize={12}
          total={50}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default TariffsPage;

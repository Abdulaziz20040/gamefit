"use client";

import React, { useState, useEffect } from "react";
import { Table, Tag, Image } from "antd";
import "antd/dist/reset.css";
import { FaRegEdit, FaHeart } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/navigation";
import CreateGameClubsModal from "../components/modals/CreateGameClubsModal";
import { API } from "@/config/api";

export default function GameClub() {
  const router = useRouter();

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // Ant Design 1-based
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // API orqali ma'lumotlarni yuklash
  const fetchData = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const data = await API.getGameClubs({ page, size });

      if (data?.success && data?.content?.content) {
        const tableData = data.content.content.map((club) => ({
          key: club.id,
          id: club.id,
          title: club.title,
          branch: club.clubBranch,
          description: club.description,
          startTime: club.startAt,
          endTime: club.endAt,
          status: club.statusIndex === 0 ? "Active" : "Inactive",
          location: `${club.address?.cityName || ""}, ${club.address?.districtName || ""}, ${club.address?.streetName || ""}`,
          country: club.address?.countryName || "",
          latitude: club.address?.latitude || "",
          longitude: club.address?.longitude || "",
          likes: club.favorite?.countLikes || 0,
          likedUsers: club.favorite?.likedUserIds || [],
          admin: club.account?.fullName || "Admin yo'q",
          phone: club.account?.phone || "Noma'lum",
          images: club.fileGameClubs || [],
          mainImage: club.fileGameClubs?.[0]?.contentUrl || "",
        }));

        setDataSource(tableData);
        setTotalElements(data.content.page.totalElements);
      }
    } catch (err) {
      console.error("❌ fetchData error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      fixed: 'left'
    },
    {
      title: "Image",
      dataIndex: "mainImage",
      key: "mainImage",
      width: 80,
      render: (image) => (
        image ? (
          <Image
            src={image}
            alt="Club"
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            preview={false}
          />
        ) : (
          <div style={{
            width: 50,
            height: 50,
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#999'
          }}>
            No Image
          </div>
        )
      )
    },
    {
      title: "Game Club Title",
      dataIndex: "title",
      key: "title",
      width: 180,
      ellipsis: true
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      width: 150,
      ellipsis: true
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
      render: (text) => (
        <div title={text} style={{ maxWidth: 200 }}>
          {text?.length > 50 ? `${text.substring(0, 50)}...` : text}
        </div>
      )
    },
    {
      title: "Working Hours",
      key: "workingHours",
      width: 120,
      render: (_, record) => (
        <div>
          <div>{record.startTime}</div>
          <div>{record.endTime}</div>
        </div>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 200,
      ellipsis: true
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 100
    },
    {
      title: "Coordinates",
      key: "coordinates",
      width: 120,
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>Lat: {record.latitude}</div>
          <div>Lng: {record.longitude}</div>
        </div>
      )
    },
    {
      title: "Likes",
      key: "likes",
      width: 80,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FaHeart style={{ color: '#ff4d4f', fontSize: '14px' }} />
          <span>{record.likes}</span>
        </div>
      )
    },
    {
      title: "Images Count",
      key: "imagesCount",
      width: 100,
      render: (_, record) => (
        <Tag color="blue">{record.images.length} images</Tag>
      )
    },
    {
      title: "Admin",
      dataIndex: "admin",
      key: "admin",
      width: 120,
      ellipsis: true
    },
    {
      title: "Telephone",
      dataIndex: "phone",
      key: "phone",
      width: 120
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <FaRegEdit
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/game-club/${record.id}`); // details sahifaga o'tish
          }}
          style={{ color: "#6984FF" }}
          className="size-[18px] cursor-pointer"
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24, minHeight: "80vh" }}>
      <div className="flex items-center justify-between p-[5px]">
        <h2 style={{ fontWeight: 600, fontSize: 24 }}>Game Club Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            color: "white",
            fontWeight: 300,
            fontSize: 16,
            borderRadius: 10,
          }}
          className="flex items-center cursor-pointer justify-center gap-3 bg-[#3F8CFF] w-[181px] h-[45px]"
        >
          <IoMdAdd style={{ color: "white", fontSize: 19 }} />
          Add Club
        </button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        loading={loading}
        bordered
        scroll={{ x: 1800, y: 600 }}
        pagination={{
          current: currentPage,
          total: totalElements,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} clubs`,
        }}
        onRow={(record) => ({
          onClick: () => router.push(`/game-club/${record.id}`),
          style: { cursor: 'pointer' }
        })}
        style={{
          marginTop: 20,
          backgroundColor: "white",
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        size="middle"
      />

      <CreateGameClubsModal
        isModalOpen={isModalOpen}
        handleOk={() => {
          setIsModalOpen(false);
          fetchData(); // Refresh data after adding new club
        }}
        handleCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}
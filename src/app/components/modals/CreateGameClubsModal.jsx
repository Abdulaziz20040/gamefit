import React, { useState } from "react";
import { Modal, Input, Button, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "../../styles/globals.css";
import axiosInstance from "@/app/utils/axiosInstance";

const CreateGameClubModal = ({ isModalOpen, handleOk, handleCancel }) => {
  const [fileList, setFileList] = useState([]);
  const [club, setClub] = useState("");
  const [description, setDescription] = useState("");
  const [branch, setBranch] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const [apiMessage, contextHolder] = message.useMessage();

  /** Rasm tanlash */
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const reader = new FileReader();
      reader.onload = () => localStorage.setItem("clubImage", reader.result);
      reader.readAsDataURL(newFileList[0].originFileObj);
    } else {
      localStorage.removeItem("clubImage");
    }
  };

  /** Faqat rasm yuklashga ruxsat */
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) apiMessage.error("Faqatgina rasm yuklash mumkin!");
    return isImage || Upload.LIST_IGNORE;
  };

  /** Base64 → File */
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  /** Formani tozalash */
  const resetForm = () => {
    setClub("");
    setDescription("");
    setBranch("");
    setStartTime("");
    setEndTime("");
    setFileList([]);
    localStorage.removeItem("clubImage");
  };

  /** Vaqt formatini tekshirish va to'g'rilash */
  const formatTime = (time) => {
    if (!time || !time.trim()) return "";

    const cleanTime = time.trim();
    const timeRegex = /^([0-9]{1,2}):([0-9]{1,2})$/;
    const match = cleanTime.match(timeRegex);

    if (!match) return null;

    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);

    if (hours > 23 || minutes > 59) return null;

    // 2 xonali formatga o'tkazish
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  /** Saqlash */
  const handleSave = async () => {
    // Majburiy maydonlarni tekshirish
    if (!club.trim() || !branch.trim()) {
      apiMessage.error("Klub nomi va filialni to'ldiring!");
      return;
    }

    if (fileList.length === 0) {
      apiMessage.error("Rasm yuklang!");
      return;
    }

    // Vaqtni tekshirish va formatga o'tkazish
    let formattedStartTime = "";
    let formattedEndTime = "";

    if (startTime.trim()) {
      formattedStartTime = formatTime(startTime);
      if (formattedStartTime === null) {
        apiMessage.error("Boshlanish vaqtini to'g'ri formatda kiriting (masalan: 10:00)");
        return;
      }
    }

    if (endTime.trim()) {
      formattedEndTime = formatTime(endTime);
      if (formattedEndTime === null) {
        apiMessage.error("Tugash vaqtini to'g'ri formatda kiriting (masalan: 18:00)");
        return;
      }
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        apiMessage.error("Token topilmadi!");
        return;
      }

      // Yuboriladigan ma'lumot
      const payload = {
        title: club.trim(),
        clubBranch: branch.trim(),
        description: description.trim() || "Tavsif mavjud emas",
      };

      // Vaqtlarni qo'shish (agar mavjud bo'lsa)
      if (formattedStartTime) {
        payload.startAt = formattedStartTime;
      }
      if (formattedEndTime) {
        payload.endAt = formattedEndTime;
      }

      console.log("Yuborilayotgan ma'lumot:", payload);

      // Klub yaratish API chaqiruvi
      const res = await axiosInstance.post(
        "http://backend.gamefit.uz/game-club",
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API javobi:", res.data);

      // Yaratilgan klub ID olish
      const createdClubId = res.data?.content?.id;
      if (!createdClubId) {
        apiMessage.error("Yaratilgan klub ID topilmadi!");
        return;
      }

      console.log("Yaratilgan klub ID:", createdClubId);

      // Rasm yuklash
      const imageBase64 = localStorage.getItem("clubImage");
      if (imageBase64) {
        const formData = new FormData();
        formData.append("club-id", createdClubId.toString());
        formData.append(
          "file",
          dataURLtoFile(imageBase64, `club-${Date.now()}.png`)
        );

        console.log("Rasm yuklash uchun FormData:", formData.get("club-id"));

        const uploadResponse = await axiosInstance.post(
          "http://backend.gamefit.uz/file-to-club/upload",
          formData,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Rasm yuklash javobi:", uploadResponse.data);
      }

      apiMessage.success("✅ Klub muvaffaqiyatli yaratildi!");
      resetForm();
      handleOk();

    } catch (err) {
      console.error("XATOLIK:", err.response?.data || err.message);
      apiMessage.error(
        err.response?.data?.message || "❌ Xatolik yuz berdi!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => {
        handleCancel();
        resetForm();
      }}
      footer={null}
      closable
      centered
      width={480}
      title={<div className="text-white text-lg font-semibold">🎮 Klub yaratish</div>}
      className="custom-dark-modal"
    >
      {contextHolder}
      <div className="space-y-4">
        {/* Rasm yuklash */}
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={beforeUpload}
          multiple={false}
        >
          <div>
            <PlusOutlined />
            <div>Rasm yuklash</div>
          </div>
        </Upload>

        {/* Klub nomi */}
        <div>
          <label className="block text-sm text-white mb-1">Klub nomi *</label>
          <Input
            value={club}
            onChange={(e) => setClub(e.target.value)}
            placeholder="Masalan: Trillon"
          />
        </div>

        {/* Tavsif */}
        <div>
          <label className="block text-sm text-white mb-1">Tavsif</label>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Klub haqida"
          />
        </div>

        {/* Filial */}
        <div>
          <label className="block text-sm text-white mb-1">Filial *</label>
          <Input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Masalan: Sergeli"
          />
        </div>

        {/* Ish vaqti */}
        <div>
          <label className="block text-sm text-white mb-1">Ish vaqti (ixtiyoriy)</label>
          <div className="flex gap-2">
            <Input
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="Boshlanish (masalan: 10:00)"
              className="w-1/2"
            />
            <Input
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="Tugash (masalan: 18:00)"
              className="w-1/2"
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Vaqtni HH:MM formatida kiriting (masalan: 09:30, 18:00)
          </div>
        </div>

        {/* Tugmalar */}
        <div className="flex justify-between mt-6">
          <Button
            style={{ width: "48%" }}
            onClick={() => {
              handleCancel();
              resetForm();
            }}
            disabled={loading}
          >
            Bekor qilish
          </Button>
          <Button
            type="primary"
            style={{ width: "48%" }}
            onClick={handleSave}
            loading={loading}
          >
            Saqlash
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGameClubModal;
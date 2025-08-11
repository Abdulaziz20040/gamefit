import React, { useState } from "react";
import { Modal, Input, Button, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import DatePicker from "react-datepicker";
import "../../styles/globals.css";

const CreateGameClubModal = ({ isModalOpen, handleOk, handleCancel }) => {
  const [fileList, setFileList] = useState([]);
  const [club, setClub] = useState("");
  const [description, setDescription] = useState("");
  const [branch, setBranch] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const [apiMessage, contextHolder] = message.useMessage();

  /** Rasm tanlash */
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const reader = new FileReader();
      reader.onload = () => localStorage.setItem("clubImage", reader.result);
      reader.readAsDataURL(newFileList[0].originFileObj);
    }
  };

  /** Rasm faqat image bo‘lishi kerak */
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) apiMessage.error("Faqatgina rasm yuklash mumkin!");
    return isImage || Upload.LIST_IGNORE;
  };

  /** Base64 -> File */
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
    setStartTime(null);
    setEndTime(null);
    setFileList([]);
    localStorage.removeItem("clubImage");
  };

  /** Club yaratish */
  const handleSave = async () => {
    if (!club || !branch) {
      apiMessage.error("Klub nomi va filialni to‘ldiring!");
      return;
    }

    if (fileList.length === 0) {
      apiMessage.error("Rasm yuklang!");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");
      const clubId = localStorage.getItem("clubId");

      if (!token || !clubId) {
        apiMessage.error("Token yoki clubId topilmadi!");
        return;
      }

      // 1-BOSQICH: Ma'lumotlarni yuborish
      const payload = {
        title: club,
        clubBranch: branch,
        description: description || "Tavsif mavjud emas",
        startAt: startTime
          ? startTime.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
          : null,
        endAt: endTime
          ? endTime.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
          : null,
      };

      const res = await axios.post("http://backend.gamefit.uz/game-club", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-club-id": clubId,
        },
      });

      const createdId = res.data?.id;
      if (!createdId) {
        apiMessage.error("Yaratilgan klub ID topilmadi!");
        return;
      }

      // 2-BOSQICH: Rasm yuklash
      const imageBase64 = localStorage.getItem("clubImage");
      if (imageBase64) {
        const formData = new FormData();
        formData.append("club-id", createdId); // Postman’dagi kabi
        formData.append("file", dataURLtoFile(imageBase64, `club-${Date.now()}.png`));

        await axios.post("http://backend.gamefit.uz/file-to-club/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      apiMessage.success("✅ Klub muvaffaqiyatli yaratildi!");
      resetForm();
      handleOk();
    } catch (err) {
      console.error("XATOLIK: ", err.response?.data || err.message);
      apiMessage.error(
        err.response?.data?.message || "❌ Xatolik yuz berdi! Qayta urinib ko‘ring."
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
          <label className="block text-sm text-white mb-1">Klub nomi</label>
          <Input
            value={club}
            onChange={(e) => setClub(e.target.value)}
            placeholder="Masalan: Trillon"
          />
        </div>

        {/* Tavsif */}
        <div>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Klub haqida"
          />
        </div>

        {/* Filial */}
        <div>
          <label className="block text-sm text-white mb-1">Filial</label>
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
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Boshlanish"
              dateFormat="HH:mm"
              placeholderText="Boshlanish"
              className="w-1/2 rounded-md px-2 py-1"
            />
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Tugash"
              dateFormat="HH:mm"
              placeholderText="Tugash"
              className="w-1/2 rounded-md px-2 py-1"
            />
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

import React, { useState } from "react";
import { Modal, Input, Button, Select, Upload } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  CloseOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const CreateAccountModal = ({ isModalOpen, handleOk, handleCancel }) => {
  return (
    <Modal
      open={isModalOpen}
      footer={null}
      closable={false}
      width={400}
      className="custom-modal"
    >
      <div className="relative p-2 rounded-xl ">
        {/* Close Button */}
        <div className=" flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="absolute top-3 right-4 cursor-pointer text-gray-500 hover:text-black"
          >
            <CloseOutlined />
          </button>

          {/* Title */}
          <h2
            style={{
              fontWeight: 600,
            }}
            className="text-xl mb-4 text-start text-black"
          >
            Create Account
          </h2>
        </div>

        {/* Profile image */}
        <div className="flex justify-center mb-4 mt-6">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm mb-1 font-semibold block text-gray-700">
              User Name
            </label>
            <Input
              placeholder="Abdusalomov Bektosh"
              className="rounded-md h-10"
            />
          </div>

          <div>
            <label className="text-sm mb-1 font-semibold block text-gray-700">
              Password
            </label>
            <Input.Password
              placeholder="*******"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="rounded-md h-10"
            />
          </div>

          <div>
            <label className="text-sm mb-1 font-semibold block text-gray-700">
              Role
            </label>
            <Select
              defaultValue="Super admin"
              className="w-full rounded-md h-10"
              dropdownStyle={{ borderRadius: "8px" }}
            >
              <Option value="Super admin">Super admin</Option>
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
            </Select>
          </div>

          <div>
            <label className="text-sm mb-1 font-semibold block text-gray-700">
              Game Club Title
            </label>
            <Input placeholder="Trilion" className="rounded-md h-10" />
          </div>

          <div>
            <label className="text-sm mb-1 font-semibold block text-gray-700">
              Branch
            </label>
            <Input placeholder="Sergeli" className="rounded-md h-10" />
          </div>

          <div>
            <label className="text-sm mb-1 font-semibold block text-gray-700">
              Mobile Number
            </label>
            <Input
              placeholder="+998(99)123-45-67"
              className="rounded-md h-10"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between mt-6 pt-4 ">
          <Button
            style={{
              width: "100px",
              height: "36px",
              background: "#e4e4e7",
              color: "#999",
              border: "none",
            }}
          >
            Block
          </Button>
          <Button
            danger
            style={{
              width: "100px",
              height: "36px",
              borderColor: "#f87171",
              color: "#f87171",
            }}
          >
            Delete
          </Button>
          <Button
            type="primary"
            style={{
              width: "100px",
              height: "36px",
              background: "#3b82f6",
            }}
            onClick={handleOk}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAccountModal;

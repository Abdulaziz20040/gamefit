"use client";
// app/page.tsx yoki pages/page.tsx
import React from "react";

import dayjs from "dayjs";
import { DatePicker } from "antd";

function Statistic() {
  const chartData = [
    { day: "Mo", height: 60 },
    { day: "Tu", height: 90 },
    { day: "We", height: 70 },
    { day: "Th", height: 130 }, // O'NG TOMON KO‘K diagramma balandroq
    { day: "Fr", height: 80 },
    { day: "Sa", height: 50 },
    { day: "Su", height: 85 },
  ];

  return (
    <div
      style={{
        borderRadius: "20px 20px 20px 20px",
      }}
      className="p-6 bg-gray-100 overflow-y-auto h-[650px] text-[#2E2E2E]"
    >
      <h1 className="text-3xl font-bold mb-6">Statistic</h1>

      <div className="flex gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm mb-1">Year</label>
          <DatePicker
            picker="year"
            className="w-40"
            defaultValue={dayjs()}
            allowClear={false}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">Day</label>
          <DatePicker
            className="w-40"
            defaultValue={dayjs()}
            allowClear={false}
          />
        </div>
      </div>

      {/* 5ta Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          {
            title: "Total Sales",
            value: "$27 632",
            diff: "+2.5%",
            compare: "$21340",
          },
          {
            title: "New Customers",
            value: "$5 232",
            diff: "+1.4%",
            compare: "$4240",
          },
          {
            title: "Activ Users",
            value: "$22 400",
            diff: "+1.3%",
            compare: "$21340",
          },
          { title: "Visits", value: "24 150", diff: "+1.3%", compare: "23230" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg ">
            <p className="text-sm text-gray-500">{item.title}</p>
            <div className="text-2xl font-bold">
              {item.value}{" "}
              <span className="text-green-500 text-sm">{item.diff}↑</span>
            </div>
            <p className="text-sm text-gray-400">
              Compared to ({item.compare} last year)
            </p>
          </div>
        ))}
      </div>

      {/* Pastki Chartlar */}
      <div className=" flex  justify-between">
        {/* Chapdagi Circle chart */}
        <div className="bg-white p-6 rounded-lg shadow w-[300px] h-[400px] flex flex-col items-center">
          <p className="text-gray-500 mb-2">Sales Growth</p>
          <p className="mb-4 text-sm text-gray-400">$27 632</p>

          <div className="relative w-40 h-40">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-500 transition-all duration-500"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeDasharray="82, 100"
                fill="none"
                d="M18 2.0845
           a 15.9155 15.9155 0 0 1 0 31.831
           a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#4f46e5]">
              82%
            </div>
          </div>

          <p className="text-sm mt-2 text-gray-400">Value Name</p>
        </div>

        {/* o'ngdagi chartlar */}
        <div className="bg-white rounded-xl shadow-md p-6 w-[874px]">
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800">Earning Report</h2>
          <p className="text-sm text-gray-400 mb-4">Weekly Overview</p>

          {/* TOP: $508 + Chart in flex */}
          <div className="flex items-end justify-between gap-6">
            {/* Left - Amount */}
            <div className="flex-1">
              <div className="text-5xl font-extrabold text-gray-800 mb-2">
                $508
              </div>
              <p className="text-xs text-gray-400 mb-2">
                This week’s total earnings overview
              </p>
            </div>

            {/* Right - Bar Chart */}
            <div className="flex-[2] flex justify-between items-end h-48 px-4">
              {chartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-5 rounded-md transition-all duration-300 ${
                      item.day === "Th"
                        ? "bg-blue-600"
                        : "bg-blue-300 hover:bg-blue-400"
                    }`}
                    style={{ height: `${item.height * 1.4}px` }}
                  ></div>
                  <span className="text-xs mt-2 text-gray-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom - 3 Stats */}
          <div className="grid grid-cols-3 gap-4 text-center mt-8">
            {/* Earning */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Earning</p>
              <p className="text-xl font-bold text-gray-800 mb-1">$508.6</p>
              <div className="w-full h-1 bg-gray-200 rounded">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>

            {/* Profit */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Profit</p>
              <p className="text-xl font-bold text-gray-800 mb-1">$508.6</p>
              <div className="w-full h-1 bg-purple-500 rounded">
                <div
                  className="h-full bg-purple-500 rounded"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>

            {/* Withdraw */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Withdraw</p>
              <p className="text-xl font-bold text-gray-800 mb-1">$138.4</p>
              <div className="w-full h-1 bg-blue-200 rounded">
                <div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistic;

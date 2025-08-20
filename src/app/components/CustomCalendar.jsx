"use client";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomCalendar({
    translations,
    language,
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
}) {
    return (
        <>
            {/* CSS Stillari */}
            <style jsx global>{`
                /* React DatePicker asosiy konteyner */
                .react-datepicker {
                    background-color: rgba(17, 24, 39, 0.8) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: none !important;
                    border-radius: 12px !important;
                    padding: 16px;
                    color: white !important;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                }

                /* Header qismi */
                .react-datepicker__header {
                    background-color: transparent !important;
                    border-bottom: none !important;
                    padding: 12px 0;
                }

                /* Navigation buttonlar */
                .react-datepicker__navigation {
                    background: rgba(75, 85, 99, 0.5) !important;
                    border-radius: 8px !important;
                    border: none !important;
                    width: 32px !important;
                    height: 32px !important;
                    top: 14px !important;
                    transition: all 0.2s ease !important;
                }

                .react-datepicker__navigation:hover {
                    background: rgba(75, 85, 99, 0.8) !important;
                    transform: scale(1.05) !important;
                }

                .react-datepicker__navigation--previous {
                    left: 12px !important;
                }

                .react-datepicker__navigation--next {
                    right: 12px !important;
                }

                /* Oy va yil selector */
                .react-datepicker__current-month {
                    color: #e5e7eb !important;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                /* Kun nomlari */
                .react-datepicker__day-name {
                    color: #9ca3af !important;
                    font-weight: 500;
                    font-size: 13px;
                }

                /* Kunlar */
                .react-datepicker__day {
                    color: #e5e7eb !important;
                    border-radius: 8px !important;
                    transition: all 0.2s ease;
                    font-size: 14px;
                    margin: 2px;
                    padding: 6px;
                }

                /* Tanlangan kun */
                .react-datepicker__day--selected,
                .react-datepicker__day--keyboard-selected {
                    background-color: #06b6d4 !important;
                    color: white !important;
                    border-radius: 8px !important;
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.3);
                }

                /* Hover effekt */
                .react-datepicker__day:hover {
                    background-color: rgba(6, 182, 212, 0.3) !important;
                    border-radius: 8px !important;
                }

                /* Bugungi kun */
                .react-datepicker__day--today {
                    background-color: rgba(59, 130, 246, 0.3) !important;
                    color: #93c5fd !important;
                    border-radius: 8px !important;
                }

                /* Disabled holatda */
                .react-datepicker__day--disabled {
                    color: rgba(156, 163, 175, 0.5) !important;
                }

                /* Tashqarida kun */
                .react-datepicker__day--outside-month {
                    color: rgba(156, 163, 175, 0.3) !important;
                }

                /* Weekend kunlari */
                .react-datepicker__day--weekend {
                    color: #f87171 !important;
                }

                /* Time Container - Glassmorphism */
                .react-datepicker__time-container {
                    background-color: rgba(17, 24, 39, 0.8) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: none !important;
                    border-left: 1px solid rgba(75, 85, 99, 0.2) !important;
                    border-radius: 0 12px 12px 0 !important;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }

                /* Time Box - orqa fon */
                .react-datepicker__time {
                    background-color: rgba(17, 24, 39, 0.8) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border-radius: 0 12px 12px 0 !important;
                }

                /* Time List orqa fon */
                .react-datepicker__time-list {
                    background-color: rgba(17, 24, 39, 0.8) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    scrollbar-width: thin !important;
                    scrollbar-color: rgba(75, 85, 99, 0.5) rgba(17, 24, 39, 0.3) !important;
                    border-radius: 0 12px 12px 0 !important;
                    padding: 4px !important;
                }

                .react-datepicker__time-list::-webkit-scrollbar {
                    width: 6px !important;
                }

                .react-datepicker__time-list::-webkit-scrollbar-track {
                    background: rgba(17, 24, 39, 0.3) !important;
                    border-radius: 3px !important;
                }

                .react-datepicker__time-list::-webkit-scrollbar-thumb {
                    background: rgba(75, 85, 99, 0.6) !important;
                    border-radius: 3px !important;
                }

                .react-datepicker__time-list::-webkit-scrollbar-thumb:hover {
                    background: rgba(75, 85, 99, 0.8) !important;
                }

                .react-datepicker__time-list-item {
                    color: #e5e7eb !important;
                    transition: all 0.2s ease;
                    border-radius: 8px !important;
                    margin: 2px 6px !important;
                    padding: 8px 12px !important;
                    font-size: 13px !important;
                    background-color: transparent !important;
                }

                .react-datepicker__time-list-item:hover {
                    background-color: rgba(6, 182, 212, 0.3) !important;
                    border-radius: 8px !important;
                    color: white !important;
                }

                .react-datepicker__time-list-item--selected {
                    background-color: #06b6d4 !important;
                    color: white !important;
                    border-radius: 8px !important;
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.3) !important;
                }

                .react-datepicker__time-list-item--disabled {
                    color: rgba(156, 163, 175, 0.5) !important;
                    background-color: transparent !important;
                }

                /* Time header */
                .react-datepicker__time-name {
                    color: #9ca3af !important;
                    font-weight: 600 !important;
                    font-size: 13px !important;
                    padding: 12px 8px 8px 8px !important;
                    border-bottom: 1px solid rgba(75, 85, 99, 0.3) !important;
                    margin-bottom: 4px !important;
                    background-color: transparent !important;
                    text-align: center !important;
                }

                /* Custom Calendar */
                .custom-calendar {
                    background-color: rgba(17, 24, 39, 0.8) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: none !important;
                    border-radius: 12px !important;
                    padding: 16px;
                    color: #e5e7eb !important;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                }

                /* DatePicker Input (faqat sana uchun) */
                .datepicker-input {
                    width: 200px;
                    background: rgba(0, 0, 0, 0.4) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: none !important;
                    border-radius: 10px;
                    padding: 10px 12px;
                    font-size: 14px;
                    color: #fff;
                    outline: none;
                    transition: all 0.2s ease;
                }

                .datepicker-input:focus {
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.5);
                    background: rgba(0, 0, 0, 0.6) !important;
                }

                .datepicker-input::placeholder {
                    color: rgba(200, 200, 200, 0.6);
                }

                /* Glassmorphism Input (DatePicker with time uchun) */
                .glassmorphism-input {
                    width: 250px;
                    background: rgba(0, 0, 0, 0.4) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: none !important;
                    border-radius: 10px;
                    padding: 10px 12px;
                    font-size: 14px;
                    color: #fff;
                    outline: none;
                    transition: all 0.2s ease;
                }

                .glassmorphism-input:focus {
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.5);
                    background: rgba(0, 0, 0, 0.6) !important;
                }

                .glassmorphism-input::placeholder {
                    color: rgba(200, 200, 200, 0.6);
                }

                /* DatePicker input uchun maxsus */
                .react-datepicker__input-container input {
                    width: 200px !important;
                    background: rgba(0, 0, 0, 0.4) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    border: none !important;
                    border-radius: 10px !important;
                    padding: 10px 12px !important;
                    font-size: 14px !important;
                    color: #fff !important;
                    outline: none !important;
                    transition: all 0.2s ease !important;
                }

                .react-datepicker__input-container input:focus {
                    box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.5) !important;
                    background: rgba(0, 0, 0, 0.6) !important;
                }

                .react-datepicker__input-container input::placeholder {
                    color: rgba(200, 200, 200, 0.6) !important;
                }
            `}</style>

            <div className="flex items-center gap-6 flex-wrap">
                {/* Chap tomondagi Calendar - faqat sana */}
                <label className="text-sm flex flex-col">
                    <span className="text-gray-300 mb-2 font-medium">
                        {translations.date[language]}:
                    </span>
                    <DatePicker
                        selected={selectedDate && !isNaN(new Date(selectedDate)) ? new Date(selectedDate) : null}
                        onChange={(date) => {
                            if (date) {
                                setSelectedDate(date.toISOString().split("T")[0]);
                            } else {
                                setSelectedDate("");
                            }
                        }}
                        dateFormat="dd.MM.yyyy"
                        className="datepicker-input"
                        calendarClassName="custom-calendar"
                        placeholderText="Sanani tanlang"
                    />
                </label>

                {/* O'ng tomondagi datetime inputlar - DatePicker with time */}
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Boshlanish sanasi va vaqti */}
                    <label className="text-sm flex flex-col">
                        <span className="text-gray-300 mb-2 font-medium">
                            {translations.start[language]}:
                        </span>
                        <DatePicker
                            selected={startTime && !isNaN(new Date(startTime)) ? new Date(startTime) : null}
                            onChange={(date) => {
                                if (date) {
                                    setStartTime(date.toISOString().slice(0, 16));
                                } else {
                                    setStartTime("");
                                }
                            }}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd/MM/yyyy HH:mm"
                            className="glassmorphism-input"
                            placeholderText="DD/MM/YYYY HH:mm"
                            calendarClassName="react-datepicker"
                        />
                    </label>

                    {/* Tugash sanasi va vaqti */}
                    <label className="text-sm flex flex-col">
                        <span className="text-gray-300 mb-2 font-medium">
                            {translations.end[language]}:
                        </span>
                        <DatePicker
                            selected={endTime && !isNaN(new Date(endTime)) ? new Date(endTime) : null}
                            onChange={(date) => {
                                if (date) {
                                    setEndTime(date.toISOString().slice(0, 16));
                                } else {
                                    setEndTime("");
                                }
                            }}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd/MM/yyyy HH:mm"
                            className="glassmorphism-input"
                            placeholderText="DD/MM/YYYY HH:mm"
                            calendarClassName="react-datepicker"
                            minDate={startTime && !isNaN(new Date(startTime)) ? new Date(startTime) : null}
                        />
                    </label>
                </div>
            </div>
        </>
    );
}
"use client";

import React, { useState } from "react";

export default function PaymentsTable() {
    // Fake data
    const data = Array.from({ length: 30 }).map((_, idx) => ({
        account: "012222332",
        ident: "0101010101",
        subNumber: `CP0000${idx + 1}`,
        phone: "99 1234567",
        date: "14.07.2025",
        type: idx % 2 === 0 ? "payme" : "click",
        amount: "270 000",
    }));

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentData = data.slice(startIndex, startIndex + rowsPerPage);

    const paginationBtnStyle = {
        background: "transparent",
        color: "#ccc",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
    };

    return (
        <div
            style={{
                borderRadius: "12px",
                padding: "16px",
                color: "#f0f0f0",
                fontFamily: "sans-serif",
                overflow: "hidden", // jadval chetga chiqmasin
            }}
        >
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "fixed", // qat’iy width
                }}
            >
                <thead>
                    <tr style={{ textAlign: "left", color: "#ccc", fontSize: "14px" }}>
                        <th style={{ padding: "10px", width: "14%", wordBreak: "break-word" }}>Номер счёта</th>
                        <th style={{ padding: "10px", width: "14%", wordBreak: "break-word" }}>Идентифик.</th>
                        <th style={{ padding: "10px", width: "16%", wordBreak: "break-word" }}>Номер подписки</th>
                        <th style={{ padding: "10px", width: "16%", wordBreak: "break-word" }}>Телефон</th>
                        <th style={{ padding: "10px", width: "12%", wordBreak: "break-word" }}>Дата</th>
                        <th style={{ padding: "10px", width: "12%", wordBreak: "break-word" }}>Тип</th>
                        <th style={{ padding: "10px", textAlign: "right", width: "16%", wordBreak: "break-word" }}>
                            Сумма
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row, idx) => (
                        <tr
                            key={idx}
                            style={{
                                borderBottom: "1px solid #2b2c32",
                                fontSize: "14px",
                                color: "#ddd",
                            }}
                        >
                            <td style={{ padding: "12px" }}>{row.account}</td>
                            <td style={{ padding: "12px" }}>{row.ident}</td>
                            <td style={{ padding: "12px" }}>{row.subNumber}</td>
                            <td style={{ padding: "12px" }}>{row.phone}</td>
                            <td style={{ padding: "12px" }}>{row.date}</td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                                {row.type === "payme" ? (
                                    <span
                                        style={{
                                            background: "#2b2c32",
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            color: "#4aa8ff",
                                            fontWeight: "bold",
                                            display: "inline-block",
                                            minWidth: "60px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Payme
                                    </span>
                                ) : (
                                    <span
                                        style={{
                                            background: "#2b2c32",
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            color: "#00BFFF",
                                            fontWeight: "bold",
                                            display: "inline-block",
                                            minWidth: "60px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Click
                                    </span>
                                )}
                            </td>
                            <td style={{ padding: "12px", textAlign: "right" }}>{row.amount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "14px",
                    fontSize: "14px",
                    color: "#ccc",
                }}
            >
                {/* Chapdagi select */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <select
                        style={{
                            background: "transparent",
                            border: "1px solid #444",
                            color: "#ddd",
                            padding: "4px 8px",
                            borderRadius: "6px",
                        }}
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value="6">6</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                    </select>
                    Количество строк
                </div>

                {/* O‘ngdagi sahifalar */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                        style={paginationBtnStyle}
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        {"<"}
                    </button>

                    {[...Array(totalPages)].map((_, pageIdx) => (
                        <span
                            key={pageIdx}
                            onClick={() => setCurrentPage(pageIdx + 1)}
                            style={{
                                padding: "4px 8px",
                                background: currentPage === pageIdx + 1 ? "#2b2c32" : "transparent",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            {pageIdx + 1}
                        </span>
                    ))}

                    <button
                        style={paginationBtnStyle}
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        {">"}
                    </button>
                </div>
            </div>
        </div>
    );
}

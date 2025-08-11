"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("+998978096972"); // default qiymat
    const [password, setPassword] = useState("root"); // default qiymat
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // APIga POST so'rovi
            const response = await axios.post(
                "http://backend.gamefit.uz/auth/get-club-token",
                {
                    username: username,
                    password: password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;
            console.log("Response:", data);

            if (!data.content?.accessToken) {
                throw new Error("Login failed!");
            }

            const accessToken = data.content.accessToken;
            localStorage.setItem("accessToken", accessToken);

            // Tokenni decode qilib clubId va username saqlash
            try {
                const tokenParts = accessToken.split(".");
                const payload = JSON.parse(atob(tokenParts[1]));

                if (payload.sub) {
                    const clubData = JSON.parse(payload.sub);
                    localStorage.setItem("clubId", clubData.clubId);
                    localStorage.setItem("clubUsername", clubData.username);
                }
            } catch (err) {
                console.warn("Token decode qilishda xatolik:", err);
            }

            // Navigate asosiy pagega
            router.push("/");
        } catch (error) {
            console.error("❌", error);
            alert("Login xatolik! Foydalanuvchi nomi yoki parol xato.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[#0E0E15]">
            <div className="flex w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                {/* Chap tomoni */}
                <div className="w-[70%] relative">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url(/loginbg.jpg)" }}
                    ></div>
                    <div className="absolute inset-0 backdrop-blur-[8px] bg-black/40" />
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-10 z-10">
                        <div className="text-6xl font-bold mb-5 flex items-center gap-4 drop-shadow-md">
                            <div className="bg-[#1846C7] p-3 rounded-lg shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                </svg>
                            </div>
                            <span style={{ textShadow: "0 0 10px rgba(255,255,255,0.7)" }}>GameFit</span>
                        </div>
                        <p className="text-center text-base font-light max-w-xs leading-relaxed text-white/90">
                            Контроль, порядок, заработок — все в одном приложении
                        </p>
                    </div>
                </div>

                {/* O‘ng tomoni */}
                <div className="w-[30%] bg-[#14141F] px-8 py-10 flex flex-col justify-center z-10">
                    <h2 className="text-white text-xl font-semibold mb-6 text-center tracking-widest">
                        ВОЙТИ В СИСТЕМУ
                    </h2>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Логин"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-3 rounded-lg bg-[#1E1E2A] border border-[#2A2A3A] text-white placeholder-white/60 focus:outline-none focus:border-[#328BFF]"
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3 rounded-lg bg-[#1E1E2A] border border-[#2A2A3A] text-white placeholder-white/60 focus:outline-none focus:border-[#328BFF]"
                        />
                        <div className="flex items-center text-white text-sm">
                            <input type="checkbox" className="mr-2 w-4 h-4 accent-[#328BFF]" defaultChecked />
                            Запоминание
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 cursor-pointer bg-[#00B2FF] hover:bg-[#009ADC] text-white font-semibold rounded-lg mt-2 text-base tracking-wide shadow-md transition-colors duration-200"
                        >
                            {loading ? "Kuting..." : "Войти в систему"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

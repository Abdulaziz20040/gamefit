"use client";

import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ to‘g‘ri import

import { redirect } from "next/navigation";

// 🔑 axios instans
const axiosInstance = axios.create({
    baseURL: "http://backend.gamefit.uz",
    headers: { "Content-Type": "application/json" },
});

// ✅ Token muddati tugagan-tugamaganini tekshirish
function isTokenExpired(token) {
    try {
        const decoded = jwtDecode(token); // ✅ endi ishlaydi
        if (!decoded.exp) return true;
        const now = Date.now() / 1000; // sekundlarda
        return decoded.exp < now;
    } catch (err) {
        return true;
    }
}

// 🔥 Request interceptor
axiosInstance.interceptors.request.use(async (config) => {
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && isTokenExpired(accessToken)) {
        // Agar access token muddati tugagan bo‘lsa
        if (refreshToken && !isTokenExpired(refreshToken)) {
            try {
                const res = await axios.post("http://backend.gamefit.uz/auth/refresh", {
                    refreshToken,
                });

                const newAccessToken = res.data?.content?.accessToken;
                const newRefreshToken = res.data?.content?.refreshToken;

                if (newAccessToken) {
                    localStorage.setItem("accessToken", newAccessToken);
                    config.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                if (newRefreshToken) {
                    localStorage.setItem("refreshToken", newRefreshToken);
                }
            } catch (error) {
                console.error("❌ Refresh token ishlamadi:", error);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                redirect("/auth/login"); // login pagega otkazamiz
            }
        } else {
            // Refresh token ham tugagan bo‘lsa
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            redirect("/auth/login");
        }
    } else if (accessToken) {
        // Agar access token hali yaroqli bo‘lsa
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export default axiosInstance;

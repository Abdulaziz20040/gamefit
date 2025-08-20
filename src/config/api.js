import axios from "axios";

const BASE_URL = "http://backend.gamefit.uz";

export const API = {
    // Klub uchun login qilish
    async loginClub(username, password) {
        try {
            const response = await axios.post(
                `${BASE_URL}/auth/get-club-token`,
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );

            const data = response.data;
            if (!data.content?.accessToken) throw new Error("Login failed!");

            // 🔑 Tokenlarni olish
            const accessToken = data.content.accessToken;
            const refreshToken = data.content.refreshToken;

            // ✅ Tokenlarni localStorage ga yozish
            localStorage.setItem("accessToken", accessToken);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            // 🔑 Tokenni decode qilib club ma’lumotlarini olish
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

            return data;
        } catch (error) {
            console.error("❌ loginClub error:", error);
            throw error;
        }
    },




    // Game clublarni olish (pagination bilan)
    async getGameClubs({ page, size }) {
        try {
            const res = await fetch(
                `${BASE_URL}/game-club/by-page?size=${size}&page=${page - 1}`
            );

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data?.success && data?.content?.content ? data : null;
        } catch (error) {
            console.error("❌ getGameClubs error:", error);
            throw error;
        }
    },



    // Status va til bo‘yicha game clublarni olish
    async getGameClubsByStatus({ page, size, status, language, accessToken }) {
        try {
            const res = await fetch(
                `${BASE_URL}/game-club/by-page?size=${size}&page=${page - 1}&status=${status}&lang=${language}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data?.success && data?.content?.content ? data : null;
        } catch (error) {
            console.error("❌ getGameClubsByStatus error:", error);
            throw error;
        }
    },




    // Game clubni ID bo‘yicha olish (barcha content bilan)
    async getGameClubById({ id, accessToken }) {
        try {
            const res = await fetch(
                `${BASE_URL}/game-club/by-id-with-all-content?id=${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    cache: "no-store",
                }
            );

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data?.content || null;
        } catch (error) {
            console.error("❌ getGameClubById error:", error);
            throw error;
        }
    },



};

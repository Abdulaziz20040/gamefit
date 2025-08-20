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





    // Seat plan (xona) ni o‘chirish
    async deleteSeatPlan({ id, accessToken }) {
        try {
            const res = await fetch(`${BASE_URL}/seat-plan?id=${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return true; // muvaffaqiyatli o‘chdi
        } catch (error) {
            console.error("❌ deleteSeatPlan error:", error);
            throw error;
        }
    },



    // Clubga tegishli xonalarni olish
    async getRoomsByClub({ clubId, accessToken }) {
        try {
            const res = await fetch(`${BASE_URL}/seat-plan/by-club?clubId=${clubId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data?.success ? data.content : [];
        } catch (error) {
            console.error("❌ getRoomsByClub error:", error);
            throw error;
        }
    },



    // Subscriptionlarni olish (by-graphic)
    async getSubscriptionsByGraphic({ clubId, date, stateIndex, size, page, lang, accessToken }) {
        try {
            const url = `${BASE_URL}/subscription/by-graphic?clubId=${clubId}&date=${date}&stateIndex=${stateIndex}&size=${size}&page=${page}&lang=${lang}`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data?.content || null;
        } catch (error) {
            console.error("❌ getSubscriptionsByGraphic error:", error);
            throw error;
        }
    },


    // Subscriptionni subToken orqali olish
    async getSubscriptionByToken({ clubId, subToken, accessToken }) {
        try {
            const url = `${BASE_URL}/subscription/by-sub-token?clubId=${encodeURIComponent(
                clubId
            )}&subToken=${encodeURIComponent(subToken)}`;

            const res = await fetch(url, {
                headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("❌ getSubscriptionByToken error:", error);
            throw error;
        }
    },
    // Foydalanuvchini ID orqali olish
    async getUserById({ userId, accessToken }) {
        try {
            const url = `${BASE_URL}/users/by-id-with-all-content?id=${userId}`;
            const res = await fetch(url, {
                headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error("❌ getUserById error:", error);
            throw error;
        }
    },




    // MODALS


    // Clubga tegishli tariflarni olish
    async getClubFutures({ clubId, lang, accessToken }) {
        try {
            const url = `${BASE_URL}/club-futures/by-club?clubId=${clubId}&lang=${lang}`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data?.success && Array.isArray(data.content) ? data.content : [];
        } catch (error) {
            console.error("❌ getClubFutures error:", error);
            throw error;
        }
    },


    // Clubga tegishli banking ma’lumotlarini olish
    async getBankingInfoByClubId({ clubId, accessToken }) {
        try {
            const url = `${BASE_URL}/banking-info/by-club-id?clubId=${clubId}`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data?.success && data?.content ? data.content : null;
        } catch (error) {
            console.error("❌ getBankingInfoByClubId error:", error);
            throw error;
        }
    },


    // Club banking ma’lumotlarini saqlash (POST)
    async saveBankingInfo({ body, accessToken }) {
        try {
            const res = await fetch(`${BASE_URL}/banking-info`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data;
        } catch (error) {
            console.error("❌ saveBankingInfo error:", error);
            throw error;
        }
    },


    // Clubga tegishli bitta tarifni olish
    async getClubFutureByService({ clubId, serviceNameIndex, lang, accessToken }) {
        try {
            const url = `${BASE_URL}/club-futures/by-club?clubId=${clubId}&lang=${lang}`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            if (data.success && Array.isArray(data.content)) {
                const found = data.content.find((t) => t.serviceNameIndex === serviceNameIndex);
                return found || null;
            }
            return null;
        } catch (error) {
            console.error("❌ getClubFutureByService error:", error);
            throw error;
        }
    },



    // Club manzilini olish
    async getAddressByClubId({ clubId, lang, accessToken }) {
        try {
            const url = `${BASE_URL}/address?id=${clubId}&lang=${lang}`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data?.content || null;
        } catch (error) {
            console.error("❌ getAddressByClubId error:", error);
            throw error;
        }
    },


    // Club manzilini saqlash (POST)
    async saveAddress({ body, accessToken }) {
        try {
            const res = await fetch(`${BASE_URL}/address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data;
        } catch (error) {
            console.error("❌ saveAddress error:", error);
            throw error;
        }
    },



    // Club account ma’lumotlarini olish
    async getClubAccountByClubId({ clubId, accessToken }) {
        try {
            const url = `${BASE_URL}/club-account/by-club-id?clubId=${clubId}`;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data?.content || null;
        } catch (error) {
            console.error("❌ getClubAccountByClubId error:", error);
            throw error;
        }
    },



    // Club account yaratish yoki saqlash (POST)
    async saveClubAccount({ body, accessToken }) {
        try {
            const res = await fetch(`${BASE_URL}/club-account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            return data;
        } catch (error) {
            console.error("❌ saveClubAccount error:", error);
            throw error;
        }
    },





};

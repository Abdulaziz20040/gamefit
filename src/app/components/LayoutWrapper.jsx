"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    const isAuthPage =
        pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken && !isAuthPage) {
            router.push("/auth/login");
        }
    }, [isAuthPage, router]);

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Navbar />
                <div style={{ flex: 1, padding: "1rem", color: "black" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useAuth } from "@/components/AuthGuard";
import dayjs from "dayjs";

export function GreetingCard() {
  const { user } = useAuth();
  const greeting =
    dayjs().hour() < 10
      ? "Selamat Pagi"
      : dayjs().hour() < 15
        ? "Selamat Siang"
        : dayjs().hour() < 18
          ? "Selamat Sore"
          : "Selamat Malam";
  return (
    <div
      id="greeting-card"
      className="w-full rounded-xl p-6 flex flex-col justify-center items-start gap-2"
    >
      <h1 className="text-xl font-semibold text-gray-800">
        {greeting}, {user?.fullName || "User"} 👋🏻
      </h1>
      <h2 className="text-sm text-gray-500">
        Lihat statistik data terbaru pendaftaran calon murid baru
      </h2>
      <h2 className="text-sm text-gray-500">
        SMK Tamtama Kroya tahun ajaran 2025/2026
      </h2>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="w-full h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="h-full">
        <GreetingCard />
        <div className="w-full h-100 bg-white rounded-md drop-shadow-sm"></div>
      </div>
    </div>
  );
}

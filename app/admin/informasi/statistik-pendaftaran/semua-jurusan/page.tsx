"use client";

import StatsMajorCard, {
  MajorData,
} from "@/components/Card/StatsCard/StatCardMajors";
import { TitleSection } from "@/components/TitleSection/index";
import { useAlert } from "@/components/ui/alert";
import { getAuthHeader } from "@/utils/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuChevronLeft } from "react-icons/lu";

const normalizeMajorDistribution = (payload: unknown): MajorData[] => {
  if (Array.isArray(payload)) {
    return payload as MajorData[];
  }

  if (payload && typeof payload === "object") {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) {
      return maybeData as MajorData[];
    }
  }

  return [];
};

export default function AllMajorsStatisticPage() {
  const { showAlert } = useAlert();
  const [majorDistribution, setMajorDistribution] = useState<MajorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMajorDistribution = async () => {
      try {
        const response = await fetch(`/api/admin/stats/major-distribution`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMajorDistribution(normalizeMajorDistribution(data));
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        showAlert({
          title: "Terjadi Kesalahan",
          description: "Gagal mengambil data distribusi jurusan",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMajorDistribution();
  }, [showAlert]);

  return (
    <div className="w-full min-h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="h-full bg-white rounded-lg shadow-sm p-6">
        <Link
          href="/admin/informasi/statistik-pendaftaran"
          className="mb-3 inline-flex font-medium text-primary items-center hover:underline"
        >
          <LuChevronLeft className="mr-2 text-3xl" /> Statistik Pendaftaran
        </Link>
        <TitleSection
          title="Semua Jurusan"
          subtitle="Menampilkan seluruh distribusi pendaftar untuk semua jurusan."
        />
        <StatsMajorCard data={majorDistribution} isLoading={isLoading} />
      </div>
    </div>
  );
}

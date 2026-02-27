"use client";

import GridListPaginate from "@/components/GridListPaginate";
import { TextButton } from "@/components/Buttons/TextButton";
import { useEffect, useMemo, useState } from "react";

type ViewMode = "grid" | "list";

interface AlumniItem {
  id: number;
  name: string;
  generationYear: number;
  photoUrl: string;
  major: string;
  currentJob: string;
}

interface AlumniApiResponse {
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
  };
  data: AlumniItem[];
}

export default function AlumnusPage() {
  const [loading, setLoading] = useState(false);
  const [alumni, setAlumni] = useState<AlumniItem[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    perPage: 9,
  });

  const fetchAlumni = async (page = 1, perPage = pagination.perPage) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/alumni?page=${page}&perPage=${perPage}`,
      );
      const result: AlumniApiResponse = await response.json();

      setAlumni(result.data || []);
      setPagination({
        total: result.meta?.total || 0,
        currentPage: result.meta?.currentPage || 1,
        perPage: result.meta?.perPage || perPage,
      });
    } catch (error) {
      console.error("Failed fetch alumni", error);
      setAlumni([]);
      setPagination((prev) => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni(1, pagination.perPage);
  }, []);

  const paginationConfig = useMemo(
    () => ({
      current: pagination.currentPage,
      pageSize: pagination.perPage,
      total: pagination.total,
      onChange: (page: number, pageSize: number) => {
        fetchAlumni(page, pageSize);
      },
      showSizeChanger: true,
      pageSizeOptions: [9, 18, 27],
      onShowSizeChange: (page: number, pageSize: number) => {
        fetchAlumni(page, pageSize);
      },
    }),
    [pagination],
  );

  const renderItem = (item: AlumniItem, _: number, mode: ViewMode) => {
    return (
      <div className="rounded-lg flex flex-col items-center">
        <img
          src={item.photoUrl}
          alt={item.name}
          className="w-full h-auto aspect-video bg-gray-300 rounded-lg object-cover"
        />
        <p className="text-base font-semibold text-gray-800 my-2">
          {item.name}
        </p>
        <p className="text-base italic text-gray-800">{item.major}</p>
        <p className="text-base italic text-gray-800">
          Angkatan {item.generationYear}
        </p>
        <p className="text-base italic text-gray-800 mt-2">{item.currentJob}</p>
      </div>
    );
  };

  return (
    <main className="h-fit flex bg-linear-to-b from-[#fafafa] to-gray-50 py-16 sm:pt-20 px-42">
      <div className="w-full py-8">
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-primary">
            ALUMNI SMK TAMTAMA KROYA
          </h1>
        </div>

        <GridListPaginate
          data={alumni}
          renderItem={renderItem}
          viewMode="grid"
          loading={loading}
          emptyText="Data alumni belum tersedia"
          pagination={paginationConfig}
        />
      </div>
    </main>
  );
}

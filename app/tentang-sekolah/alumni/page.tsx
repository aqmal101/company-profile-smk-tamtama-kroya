"use client";

import { AlumniApiResponse, AlumniItem } from "@/admin/siswa/data-alumni/type";
import GridListPaginate from "@/components/GridListPaginate";
import { useEffect, useMemo, useState } from "react";

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
      pageSize: 9,
      total: pagination.total,
      onChange: (page: number, pageSize: number) => {
        fetchAlumni(page, pageSize);
      },
      onShowSizeChange: (page: number, pageSize: number) => {
        fetchAlumni(page, pageSize);
      },
    }),
    [pagination],
  );

  const renderItem = (item: AlumniItem, _: number) => {
    let majorAbbr = item.major;
    switch (item.major) {
      case "TP":
        item.major = "Teknik Permesinan";
        break;
      case "TKR":
        item.major = "Teknik Kendaraan Ringan";
        break;
      case "TITL":
        item.major = "Teknik Instalasi Tenaga Listrik";
        break;
      case "DKV":
        item.major = "Desain Komunikasi Visual";
        break;
    }
    return (
      <div className="rounded-lg flex flex-col items-center">
        <img
          src={item.photoUrl}
          alt={item.name}
          className="w-full h-auto aspect-1.5/1 bg-gray-300 border border-gray-300 rounded-lg object-cover"
        />
        <p className="text-base font-semibold text-gray-800 my-1">
          {item.name}
        </p>
        <p className="text-base italic text-gray-800">{majorAbbr}</p>
        <p className="text-base italic text-gray-800">
          Angkatan {item.generationYear}
        </p>
        <p className="text-base italic text-gray-600 font-light mt-1">
          {item.currentJob}
        </p>
      </div>
    );
  };

  return (
    <main className="h-fit flex bg-linear-to-b from-[#fafafa] to-gray-50 py-16 sm:pt-20 px-42">
      <div className="w-full py-8 gap-6">
        <div className="w-full flex flex-wrap items-center">
          <h1 className="text-3xl font-bold text-primary">
            ALUMNI SMK TAMTAMA KROYA
          </h1>
        </div>

        <GridListPaginate
          data={alumni}
          showSizeChanger={false}
          showNumberInfo={false}
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

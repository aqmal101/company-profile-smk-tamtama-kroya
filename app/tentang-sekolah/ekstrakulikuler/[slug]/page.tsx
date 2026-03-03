"use client";

import { AlumniApiResponse, AlumniItem } from "@/admin/siswa/data-alumni/type";
import { TextButton } from "@/components/Buttons/TextButton";
import GridListPaginate from "@/components/GridListPaginate";
import Image from "next/image";
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
      pageSize: pagination.perPage,
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
      <div className="rounded-lg flex flex-col border border-gray-300 bg-white">
        <Image
          src={item.photoUrl || "https://placehold.co/600x400/png"}
          alt={item.name}
          width={232}
          height={121}
          loading="lazy"
          unoptimized
          className="w-full h-58 rounded-t-md aspect-1.5/1 bg-gray-300 border border-gray-300 object-cover"
        />

        <div className="w-full flex flex-col px-3 py-2 gap-4">
          <p className="text-base text-left font-semibold text-gray-800">
            Ini adalah nama kegiatasn ekstrakulikuler yang Popolarabansb
          </p>
          <TextButton
            variant="gray"
            text="Lihat Detail"
            className="w-fit rounded-full! text-sm!"
          />
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full bg-linear-to-b from-[#fafafa] to-gray-50 px-4 py-10 sm:px-6 sm:py-12 md:px-10 lg:px-16 xl:px-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-28 sm:pb-4 max-sm:pt-20 max-sm:px-8 justify-center items-center">
        <div className="w-full flex flex-wrap items-center justify-center max-w-3xl gap-4">
          <h1 className="text-4xl max-sm:text-2xl font-bold text-primary text-center">
            Ekstrakurikuler di SMK Tamtama Kroya
          </h1>
          <p className="text-center text-lg max-sm:text-sm text-gray-600">
            SMK Tamtama Kroya memiliki berbagai kegiatan ekstrakurikuler yang
            dapat diikuti siswa sesuai minat dan bakatnya.
          </p>
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

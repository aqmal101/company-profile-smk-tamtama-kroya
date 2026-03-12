"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { TextButton } from "@/components/Buttons/TextButton";
import Search from "@/components/Filter/Search";
import GridListPaginate from "@/components/GridListPaginate";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RiFilterOffFill } from "react-icons/ri";
import { MajorListItem, MajorsListResponse } from "./type";
import { toSlug } from "@/utils/resolveSlug";

const ITEMS_PER_PAGE = 6;

export default function MajorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [majors, setMajors] = useState<MajorListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    perPage: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMajors = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          perPage: String(ITEMS_PER_PAGE),
        });

        if (debouncedSearchTerm) {
          params.append("search", debouncedSearchTerm);
        }

        const response = await fetch(`/api/majors?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch majors data");
        }

        const result: MajorsListResponse = await response.json();
        const items = (result.items || []).slice(0, ITEMS_PER_PAGE);

        setMajors(items);
        setPagination({
          total: result.meta?.total || 0,
          currentPage: result.meta?.currentPage || page,
          perPage: ITEMS_PER_PAGE,
        });
      } catch (error) {
        console.error("Failed fetch majors", error);
        setMajors([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchTerm],
  );

  useEffect(() => {
    fetchMajors(1);
  }, [fetchMajors]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const paginationConfig = useMemo(
    () => ({
      current: pagination.currentPage,
      pageSize: ITEMS_PER_PAGE,
      total: pagination.total,
      onChange: (page: number) => {
        fetchMajors(page);
      },
      onShowSizeChange: (page: number) => {
        fetchMajors(page);
      },
    }),
    [pagination, fetchMajors],
  );

  const renderItem = (item: MajorListItem, _: number) => {
    const slug = item.slug || toSlug(item.name);

    return (
      <div className="rounded-lg flex flex-col border border-gray-300 bg-white overflow-hidden">
        <Image
          src={item.photoUrl || "https://placehold.co/1200x800/png"}
          alt={item.name}
          width={1200}
          height={800}
          loading="lazy"
          unoptimized
          className="w-full h-58 aspect-video bg-gray-300 object-cover"
        />

        <div className="w-full flex flex-col px-3 py-2 gap-4">
          <div>
            <p className="text-base text-left font-semibold text-gray-800">
              {item.name}
            </p>
            <p className="text-sm text-gray-600">{item.abbreviation}</p>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">
            {item.summary || "-"}
          </p>
          <div className="w-full flex flex-row justify-end">
            <TextButton
              variant="gray"
              text="Lihat Detail"
              className="w-fit rounded-full! text-sm!"
              onClick={() =>
                router.push(`/tentang-sekolah/program-keahlian/${slug}`)
              }
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full bg-linear-to-b from-[#fafafa] to-gray-50 px-4 sm:px-6 sm:py-12 md:px-10 lg:px-16 xl:px-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 mt-20 sm:pb-4 max-sm:mt-20 max-sm:px-8 justify-center items-center">
        <Breadcrumb
          className="w-full justify-start"
          items={[{ label: "Tentang Sekolah" }, { label: "Program Keahlian" }]}
        />

        <div className="w-full flex flex-wrap items-center justify-center max-w-2xl gap-4">
          <h1 className="text-4xl max-sm:text-2xl font-bold text-primary text-center">
            PROGRAM KEAHLIAN <br /> SMK TAMTAMA KROYA
          </h1>
          <p className="text-center text-lg max-sm:text-sm text-gray-600">
            Pelajari tentang program keahlian yang ditawarkan SMK Tamtama Kroya
            untuk mengembangkan skill dan kompetensi peserta didik.
          </p>
        </div>

        <div className="flex flex-col justify-end w-full flex-wrap gap-3 md:flex-nowrap md:flex-row md:items-center md:justify-end px-0">
          {searchTerm && (
            <TextButton
              variant="outline"
              className="w-full sm:w-fit!"
              onClick={handleResetFilters}
              icon={<RiFilterOffFill className="text-xl shrink-0" />}
            />
          )}
          <Search
            placeholder="Cari program keahlian"
            className="w-full md:max-w-72 sm:max-w-68"
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
          />
        </div>

        <GridListPaginate
          data={majors}
          showSizeChanger={false}
          showNumberInfo={false}
          renderItem={renderItem}
          viewMode="grid"
          loading={loading}
          emptyText="Data program keahlian belum tersedia"
          pagination={paginationConfig}
        />
      </div>
    </main>
  );
}

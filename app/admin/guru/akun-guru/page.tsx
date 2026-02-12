"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import { PaginationMeta } from "@/components/Dashboard/Pagination";
import Search from "@/components/Filter/Search";
import { ProfileUser } from "@/components/Icon/UserIcon";
import ReusableTable, { Column } from "@/components/Table/ReusableTable";
import { TitleSection } from "@/components/TitleSection/index";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Teacher } from "@/types/teacher/list";
import { getAuthHeader } from "@/utils/auth";
import { transformTeacherData } from "@/utils/trasformTeacherData";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LuEye, LuPen, LuPlus, LuTrash2 } from "react-icons/lu";

export default function AdminTeacherAccountPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [selectedBatchId, setSelectedBatchId] = useState<string | number | "">(
    "",
  );
  const [selectedMajor, setSelectedMajor] = useState<string | number | "">("");
  const [selectAuthored, setSelectedAuthor] = useState<"" | "true" | "false">(
    "",
  );
  // Selected academic year filter
  const [selectedYearId, setSelectedYearId] = useState<string | number | "">(
    "",
  );

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 750); // 750ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadingStates = isLoading;

  const fetchTeachers = useCallback(
    async (page: number, search: string = "", pageLimit: number = 10) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pageLimit.toString(),
        });

        if (search) {
          params.append("search", search);
        }

        if (selectedBatchId) {
          params.append("batch_id", String(selectedBatchId));
        }
        // Append selected academic year filter if set
        if (selectedYearId) {
          params.append("academic_year_id", String(selectedYearId));
        }
        // Only append `authored` when a specific type is selected
        if (selectAuthored !== "") {
          params.append("authored", selectAuthored);
        }

        if (selectedMajor !== "") {
          params.append("major_code", String(selectedMajor));
        }

        const response = await fetch(
          `/api/backoffice/teachers?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          if (data.error === "E_UNAUTHORIZED_ACCESS") {
            setError("Anda tidak memiliki akses. Silakan login kembali.");
          } else {
            setError(data.message || "Gagal mengambil data guru");
          }
          return;
        }
        const transformed = transformTeacherData(data || []);
        setTeachers(transformed);
        setMeta(data.meta ?? null);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
        setError("Terjadi kesalahan saat mengambil data guru");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedBatchId, selectAuthored, selectedYearId, selectedMajor],
  );

  useEffect(() => {
    fetchTeachers(currentPage, debouncedSearchTerm, limit);
  }, [currentPage, debouncedSearchTerm, fetchTeachers, limit]);

  const handleResetFilters = () => {
    setSelectedMajor("");
    setCurrentPage(1);
    setSearchTerm("");
    setSelectedBatchId("");
    setSelectedAuthor("");
    setSelectedYearId("");
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Fetch filter options (years, batches, registration types) from server endpoint with caching
  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      try {
        const res = await fetch(`/api/filters/options`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch options", res.status);
          return;
        }

        const data = await res.json();

        // Normalize batches to option shape
        const batchOpts = (data.batches || []).map(
          (b: {
            id: number;
            name: string;
            title: string;
            isActive: number;
          }) => ({
            value: b.id,
            label: b.name || b.title || `Gelombang ${b.id}`,
            disabled: Number(b.isActive) === 0,
          }),
        );
        const majorOpts = (data.majors || []).map(
          (b: { name: string; abbreviation: string }) => ({
            value: b.abbreviation,
            label: `Jurusan ${b.abbreviation}`,
          }),
        );

        if (cancelled) return;

        // Cache to localStorage as fallback when network fails
        try {
          localStorage.setItem(
            "filterOptions.majors",
            JSON.stringify(majorOpts),
          );
          localStorage.setItem(
            "filterOptions.batches",
            JSON.stringify(batchOpts),
          );
          localStorage.setItem(
            "filterOptions.years",
            JSON.stringify(data.years || []),
          );
          localStorage.setItem(
            "filterOptions.regTypes",
            JSON.stringify(data.registrationTypes || []),
          );
        } catch {
          /* ignore localStorage errors */
        }
      } catch (err) {
        console.error(
          "Failed to load filter options, falling back to cache",
          err,
        );
      }
    };

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  const columns: Column<Teacher>[] = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      render: (value, record, index) => (currentPage - 1) * limit + index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Foto",
      dataIndex: "photoUrl",
      key: "photoUrl",
      width: 80,
      align: "center",
      render: (value) => (
        <div className="w-full my-2 flex justify-center">
          <ProfileUser
            size={12}
            source={typeof value === "string" ? value : null}
          />
        </div>
      ),
    },
    {
      title: "Nama Guru",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      width: 160,
    },
    {
      title: "Mata Pelajaran",
      dataIndex: "schoolLesson",
      key: "schoolLesson",
      width: 300,
      render: (value) => {
        const lessons = Array.isArray(value) ? value : [];
        if (!lessons.length) return "-";
        return lessons
          .map((lesson) => lesson.abbreviation || lesson.name)
          .filter(Boolean)
          .join(", ");
      },
    },
    {
      title: "Aksi",
      dataIndex: "registrationId",
      key: "actions",
      align: "center",
      width: 200,
      render: () => (
        <div className="flex justify-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <TextButton
                icon={<LuEye className="text-xl" />}
                isLoading={loadingStates}
                variant="outline-warning"
                className="w-fit py-1 px-2! border-2"
                disabled={loadingStates}
                // onClick={() => handleDetailClick(Number(value))}
              />
            </TooltipTrigger>
            <TooltipContent side="top">Detail Data Guru</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TextButton
                icon={<LuPen className="text-xl" />}
                isLoading={loadingStates}
                variant="outline-info"
                className="w-fit py-1 px-2! text-xs border-2 border-blue-500"
                disabled={loadingStates}
                // onClick={() => handleRouteDetail(Number(value))}
              />
            </TooltipTrigger>
            <TooltipContent side="top">Edit Data Guru</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TextButton
                icon={<LuTrash2 className="text-xl" />}
                isLoading={loadingStates}
                variant="outline-danger"
                className="w-fit py-1 px-2! border-2"
                disabled={loadingStates}
                // onClick={() => confirmDelete(Number(value))}
              />
            </TooltipTrigger>
            <TooltipContent side="top">Hapus Data Guru</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="h-full">
        <TitleSection
          title="Akun Guru"
          subtitle="Halaman ini digunakan untuk membuat akun guru yang akan masuk ke dalam sistem PPDB dan melakukan pendaftaran untuk calon murid baru."
        />
        <div className="w-full h-fit bg-white rounded-md drop-shadow-sm">
          <div className="p-6 max-sm:p-2 border-b border-gray-200">
            <div className="flex w-auto flex-wrap flex-col gap-4 lg:flex-row lg:items-center lg:justify-end mb-3">
              <Search
                placeholder="Cari nama / username / mata pelajaran"
                className="w-full mb-2 lg:max-w-sm lg:w-full"
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
              />
              <Link href="/admin/guru/akun-guru/tambah">
                <TextButton
                  variant="primary"
                  text="Tambah Akun"
                  disabled={loadingStates}
                  className="w-full font-normal px-2! sm:col-span-2 lg:w-auto mb-2 shrink-0"
                  isLoading={loadingStates}
                  icon={<LuPlus className="text-lg shrink-0" />}
                  onClick={handleResetFilters}
                />
              </Link>
            </div>
            <ReusableTable
              columns={columns}
              dataSource={teachers}
              loading={isLoading}
              error={error || undefined}
              emptyText="Data Guru Tidak Ada"
              rowKey="id"
              serverSidePagination={true}
              tableLayout="fixed"
              pagination={{
                current: currentPage,
                pageSize: limit,
                total: meta?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 25, 50, 100],
                onChange: (page, pageSize) => {
                  setCurrentPage(page);
                  setLimit(pageSize);
                },
                onShowSizeChange: (current, size) => {
                  setCurrentPage(1);
                  setLimit(size);
                },
              }}
              scroll={{ y: 600 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

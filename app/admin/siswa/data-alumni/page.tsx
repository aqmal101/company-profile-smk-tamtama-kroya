"use client";

import GridListPaginate from "@/components/GridListPaginate";
import { TitleSection } from "@/components/TitleSection/index";
import { useEffect, useMemo, useState } from "react";
import { AlumniApiResponse, AlumniItem } from "./type";
import Toggle from "@/components/ui/toggle";
import { TextButton } from "@/components/Buttons/TextButton";
import { LuPen, LuTrash2 } from "react-icons/lu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BaseModal } from "@/components/Modal/BaseModal";
import { useRouter } from "next/navigation";
import { getAuthHeader } from "@/utils/auth";
import { useAlert } from "@/components/ui/alert";
import Image from "next/image";

export default function DataAlumniPage() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [alumni, setAlumni] = useState<AlumniItem[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    perPage: 10,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAlumni = async (page = 1, perPage = pagination.perPage) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/backoffice/alumni?page=${page}&perPage=${perPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        },
      );

      if (!response.ok) {
        throw new Error("Gagal memuat data alumni");
      }

      const result: AlumniApiResponse = await response.json();

      setAlumni(result.data || []);
      setPagination({
        total: result.meta?.total || 0,
        currentPage: result.meta?.currentPage || 1,
        perPage: result.meta?.perPage || perPage,
      });
    } catch (error) {
      console.error("Failed fetch alumni", error);
      showAlert({
        title: "Gagal",
        description: "Gagal memuat data alumni",
        variant: "error",
      });
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
      onShowSizeChange: (page: number, pageSize: number) => {
        fetchAlumni(page, pageSize);
      },
    }),
    [pagination],
  );

  const handleTogglePublish = async (
    item: AlumniItem,
    isPublished: boolean,
  ) => {
    try {
      const response = await fetch(`/api/backoffice/alumni/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          name: item.name,
          major: item.major,
          generationYear: item.generationYear,
          photoUrl: item.photoUrl,
          currentJob: item.currentJob,
          isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengubah visibilitas alumni");
      }

      setAlumni((prev) =>
        prev.map((current) =>
          current.id === item.id ? { ...current, isPublished } : current,
        ),
      );
    } catch (error) {
      console.error("Failed update visibility", error);
      showAlert({
        title: "Gagal",
        description: "Gagal mengubah visibilitas alumni",
        variant: "error",
      });
    }
  };

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/backoffice/alumni/${deletingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data alumni");
      }

      showAlert({
        title: "Berhasil",
        description: "Data alumni berhasil dihapus",
        variant: "success",
      });
      setDeleteModalOpen(false);
      setDeletingId(null);
      fetchAlumni(pagination.currentPage, pagination.perPage);
    } catch (error) {
      console.error("Failed delete alumni", error);
      showAlert({
        title: "Gagal",
        description: "Gagal menghapus data alumni",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
      <div className="rounded-lg h-28 flex flex-row items-center justify-between border border-gray-300 shadow-2xs p-2 gap-4">
        <div className="h-full flex flex-row items-center gap-4 ">
          <img
            src={item.photoUrl}
            alt={item.name}
            // height={100}
            // width={100}
            className="w-auto h-full border border-gray-300 aspect-video bg-gray-300 rounded-lg object-cover"
          />
          <div>
            <p className="text-base font-semibold text-gray-800 mb-3">
              {item.name}
            </p>
            <div className="w-full flex flex-row items-center gap-4">
              <p className="text-base italic text-gray-800">{majorAbbr}</p>{" "}
              <span className="text-gray-300">|</span>
              <p className="text-base italic text-gray-800">
                Angkatan Tahun {item.generationYear}
              </p>{" "}
              <span className="text-gray-300">|</span>
              <p className="text-base italic text-gray-800">
                {item.currentJob}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-4 items-center mr-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mt-1">
                <Toggle
                  size="md"
                  showIcon
                  enabled={Boolean(item.isPublished)}
                  onChange={(setVisibility) => {
                    handleTogglePublish(item, setVisibility);
                  }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              Tampilkan Alumni
              <br /> di Landing Page
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TextButton
                icon={<LuPen className="text-xl" />}
                // isLoading={loadingStates}
                variant="outline-info"
                className="w-fit py-1 px-2! text-xs border-2 border-blue-500"
                // disabled={loadingStates}
                onClick={() =>
                  router.push(`/admin/siswa/data-alumni/edit/${item.id}`)
                }
              />
            </TooltipTrigger>
            <TooltipContent side="top">Edit Data Murid</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <TextButton
                icon={<LuTrash2 className="text-xl" />}
                variant="outline-danger"
                className="w-fit py-1 px-2! border-2"
                onClick={() => confirmDelete(item.id)}
              />
            </TooltipTrigger>
            <TooltipContent side="top">Hapus Data Murid</TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-auto min-h-screen bg-gray-100 p-4">
      <div className="w-full h-fit bg-white rounded-md drop-shadow-sm px-4 py-2">
        <TitleSection
          title="Data Alumni SMK Tamtama Kroya"
          subtitle="Halaman ini akan menampilkan daftar alumni SMK Tamtama Kroya yang dapat diubah"
        />
        <div className="w-full flex justify-end mb-3">
          <TextButton
            variant="primary"
            text="Tambah Alumni"
            onClick={() => router.push("/admin/siswa/data-alumni/tambah")}
          />
        </div>
        <div className="w-full h-fit">
          <GridListPaginate
            data={alumni}
            renderItem={renderItem}
            viewMode="list"
            loading={loading}
            emptyText="Data alumni belum tersedia"
            pagination={paginationConfig}
          />
        </div>
        <BaseModal
          isOpen={deleteModalOpen}
          onClose={() => {
            if (!isDeleting) {
              setDeleteModalOpen(false);
              setDeletingId(null);
            }
          }}
          title="Konfirmasi Hapus"
          footer={
            <div className="flex justify-end gap-2">
              <TextButton
                variant="outline"
                text="Batal"
                isLoading={isDeleting}
                disabled={isDeleting}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletingId(null);
                }}
              />
              <TextButton
                text="Hapus"
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
                disabled={isDeleting}
              />
            </div>
          }
        >
          <p>Anda yakin ingin menghapus data alumni ini?</p>
        </BaseModal>
      </div>
    </div>
  );
}

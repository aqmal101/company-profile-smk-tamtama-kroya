"use client";

import { TitleSection } from "@/components/TitleSection/index";
import { RequirementCard } from "@/components/Card/RequirementCard";
import { BaseModal } from "@/components/Modal/BaseModal";
import { useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { TextButton } from "@/components/Buttons/TextButton";
import { SectionCard } from "@/components/Card/SectionCard";

interface Requirement {
  id: string;
  label: string;
  isActive: boolean;
  isRequired: boolean;
}

export default function SyaratPeriodePendaftaranPage() {
  const [requirements, setRequirements] = useState<Requirement[]>([
    {
      id: "2",
      label: "Mengisi fomulir.",
      isActive: true,
      isRequired: true,
    },
    {
      id: "3",
      label: "Foto Copy Ijazah",
      isActive: true,
      isRequired: true,
    },
    {
      id: "4",
      label: "Foto Copy KK dan Akta Kelahiran",
      isActive: true,
      isRequired: true,
    },
    {
      id: "5",
      label: "Foto Copy KTP Orang Tua",
      isActive: true,
      isRequired: true,
    },
    {
      id: "6",
      label: "Pas foto 3x4 Berwarna (3 lembar)",
      isActive: true,
      isRequired: true,
    },
    {
      id: "7",
      label: "Sertifikat TKA (Tes Kemampuan Akademik)",
      isActive: true,
      isRequired: true,
    },
  ]);

  const [selectAllModalOpen, setSelectAllModalOpen] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);

  const handleToggle = (id: string, isActive: boolean) => {
    setRequirements((prev) =>
      prev.map((req) => (req.id === id ? { ...req, isActive } : req)),
    );
  };

  const handleRequiredChange = (id: string, isRequired: boolean) => {
    setRequirements((prev) =>
      prev.map((req) => (req.id === id ? { ...req, isRequired } : req)),
    );
  };

  const handleLabelChange = (id: string, label: string) => {
    setRequirements((prev) =>
      prev.map((req) => (req.id === id ? { ...req, label } : req)),
    );
  };

  const handleDelete = (id: string) => {
    setRequirements((prev) => prev.filter((req) => req.id !== id));
  };

  const handleAddRequirement = () => {
    const newRequirement: Requirement = {
      id: Date.now().toString(),
      label: "",
      isActive: true,
      isRequired: false,
    };
    setRequirements((prev) => [...prev, newRequirement]);
  };

  const handleSaveChanges = () => {
    // TODO: Implement save to backend
    console.log("Saving requirements:", requirements);
    alert("Perubahan berhasil disimpan!");
  };

  return (
    <div className="w-full min-h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="h-full w-full bg-white rounded-md drop-shadow-sm p-3">
        <TitleSection
          title="Syarat & Periode Pendaftaran"
          subtitle="Menampilkan daftar jalur pendaftaran yang dapat diubah deksripsi dan fotonya"
        />

        <SectionCard
          title="Syarat Pendaftaran"
          handleSaveChanges={handleSaveChanges}
          leftButton={
            <TextButton
              variant="outline"
              icon={<LuPlus size={18} />}
              text="Tambah Syarat"
              onClick={handleAddRequirement}
            />
          }
        >
          <div className="p-4 space-y-1 ">
            {/* Header: select-all checkbox, column titles, delete all */}
            <div className="flex items-center gap-3 py-2 px-2 bg-gray-50 rounded-md">
              <input
                type="checkbox"
                checked={
                  requirements.length > 0 &&
                  requirements.every((r) => r.isRequired)
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectAllModalOpen(true);
                  } else {
                    setRequirements((prev) =>
                      prev.map((r) => ({ ...r, isRequired: false })),
                    );
                  }
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                aria-label="Pilih semua sebagai wajib"
              />

              <div className="w-16 text-base text-gray-600 font-medium">
                Aktif
              </div>
              <div className="flex-1 text-base text-primary font-medium">
                Nama Syarat
              </div>

              <TextButton
                icon={<LuTrash2 className="text-xl text-red-600 px-0" />}
                variant="icon"
                onClick={() => setDeleteAllModalOpen(true)}
              />
            </div>

            {requirements.map((req) => (
              <RequirementCard
                key={req.id}
                id={req.id}
                label={req.label}
                isActive={req.isActive}
                isRequired={req.isRequired}
                onToggle={handleToggle}
                onRequiredChange={handleRequiredChange}
                onLabelChange={handleLabelChange}
                onDelete={handleDelete}
                isEditable={true}
              />
            ))}

            {/* Modals */}
            <BaseModal
              hiddenOverlay={true}
              isOpen={selectAllModalOpen}
              onClose={() => setSelectAllModalOpen(false)}
              title="Konfirmasi"
              footer={
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectAllModalOpen(false)}
                    className="px-4 py-2 rounded-md"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setRequirements((prev) =>
                        prev.map((r) => ({ ...r, isRequired: true })),
                      );
                      setSelectAllModalOpen(false);
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-md"
                  >
                    Ya, tandai semua
                  </button>
                </div>
              }
            >
              <p>Anda yakin ingin menandai semua syarat sebagai wajib?</p>
            </BaseModal>

            <BaseModal
              isOpen={deleteAllModalOpen}
              onClose={() => setDeleteAllModalOpen(false)}
              title="Hapus Semua Syarat"
              footer={
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDeleteAllModalOpen(false)}
                    className="px-4 py-2 rounded-md"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setRequirements([]);
                      setDeleteAllModalOpen(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    Hapus Semua
                  </button>
                </div>
              }
            >
              <p>Semua syarat akan dihapus. Lanjutkan?</p>
            </BaseModal>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

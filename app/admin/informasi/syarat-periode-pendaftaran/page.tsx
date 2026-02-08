"use client";

import { TitleSection } from "@/components/TitleSection/index";
import { RequirementCard } from "@/components/Card/RequirementCard";
import { BaseModal } from "@/components/Modal/BaseModal";
import { useEffect, useState } from "react";
import { LuArrowRight, LuPlus, LuTrash2 } from "react-icons/lu";
import { TextButton } from "@/components/Buttons/TextButton";
import { SectionCard } from "@/components/Card/SectionCard";
import { useAlert } from "@/components/ui/alert";
import { getAuthHeader } from "@/utils/auth";
import SelectInput from "@/components/InputForm/SelectInput";
import { InputText } from "@/components/InputForm/TextInput";
import { DateInput } from "@/components/InputForm/DateInput";
import { FaDotCircle } from "react-icons/fa";

interface Requirement {
  id: string;
  label: string;
  isActive: boolean;
  isRequired: boolean;
}

export default function SyaratPeriodePendaftaranPage() {
  const { showAlert } = useAlert();

  const [requirements, setRequirements] = useState<Requirement[]>([]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Fetch registration requirements from backoffice API
  useEffect(() => {
    type ReqResp = {
      id: number;
      name: string;
      isActive: number;
      order?: number;
    };

    const fetchRequirements = async () => {
      try {
        const res = await fetch(`/api/backoffice/registration-requirements`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        });
        if (!res.ok) {
          console.error(
            "Failed to fetch registration requirements, status:",
            res.status,
          );
          return;
        }
        const data: ReqResp[] = await res.json();
        const mapped: Requirement[] = (data || []).map((r: ReqResp) => ({
          id: String(r.id),
          label: r.name || "",
          isActive: Number(r.isActive) === 1,
          // default: mark required when active
          isRequired: Number(r.isActive) === 1,
        }));
        setRequirements(mapped);
      } catch (err) {
        console.error("Failed to fetch registration requirements:", err);
      }
    };

    fetchRequirements();
  }, []);

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
      id: "new-" + Date.now().toString(),
      label: "",
      isActive: true,
      isRequired: false,
    };
    setRequirements((prev) => [...prev, newRequirement]);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number,
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newRequirements = [...requirements];
    const draggedItem = newRequirements[draggedIndex];
    newRequirements.splice(draggedIndex, 1);
    newRequirements.splice(dropIndex, 0, draggedItem);

    setRequirements(newRequirements);
    setDraggedIndex(null);
  };

  const [batches, setBatches] = useState<
    Array<{ value: string | number; label: string; disabled?: boolean }>
  >([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | number | "">(
    "",
  );

  // Fetch registration batches for filter select
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch(`/api/registrations/batches`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        const opts = (data || []).map(
          (b: {
            id: number;
            name: string;
            title: string;
            isActive?: number;
          }) => ({
            value: b.id,
            label: b.name || b.title || `${b.id}`,
            isActive: b.isActive === 1,
          }),
        );
        setBatches(opts);
      } catch (err) {
        console.error("Failed to fetch batches:", err);
      }
    };
    fetchBatches();
  }, []);

  // Fetch batch details when selection changes
  useEffect(() => {
    const fetchBatchDetail = async (batchId: string | number) => {
      try {
        setLoadingBatch(true);
        const res = await fetch(`/api/registrations/batches/${batchId}`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch batch detail");
        const data = await res.json();
        setBatchName(data.name || "");
        setDateStart(data.dateStart || "");
        setDateEnd(data.dateEnd || "");
        setIsActive(Number(data.isActive || 0));
        setBatchOrder(Number(data.order ?? 0));
        setBatchPhotoUrl(data.photoUrl || "");
      } catch (err) {
        console.error("Failed to fetch batch detail:", err);
        showAlert({
          title: "Error",
          description: "Gagal memuat detail gelombang",
          variant: "error",
        });
      } finally {
        setLoadingBatch(false);
      }
    };

    if (selectedBatchId) {
      fetchBatchDetail(selectedBatchId);
    } else {
      // reset
      setBatchName("");
      setDateStart("");
      setDateEnd("");
      setIsActive(0);
      setBatchOrder(0);
      setBatchPhotoUrl("");
    }
  }, [selectedBatchId, showAlert]);

  const [batchName, setBatchName] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [isActive, setIsActive] = useState<number>(0);
  const [batchOrder, setBatchOrder] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [batchPhotoUrl, setBatchPhotoUrl] = useState<string>("");
  const [loadingBatch, setLoadingBatch] = useState(false);
  const [savingBatch, setSavingBatch] = useState(false);

  const [savingRequirements, setSavingRequirements] = useState(false);

  const handleSaveChanges = async () => {
    if (savingRequirements) return;
    setSavingRequirements(true);
    try {
      type ReqOut = {
        id?: number;
        name: string;
        isActive: number;
        order?: number;
      };
      const payload = {
        requirements: requirements.map((r, idx): ReqOut => {
          const reqOut: ReqOut = {
            name: r.label.trim() || `Syarat ${idx + 1}`,
            isActive: r.isActive ? 1 : 0,
            order: idx,
          };
          // Only include id for existing items (not new- prefixed)
          if (!r.id.startsWith("new-")) {
            reqOut.id = Number(r.id);
          }
          // For new items, omit id entirely
          return reqOut;
        }),
      };

      const res = await fetch(`/api/backoffice/registration-requirements`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data: {
        id: number;
        name: string;
        isActive: number;
        order?: number;
      }[] = await res.json();
      if (!res.ok) {
        const errMsg =
          (data && (data as unknown as { message?: string }).message) ||
          "Gagal menyimpan perubahan";
        showAlert({ title: "Gagal", description: errMsg, variant: "error" });
        return;
      }

      const mapped: Requirement[] = (data || []).map((r) => ({
        id: String(r.id),
        label: r.name || "",
        isActive: Number(r.isActive) === 1,
        isRequired: Number(r.isActive) === 1,
      }));

      setRequirements(mapped);
      showAlert({
        title: "Berhasil",
        description: "Perubahan syarat pendaftaran telah disimpan.",
        variant: "success",
      });

      // Refetch to ensure latest data
      try {
        const refreshRes = await fetch(
          `/api/backoffice/registration-requirements`,
          {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
          },
        );
        if (refreshRes.ok) {
          type ReqResp = {
            id: number;
            name: string;
            isActive: number;
            order?: number;
          };
          const freshData: ReqResp[] = await refreshRes.json();
          const freshMapped: Requirement[] = (freshData || []).map(
            (r: ReqResp) => ({
              id: String(r.id),
              label: r.name || "",
              isActive: Number(r.isActive) === 1,
              isRequired: Number(r.isActive) === 1,
            }),
          );
          setRequirements(freshMapped);
        }
      } catch (refreshErr) {
        console.error("Failed to refetch after save:", refreshErr);
      }
    } catch (err) {
      console.error("Failed to save requirements:", err);
      showAlert({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan syarat pendaftaran",
        variant: "error",
      });
    } finally {
      setSavingRequirements(false);
    }
  };

  const handleSaveBatch = async () => {
    if (!selectedBatchId) return;
    setSavingBatch(true);
    setLoadingBatch(true);
    try {
      const payload: Record<string, unknown> = {
        name: batchName,
        dateStart,
        dateEnd,
        isActive,
        order: batchOrder,
      };

      // If photo file selected, skip here (backend expects separate upload) - we still send JSON
      const res = await fetch(`/api/registrations/batches/${selectedBatchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showAlert({
          title: "Gagal",
          description: data.message || "Gagal menyimpan perubahan",
          variant: "error",
        });
        return;
      }

      showAlert({
        title: "Berhasil",
        description: "Perubahan gelombang berhasil disimpan",
        variant: "success",
      });

      // refresh batches list to reflect changed name/status
      const refreshRes = await fetch(`/api/registrations/batches`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });
      if (refreshRes.ok) {
        const fresh = await refreshRes.json();
        const opts = (fresh || []).map(
          (b: {
            id: number;
            name: string;
            title: string;
            isActive: number;
          }) => ({
            value: b.id,
            label: b.name || b.title || `${b.id}`,
            isActive: b.isActive === 1,
          }),
        );
        setBatches(opts);
      }
    } catch (err) {
      console.error("Failed to save batch:", err);
      showAlert({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan",
        variant: "error",
      });
    } finally {
      setSavingBatch(false);
      setLoadingBatch(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="h-full w-full bg-white rounded-md drop-shadow-sm p-6">
        <TitleSection
          title="Syarat & Periode Pendaftaran"
          subtitle="Menampilkan daftar jalur pendaftaran yang dapat diubah deksripsi dan fotonya"
        />

        <SectionCard
          className="w-full"
          isLoading={savingRequirements}
          title="Syarat Pendaftaran"
          handleSaveChanges={handleSaveChanges}
          leftButton={
            <TextButton
              isLoading={savingRequirements}
              variant="outline"
              icon={<LuPlus size={18} />}
              text="Tambah Syarat"
              onClick={handleAddRequirement}
            />
          }
        >
          <div className="p-4 space-y-1  w-full">
            {/* Header: select-all checkbox, column titles, delete all */}
            <div className="flex items-center gap-3 py-2 px-2 bg-gray-50 rounded-md">
              <div className="w-6"></div> {/* Space for drag handle */}
              <input
                type="checkbox"
                checked={
                  requirements.length > 0 &&
                  requirements.every((r) => r.isActive)
                }
                onChange={(e) => {
                  const newActive = e.target.checked;
                  setRequirements((prev) =>
                    prev.map((r) => ({ ...r, isActive: newActive })),
                  );
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                aria-label="Aktifkan semua syarat"
              />
              <div className="w-16 text-base text-gray-600 font-medium">
                Aktif
              </div>
              <div className="flex-1 text-base text-primary font-medium">
                Nama Syarat
              </div>
              <TextButton
                isLoading={savingRequirements}
                icon={<LuTrash2 className="text-xl text-red-600 px-0" />}
                variant="icon"
                onClick={() => setDeleteAllModalOpen(true)}
              />
            </div>

            {requirements.map((req, index) => (
              <RequirementCard
                key={req.id}
                id={req.id}
                label={req.label}
                isActive={req.isActive}
                isRequired={req.isRequired}
                isLoading={savingRequirements}
                onToggle={handleToggle}
                onRequiredChange={handleRequiredChange}
                onLabelChange={handleLabelChange}
                onDelete={handleDelete}
                isEditable={true}
                index={index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}

            <BaseModal
              hiddenOverlay={true}
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
        <div className="h-5" />
        <TitleSection title="Edit Gelombang Pendaftaran" />
        <SectionCard
          className="w-full"
          title="Data Gelombang"
          isLoading={loadingBatch || savingBatch}
          handleSaveChanges={handleSaveBatch}
          leftButton={
            <div className="mt-1.5 flex flex-row items-center gap-2">
              <p className="text-sm mb-1.5">Urutan Gelombang</p>
              <SelectInput
                value={selectedBatchId}
                onChange={(e) => {
                  setSelectedBatchId(e.target.value);
                }}
                options={[...batches]}
                placeholder="Pilih Gelombang"
                className="w-48 mb-0!"
              />
            </div>
          }
        >
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <InputText
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  label={"Nama Gelombang"}
                  placeholder="Nama Gelombang"
                  name={""}
                />
              </div>

              <div className="w-full flex flex-col">
                <label className="block text-sm font-medium">
                  Periode Pendaftaran
                </label>
                <div className="flex gap-2 items-center">
                  <DateInput
                    value={dateStart}
                    placeholder="Tanggal Awal"
                    startYear={2023}
                    endYear={2099}
                    max={dateEnd || undefined}
                    onChange={(date) => {
                      setDateStart(
                        date ? date.toISOString().split("T")[0] : "",
                      );
                    }}
                    label={""}
                    name={""}
                  />
                  <LuArrowRight className="text-5xl mt-1 text-gray-400" />
                  <DateInput
                    value={dateEnd}
                    placeholder="Tanggal Akhir"
                    startYear={2023}
                    endYear={2099}
                    min={dateStart || undefined}
                    onChange={(date) => {
                      setDateEnd(date ? date.toISOString().split("T")[0] : "");
                    }}
                    label={""}
                    name={""}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Status Gelombang
                </label>
                <div className="flex gap-4 items-center">
                  <button
                    type="button"
                    onClick={() => setIsActive(1)}
                    className={
                      "px-4 py-1 flex flex-row justify-center items-center gap-2 rounded-full font-semibold " +
                      (isActive === 1
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700")
                    }
                  >
                    {isActive === 1 ? (
                      <FaDotCircle
                        className={
                          isActive === 1
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700"
                        }
                      />
                    ) : null}{" "}
                    BUKA
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsActive(0)}
                    className={
                      "px-4 py-1 flex flex-row justify-center items-center gap-2 rounded-full font-semibold " +
                      (isActive === 0
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700")
                    }
                  >
                    {isActive === 0 ? (
                      <FaDotCircle
                        className={
                          isActive === 0
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }
                      />
                    ) : null}{" "}
                    TUTUP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

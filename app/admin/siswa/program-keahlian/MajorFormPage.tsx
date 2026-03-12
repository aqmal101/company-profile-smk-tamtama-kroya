"use client";

import Breadcrumb from "@/components/Breadcrumb";
import { TextButton } from "@/components/Buttons/TextButton";
import SelectInput from "@/components/InputForm/SelectInput";
import SortableListInput from "@/components/InputForm/SortableListInput";
import { BaseModal } from "@/components/Modal/BaseModal";
import { TitleSection } from "@/components/TitleSection";
import { useAlert } from "@/components/ui/alert";
import {
  FormInput,
  FormInputNumber,
  FormTextarea,
} from "@/components/ui/form-input";
import { FormInputRichText } from "@/components/ui/form-input-richtext";
import MultipleImageUploader, {
  MultipleImageItem,
} from "@/components/Upload/MultipleImageUploader";
import PhotoUpload from "@/components/Upload/PhotoUpload";
import { getAuthHeader } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { MajorDetail } from "./type";

// ─── Types ──────────────────────────────────────────────────────────────────

type MajorFormMode = "create" | "edit";

type FormErrors = Partial<
  Record<
    | "name"
    | "abbreviation"
    | "summary"
    | "description"
    | "capacity"
    | "studyDurationYears"
    | "photoUrl",
    string
  >
>;

type InlineAlert = { variant: "success" | "error"; message: string };

interface IndustryPartnerInput {
  clientId: string;
  id?: number;
  cover: string;
  coverFile?: File;
  coverPreview: string;
  name: string;
  description: string;
}

interface MajorFormValues {
  name: string;
  abbreviation: string;
  summary: string;
  description: string;
  graduateProspects: string[];
  mainCompetencies: string[];
  certifications: string[];
  vocationalSubjects: string[];
  capacity: number | "";
  studyDurationYears: number | "";
  photoUrl: string;
  galleryDescription: string;
  industryPartnerDescription: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STUDY_DURATION_OPTIONS = [
  { value: "1", label: "1 Tahun" },
  { value: "2", label: "2 Tahun" },
  { value: "3", label: "3 Tahun" },
  { value: "4", label: "4 Tahun" },
];

const DEFAULT_FORM: MajorFormValues = {
  name: "",
  abbreviation: "",
  summary: "",
  description: "",
  graduateProspects: [],
  mainCompetencies: [],
  certifications: [],
  vocationalSubjects: [],
  capacity: "",
  studyDurationYears: "",
  photoUrl: "",
  galleryDescription: "",
  industryPartnerDescription: "",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const createClientId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const toObject = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};

const getErrorMessage = (payload: unknown, fallback: string): string => {
  const root = toObject(payload);
  const msg = root.message;
  if (typeof msg === "string" && msg.trim()) return msg.trim();
  const err = root.error;
  if (typeof err === "string" && err.trim()) return err.trim();
  return fallback;
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface MajorFormPageProps {
  mode: MajorFormMode;
  id?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function MajorFormPage({ mode, id }: MajorFormPageProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const isEditMode = mode === "edit";

  const [isLoadingDetail, setIsLoadingDetail] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [formValues, setFormValues] = useState<MajorFormValues>(DEFAULT_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [galleryItems, setGalleryItems] = useState<MultipleImageItem[]>([]);
  const [galleryAlert, setGalleryAlert] = useState<InlineAlert | null>(null);

  const [partners, setPartners] = useState<IndustryPartnerInput[]>([]);

  // ─── Load detail for edit ─────────────────────────────────────────────────

  useEffect(() => {
    if (!isEditMode || !id) {
      setIsLoadingDetail(false);
      return;
    }

    let cancelled = false;

    const fetchDetail = async () => {
      try {
        setIsLoadingDetail(true);

        const res = await fetch(`/api/backoffice/majors/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Gagal memuat detail jurusan");

        const payload = (await res.json()) as unknown;
        const raw: Partial<MajorDetail> =
          payload && typeof payload === "object" && "data" in payload
            ? ((payload as Record<string, unknown>)
                .data as Partial<MajorDetail>)
            : (payload as Partial<MajorDetail>);

        if (cancelled) return;

        setFormValues({
          name: raw.name ?? "",
          abbreviation: raw.abbreviation ?? "",
          summary: raw.summary ?? "",
          description: raw.description ?? "",
          graduateProspects: raw.graduateProspects ?? [],
          mainCompetencies: raw.mainCompetencies ?? [],
          certifications: raw.certifications ?? [],
          vocationalSubjects: raw.vocationalSubjects ?? [],
          capacity: raw.capacity ?? "",
          studyDurationYears: raw.studyDurationYears ?? "",
          photoUrl: raw.photoUrl ?? "",
          galleryDescription: raw.galleryDescription ?? "",
          industryPartnerDescription: raw.industryPartnerDescription ?? "",
        });

        setPhotoPreview(raw.photoUrl ?? "");

        setGalleryItems(
          (raw.galleries ?? [])
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((g) => ({
              clientId: createClientId("gallery"),
              id: g.id,
              previewUrl: g.photoUrl,
              order: g.order,
            })),
        );

        setPartners(
          (raw.industryPartners ?? []).map((p) => ({
            clientId: createClientId("partner"),
            id: p.id,
            cover: p.cover ?? "",
            coverPreview: p.cover ?? "",
            name: p.name ?? "",
            description: p.description ?? "",
          })),
        );
      } catch (err) {
        console.error("Failed fetch major detail", err);
        showAlert({
          title: "Gagal",
          description: "Gagal memuat data jurusan",
          variant: "error",
        });
        router.push("/admin/siswa/program-keahlian");
      } finally {
        if (!cancelled) setIsLoadingDetail(false);
      }
    };

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [isEditMode, id, router, showAlert]);

  // Auto-clear gallery alert
  useEffect(() => {
    if (!galleryAlert) return;
    const t = setTimeout(() => setGalleryAlert(null), 3000);
    return () => clearTimeout(t);
  }, [galleryAlert]);

  // ─── Field helpers ────────────────────────────────────────────────────────

  const setField = <K extends keyof MajorFormValues>(
    key: K,
    value: MajorFormValues[K],
  ) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // ─── Photo handlers ───────────────────────────────────────────────────────

  const handlePhotoSelect = (file: File | null) => {
    if (!file) {
      setPhotoFile(null);
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(String(e.target?.result ?? ""));
    reader.readAsDataURL(file);
    setFormErrors((prev) => ({ ...prev, photoUrl: undefined }));
  };

  const handlePhotoRemove = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    setFormValues((prev) => ({ ...prev, photoUrl: "" }));
  };

  // ─── Gallery handlers ─────────────────────────────────────────────────────

  const handleGalleryChange = (next: MultipleImageItem[]) => {
    const prevIds = new Set(galleryItems.map((g) => g.clientId));
    const added = next.filter(
      (item) => !prevIds.has(item.clientId) && item.file,
    );
    setGalleryItems(next.map((item, i) => ({ ...item, order: i })));
    if (added.length > 0) {
      setGalleryAlert({
        variant: "success",
        message: `${added.length} foto ditambahkan. Klik Simpan untuk menerapkan.`,
      });
    }
  };

  // ─── Partner handlers ─────────────────────────────────────────────────────

  const addPartner = () => {
    setPartners((prev) => [
      ...prev,
      {
        clientId: createClientId("partner"),
        cover: "",
        coverPreview: "",
        name: "",
        description: "",
      },
    ]);
  };

  const removePartner = (clientId: string) => {
    setPartners((prev) => prev.filter((p) => p.clientId !== clientId));
  };

  const updatePartner = (
    clientId: string,
    patch: Partial<IndustryPartnerInput>,
  ) => {
    setPartners((prev) =>
      prev.map((p) => (p.clientId === clientId ? { ...p, ...patch } : p)),
    );
  };

  const handlePartnerCoverSelect = (clientId: string, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      updatePartner(clientId, {
        coverFile: file,
        coverPreview: String(e.target?.result ?? ""),
      });
    reader.readAsDataURL(file);
  };

  // ─── Validation ───────────────────────────────────────────────────────────

  const validate = () => {
    const errors: FormErrors = {};
    if (!formValues.name.trim()) errors.name = "Nama jurusan wajib diisi";
    if (!formValues.abbreviation.trim())
      errors.abbreviation = "Singkatan wajib diisi";
    if (!formValues.summary.trim())
      errors.summary = "Deskripsi singkat wajib diisi";
    if (!formValues.description.trim())
      errors.description = "Deskripsi lengkap wajib diisi";
    if (formValues.capacity === "" || Number(formValues.capacity) < 1)
      errors.capacity = "Daya tampung wajib diisi (minimal 1)";
    if (formValues.studyDurationYears === "")
      errors.studyDurationYears = "Durasi studi wajib dipilih";
    if (!photoFile && !formValues.photoUrl.trim())
      errors.photoUrl = "Foto utama jurusan wajib diisi";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Upload helpers ───────────────────────────────────────────────────────

  const uploadMainPhoto = async (): Promise<string> => {
    if (!photoFile) return formValues.photoUrl;
    const fd = new FormData();
    fd.append("photo", photoFile);
    const res = await fetch("/api/backoffice/majors/photo", {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: fd,
    });
    const payload = (await res.json()) as unknown;
    if (!res.ok)
      throw new Error(getErrorMessage(payload, "Gagal upload foto utama"));
    const url = toObject(payload).photoUrl;
    if (typeof url !== "string" || !url.trim())
      throw new Error("URL foto utama tidak ditemukan dari response");
    return url.trim();
  };

  const uploadGalleryPhoto = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("photo", file);
    const res = await fetch("/api/backoffice/majors/galleries/photo", {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: fd,
    });
    const payload = (await res.json()) as unknown;
    if (!res.ok)
      throw new Error(getErrorMessage(payload, "Gagal upload foto galeri"));
    const url = toObject(payload).photoUrl;
    if (typeof url !== "string" || !url.trim())
      throw new Error("URL foto galeri tidak ditemukan dari response");
    return url.trim();
  };

  const uploadPartnerCover = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("photo", file);
    const res = await fetch("/api/backoffice/majors/photo", {
      method: "POST",
      headers: { ...getAuthHeader() },
      body: fd,
    });
    const payload = (await res.json()) as unknown;
    if (!res.ok)
      throw new Error(getErrorMessage(payload, "Gagal upload cover mitra"));
    const url = toObject(payload).photoUrl;
    if (typeof url !== "string" || !url.trim())
      throw new Error("URL cover mitra tidak ditemukan dari response");
    return url.trim();
  };

  const buildGalleryPayload = async (): Promise<string[]> => {
    const sorted = [...galleryItems].sort((a, b) => a.order - b.order);
    const urls: string[] = [];
    for (const item of sorted) {
      if (item.file) {
        urls.push(await uploadGalleryPhoto(item.file));
      } else if (item.previewUrl && !item.previewUrl.startsWith("data:")) {
        urls.push(item.previewUrl);
      }
    }
    return urls;
  };

  const buildPartnersPayload = async () => {
    const result = [];
    for (const p of partners) {
      let cover = p.cover;
      if (p.coverFile) cover = await uploadPartnerCover(p.coverFile);
      result.push({
        cover,
        name: p.name.trim(),
        description: p.description.trim(),
      });
    }
    return result;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) {
      showAlert({
        title: "Validasi",
        description: "Periksa kembali data wajib",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const finalPhotoUrl = await uploadMainPhoto();
      const galleriesPayload = await buildGalleryPayload();
      const partnersPayload = await buildPartnersPayload();

      const payload = {
        name: formValues.name.trim(),
        abbreviation: formValues.abbreviation.trim().toUpperCase(),
        summary: formValues.summary.trim(),
        description: formValues.description.trim(),
        graduateProspects: formValues.graduateProspects.filter(Boolean),
        mainCompetencies: formValues.mainCompetencies.filter(Boolean),
        certifications: formValues.certifications.filter(Boolean),
        vocationalSubjects: formValues.vocationalSubjects.filter(Boolean),
        capacity: Number(formValues.capacity),
        studyDurationYears: Number(formValues.studyDurationYears),
        photoUrl: finalPhotoUrl,
        galleryDescription: formValues.galleryDescription.trim(),
        galleries: galleriesPayload,
        industryPartnerDescription:
          formValues.industryPartnerDescription.trim(),
        industryPartners: partnersPayload,
      };

      const endpoint = isEditMode
        ? `/api/backoffice/majors/${id}`
        : "/api/backoffice/majors";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const resPayload = (await res.json()) as unknown;
      if (!res.ok) {
        throw new Error(
          getErrorMessage(
            resPayload,
            `Gagal ${isEditMode ? "memperbarui" : "menambahkan"} data jurusan`,
          ),
        );
      }

      showAlert({
        title: "Berhasil",
        description: `Data jurusan berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}`,
        variant: "success",
      });
      router.push("/admin/siswa/program-keahlian");
    } catch (err) {
      console.error("Failed to submit major form", err);
      showAlert({
        title: "Gagal",
        description:
          err instanceof Error ? err.message : "Gagal menyimpan data jurusan",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Loading state ────────────────────────────────────────────────────────

  if (isLoadingDetail) {
    return (
      <div className="w-full min-h-screen bg-gray-100 p-4">
        <div className="w-full h-fit bg-white rounded-md drop-shadow-sm px-4 py-4">
          <TitleSection
            title={isEditMode ? "Edit Jurusan" : "Tambah Jurusan"}
            subtitle={
              isEditMode
                ? "Perbarui data jurusan sekolah."
                : "Tambahkan data jurusan baru."
            }
          />
          <div className="w-full h-[60vh] flex flex-col gap-4 justify-center items-center">
            <div className="w-12 h-12 border-4 border-dashed border-gray-400 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Memuat data jurusan...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <div className="w-full h-fit bg-white rounded-md drop-shadow-sm px-4 py-4">
        <TitleSection
          title={isEditMode ? "Edit Jurusan" : "Tambah Jurusan"}
          subtitle={
            isEditMode
              ? "Perbarui informasi jurusan yang ditampilkan pada halaman website sekolah."
              : "Tambahkan jurusan baru pada website sekolah."
          }
        />

        <div className="space-y-6 mt-4">
          {/* ── Section 1: Informasi Utama ───────────────────────────────── */}
          <section className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="text-base font-semibold text-gray-800">
              Informasi Utama
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormInput
                label="Nama Jurusan"
                value={formValues.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Contoh: Teknik Kendaraan Ringan"
                isMandatory
                disabled={isSubmitting}
                error={formErrors.name}
              />
              <FormInput
                label="Singkatan"
                value={formValues.abbreviation}
                onChange={(e) =>
                  setField("abbreviation", e.target.value.toUpperCase())
                }
                placeholder="Contoh: TKR"
                isMandatory
                isUppercase
                disabled={isSubmitting}
                error={formErrors.abbreviation}
              />
              <FormInputNumber
                label="Daya Tampung (Siswa)"
                value={formValues.capacity}
                onChange={(e) =>
                  setField(
                    "capacity",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="Contoh: 100"
                min={1}
                isMandatory
                disabled={isSubmitting}
                error={formErrors.capacity}
              />
              <SelectInput
                label="Durasi Studi"
                value={String(formValues.studyDurationYears)}
                onChange={(e) =>
                  setField(
                    "studyDurationYears",
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                options={STUDY_DURATION_OPTIONS}
                placeholder="Pilih durasi studi"
                isMandatory
                disabled={isSubmitting}
                error={formErrors.studyDurationYears}
              />
              <div className="lg:col-span-2">
                <FormTextarea
                  label="Deskripsi Singkat"
                  value={formValues.summary}
                  onChange={(e) => setField("summary", e.target.value)}
                  placeholder="Deskripsi singkat jurusan"
                  limit={100}
                  isMandatory
                  disabled={isSubmitting}
                  error={formErrors.summary}
                />
              </div>
            </div>
          </section>

          {/* ── Section 2: Deskripsi Lengkap ─────────────────────────────── */}
          <section className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="text-base font-semibold text-gray-800">
              Deskripsi Lengkap
            </h3>
            <FormInputRichText
              label="Deskripsi"
              value={formValues.description}
              onChange={(v) => setField("description", v)}
              placeholder="Deskripsi lengkap tentang jurusan ini..."
              isMandatory
              disabled={isSubmitting}
              error={formErrors.description}
            />
          </section>

          {/* ── Section 3: Foto Utama & Galeri ───────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="text-base font-semibold text-gray-800">
                Foto Utama
              </h3>
              <PhotoUpload
                label="Foto Jurusan"
                previewUrl={photoPreview || formValues.photoUrl}
                onFileSelect={handlePhotoSelect}
                onFileRemove={handlePhotoRemove}
                isMandatory
                disabled={isSubmitting}
                textButton="Ganti Foto"
                maxSizeInMB={5}
                error={formErrors.photoUrl}
                onValidationError={(msg) =>
                  showAlert({
                    title: "Validasi Foto",
                    description: msg,
                    variant: "error",
                  })
                }
              />
            </section>

            <section className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="text-base font-semibold text-gray-800">
                Galeri Jurusan
              </h3>
              <MultipleImageUploader
                label="Foto Galeri"
                items={galleryItems}
                onChange={handleGalleryChange}
                disabled={isSubmitting}
                maxItems={20}
                maxSizeInMB={5}
                onValidationError={(msg) =>
                  showAlert({
                    title: "Validasi Galeri",
                    description: msg,
                    variant: "error",
                  })
                }
              />
              {galleryAlert && (
                <div
                  className={`rounded border px-3 py-2 text-sm ${
                    galleryAlert.variant === "success"
                      ? "border-green-300 bg-green-50 text-green-700"
                      : "border-red-300 bg-red-50 text-red-700"
                  }`}
                >
                  {galleryAlert.message}
                </div>
              )}
              <FormTextarea
                label="Deskripsi Galeri"
                value={formValues.galleryDescription}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    galleryDescription: e.target.value,
                  }))
                }
                placeholder="Deskripsi singkat galeri jurusan"
                limit={500}
                disabled={isSubmitting}
              />
            </section>
          </div>

          {/* ── Section 4: Prospek & Kompetensi ──────────────────────────── */}
          <section className="border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="text-base font-semibold text-gray-800">
              Prospek &amp; Kompetensi
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SortableListInput
                label="Prospek Lulusan"
                value={formValues.graduateProspects}
                onChange={(v) =>
                  setFormValues((prev) => ({
                    ...prev,
                    graduateProspects: v,
                  }))
                }
                placeholder="Ketik lalu tekan Enter"
                disabled={isSubmitting}
              />
              <SortableListInput
                label="Kompetensi Utama"
                value={formValues.mainCompetencies}
                onChange={(v) =>
                  setFormValues((prev) => ({ ...prev, mainCompetencies: v }))
                }
                placeholder="Ketik lalu tekan Enter"
                disabled={isSubmitting}
              />
              <SortableListInput
                label="Sertifikasi"
                value={formValues.certifications}
                onChange={(v) =>
                  setFormValues((prev) => ({ ...prev, certifications: v }))
                }
                placeholder="Ketik lalu tekan Enter"
                disabled={isSubmitting}
              />
              <SortableListInput
                label="Mata Pelajaran Kejuruan"
                value={formValues.vocationalSubjects}
                onChange={(v) =>
                  setFormValues((prev) => ({ ...prev, vocationalSubjects: v }))
                }
                placeholder="Ketik lalu tekan Enter"
                disabled={isSubmitting}
              />
            </div>
          </section>

          {/* ── Section 5: Mitra Industri ─────────────────────────────────── */}
          <section className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-800">
                Mitra Industri
              </h3>
              <TextButton
                variant="outline"
                text="Tambah Mitra"
                icon={<LuPlus />}
                onClick={addPartner}
                disabled={isSubmitting}
                className="text-sm"
              />
            </div>

            <FormTextarea
              label="Deskripsi Mitra Industri"
              value={formValues.industryPartnerDescription}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  industryPartnerDescription: e.target.value,
                }))
              }
              placeholder="Deskripsi umum mengenai kerjasama industri"
              limit={500}
              disabled={isSubmitting}
            />

            {partners.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                Belum ada mitra industri. Klik &quot;Tambah Mitra&quot; untuk
                menambahkan.
              </p>
            )}

            <div className="space-y-4">
              {partners.map((p, i) => (
                <div
                  key={p.clientId}
                  className="border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">
                      Mitra {i + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removePartner(p.clientId)}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                    >
                      <LuTrash2 className="text-lg" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Cover Mitra
                      </p>
                      <PhotoUpload
                        label=""
                        previewUrl={p.coverPreview || p.cover}
                        onFileSelect={(file) =>
                          handlePartnerCoverSelect(p.clientId, file)
                        }
                        onFileRemove={() =>
                          updatePartner(p.clientId, {
                            coverFile: undefined,
                            coverPreview: "",
                            cover: "",
                          })
                        }
                        disabled={isSubmitting}
                        textButton="Ganti Cover"
                        maxSizeInMB={5}
                        onValidationError={(msg) =>
                          showAlert({
                            title: "Validasi Cover Mitra",
                            description: msg,
                            variant: "error",
                          })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <FormInput
                        label="Nama Mitra"
                        value={p.name}
                        onChange={(e) =>
                          updatePartner(p.clientId, { name: e.target.value })
                        }
                        placeholder="Contoh: PT. Astra International"
                        disabled={isSubmitting}
                      />
                      <FormTextarea
                        label="Deskripsi Mitra"
                        value={p.description}
                        onChange={(e) =>
                          updatePartner(p.clientId, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Deskripsi singkat mitra industri"
                        limit={300}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <TextButton
            variant="outline"
            text="Batal"
            disabled={isSubmitting}
            onClick={() => setIsCancelModalOpen(true)}
          />
          <TextButton
            variant="primary"
            text={isSubmitting ? "Menyimpan..." : "Simpan"}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            onClick={handleSubmit}
          />
        </div>
      </div>

      {/* ── Cancel Modal ─────────────────────────────────────────────────── */}
      <BaseModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Konfirmasi Batal"
        footer={
          <div className="flex justify-end gap-2">
            <TextButton
              variant="outline"
              text="Kembali"
              onClick={() => setIsCancelModalOpen(false)}
            />
            <TextButton
              variant="danger"
              text="Ya, Batal"
              onClick={() => {
                setIsCancelModalOpen(false);
                router.push("/admin/siswa/program-keahlian");
              }}
            />
          </div>
        }
      >
        <p>Perubahan yang belum disimpan akan hilang. Lanjutkan?</p>
      </BaseModal>
    </div>
  );
}

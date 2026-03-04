"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import Search from "@/components/Filter/Search";
import GridListPaginate from "@/components/GridListPaginate";
import SelectInput from "@/components/InputForm/SelectInput";
import { BaseModal } from "@/components/Modal/BaseModal";
import { TitleSection } from "@/components/TitleSection/index";
import Toggle from "@/components/ui/toggle";
import { useAlert } from "@/components/ui/alert";
import PhotoUpload from "@/components/Upload/PhotoUpload";
import { getAuthHeader } from "@/utils/auth";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoMdRefresh } from "react-icons/io";
import { LuPen, LuPlus, LuTrash2 } from "react-icons/lu";
import CategoryMultiInput from "@/components/InputForm/CategoryMultiInput";
import {
  ExtracurricularFormValues,
  ExtracurricularItem,
  ExtracurricularListResponse,
} from "./type";

type FormErrorState = Partial<
  Record<"name" | "categories" | "description" | "thumbnailUrl", string>
>;

const CATEGORY_FILTER_DEFAULT = { value: "", label: "Semua Kategori" };

const DEFAULT_FORM_VALUES: ExtracurricularFormValues = {
  name: "",
  slug: "",
  categories: [],
  mentorName: "",
  description: "",
  schedule: "",
  location: "",
  thumbnailUrl: "",
  isPublished: true,
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const normalizeBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    return lowered === "true" || lowered === "1";
  }
  return false;
};

const toCategoryArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeItem = (
  item: Partial<ExtracurricularItem>,
): ExtracurricularItem => {
  const normalizedName = item.name?.trim() || "Tanpa Nama";

  return {
    id: Number(item.id || 0),
    name: normalizedName,
    slug: item.slug?.trim() || toSlug(normalizedName),
    thumbnailUrl:
      item.thumbnailUrl?.trim() || "https://placehold.co/1200x800/png",
    categories: toCategoryArray(item.categories),
    mentorName: item.mentorName?.trim() || "",
    description: item.description?.trim() || "",
    schedule: item.schedule?.trim() || "",
    location: item.location?.trim() || "",
    isPublished: normalizeBoolean(item.isPublished),
    galleries: Array.isArray(item.galleries) ? item.galleries : [],
    achievements: Array.isArray(item.achievements) ? item.achievements : [],
    createdAt: item.createdAt || "",
    updatedAt: item.updatedAt || "",
    deletedAt: item.deletedAt ?? null,
  };
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(String(reader.result || ""));
    };
    reader.onerror = () => {
      reject(new Error("Gagal membaca file thumbnail"));
    };
    reader.readAsDataURL(file);
  });

export default function DataExtraPage() {
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [items, setItems] = useState<ExtracurricularItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    Array<{ value: string | number; label: string }>
  >([CATEGORY_FILTER_DEFAULT]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    perPage: 9,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [formValues, setFormValues] =
    useState<ExtracurricularFormValues>(DEFAULT_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<FormErrorState>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [togglingBySlug, setTogglingBySlug] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const mergeCategoryOptions = useCallback(
    (nextItems: ExtracurricularItem[]) => {
      setCategoryOptions((prevOptions) => {
        const mergedCategories = new Set<string>(
          prevOptions
            .map((option) => String(option.value).trim())
            .filter((value) => value !== ""),
        );

        nextItems.forEach((item) => {
          item.categories.forEach((category) => {
            const normalized = category.trim();
            if (normalized) {
              mergedCategories.add(normalized);
            }
          });
        });

        return [
          CATEGORY_FILTER_DEFAULT,
          ...Array.from(mergedCategories)
            .sort((a, b) => a.localeCompare(b))
            .map((category) => ({ value: category, label: category })),
        ];
      });
    },
    [],
  );

  const fetchExtracurriculars = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const params = new URLSearchParams({
        page: String(pagination.currentPage),
        perPage: String(pagination.perPage),
        limit: String(pagination.perPage),
      });

      if (debouncedSearchTerm) {
        params.set("search", debouncedSearchTerm);
      }

      if (selectedCategory) {
        params.set("category", selectedCategory);
      }

      const response = await fetch(
        `/api/backoffice/extracurriculars?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        },
      );

      if (!response.ok) {
        throw new Error("Gagal memuat data ekstrakurikuler");
      }

      const payload = (await response.json()) as
        | ExtracurricularListResponse
        | {
            data?: ExtracurricularItem[];
            meta?: ExtracurricularListResponse["meta"];
          };

      const rawItems = Array.isArray(
        (payload as ExtracurricularListResponse).items,
      )
        ? (payload as ExtracurricularListResponse).items
        : Array.isArray((payload as { data?: ExtracurricularItem[] }).data)
          ? (payload as { data: ExtracurricularItem[] }).data || []
          : [];

      const normalizedItems = rawItems.map((item) => normalizeItem(item));

      setItems(normalizedItems);
      mergeCategoryOptions(normalizedItems);

      const responseMeta = payload.meta;
      setPagination((prev) => ({
        ...prev,
        total: Number(responseMeta?.total ?? normalizedItems.length),
        currentPage: Number(responseMeta?.currentPage ?? prev.currentPage),
        perPage: Number(responseMeta?.perPage ?? prev.perPage),
      }));
    } catch (error) {
      console.error("Failed fetch extracurriculars", error);
      setItems([]);
      setPagination((prev) => ({ ...prev, total: 0 }));
      setFetchError("Gagal memuat data ekstrakurikuler.");
      showAlert({
        title: "Gagal",
        description: "Gagal memuat data ekstrakurikuler",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.perPage,
    debouncedSearchTerm,
    selectedCategory,
    mergeCategoryOptions,
    showAlert,
  ]);

  useEffect(() => {
    fetchExtracurriculars();
  }, [fetchExtracurriculars]);

  const categorySuggestions = useMemo(
    () =>
      categoryOptions
        .map((option) => String(option.value).trim())
        .filter((value) => value !== ""),
    [categoryOptions],
  );

  const deletingItem = useMemo(
    () => items.find((item) => item.slug === deletingSlug) || null,
    [items, deletingSlug],
  );

  const resetFormState = () => {
    setFormValues(DEFAULT_FORM_VALUES);
    setFormErrors({});
    setThumbnailFile(null);
    setThumbnailPreview("");
    setIsLoadingDetail(false);
    setIsSubmitting(false);
    setActiveSlug(null);
  };

  const openCreateModal = () => {
    resetFormState();
    setFormMode("create");
    setIsFormModalOpen(true);
  };

  const openEditModal = async (slug: string) => {
    setFormMode("edit");
    setActiveSlug(slug);
    setFormErrors({});
    setThumbnailFile(null);
    setThumbnailPreview("");
    setIsFormModalOpen(true);
    setIsLoadingDetail(true);

    try {
      const response = await fetch(
        `/api/backoffice/extracurriculars/${encodeURIComponent(slug)}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        },
      );

      if (!response.ok) {
        throw new Error("Gagal memuat detail ekstrakurikuler");
      }

      const payload = await response.json();
      const detail = normalizeItem(payload?.data ?? payload);

      setFormValues({
        name: detail.name,
        slug: detail.slug,
        categories: detail.categories,
        mentorName: detail.mentorName,
        description: detail.description,
        schedule: detail.schedule,
        location: detail.location,
        thumbnailUrl: detail.thumbnailUrl,
        isPublished: detail.isPublished,
      });
      setThumbnailPreview(detail.thumbnailUrl);
      mergeCategoryOptions([detail]);
    } catch (error) {
      console.error("Failed fetch extracurricular detail", error);
      showAlert({
        title: "Gagal",
        description: "Gagal memuat detail ekstrakurikuler",
        variant: "error",
      });
      setIsFormModalOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const closeFormModal = () => {
    if (isSubmitting || isLoadingDetail) {
      return;
    }

    setIsFormModalOpen(false);
    resetFormState();
  };

  const handleFormNameChange = (name: string) => {
    setFormValues((prev) => ({
      ...prev,
      name,
      slug: toSlug(name),
    }));
    setFormErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleDescriptionChange = (description: string) => {
    setFormValues((prev) => ({ ...prev, description }));
    setFormErrors((prev) => ({ ...prev, description: undefined }));
  };

  const handleCategoryChange = (categories: string[]) => {
    setFormValues((prev) => ({ ...prev, categories }));
    setFormErrors((prev) => ({ ...prev, categories: undefined }));
  };

  const handleThumbnailFileChange = (file: File | null) => {
    if (!file) {
      setThumbnailFile(null);
      return;
    }

    setThumbnailFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = String(event.target?.result || "");
      setThumbnailPreview(dataUrl);
    };
    reader.readAsDataURL(file);

    setFormErrors((prev) => ({ ...prev, thumbnailUrl: undefined }));
  };

  const handleThumbnailRemove = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
    setFormValues((prev) => ({ ...prev, thumbnailUrl: "" }));
  };

  const handleThumbnailUrlChange = (thumbnailUrl: string) => {
    setThumbnailFile(null);
    setThumbnailPreview(thumbnailUrl);
    setFormValues((prev) => ({ ...prev, thumbnailUrl }));
    setFormErrors((prev) => ({ ...prev, thumbnailUrl: undefined }));
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrorState = {};

    if (!formValues.name.trim()) {
      nextErrors.name = "Nama ekstrakurikuler wajib diisi";
    }

    if (formValues.categories.length === 0) {
      nextErrors.categories = "Kategori wajib diisi minimal 1";
    }

    if (!formValues.description.trim()) {
      nextErrors.description = "Deskripsi wajib diisi";
    }

    if (!thumbnailFile && !formValues.thumbnailUrl.trim()) {
      nextErrors.thumbnailUrl = "Thumbnail wajib diisi";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitForm = async () => {
    if (!validateForm()) {
      showAlert({
        title: "Validasi",
        description: "Periksa kembali field yang wajib diisi",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let finalThumbnailUrl = formValues.thumbnailUrl.trim();

      if (thumbnailFile) {
        finalThumbnailUrl = await fileToDataUrl(thumbnailFile);
      }

      const payload = {
        name: formValues.name.trim(),
        thumbnailUrl: finalThumbnailUrl,
        categories: formValues.categories,
        mentorName: formValues.mentorName,
        description: formValues.description.trim(),
        schedule: formValues.schedule,
        location: formValues.location,
        isPublished: formValues.isPublished,
      };

      const isEditMode = formMode === "edit" && Boolean(activeSlug);
      const endpoint = isEditMode
        ? `/api/backoffice/extracurriculars/${encodeURIComponent(activeSlug || "")}`
        : "/api/backoffice/extracurriculars";

      const response = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.message ||
            `Gagal ${isEditMode ? "memperbarui" : "menambah"} ekstrakurikuler`,
        );
      }

      showAlert({
        title: "Berhasil",
        description: `Data ekstrakurikuler berhasil ${
          isEditMode ? "diperbarui" : "ditambahkan"
        }`,
        variant: "success",
      });

      setIsFormModalOpen(false);
      resetFormState();
      fetchExtracurriculars();
    } catch (error) {
      console.error("Failed submit extracurricular form", error);
      showAlert({
        title: "Gagal",
        description:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan data ekstrakurikuler",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (slug: string) => {
    setDeletingSlug(slug);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingSlug) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(
        `/api/backoffice/extracurriculars/${encodeURIComponent(deletingSlug)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        },
      );

      if (!response.ok) {
        throw new Error("Gagal menghapus data ekstrakurikuler");
      }

      showAlert({
        title: "Berhasil",
        description: "Data ekstrakurikuler berhasil dihapus",
        variant: "success",
      });

      setIsDeleteModalOpen(false);
      setDeletingSlug(null);

      if (items.length === 1 && pagination.currentPage > 1) {
        setPagination((prev) => ({
          ...prev,
          currentPage: Math.max(1, prev.currentPage - 1),
        }));
      } else {
        fetchExtracurriculars();
      }
    } catch (error) {
      console.error("Failed delete extracurricular", error);
      showAlert({
        title: "Gagal",
        description: "Gagal menghapus data ekstrakurikuler",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (
    item: ExtracurricularItem,
    nextPublishedValue: boolean,
  ) => {
    setItems((prev) =>
      prev.map((current) =>
        current.slug === item.slug
          ? { ...current, isPublished: nextPublishedValue }
          : current,
      ),
    );
    setTogglingBySlug((prev) => ({ ...prev, [item.slug]: true }));

    try {
      const response = await fetch(
        `/api/backoffice/extracurriculars/${encodeURIComponent(item.slug)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          body: JSON.stringify({
            name: item.name,
            thumbnailUrl: item.thumbnailUrl,
            categories: item.categories,
            mentorName: item.mentorName,
            description: item.description,
            schedule: item.schedule,
            location: item.location,
            isPublished: nextPublishedValue,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Gagal memperbarui status publikasi");
      }

      showAlert({
        title: "Berhasil",
        description: `Status ekstrakurikuler berhasil diubah menjadi ${
          nextPublishedValue ? "Active" : "Non Active"
        }`,
        variant: "success",
      });
    } catch (error) {
      console.error("Failed toggle extracurricular status", error);

      setItems((prev) =>
        prev.map((current) =>
          current.slug === item.slug
            ? { ...current, isPublished: item.isPublished }
            : current,
        ),
      );

      showAlert({
        title: "Gagal",
        description: "Gagal memperbarui status ekstrakurikuler",
        variant: "error",
      });
    } finally {
      setTogglingBySlug((prev) => {
        const nextValue = { ...prev };
        delete nextValue[item.slug];
        return nextValue;
      });
    }
  };

  const paginationConfig = useMemo(
    () => ({
      current: pagination.currentPage,
      pageSize: pagination.perPage,
      total: pagination.total,
      onChange: (page: number, pageSize: number) => {
        setPagination((prev) => ({
          ...prev,
          currentPage: page,
          perPage: pageSize,
        }));
      },
      showSizeChanger: false,
      onShowSizeChange: (_page: number, pageSize: number) => {
        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
          perPage: pageSize,
        }));
      },
    }),
    [pagination],
  );

  const renderItem = (item: ExtracurricularItem, _: number) => (
    <div className="h-full rounded-lg border border-gray-300 bg-white overflow-hidden flex flex-col">
      <Image
        src={item.thumbnailUrl || "https://placehold.co/1200x800/png"}
        alt={item.name}
        width={1200}
        height={800}
        loading="lazy"
        unoptimized
        className="w-full h-44 object-cover border-b border-gray-200"
      />
      <div className="flex-1 p-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-800 leading-5">
            {item.name}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[11px] ${
              item.isPublished
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {item.isPublished ? "Active" : "Non Active"}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 min-h-6">
          {item.categories.length > 0 ? (
            item.categories.map((category) => (
              <span
                key={`${item.slug}-${category}`}
                className="rounded-full bg-primary/10 px-2 py-1 text-[11px] text-primary"
              >
                {category}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-500">Tanpa kategori</span>
          )}
        </div>

        <p className="text-xs text-gray-600 min-h-10">
          {item.description || "Deskripsi belum tersedia."}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <Toggle
              size="sm"
              enabled={Boolean(item.isPublished)}
              disabled={Boolean(togglingBySlug[item.slug])}
              onChange={(nextValue) => {
                handleTogglePublish(item, nextValue);
              }}
            />
            <span className="text-xs text-gray-600">
              {item.isPublished ? "Active" : "Non Active"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <TextButton
              icon={<LuPen className="text-base" />}
              variant="outline-info"
              className="w-fit py-1 px-2! text-xs border"
              onClick={() => openEditModal(item.slug)}
            />
            <TextButton
              icon={<LuTrash2 className="text-base" />}
              variant="outline-danger"
              className="w-fit py-1 px-2! text-xs border"
              onClick={() => openDeleteModal(item.slug)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-auto min-h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="w-full h-fit bg-white rounded-md drop-shadow-sm px-4 py-2">
        <TitleSection
          title="Data Ekstrakurikuler"
          subtitle="Berisi data ekstrakurikuler SMK Tamtama Kroya."
        />

        <div className="w-full mb-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-sm">
            <Search
              placeholder="Cari nama ekstrakurikuler"
              searchTerm={searchTerm}
              handleSearchChange={setSearchTerm}
            />
          </div>

          <div className="w-full lg:w-fit flex flex-col sm:flex-row gap-2 sm:items-end">
            <div className="w-full sm:w-56">
              <SelectInput
                label=""
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(String(event.target.value));
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
                options={categoryOptions}
              />
            </div>

            <TextButton
              variant="outline"
              text="Reset"
              icon={<IoMdRefresh className="text-base" />}
              className="w-full sm:w-auto sm:mb-2"
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearchTerm("");
                setSelectedCategory("");
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
            />

            <TextButton
              variant="primary"
              text="Tambah Ekskul"
              icon={<LuPlus className="text-base" />}
              className="w-full sm:w-auto sm:mb-2"
              onClick={openCreateModal}
            />
          </div>
        </div>

        {fetchError && (
          <div className="mb-3 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {fetchError}
          </div>
        )}

        <GridListPaginate
          data={items}
          renderItem={renderItem}
          viewMode="grid"
          loading={loading}
          emptyText="Data ekstrakurikuler belum tersedia"
          showNumberInfo
          showSizeChanger={false}
          pagination={paginationConfig}
        />
      </div>

      <BaseModal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={formMode === "create" ? "Tambah Ekskul" : "Edit Ekskul"}
        size="xl"
        footer={
          <div className="flex justify-end gap-2">
            <TextButton
              variant="outline"
              text="Cancel"
              disabled={isSubmitting || isLoadingDetail}
              onClick={closeFormModal}
            />
            <TextButton
              variant="primary"
              text={formMode === "create" ? "Submit" : "Simpan"}
              isLoading={isSubmitting}
              disabled={isSubmitting || isLoadingDetail}
              onClick={handleSubmitForm}
            />
          </div>
        }
      >
        {isLoadingDetail ? (
          <div className="py-12 flex items-center justify-center text-gray-500">
            Memuat detail ekstrakurikuler...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Ekskul <span className="text-red-500">*</span>
                </label>
                <input
                  value={formValues.name}
                  onChange={(event) => handleFormNameChange(event.target.value)}
                  placeholder="Masukkan nama ekstrakurikuler"
                  className={`w-full rounded-sm border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug (Auto Generate)
                </label>
                <input
                  value={formValues.slug}
                  readOnly
                  className="w-full rounded-sm border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600"
                />
              </div>

              <CategoryMultiInput
                label="Kategori"
                value={formValues.categories}
                onChange={handleCategoryChange}
                suggestions={categorySuggestions}
                isMandatory
                error={formErrors.categories}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formValues.description}
                  onChange={(event) =>
                    handleDescriptionChange(event.target.value)
                  }
                  rows={5}
                  placeholder="Masukkan deskripsi ekstrakurikuler"
                  className={`w-full rounded-sm border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-y ${
                    formErrors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-3 border border-gray-300 rounded-sm px-3 py-2">
                  <Toggle
                    size="sm"
                    enabled={formValues.isPublished}
                    onChange={(nextValue) =>
                      setFormValues((prev) => ({
                        ...prev,
                        isPublished: nextValue,
                      }))
                    }
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">
                    {formValues.isPublished ? "Active" : "Non Active"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <PhotoUpload
                previewUrl={thumbnailPreview || formValues.thumbnailUrl}
                onFileSelect={handleThumbnailFileChange}
                onFileRemove={handleThumbnailRemove}
                onValidationError={(message) => {
                  showAlert({
                    title: "Validasi Thumbnail",
                    description: message,
                    variant: "error",
                  });
                }}
                disabled={isSubmitting}
                label="Upload Thumbnail"
                maxSizeInMB={5}
                isMandatory
                error={formErrors.thumbnailUrl}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Atau gunakan URL Thumbnail
                </label>
                <input
                  value={formValues.thumbnailUrl}
                  onChange={(event) =>
                    handleThumbnailUrlChange(event.target.value)
                  }
                  placeholder="https://..."
                  className={`w-full rounded-sm border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.thumbnailUrl
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.thumbnailUrl && (
                  <p className="text-xs text-red-500 mt-1">
                    {formErrors.thumbnailUrl}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </BaseModal>

      <BaseModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setDeletingSlug(null);
          }
        }}
        title="Konfirmasi Hapus"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <TextButton
              variant="outline"
              text="Batal"
              disabled={isDeleting}
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeletingSlug(null);
              }}
            />
            <TextButton
              variant="danger"
              text="Hapus"
              isLoading={isDeleting}
              disabled={isDeleting}
              onClick={handleDelete}
            />
          </div>
        }
      >
        <p className="text-sm text-gray-700">
          Anda yakin ingin menghapus data ekstrakurikuler
          <span className="font-semibold">
            {deletingItem ? ` ${deletingItem.name}` : " ini"}
          </span>
          ?
        </p>
      </BaseModal>
    </div>
  );
}

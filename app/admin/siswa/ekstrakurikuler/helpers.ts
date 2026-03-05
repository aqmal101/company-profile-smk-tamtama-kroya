import { ExtracurricularItem } from "./type";

export const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const normalizeBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    return lowered === "true" || lowered === "1";
  }
  return false;
};

export const toCategoryArray = (value: unknown): string[] => {
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

export const normalizeItem = (
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

export const createClientId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

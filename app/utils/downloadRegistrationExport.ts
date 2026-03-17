import { getAuthHeader } from "@/utils/auth";

export type RegistrationExportType = "pdf" | "xlsx";

export type RegistrationExportFilters = {
  search?: string;
  batchId?: string | number | "";
  academicYearId?: string | number | "";
  authored?: "" | "true" | "false";
  majorCode?: string | number | "";
  schoolOrigin?: string | number | "";
};

const EXPORT_EXTENSION: Record<RegistrationExportType, string> = {
  pdf: "pdf",
  xlsx: "xlsx",
};

const appendFilter = (
  params: URLSearchParams,
  key: string,
  value: string | number | "" | undefined,
) => {
  if (value === undefined || value === null || value === "") {
    return;
  }

  params.append(key, String(value));
};

const getFallbackFilename = (type: RegistrationExportType) =>
  `registrations-export.${type === "xlsx" ? "xlsx" : "pdf"}`;

const sanitizeFilename = (value: string) =>
  value
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildCustomFilename = (
  filename: string,
  type: RegistrationExportType,
) => {
  const sanitizedFilename = sanitizeFilename(filename);

  if (!sanitizedFilename) {
    return getFallbackFilename(type);
  }

  return `${sanitizedFilename}.${EXPORT_EXTENSION[type]}`;
};

const parseFilename = (
  contentDisposition: string | null,
  fallbackFilename: string,
) => {
  if (!contentDisposition) {
    return fallbackFilename;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i);
  if (quotedMatch?.[1]) {
    return quotedMatch[1];
  }

  const plainMatch = contentDisposition.match(/filename=([^;]+)/i);
  if (plainMatch?.[1]) {
    return plainMatch[1].trim();
  }

  return fallbackFilename;
};

export async function downloadRegistrationExport({
  type,
  filters,
  filename,
}: {
  type: RegistrationExportType;
  filters?: RegistrationExportFilters;
  filename?: string;
}) {
  const authHeader = getAuthHeader();

  if (!("Authorization" in authHeader)) {
    throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");
  }

  const params = new URLSearchParams();

  appendFilter(params, "search", filters?.search?.trim());
  appendFilter(params, "batch_id", filters?.batchId);
  appendFilter(params, "academic_year_id", filters?.academicYearId);
  appendFilter(params, "authored", filters?.authored);
  appendFilter(params, "major_code", filters?.majorCode);
  appendFilter(params, "school_origin", filters?.schoolOrigin);

  const queryString = params.toString();
  const response = await fetch(
    `/api/backoffice/registrations/export/${type}${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      headers: {
        ...authHeader,
      },
    },
  );

  if (!response.ok) {
    let errorMessage = `Gagal mengunduh file ${type === "pdf" ? "PDF" : "Excel"}`;

    try {
      const data = await response.json();
      errorMessage =
        data?.message ||
        data?.error ||
        errorMessage;
    } catch {
      // Ignore invalid error payloads and use fallback message.
    }

    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fallbackFilename = getFallbackFilename(type);

  link.href = downloadUrl;
  link.download = filename
    ? buildCustomFilename(filename, type)
    : parseFilename(response.headers.get("Content-Disposition"), fallbackFilename);

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 0);
}
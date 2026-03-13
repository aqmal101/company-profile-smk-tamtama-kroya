import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

const MIME_TYPES = {
  pdf: "application/pdf",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const;

const isSupportedExportType = (
  value: string,
): value is keyof typeof MIME_TYPES => value === "pdf" || value === "xlsx";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string }> },
) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          error: "E_UNAUTHORIZED_ACCESS",
          message: "Not authenticated",
        },
        { status: 401 },
      );
    }

    const { type } = await context.params;

    if (!isSupportedExportType(type)) {
      return NextResponse.json(
        { message: "Unsupported export type" },
        { status: 400 },
      );
    }

    const { search } = new URL(request.url);
    const backendResponse = await fetch(
      `${API_BASE_URL}/backoffice/registrations/export/${type}${search}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          Accept: MIME_TYPES[type],
        },
        cache: "no-store",
      },
    );

    if (!backendResponse.ok) {
      const contentType = backendResponse.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await backendResponse.json();
        return NextResponse.json(data, { status: backendResponse.status });
      }

      const message = await backendResponse.text();
        
      return NextResponse.json(
        {
          message:
            message ||
            `Gagal mengunduh file ${type === "pdf" ? "PDF" : "Excel"}`,
        },
        { status: backendResponse.status },
      );
    }

    const buffer = await backendResponse.arrayBuffer();
    const contentType = backendResponse.headers.get("content-type") || MIME_TYPES[type];
    const contentDisposition =
      backendResponse.headers.get("content-disposition") ||
      `attachment; filename="registrations-export.${type}"`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Registration export proxy error:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat mengunduh file ekspor",
      },
      { status: 500 },
    );
  }
}
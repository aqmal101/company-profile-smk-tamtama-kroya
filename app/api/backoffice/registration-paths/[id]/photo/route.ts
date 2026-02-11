import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_LABEL = "10MB";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        {
          error: "E_UNAUTHORIZED_ACCESS",
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id || Number.isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid registration path ID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const photoFile = formData.get("photo");

    if (!photoFile || !(photoFile instanceof File)) {
      return NextResponse.json(
        { error: "File foto tidak ditemukan" },
        { status: 400 }
      );
    }

    if (photoFile.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `Ukuran file maksimal ${MAX_FILE_LABEL}` },
        { status: 413 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("photo", photoFile);

    const backendResponse = await fetch(
      `${API_BASE_URL}/backoffice/registration-paths/${id}/photo`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: backendFormData,
      }
    );

    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Registration path photo upload error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}

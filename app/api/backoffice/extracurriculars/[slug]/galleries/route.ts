import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const unauthorizedResponse = () =>
  NextResponse.json(
    {
      error: "E_UNAUTHORIZED_ACCESS",
      message: "Not authenticated",
    },
    { status: 401 },
  );

const getSlugParam = async (params: Promise<{ slug: string }>) => {
  const { slug } = await params;
  return decodeURIComponent(slug || "").trim();
};

const isAllowedImageMime = (mimeType: string) =>
  ["image/png", "image/jpeg", "image/jpg"].includes(mimeType.toLowerCase());

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return unauthorizedResponse();
    }

    const slug = await getSlugParam(params);
    console.log("Fetching galleries for extracurricular slug:", slug);
    console.log(encodeURIComponent(slug));

    if (!slug) {
      return NextResponse.json(
        { message: "Invalid extracurricular slug" },
        { status: 400 },
      );
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/backoffice/extracurriculars/${encodeURIComponent(slug)}/galleries`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        cache: "no-store",
      },
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching extracurricular galleries:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return unauthorizedResponse();
    }

    const slug = await getSlugParam(params);

    if (!slug) {
      return NextResponse.json(
        { message: "Invalid extracurricular slug" },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const photoFile = formData.get("photo");

    if (!photoFile || !(photoFile instanceof File)) {
      return NextResponse.json(
        { error: "File foto tidak ditemukan" },
        { status: 400 },
      );
    }

    if (!isAllowedImageMime(photoFile.type)) {
      return NextResponse.json(
        { error: "Format file harus png, jpg, atau jpeg" },
        { status: 400 },
      );
    }

    if (photoFile.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 413 },
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("photo", photoFile);

    const backendResponse = await fetch(
      `${API_BASE_URL}/backoffice/extracurriculars/${encodeURIComponent(slug)}/galleries`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: backendFormData,
      },
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating extracurricular gallery:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

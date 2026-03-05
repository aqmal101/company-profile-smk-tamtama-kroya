import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

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

export async function PUT(
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

    const body = await request.json();
    const galleryIds = Array.isArray(body.galleryIds)
      ? body.galleryIds
          .map((item: unknown) => Number(item))
          .filter((item: number) => Number.isFinite(item) && item > 0)
      : [];

    if (galleryIds.length === 0) {
      return NextResponse.json(
        { error: "galleryIds wajib berupa array ID" },
        { status: 400 },
      );
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/backoffice/extracurriculars/${encodeURIComponent(slug)}/galleries/reorder`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ galleryIds }),
      },
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error reordering extracurricular galleries:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

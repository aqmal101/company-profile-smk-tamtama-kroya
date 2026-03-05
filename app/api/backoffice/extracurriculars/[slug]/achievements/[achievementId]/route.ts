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

const getParams = async (
  params: Promise<{ slug: string; achievementId: string }>,
) => {
  const { slug, achievementId } = await params;

  return {
    slug: decodeURIComponent(slug || "").trim(),
    achievementId: Number(achievementId),
  };
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; achievementId: string }> },
) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return unauthorizedResponse();
    }

    const { slug, achievementId } = await getParams(params);

    if (!slug || Number.isNaN(achievementId) || achievementId <= 0) {
      return NextResponse.json(
        { message: "Invalid slug or achievement ID" },
        { status: 400 },
      );
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/backoffice/extracurriculars/${encodeURIComponent(slug)}/achievements/${achievementId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      },
    );

    if (!backendResponse.ok) {
      const data = await backendResponse.json();
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(
      { message: "Achievement deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting extracurricular achievement:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const signatureFile = formData.get("signature");

    if (!signatureFile || !(signatureFile instanceof File)) {
      return NextResponse.json(
        { error: "No signature file provided" },
        { status: 400 },
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("signature", signatureFile);

    const backendRes = await fetch(
      `${API_BASE_URL}/backoffice/committees/upload-signature`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: backendFormData,
      },
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Failed to upload committee signature:", error);
    return NextResponse.json(
      { error: "Failed to upload signature" },
      { status: 500 },
    );
  }
}

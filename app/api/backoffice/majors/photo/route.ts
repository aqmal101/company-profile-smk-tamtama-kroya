import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "E_UNAUTHORIZED_ACCESS", message: "Not authenticated" },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const backendResponse = await fetch(
      `${API_BASE_URL}/backoffice/majors/photo`,
      {
        method: "POST",
        headers: { Authorization: authHeader },
        body: formData,
      },
    );

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Backoffice majors photo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload major photo" },
      { status: 500 },
    );
  }
}

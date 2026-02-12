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
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const photoFile = formData.get("photo");

    if (!photoFile || !(photoFile instanceof File)) {
      return NextResponse.json(
        { error: "No photo file provided" },
        { status: 400 }
      );
    }

    // Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append("photo", photoFile);

    // Proxy to backend photo upload endpoint
    const backendRes = await fetch(`${API_BASE_URL}/backoffice/teachers/photo`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: backendFormData,
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Failed to upload photo:", err);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}

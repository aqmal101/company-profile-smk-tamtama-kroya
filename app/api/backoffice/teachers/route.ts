import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const limit = searchParams.get("limit") || "10";
    const authored = searchParams.get("authored") || "";
    const batch_id = searchParams.get("batch_id") || "";
    const major_code = searchParams.get("major_code") || "";
    const academic_year_id = searchParams.get("academic_year_id") || "";

    const queryParams = new URLSearchParams({ page, limit });
    if (search) {
      queryParams.append("search", search);
    }
    
    if (authored !== "") {
      queryParams.append("authored", authored);
    }

    if (major_code !== "") {
      queryParams.append("major_code", major_code);
    }

    if (batch_id !== "") {
      queryParams.append("batch_id", batch_id);
    }

    if (academic_year_id !== "") {
      queryParams.append("academic_year_id", academic_year_id);
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/backoffice/teachers?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );
    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Teachers fetch error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();

    // Validate required fields
    if (!body.fullName || !body.username || !body.password || !Array.isArray(body.schoolLessonIds)) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, username, password, schoolLessonIds" },
        { status: 400 }
      );
    }

    // Proxy to backend POST endpoint
    const backendRes = await fetch(`${API_BASE_URL}/backoffice/teachers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        fullName: body.fullName,
        username: body.username,
        password: body.password,
        schoolLessonIds: body.schoolLessonIds,
        photoUrl: body.photoUrl || null,
      }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      // Return detailed error response from backend (including validation errors)
      return NextResponse.json(
        {
          error: data.error || "Failed to create teacher",
          message: data.message || "Gagal membuat akun guru",
          errors: data.errors || [],
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Failed to create teacher:", err);
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}

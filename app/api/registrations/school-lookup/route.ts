import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || process.env.API_BASE_URL;

interface SchoolItem {
  name: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";

  if (query.length < 3) {
    return NextResponse.json(
      {
        error: "E_VALIDATION_ERROR",
        message: "The q field must have at least 3 characters",
        errors: [
          {
            field: "q",
            message: "The q field must have at least 3 characters",
            rule: "minLength",
          },
        ],
      },
      { status: 422 }
    );
  }

  if (!API_BASE_URL) {
    return NextResponse.json(
      {
        error: "SERVER_CONFIG_ERROR",
        message: "Server configuration error (BACKEND_URL not set)",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/registrations/school-lookup?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const data = await response.json();

    let schools: string[] = [];
    if (Array.isArray(data)) {
      schools = data.map((item: SchoolItem) => item.name).filter(Boolean);
    } else if (data.data && Array.isArray(data.data)) {
      schools = data.data.map((item: SchoolItem) => item.name).filter(Boolean);
    } else if (data.schools && Array.isArray(data.schools)) {
      schools = data.schools.map((item: SchoolItem) => item.name).filter(Boolean);
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      data: schools,
    });
  } catch (error) {
    console.error("School lookup error:", error);
    return NextResponse.json(
      {
        error: "SERVER_ERROR",
        message: "Terjadi kesalahan saat mengambil data sekolah",
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";

interface SchoolItem {
  name: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";

  // Validasi minimum 3 karakter
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
      { status: 422 },
    );
  }

  const baseUrl = process.env.BACKEND_URL || process.env.API_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      {
        error: "SERVER_CONFIG_ERROR",
        message: "Server configuration error (BACKEND_URL not set)",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `${baseUrl}/registrations/school-lookup?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Extract school names dari response
    // Response bisa berupa array langsung atau nested dalam object
    let schools: string[] = [];

    if (Array.isArray(data)) {
      // Jika response adalah array langsung
      schools = data.map((item: SchoolItem) => item.name).filter(Boolean);
    } else if (data.data && Array.isArray(data.data)) {
      // Jika response nested dalam data property
      schools = data.data.map((item: SchoolItem) => item.name).filter(Boolean);
    } else if (data.schools && Array.isArray(data.schools)) {
      // Jika response nested dalam schools property
      schools = data.schools.map((item: SchoolItem) => item.name).filter(Boolean);
    }

    // Return data dari backend
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
      { status: 500 },
    );
  }
}
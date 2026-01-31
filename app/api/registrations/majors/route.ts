import {  NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || process.env.API_BASE_URL;

interface MajorItem {
  name: string;
  abbreviation?: string;
  photoUrl?: string;
  [key: string]: unknown;
  description?: string;
}

export async function GET() {


 
  try {
    const response = await fetch(
      `${API_BASE_URL}/registrations/majors`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const data = await response.json();

    let majors: string[] = [];
    if (Array.isArray(data)) {
      majors = data.map((item: MajorItem) => item.name).filter(Boolean);
    } else if (data.data && Array.isArray(data.data)) {
      majors = data.data.map((item: MajorItem) => item.name).filter(Boolean);
    } else if (data.majors && Array.isArray(data.majors)) {
      majors = data.majors.map((item: MajorItem) => item.name).filter(Boolean);
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      data: majors,
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
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ academic_year_id: string }> },
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const { academic_year_id } = await params;

    if (!authHeader) {
      return NextResponse.json(
        {
          error: "E_UNAUTHORIZED_ACCESS",
          message: "Not authenticated",
        },
        { status: 401 },
      );
    }

    if (!academic_year_id || Number.isNaN(Number(academic_year_id))) {
      return NextResponse.json(
        { error: "Invalid academic_year_id" },
        { status: 400 },
      );
    }

    const backendRes = await fetch(
      `${API_BASE_URL}/backoffice/committees/academic-year/${academic_year_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        cache: "no-store",
      },
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching committee by academic year:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ academic_year_id: string }> },
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const { academic_year_id } = await params;

    if (!authHeader) {
      return NextResponse.json(
        {
          error: "E_UNAUTHORIZED_ACCESS",
          message: "Not authenticated",
        },
        { status: 401 },
      );
    }

    if (!academic_year_id || Number.isNaN(Number(academic_year_id))) {
      return NextResponse.json(
        { error: "Invalid academic_year_id" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const backendRes = await fetch(
      `${API_BASE_URL}/backoffice/committees/academic-year/${academic_year_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating committee by academic year:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

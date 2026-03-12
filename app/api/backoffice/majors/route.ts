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
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const perPage = searchParams.get("perPage") || searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const queryParams = new URLSearchParams({
      page,
      limit: perPage,
      perPage,
      sortBy,
      sortOrder,
    });

    if (search) {
      queryParams.append("search", search);
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/backoffice/majors?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        cache: "no-store",
      },
    );

    const data = await backendResponse.json();

    if (data?.meta && typeof data.meta === "object") {
      data.meta.perPage = Number(data.meta.perPage ?? data.meta.limit ?? perPage);
    }
    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Backoffice majors fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch majors data" },
      { status: 500 },
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
        { status: 401 },
      );
    }

    const body = await request.json();

    const backendResponse = await fetch(
      `${API_BASE_URL}/backoffice/majors`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Backoffice majors create error:", error);
    return NextResponse.json(
      { error: "Failed to create major" },
      { status: 500 },
    );
  }
}

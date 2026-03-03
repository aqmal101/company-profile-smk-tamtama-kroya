import { NextRequest, NextResponse } from "next/server";
const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

interface AlumniItem {
  id: number;
  name: string;
  generationYear: number;
  photoUrl: string;
  major: string;
  currentJob: string;
}

interface AlumniResponse {
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
  };
  data: AlumniItem[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(
      searchParams.get("perPage") || searchParams.get("limit") || "9",
    );
    const search = searchParams.get("search") || "";
    const major = searchParams.get("major") || "";
    const generationYear = searchParams.get("generationYear") || "";

    const backendParams = new URLSearchParams();
    backendParams.set("page", String(page));
    backendParams.set("perPage", String(perPage));
    backendParams.set("limit", String(perPage));

    if (search) {
      backendParams.set("search", search);
    }
    if (major) {
      backendParams.set("major", major);
    }
    if (generationYear) {
      backendParams.set("generationYear", generationYear);
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/alumni${backendParams.toString() ? `?${backendParams.toString()}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch alumni data" },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();

    if (backendData?.meta && Array.isArray(backendData?.data)) {
      const baseUrl = request.nextUrl.pathname;
      const backendTotal = Number(backendData.meta?.total ?? 0);
      const backendPerPage = Number(backendData.meta?.perPage ?? perPage);
      const backendCurrentPage = Number(backendData.meta?.currentPage ?? page);
      const backendLastPage =
        Number(backendData.meta?.lastPage) ||
        Math.max(1, Math.ceil(backendTotal / Math.max(1, backendPerPage)));

      const response: AlumniResponse = {
        meta: {
          total: backendTotal,
          perPage: backendPerPage,
          currentPage: backendCurrentPage,
          lastPage: backendLastPage,
          firstPage: 1,
          firstPageUrl: `${baseUrl}?page=1`,
          lastPageUrl: `${baseUrl}?page=${backendLastPage}`,
          nextPageUrl:
            backendCurrentPage < backendLastPage
              ? `${baseUrl}?page=${backendCurrentPage + 1}`
              : null,
          previousPageUrl:
            backendCurrentPage > 1
              ? `${baseUrl}?page=${backendCurrentPage - 1}`
              : null,
        },
        data: backendData.data,
      };

      return NextResponse.json(response);
    }

    const rawData: AlumniItem[] = Array.isArray(backendData)
      ? backendData
      : backendData?.data || [];

    // Pagination logic
    const total = rawData.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(Math.max(1, page), lastPage);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = rawData.slice(startIndex, endIndex);

    const baseUrl = request.nextUrl.pathname;

    const response: AlumniResponse = {  
      meta: {
        total,
        perPage,
        currentPage,
        lastPage,
        firstPage: 1,
        firstPageUrl: `${baseUrl}?page=1`,
        lastPageUrl: `${baseUrl}?page=${lastPage}`,
        nextPageUrl:
          currentPage < lastPage ? `${baseUrl}?page=${currentPage + 1}` : null,
        previousPageUrl:
          currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
      },
      data: paginatedData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching alumni:", error);
    return NextResponse.json(
      { error: "Failed to fetch alumni data" },
      { status: 500 }
    );
  }
}

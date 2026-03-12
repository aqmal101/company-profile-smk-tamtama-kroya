import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

interface MajorOption {
  name: string;
  abbreviation: string;
}

export async function GET(request: NextRequest) {
  try {
    const backendResponse = await fetch(`${API_BASE_URL}/majors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch major options" },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();

    // Handle paginated response from backend
    const majors = Array.isArray(backendData?.data) 
      ? backendData.data 
      : Array.isArray(backendData) 
        ? backendData 
        : [];

    // Map to options format
    const options: MajorOption[] = majors.map((major: any) => ({
      name: major.name,
      abbreviation: major.abbreviation || "",
    }));

    return NextResponse.json(options, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Major options error:", error);
    return NextResponse.json(
      { error: "Failed to fetch major options" },
      { status: 500 }
    );
  }
}

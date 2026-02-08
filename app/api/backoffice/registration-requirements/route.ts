import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";


export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    // Proxy to backend if BACKEND_URL configured and Authorization present
    if (process.env.BACKEND_URL && authHeader) {
      const backendResponse = await fetch(
        `${API_BASE_URL}/backoffice/registration-requirements`,
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

      return NextResponse.json(data, { status: 200 });
    }

  } catch (error) {
    console.error("registration-requirements fetch error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }
  try {
    const apiResponse = await fetch(`${API_BASE_URL}/backoffice/registrations/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });
    const apiData = await apiResponse.json();
    if (apiResponse.ok) {
      return NextResponse.json(apiData, { status: 200 });
    } else {
      return NextResponse.json(apiData, { status: apiResponse.status });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

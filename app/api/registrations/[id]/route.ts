import { NextRequest, NextResponse } from "next/server";
import { getAuthHeader } from "@/utils/auth";

const API_BASE_URL = process.env.BACKEND_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid registration ID" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/backoffice/registrations/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch registration details" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching registration details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
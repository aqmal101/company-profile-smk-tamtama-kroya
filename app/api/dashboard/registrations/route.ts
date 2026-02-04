import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

interface StudentDetail {
  nisn: string;
  nik: string;
  fullName: string;
  placeOfBirth: string;
  dateOfBirth: string;
  gender: number;
  religion: string;
  schoolOriginNpsn: string;
  address: string;
  phoneNumber: string;
  email: string;
  isKipRecipient: boolean;
}

interface ParentDetail {
  fatherName: string;
  fatherLivingStatus: string;
  motherName: string;
  motherLivingStatus: string;
  parentPhoneNumber: string;
  parentAddress: string;
  guardianName: string;
  guardianPhoneNumber: string;
  guardianAddress: string;
}

interface RegistrationPayload {
  studentDetail: StudentDetail;
  parentDetail: ParentDetail;
  majorChoiceCode: string;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const body: RegistrationPayload = await request.json();
    const apiResponse = await fetch(
      `${API_BASE_URL}/backoffice/registrations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      }
    );
    const apiData = await apiResponse.json();

    if (apiResponse.ok) {
      return NextResponse.json(
        {
          success: true,
          message:
            apiData.message ||
            "Pendaftaran berhasil! Bukti pendaftaran telah dikirim ke email Anda.",
          data: {
            registrationNumber: apiData.registrationNumber,
            registrationId: apiData.id,
            majorChoiceCode: apiData.majorChoiceCode,
            studentName:
              apiData.studentDetail?.fullName || body.studentDetail.fullName,
            createdAt: apiData.createdAt,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: apiData.message || "Pendaftaran gagal",
          errors: apiData.errors,
        },
        { status: apiResponse.status }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const body = await request.json();
    const registrationId = id || body?.id || body?.registrationId;

    if (!registrationId) {
      return NextResponse.json(
        { success: false, message: "Missing registration id" },
        { status: 400 },
      );
    }

    const apiResponse = await fetch(
      `${API_BASE_URL}/backoffice/registrations/${registrationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      },
    );

    const apiData = await apiResponse.json();

    return NextResponse.json(apiData, { status: apiResponse.status });
  } catch (error) {
    console.error("Registration PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // allow id in body as fallback
    let registrationId = id;
    if (!registrationId) {
      try {
        const body = await request.json();
        registrationId = body?.id || body?.registrationId;
      } catch (e) {
        // ignore parse error
      }
    }

    if (!registrationId) {
      return NextResponse.json(
        { success: false, message: "Missing registration id" },
        { status: 400 },
      );
    }

    const apiResponse = await fetch(
      `${API_BASE_URL}/backoffice/registrations/${registrationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      },
    );

    const apiData = await apiResponse.json();
    return NextResponse.json(apiData, { status: apiResponse.status });
  } catch (error) {
    console.error("Registration DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

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

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

export async function POST(request: NextRequest) {
  try {
    // Get authorization header using getAuthHeader utility
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

    // Get request body
    const body: RegistrationPayload = await request.json();

    // Forward request to backend
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
      return NextResponse.json({
        success: true,
        message: apiData.message || "Pendaftaran berhasil! Bukti pendaftaran telah dikirim ke email Anda.",
        data: {
          registrationNumber: apiData.registrationNumber,
          registrationId: apiData.id,
          majorChoiceCode: apiData.majorChoiceCode,
          studentName: apiData.studentDetail?.fullName || body.studentDetail.fullName,
          createdAt: apiData.createdAt,
        },
      },
      { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: apiData.message || "Pendaftaran gagal",
        errors: apiData.errors,
      },
      { status: apiResponse.status });
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

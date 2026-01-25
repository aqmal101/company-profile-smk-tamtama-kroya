import { NextResponse } from "next/server";

export async function getSchoolList() {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/school-lookup?q=ab `,
      {
        cache: "no-store", 
        next: { revalidate: 86400 }
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Gagal mengambil data sekolah" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      status: 200,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        message: `Terjadi kesalahan server, ${error}`,
      },
      { status: 500 }
    );
  }
}

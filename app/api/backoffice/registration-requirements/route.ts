import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

const MOCK_RESPONSE = [
  { id: 1, name: "Mengisi Formulir", isActive: 1, order: 0 },
  { id: 2, name: "Fotocopy Ijazah", isActive: 1, order: 1 },
  { id: 3, name: "Fotocopy KK dan Akta Kelahiran", isActive: 1, order: 2 },
  { id: 4, name: "Fotocopy KTP Orang Tua", isActive: 1, order: 3 },
  { id: 5, name: "Pas Foto 3x4 Berwarna (3 lembar)", isActive: 1, order: 4 },
  { id: 6, name: "Sertifikat TKA (Test Kemampuan Akademik)", isActive: 1, order: 5 },
];

// Mutable mock storage for development (keeps state in server process)
const MOCK_DATA = MOCK_RESPONSE.map((r) => ({ ...r }));

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

    // Fallback to mock data
    return NextResponse.json(MOCK_DATA, { status: 200 });
  } catch (error) {
    console.error("registration-requirements fetch error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    // Proxy to backend if configured
    if (process.env.BACKEND_URL && authHeader) {
      const backendResponse = await fetch(
        `${API_BASE_URL}/backoffice/registration-requirements`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: await request.text(),
        }
      );

      const data = await backendResponse.json();
      if (!backendResponse.ok) {
        return NextResponse.json(data, { status: backendResponse.status });
      }

      return NextResponse.json(data, { status: 200 });
    }

    // Local mock behavior: accept { requirements: [...] } or an array body
    const bodyText = await request.text();
    const body = bodyText ? JSON.parse(bodyText) : {};
    type IncomingItem = { id?: number | string; name: string; isActive?: number | boolean; order?: number };
    const incoming: IncomingItem[] = Array.isArray(body) ? (body as IncomingItem[]) : (body.requirements as IncomingItem[]) || [];

    // Validate minimal shape
    for (const item of incoming) {
      if (!item || typeof item.name !== "string") {
        return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
      }
    }

    // Update or insert
    for (const item of incoming) {
      const id = item.id !== undefined && item.id !== null ? Number(item.id) : undefined;
      if (id != null) {
        // update existing if found
        const idx = MOCK_DATA.findIndex((m) => Number(m.id) === id);
        if (idx !== -1) {
          MOCK_DATA[idx] = {
            ...MOCK_DATA[idx],
            name: item.name,
            isActive: Number(item.isActive) === 1 ? 1 : 0,
            order: typeof item.order === "number" ? item.order : MOCK_DATA[idx].order,
          };
        } else {
          // if id provided but not found, insert with provided id
          MOCK_DATA.push({ id, name: item.name, isActive: Number(item.isActive) === 1 ? 1 : 0, order: Number(item.order ?? MOCK_DATA.length) });
        }
      } else {
        // Create new id (max id + 1)
        const maxId = MOCK_DATA.reduce((acc, v) => Math.max(acc, Number(v.id)), 0);
        const newId = maxId + 1;
        MOCK_DATA.push({ id: newId, name: item.name, isActive: Number(item.isActive) === 1 ? 1 : 0, order: Number(item.order ?? MOCK_DATA.length) });
      }
    }

    // Optionally sort by order
    MOCK_DATA.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return NextResponse.json(MOCK_DATA, { status: 200 });
  } catch (error) {
    console.error("registration-requirements update error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
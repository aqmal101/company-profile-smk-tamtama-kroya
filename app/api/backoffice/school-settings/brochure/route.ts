/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

// Note: For real backend we expect an endpoint for uploading brochure files.
// This mock endpoint accepts multipart/form-data and returns mock URLs.

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    // If proxying to real backend
    if (process.env.BACKEND_URL && authHeader) {
      // Forward the multipart form to backend - keep body as stream
      const backendResponse = await fetch(`${API_BASE_URL}/backoffice/school-settings/brochure`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
        body: await request.arrayBuffer(),
      });

      const data = await backendResponse.json();
      if (!backendResponse.ok) {
        return NextResponse.json(data, { status: backendResponse.status });
      }

      return NextResponse.json(data, { status: 200 });
    }

    // Mock behavior: read the form from request.body (next provides formData only on serverless-adapters; parse minimal)
    // We will simply return generated URLs using Date.now() for filenames
    const now = Date.now();

    // Very naive detection: check content-type header for presence of parts
    const contentType = request.headers.get("content-type") || "";

    const result: any = {};

    if (contentType.includes("front")) {
      result.brochureFrontUrl = `https://mock.local/brochures/front-${now}.pdf`;
    }
    if (contentType.includes("back")) {
      result.brochureBackUrl = `https://mock.local/brochures/back-${now}.pdf`;
    }

    // If can't detect, return both sample urls
    if (!result.brochureFrontUrl && !result.brochureBackUrl) {
      result.brochureFrontUrl = `https://mock.local/brochures/front-${now}.pdf`;
      result.brochureBackUrl = `https://mock.local/brochures/back-${now}.pdf`;
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("brochure upload error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

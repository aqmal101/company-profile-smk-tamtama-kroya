import { NextRequest, NextResponse } from "next/server";

interface ImageToDataUrlRequestBody {
  url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ImageToDataUrlRequestBody;
    const imageUrl = body?.url?.trim();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const parsedUrl = parseHttpUrl(imageUrl);
    if (!parsedUrl) {
      return NextResponse.json(
        { error: "Only valid http/https URL is allowed" },
        { status: 400 },
      );
    }

    const imageResponse = await fetch(parsedUrl.toString(), {
      method: "GET",
      cache: "no-store",
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image (${imageResponse.status})` },
        { status: imageResponse.status },
      );
    }

    const contentType = imageResponse.headers.get("content-type") || "image/png";
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUrl = `data:${contentType};base64,${buffer.toString("base64")}`;

    return NextResponse.json({ dataUrl }, { status: 200 });
  } catch (error) {
    console.error("Failed to convert image URL to data URL:", error);
    return NextResponse.json(
      { error: "Failed to convert image URL to data URL" },
      { status: 500 },
    );
  }
}

function parseHttpUrl(value: string): URL | null {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

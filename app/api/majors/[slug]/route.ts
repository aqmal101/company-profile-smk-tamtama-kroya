import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.BACKEND_URL || "http://localhost:3333";

interface GalleryItem {
  id: number;
  photoUrl: string;
  order: number;
}

interface IndustryPartner {
  id: number;
  cover: string;
  name: string;
  description: string;
}

interface MajorDetail {
  id: number;
  name: string;
  slug: string;
  summary: string;
  abbreviation: string;
  description: string;
  graduateProspects: string[];
  mainCompetencies: string[];
  certifications: string[];
  vocationalSubjects: string[];
  capacity: number;
  studyDurationYears: number;
  photoUrl: string;
  galleryDescription: string;
  industryPartnerDescription: string;
  galleries: GalleryItem[];
  industryPartners: IndustryPartner[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/majors/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: "Major not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch major detail" },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();

    // Handle both direct data and wrapped format
    const major: MajorDetail = backendData?.data || backendData;

    // Validate required fields
    if (!major.id || !major.name || !major.slug) {
      return NextResponse.json(
        { error: "Invalid major data" },
        { status: 500 }
      );
    }

    const response: MajorDetail = {
      id: major.id,
      name: major.name,
      slug: major.slug,
      summary: major.summary || "",
      abbreviation: major.abbreviation || "",
      description: major.description || "",
      graduateProspects: major.graduateProspects || [],
      mainCompetencies: major.mainCompetencies || [],
      certifications: major.certifications || [],
      vocationalSubjects: major.vocationalSubjects || [],
      capacity: major.capacity || 0,
      studyDurationYears: major.studyDurationYears || 0,
      photoUrl: major.photoUrl || "",
      galleryDescription: major.galleryDescription || "",
      industryPartnerDescription: major.industryPartnerDescription || "",
      galleries: major.galleries || [],
      industryPartners: major.industryPartners || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching major detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch major detail" },
      { status: 500 }
    );
  }
}

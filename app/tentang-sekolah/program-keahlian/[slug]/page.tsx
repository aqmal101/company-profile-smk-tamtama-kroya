"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import DetailContentLayout from "@/components/LandingPage/DetailContentLayout";
import RotatedHighlightTitle from "@/components/SectionTitle/RotatedHighlightTitle";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MajorDetail } from "../type";
import { resolveSlug } from "@/utils/resolveSlug";

export default function MajorDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<MajorDetail | null>(null);

  const slug = resolveSlug(params?.slug);

  useEffect(() => {
    let cancelled = false;

    const fetchDetail = async () => {
      if (!slug) {
        if (!cancelled) {
          setError("Slug program keahlian tidak valid.");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/majors/${encodeURIComponent(slug)}`);

        if (!response.ok) {
          throw new Error("Failed to fetch major detail");
        }

        const result: MajorDetail = await response.json();

        if (!cancelled) {
          setDetail(result);
        }
      } catch (fetchError) {
        console.error("Failed fetch major detail", fetchError);

        if (!cancelled) {
          setError("Data program keahlian tidak ditemukan.");
          setDetail(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const galleries = useMemo(
    () => [...(detail?.galleries || [])].sort((a, b) => a.order - b.order),
    [detail?.galleries],
  );

  const [firstNameWord, remainingNameWords] = useMemo(() => {
    const words = (detail?.name || "").trim().split(/\s+/).filter(Boolean);

    return [words[0] || "", words.slice(1).join(" ")];
  }, [detail?.name]);

  // Create sections data from detail fields
  const sections = useMemo(() => {
    if (!detail) return [];

    const items = [];

    if (detail.mainCompetencies && detail.mainCompetencies.length > 0) {
      items.push({
        title: "Kompetensi Utama",
        description: detail.description,
        items: detail.mainCompetencies,
      });
    }

    if (detail.vocationalSubjects && detail.vocationalSubjects.length > 0) {
      items.push({
        title: "Mata Pelajaran Keahlian",
        description: detail.description,
        items: detail.vocationalSubjects,
      });
    }

    if (detail.certifications && detail.certifications.length > 0) {
      items.push({
        title: "Sertifikasi",
        description: detail.description,
        items: detail.certifications,
      });
    }

    if (detail.graduateProspects && detail.graduateProspects.length > 0) {
      items.push({
        title: "Prospek Lulusan",
        description: detail.description,
        items: detail.graduateProspects,
      });
    }

    return items;
  }, [detail]);

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-linear-to-b from-[#fafafa] to-gray-50 px-4 sm:px-6 sm:py-12 md:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 mt-24 animate-pulse">
          <div className="h-8 w-36 rounded bg-gray-200" />
          <div className="h-10 w-2/3 rounded bg-gray-200" />
          <div className="h-96 w-full rounded-lg bg-gray-200" />
          <div className="h-24 w-full rounded bg-gray-200" />
        </div>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="h-screen w-full px-4 sm:px-6 sm:py-12 md:px-10 lg:px-16 xl:px-24">
        <div className="flex w-full h-full flex-col items-center justify-center gap-4  text-center">
          <p className="text-lg text-gray-700">
            {error || "Data tidak tersedia"}
          </p>
          <TextButton
            variant="outline"
            text="Kembali ke daftar program keahlian"
            onClick={() => router.push("/tentang-sekolah/program-keahlian")}
          />
        </div>
      </main>
    );
  }

  return (
    <DetailContentLayout
      backPath="/tentang-sekolah/program-keahlian"
      title={detail.name}
      subtitle="SMK Tamtama Kroya"
      heroImageUrl={detail.photoUrl || "https://placehold.co/1200x800/png"}
      heroImageAlt={detail.name}
      infoTitle="Informasi Singkat"
      infoItems={[
        { label: "Singkatan", value: detail.abbreviation },
        { label: "Daya Tampung", value: `${detail.capacity} siswa` },
        { label: "Durasi Studi", value: `${detail.studyDurationYears} tahun` },
      ]}
      descriptionTitle={
        <h2 className="text-2xl max-sm:text-xl font-semibold text-primary flex flex-wrap items-center gap-2">
          <span>Tentang</span>
          {firstNameWord && (
            <RotatedHighlightTitle
              as="span"
              title={firstNameWord}
              className="align-middle"
              titleClassName="text-2xl max-sm:text-xl font-semibold text-primary"
              highlightClassName="h-9 max-sm:h-8"
            />
          )}
          {remainingNameWords && <span>{remainingNameWords}</span>}
          <span>SMK Tamtama Kroya</span>
        </h2>
      }
      description={detail.description}
      galleryTitle={detail.galleryDescription || "Galeri Program"}
      galleries={galleries.map((gallery) => ({
        id: gallery.id,
        photoUrl: gallery.photoUrl,
        order: gallery.order,
      }))}
      galleryEmptyText="Belum ada galeri"
      highlightsTitle="Mitra Industri"
      highlights={detail.industryPartners.map((partner) => ({
        id: partner.id,
        name: partner.name,
      }))}
      highlightsEmptyText="Belum ada mitra industri"
    />
  );
}

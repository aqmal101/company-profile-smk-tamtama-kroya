"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import DetailContentLayout from "@/components/LandingPage/DetailContentLayout";
import RotatedHighlightTitle from "@/components/SectionTitle/RotatedHighlightTitle";
import { resolveSlug } from "@/utils/resolveSlug";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SchoolAchievementDetail } from "../types";

const COMPETITION_LEVEL_LABELS: Record<string, string> = {
  nasional: "Nasional",
  provinsi: "Provinsi",
  daerah: "Daerah",
  kabupaten: "Kabupaten",
  kecamatan: "Kecamatan",
};

const competitionLevelLabel = (value: string) => {
  const lowered = value.trim().toLowerCase();

  if (!lowered) {
    return "-";
  }

  return (
    COMPETITION_LEVEL_LABELS[lowered] ||
    `${lowered.charAt(0).toUpperCase()}${lowered.slice(1)}`
  );
};

const formatCompetitionDate = (value: string) => {
  if (!value.trim()) {
    return "-";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function SchoolAchievementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = resolveSlug(params?.slug);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<SchoolAchievementDetail | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDetail = async () => {
      if (!slug) {
        if (!cancelled) {
          setError("Slug prestasi tidak valid.");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/school-achievements/${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch school achievement detail");
        }

        const result: SchoolAchievementDetail = await response.json();

        if (!cancelled) {
          setDetail(result);
        }
      } catch (fetchError) {
        console.error("Failed fetch school achievement detail", fetchError);

        if (!cancelled) {
          setError("Data prestasi siswa tidak ditemukan.");
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

  const awards = useMemo(
    () => [...(detail?.awards || [])].sort((a, b) => a.order - b.order),
    [detail?.awards],
  );

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-white px-4 py-10 sm:px-6 sm:py-12 md:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-16 sm:pb-8 max-sm:pt-20 max-sm:px-8 animate-pulse">
          <div className="h-8 w-36 rounded bg-gray-200" />
          <div className="h-10 w-2/3 rounded bg-gray-200" />
          <div className="h-96 w-full rounded-lg bg-gray-200" />
          <div className="h-40 w-full rounded bg-gray-200" />
        </div>
      </main>
    );
  }

  if (error || !detail) {
    return (
      <main className="h-screen w-full px-4 sm:px-6 sm:py-12 md:px-10 lg:px-16 xl:px-24">
        <div className="flex w-full h-full flex-col items-center justify-center gap-4 text-center">
          <p className="text-lg text-gray-700">
            {error || "Data tidak tersedia"}
          </p>
          <TextButton
            variant="outline"
            text="Kembali ke daftar prestasi"
            onClick={() => router.push("/tentang-sekolah/prestasi-siswa")}
          />
        </div>
      </main>
    );
  }

  return (
    <DetailContentLayout
      backPath="/tentang-sekolah/prestasi-siswa"
      title={detail.title}
      subtitle="Prestasi Siswa SMK Tamtama Kroya"
      heroImageUrl={detail.coverPhotoUrl || "https://placehold.co/1200x800/png"}
      heroImageAlt={detail.title}
      infoTitle="Informasi Kompetisi"
      infoItems={[
        { label: "Kategori", value: detail.category || "-" },
        {
          label: "Tingkatan",
          value: competitionLevelLabel(detail.competitionLevel || ""),
        },
        {
          label: "Tanggal",
          value: formatCompetitionDate(detail.competitionDate || ""),
        },
        { label: "Tempat", value: detail.placeName || "-" },
        { label: "Penyelenggara", value: detail.organizerName || "-" },
        { label: "Peserta", value: detail.participantName || "-" },
      ]}
      descriptionTitle={<RotatedHighlightTitle title="Deskripsi Prestasi" />}
      description={detail.description || "Belum ada deskripsi prestasi."}
      galleryTitle="Galeri Prestasi"
      galleries={galleries.map((gallery) => ({
        id: gallery.id,
        photoUrl: gallery.photoUrl,
        order: gallery.order,
      }))}
      galleryDescription={
        detail.galleryDescription || "Belum ada deskripsi galeri prestasi."
      }
      galleryEmptyText="Belum ada foto dokumentasi."
      highlightsTitle="Penghargaan"
      highlights={awards.map((award) => ({
        id: award.id,
        name: award.name,
      }))}
      highlightsEmptyText="Belum ada data penghargaan."
      footerInlineWithHighlights
      footer={
        <div className="h-full rounded-md border border-gray-300 bg-white p-6 shadow flex flex-col justify-between items-center gap-4">
          <h3 className="text-xl text-center text-primary font-semibold">
            Infromasi Penerimaan <br /> Siswa Baru
          </h3>
          <p className="mt-3 text-gray-700 text-center">
            Berminat bergaubung di SMK Tamtama Kroya? Lihat informasi penerimaan
            siswa baru dan jadilah bagian dari sekolah berprestasi ini.
          </p>
          <div className="mt-4">
            <TextButton
              variant="primary"
              text="Cek Pendaftaran"
              className="w-full sm:w-fit"
              onClick={() => router.push("/pendaftaran")}
            />
          </div>
        </div>
      }
    />
  );
}

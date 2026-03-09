"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import RotatedHighlightTitle from "@/components/SectionTitle/RotatedHighlightTitle";
import { resolveSlug } from "@/utils/resolveSlug";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LuArrowLeft } from "react-icons/lu";
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
            onClick={() => router.push("/tentang-sekolah/prestasi")}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white px-4 py-10 sm:px-6 sm:py-12 md:px-10 lg:px-16 xl:px-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-16 sm:pb-8 max-sm:pt-20 max-sm:px-8">
        <div className="w-fit">
          <TextButton
            variant="shadow"
            icon={<LuArrowLeft className="text-2xl" />}
            className="w-fit!"
            onClick={() => router.push("/tentang-sekolah/prestasi")}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <h1 className="text-4xl max-sm:text-2xl font-semibold text-primary">
            {detail.title}
          </h1>
          <p className="text-lg text-primary/80">
            Prestasi Siswa SMK Tamtama Kroya
          </p>
        </div>

        <div className="grid w-full gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Image
            src={detail.coverPhotoUrl || "https://placehold.co/1200x800/png"}
            alt={detail.title}
            width={1200}
            height={800}
            loading="lazy"
            unoptimized
            className="h-full max-h-96 w-full rounded-md border border-gray-200 object-cover"
          />

          <div className="w-full rounded-md border border-gray-300 p-6 shadow h-fit">
            <h2 className="text-xl text-primary font-semibold mb-4">
              Informasi Kompetisi
            </h2>

            <div className="flex flex-col gap-2 text-gray-800">
              <div className="grid grid-cols-[8rem_1fr] items-start gap-x-2">
                <p className="font-semibold">Kategori</p>
                <p>: {detail.category || "-"}</p>
              </div>
              <div className="grid grid-cols-[8rem_1fr] items-start gap-x-2">
                <p className="font-semibold">Tangkatan</p>
                <p>: {competitionLevelLabel(detail.competitionLevel || "")}</p>
              </div>
              <div className="grid grid-cols-[8rem_1fr] items-start gap-x-2">
                <p className="font-semibold">Tanggal</p>
                <p>: {formatCompetitionDate(detail.competitionDate || "")}</p>
              </div>
              <div className="grid grid-cols-[8rem_1fr] items-start gap-x-2">
                <p className="font-semibold">Tempat</p>
                <p>: {detail.placeName || "-"}</p>
              </div>
              <div className="grid grid-cols-[8rem_1fr] items-start gap-x-2">
                <p className="font-semibold">Penyelenggara</p>
                <p>: {detail.organizerName || "-"}</p>
              </div>
              <div className="grid grid-cols-[8rem_1fr] items-start gap-x-2">
                <p className="font-semibold">Peserta</p>
                <p>: {detail.participantName || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="flex flex-col gap-3">
          <RotatedHighlightTitle title="Deskripsi Prestasi" />
          <p className="text-base text-gray-700 leading-relaxed break-all">
            {detail.description || "Belum ada deskripsi prestasi."}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <RotatedHighlightTitle title="Penghargaan" />

          {awards.length > 0 ? (
            <ol className="mt-3 ml-6 flex flex-col gap-2">
              {awards.map((award) => (
                <li key={award.id} className="list-disc text-gray-700">
                  {award.name}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-gray-700">Belum ada data penghargaan.</p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <RotatedHighlightTitle title="Galeri Prestasi" />

          {galleries.length > 0 ? (
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleries.map((gallery) => (
                <Image
                  key={gallery.id}
                  src={gallery.photoUrl || "https://placehold.co/1600x900/png"}
                  alt={`${detail.title} galeri ${gallery.order + 1}`}
                  width={1600}
                  height={900}
                  loading="lazy"
                  unoptimized
                  className="h-52 w-full rounded-lg border border-gray-200 object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-gray-700">Belum ada foto dokumentasi.</p>
          )}
        </section>
      </div>
    </main>
  );
}

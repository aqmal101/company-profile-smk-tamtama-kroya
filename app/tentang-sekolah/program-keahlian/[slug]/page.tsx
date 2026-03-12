"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import MarqueeGallery from "@/components/LandingPage/MarqueeGallery";
import RotatedHighlightTitle from "@/components/SectionTitle/RotatedHighlightTitle";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { MajorDetail } from "../type";
import { resolveSlug } from "@/utils/resolveSlug";
import { RiPhoneFill } from "react-icons/ri";

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

export default function MajorDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<MajorDetail | null>(null);

  const slug = resolveSlug(params?.slug);

  const message =
    "Halo! Mohon informasikan pendaftaran murid baru di SMK Tamtama Kroya.";

  const encodedMessage = encodeURIComponent(message);

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

  const industryPartners = useMemo(
    () => detail?.industryPartners || [],
    [detail?.industryPartners],
  );

  const normalizedDescription = useMemo(
    () => detail?.description?.trim() || "",
    [detail?.description],
  );

  const isDescriptionHtml = useMemo(
    () => HTML_TAG_PATTERN.test(normalizedDescription),
    [normalizedDescription],
  );

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
    <main className="min-h-screen w-full bg-linear-to-b from-[#fafafa] to-gray-50 px-4 sm:px-6 sm:py-12 md:px-10 lg:px-16 xl:px-24">
      <div className="mx-auto mt-24 flex w-full max-w-7xl flex-col gap-8">
        <div className="w-fit">
          <TextButton
            variant="shadow"
            icon={<LuArrowLeft className="text-2xl" />}
            className="w-fit!"
            onClick={() => router.push("/tentang-sekolah/program-keahlian")}
          />
        </div>

        <header className="space-y-3">
          <h1 className="text-4xl max-sm:text-2xl font-semibold text-primary">
            {detail.name}
          </h1>
          <h2 className="text-xl text-primary">SMK Tamtama Kroya</h2>
          <p className="text-base max-sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {detail.summary?.trim() || "Belum ada ringkasan jurusan."}
          </p>
        </header>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
              <Image
                src={detail.photoUrl || "https://placehold.co/1200x800/png"}
                alt={detail.name}
                width={1200}
                height={800}
                loading="lazy"
                unoptimized
                className="w-full h-auto max-h-112 rounded-lg object-cover"
              />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-3">
              <h2 className="text-2xl max-sm:text-xl font-semibold text-primary">
                Deskripsi Jurusan
              </h2>

              {isDescriptionHtml ? (
                <div
                  className="text-base max-sm:text-sm text-gray-700 leading-relaxed wrap-break-word [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1"
                  dangerouslySetInnerHTML={{
                    __html: normalizedDescription,
                  }}
                />
              ) : (
                <p className="text-base max-sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {normalizedDescription || "Belum ada deskripsi jurusan."}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="rounded-lg bg-white">
                  <h3 className="text-lg font-semibold text-primary mb-3">
                    Prospek Lulusan
                  </h3>
                  {detail.graduateProspects.length > 0 ? (
                    <ol className="ml-4 list-disc space-y-1">
                      {detail.graduateProspects.map((item, index) => (
                        <li
                          key={`prospect-${index}`}
                          className="text-sm text-gray-700"
                        >
                          {item}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-gray-500">Belum ada data.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="xl:col-span-4">
            <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-5 xl:sticky xl:top-24">
              <h3 className="text-xl font-semibold text-primary">
                Informasi Utama
              </h3>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-800">
                  Kompetensi Utama
                </p>
                {detail.mainCompetencies.length > 0 ? (
                  <ol className="ml-4 list-disc space-y-1">
                    {detail.mainCompetencies.map((item, index) => (
                      <li
                        key={`competency-${index}`}
                        className="text-sm text-gray-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-gray-500">Belum ada data.</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">
                  Lama Pendidikan
                </p>
                <p className="text-sm text-gray-700">
                  {detail.studyDurationYears} tahun
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-800">
                  Sertifikasi
                </p>
                {detail.certifications.length > 0 ? (
                  <ol className="ml-4 list-disc space-y-1">
                    {detail.certifications.map((item, index) => (
                      <li
                        key={`certification-${index}`}
                        className="text-sm text-gray-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-gray-500">Belum ada data.</p>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-800">
                Mata Pelajaran Kejuruan
              </p>
              {detail.vocationalSubjects.length > 0 ? (
                <ol className="ml-4 list-disc space-y-1">
                  {detail.vocationalSubjects.map((item, index) => (
                    <li
                      key={`subject-${index}`}
                      className="text-sm text-gray-700"
                    >
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-500">Belum ada data.</p>
              )}
            </div>
          </aside>
        </section>

        <section className="space-y-4">
          <RotatedHighlightTitle title={"Galeri Program Keahlian"} />

          {detail.galleryDescription?.trim() ? (
            <p className="text-sm text-gray-700">{detail.galleryDescription}</p>
          ) : null}

          <MarqueeGallery
            items={galleries}
            imageAltBase={detail.name}
            emptyText="Belum ada galeri."
            fallbackImageUrl="https://placehold.co/1200x800/png"
            marqueeContainerClassName="group relative mt-2 overflow-hidden"
            scrollContainerClassName="no-scrollbar mt-2 -mx-2 overflow-x-auto px-2 pb-2"
            emptyTextClassName="text-gray-600"
          />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-end mb-6">
          <div className="xl:col-span-9 space-y-4">
            <RotatedHighlightTitle title="Mitra Industri" />

            {detail.industryPartnerDescription?.trim() ? (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {detail.industryPartnerDescription}
              </p>
            ) : null}

            {industryPartners.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {industryPartners.map((partner) => (
                  <article
                    key={partner.id}
                    className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm"
                  >
                    <Image
                      src={partner.cover || "https://placehold.co/1200x800/png"}
                      alt={partner.name}
                      width={1200}
                      height={800}
                      loading="lazy"
                      unoptimized
                      className="w-full h-48 object-cover border-b border-gray-200"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="text-base font-semibold text-primary">
                        {partner.name || "Mitra Industri"}
                      </h3>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {partner.description?.trim() ||
                          "Belum ada deskripsi mitra."}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Belum ada mitra industri.</p>
            )}
          </div>

          <aside className="xl:col-span-3">
            <div className="h-fit px-5 py-10 text-center space-y-4 border border-gray-200 rounded-lg bg-white shadow-sm xl:sticky xl:top-24">
              <h3 className="text-lg font-semibold text-primary">
                Tertarik Bergabung {detail.abbreviation}?
              </h3>
              <p className="text-sm text-gray-700">
                Jika anda tertarik menjadi siswa {detail.abbreviation} atau
                memiliki pertanyaan lebih lanjut, silahkan hubungi kami.
              </p>
              <a
                href={`https://wa.me/6281325767718?text=${encodedMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white px-3 py-2 rounded-md flex items-center justify-center transition-opacity hover:opacity-90"
              >
                Hubungi Kami
              </a>
              <span className="text-gray-500 flex flex-row gap-2 items-center justify-center">
                <RiPhoneFill className="text-xl text-primary" />
                <p>(+62)81325767718</p>
              </span>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

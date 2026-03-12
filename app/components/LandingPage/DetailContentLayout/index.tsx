"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import MarqueeGallery from "@/components/LandingPage/MarqueeGallery";
import RotatedHighlightTitle from "@/components/SectionTitle/RotatedHighlightTitle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { LuArrowLeft } from "react-icons/lu";

interface DetailInfoItem {
  label: string;
  value: string;
}

interface DetailGalleryItem {
  id: number | string;
  photoUrl: string;
  order: number;
}

interface DetailHighlightItem {
  id: number | string;
  name: string;
}

interface DetailContentLayoutProps {
  backPath: string;
  title: string;
  subtitle?: string;
  heroImageUrl: string;
  heroImageAlt: string;
  infoTitle: string;
  infoItems: DetailInfoItem[];
  descriptionTitle: ReactNode;
  description: string;
  galleryTitle: string;
  galleries: DetailGalleryItem[];
  galleryDescription?: string;
  galleryEmptyText?: string;
  highlightsTitle: string;
  highlights: DetailHighlightItem[];
  highlightsEmptyText?: string;
  footer?: ReactNode;
  footerInlineWithHighlights?: boolean;
}

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

export default function DetailContentLayout({
  backPath,
  title,
  subtitle,
  heroImageUrl,
  heroImageAlt,
  infoTitle,
  infoItems,
  descriptionTitle,
  description,
  galleryTitle,
  galleries,
  galleryDescription,
  galleryEmptyText = "Belum ada foto dokumentasi.",
  highlightsTitle,
  highlights,
  highlightsEmptyText = "Belum ada data.",
  footer,
  footerInlineWithHighlights = false,
}: DetailContentLayoutProps) {
  const router = useRouter();

  const normalizedDescription = useMemo(
    () => description.trim(),
    [description],
  );
  const isDescriptionHtml = useMemo(
    () => HTML_TAG_PATTERN.test(normalizedDescription),
    [normalizedDescription],
  );

  const sortedGalleries = useMemo(
    () => [...galleries].sort((a, b) => a.order - b.order),
    [galleries],
  );

  return (
    <main className="min-h-screen w-full bg-white px-4 py-10 sm:px-4 sm:py-12 md:px-10 lg:px-16 xl:px-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-16 sm:pb-4 max-sm:pt-20 max-sm:px-2">
        <div className="w-fit">
          <TextButton
            variant="shadow"
            icon={<LuArrowLeft className="text-2xl" />}
            className="w-fit!"
            onClick={() => router.push(backPath)}
          />
        </div>

        <div className="w-full flex flex-col gap-3">
          <h1 className="text-4xl max-sm:text-2xl font-semibold text-primary">
            {title}
          </h1>
          {subtitle && <h2 className="text-xl text-primary">{subtitle}</h2>}
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full h-full">
          <Image
            src={heroImageUrl || "https://placehold.co/1200x800/png"}
            alt={heroImageAlt}
            width={1200}
            height={800}
            loading="lazy"
            unoptimized
            className="md:w-6/10 w-full h-auto max-h-92 rounded-md border border-gray-200 object-cover"
          />
          <div className="md:w-4/10 w-full h-full flex flex-col gap-4 p-8 max-sm:p-3 border border-gray-300 shadow rounded-md">
            <h2 className="text-xl text-primary font-semibold">{infoTitle}</h2>

            <div className="flex flex-col gap-2 text-gray-800">
              {infoItems.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="grid grid-cols-[8rem_1fr] items-start gap-x-2"
                >
                  <p className="font-semibold max-sm:text-sm whitespace-nowrap">
                    {item.label}
                  </p>
                  <p className="font-normal max-sm:text-sm wrap-break-word">
                    : {item.value || "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="flex flex-col gap-3 mt-10 max-w-7xl">
          {descriptionTitle}
          {isDescriptionHtml ? (
            <div
              className="text-base max-sm:text-sm text-gray-700 leading-relaxed wrap-break-word [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1"
              dangerouslySetInnerHTML={{
                __html: normalizedDescription,
              }}
            />
          ) : (
            <p className="text-base max-sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line wrap-break-word">
              {normalizedDescription || "Belum ada deskripsi."}
            </p>
          )}
        </section>

        <section className="flex flex-col gap-3 mt-10">
          <RotatedHighlightTitle title={galleryTitle} />

          <MarqueeGallery
            items={sortedGalleries}
            imageAltBase={heroImageAlt}
            emptyText={galleryEmptyText}
            fallbackImageUrl="https://placehold.co/1600x900/png"
          />

          {galleryDescription?.trim() ? (
            <p className="mt-2 text-sm text-gray-700 text-center leading-relaxed">
              {galleryDescription}
            </p>
          ) : null}
        </section>

        {footer && footerInlineWithHighlights ? (
          <section className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between">
            <div className="w-full flex flex-col gap-3 lg:w-[48.5%] lg:flex-none">
              <RotatedHighlightTitle title={highlightsTitle} />

              {highlights.length > 0 ? (
                <ol className="flex flex-col gap-2 mt-4 ml-6">
                  {highlights.map((item) => (
                    <li key={item.id} className="text-gray-700 list-disc">
                      {item.name}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-gray-700">{highlightsEmptyText}</p>
              )}
            </div>

            <div className="w-full justify-end lg:w-[25%] lg:flex-none">
              {footer}
            </div>
          </section>
        ) : (
          <div>
            <section className="flex flex-col gap-3 mt-10">
              <RotatedHighlightTitle title={highlightsTitle} />

              {highlights.length > 0 ? (
                <ol className="flex flex-col gap-2 mt-4 ml-6">
                  {highlights.map((item) => (
                    <li key={item.id} className="text-gray-700 list-disc">
                      {item.name}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-gray-700">{highlightsEmptyText}</p>
              )}
            </section>

            {footer ? <section className="mt-10">{footer}</section> : null}
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import { CSSProperties, useMemo } from "react";

export interface MarqueeGalleryItem {
  id: number | string;
  photoUrl: string;
  order: number;
}

interface MarqueeGalleryProps {
  items: MarqueeGalleryItem[];
  imageAltBase: string;
  emptyText?: string;
  fallbackImageUrl?: string;
  marqueeThreshold?: number;
  marqueeContainerClassName?: string;
  scrollContainerClassName?: string;
  emptyTextClassName?: string;
}

export default function MarqueeGallery({
  items,
  imageAltBase,
  emptyText = "Belum ada foto dokumentasi.",
  fallbackImageUrl = "https://placehold.co/1600x900/png",
  marqueeThreshold = 4,
  marqueeContainerClassName = "group relative mt-6 overflow-hidden",
  scrollContainerClassName = "no-scrollbar mt-6 -mx-2 overflow-x-auto px-2 pb-2",
  emptyTextClassName = "mt-6 text-gray-700",
}: MarqueeGalleryProps) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.order - b.order),
    [items],
  );

  const shouldUseMarquee = sortedItems.length > marqueeThreshold;

  const marqueeItems = useMemo(
    () => (shouldUseMarquee ? [...sortedItems, ...sortedItems] : sortedItems),
    [sortedItems, shouldUseMarquee],
  );

  const marqueeDuration = useMemo(
    () => Math.max(50, sortedItems.length * 4),
    [sortedItems.length],
  );

  const marqueeStyle = useMemo(
    () =>
      ({
        "--marquee-duration": `${marqueeDuration}s`,
      }) as CSSProperties,
    [marqueeDuration],
  );

  if (sortedItems.length === 0) {
    return <p className={emptyTextClassName}>{emptyText}</p>;
  }

  return (
    <>
      {shouldUseMarquee ? (
        <div className={marqueeContainerClassName}>
          <div
            className="marquee-gallery-track flex w-max gap-4"
            style={marqueeStyle}
          >
            {marqueeItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="w-[78vw] shrink-0 sm:w-[30vw] md:w-[34vw] lg:w-[28vw] xl:w-[22vw]"
              >
                <Image
                  src={item.photoUrl || fallbackImageUrl}
                  alt={`${imageAltBase} galeri ${index + 1}`}
                  width={1600}
                  height={900}
                  loading="lazy"
                  unoptimized
                  className="h-52 w-full rounded-lg border border-gray-200 object-cover grayscale transition-[filter,transform] duration-500 ease-out hover:grayscale-0 hover:scale-[1.01]"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={scrollContainerClassName}>
          <div className="flex w-max gap-4">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="w-[78vw] shrink-0 sm:w-[30vw] md:w-[34vw] lg:w-[28vw] xl:w-[20vw]"
              >
                <Image
                  src={item.photoUrl || fallbackImageUrl}
                  alt={`${imageAltBase} galeri ${item.order + 1}`}
                  width={1600}
                  height={900}
                  loading="lazy"
                  unoptimized
                  className="h-42 w-full rounded-lg border border-gray-200 object-cover grayscale transition-[filter,transform] duration-500 ease-out hover:grayscale-0 hover:scale-[1.01]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .marquee-gallery-track {
          animation: marquee-left var(--marquee-duration, 60s) linear infinite;
          will-change: transform;
        }

        .group:hover .marquee-gallery-track {
          animation-play-state: paused;
        }

        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-gallery-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

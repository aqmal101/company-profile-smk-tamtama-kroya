import Link from "next/link";
import { Fragment } from "react";
import { LuHouse } from "react-icons/lu";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  homeHref?: string;
  homeLabel?: string;
}

export default function Breadcrumb({
  items,
  className = "",
  homeHref = "/",
  homeLabel = "Beranda",
}: BreadcrumbProps) {
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: homeLabel,
      href: homeHref,
    },
    ...items,
  ];

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm max-sm:text-[9px] text-gray-600">
        {breadcrumbItems.map((item, index) => {
          const isLastItem = index === breadcrumbItems.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {item.href && !isLastItem ? (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                  >
                    {index === 0 ? <LuHouse className="text-base" /> : null}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={
                      isLastItem
                        ? "font-medium text-primary"
                        : "inline-flex items-center gap-1.5"
                    }
                    aria-current={isLastItem ? "page" : undefined}
                  >
                    {index === 0 ? <LuHouse className="text-base" /> : null}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>

              {!isLastItem ? (
                <li className="text-gray-400" aria-hidden="true">
                  /
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

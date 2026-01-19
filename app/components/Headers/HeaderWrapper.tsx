"use client";

import { usePathname } from "next/navigation";
import Header from "./index";

export const HeaderWrapper = () => {
  const pathname = usePathname();

  // Untuk custom path tanpa header (bisa ditambahkan sesuai kebutuhan)
  const noHeader = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/not-found",
  ];

  // Cek apakah pathname dimulai dengan path tanpa header
  const isNoHeader = noHeader.some((route) => pathname.startsWith(route));

  // Return header sesuai kondisi (null jika tidak ada header)
  if (isNoHeader) return null;

  return <Header />;
};

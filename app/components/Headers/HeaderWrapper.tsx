"use client";

import { usePathname } from "next/navigation";
import Header from "./index";
import RegistrationHeader from "./RegistrationHeader";

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

  const registrationHeaderRoutes = ["/pendaftaran"];

  // Cek apakah pathname dimulai dengan path tanpa header
  const isNoHeader = noHeader.some((route) => pathname.startsWith(route));
  const isRegistrationHeader = registrationHeaderRoutes.some((route) =>
    pathname.startsWith(route),
  );

  return isRegistrationHeader && !isNoHeader ? (
    <RegistrationHeader />
  ) : (
    <Header />
  );
};

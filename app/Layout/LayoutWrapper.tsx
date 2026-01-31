"use client";
import { Footer } from "@/components/Footer";
import RegistrationHeader from "@/components/Headers/RegistrationHeader";
import Header from "@/components/Headers";
import { AuthGuard } from "@/components/AuthGuard";
import { usePathname } from "next/navigation";
import { JSX, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import DashboardHeader from "@/components/Headers/DashboardHeader";
import AdminHeader from "@/app/admin/dashboard/AdminHeader";
import Sidebar from "@/app/admin/dashboard/Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  // Untuk custom path tanpa header (bisa ditambahkan sesuai kebutuhan)
  const noHeader = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/not-found",
  ];

  const registrationHeaderRoutes = ["/pendaftaran"];

  const dashboardRoutes = ["/dashboard"];
  const adminRoutes = ["/admin"];

  // Cek apakah pathname dimulai dengan path tanpa header
  const isNoHeader = noHeader.some((route) => pathname.startsWith(route));

  const isRegistrationPage = registrationHeaderRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isDashboardPage = dashboardRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAdminPage = adminRoutes.some((route) => pathname.startsWith(route));

  if (isNoHeader) {
    return <>{children}</>;
  }

  const message =
    "Halo! Mohon informasikan pendaftaran murid baru di SMK Tamtama Kroya.";

  const encodedMessage = encodeURIComponent(message);

  return (
    <>
      {isAdminPage ? (
        <AuthGuard allowedRoles={["admin"]}>
          <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          <Sidebar collapsed={collapsed} />
        </AuthGuard>
      ) : isRegistrationPage ? (
        <RegistrationHeader />
      ) : isDashboardPage ? (
        <AuthGuard allowedRoles={["teacher", "admin"]}>
          <DashboardHeader />
        </AuthGuard>
      ) : (
        <Header />
      )}
      {isAdminPage ? (
        <AuthGuard allowedRoles={["admin"]}>
          <div
            className={`pt-20 min-h-screen bg-gray-50 transition-all duration-300 ${collapsed ? "pl-16" : "pl-62"}`}
          >
            {children}
          </div>
        </AuthGuard>
      ) : (
        children
      )}
      {!isDashboardPage && !isAdminPage && (
        <a
          href={`https://wa.me/6281325767718?text=${encodedMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-50 drop-shadow-xl bottom-4 md:right-8 right-2 bg-[#25d366] p-2 md:mr-4 md:mb-8 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          <BsWhatsapp size={30} color="white" />
        </a>
      )}
      {isRegistrationPage || isDashboardPage || isAdminPage ? (
        <></>
      ) : (
        <Footer />
      )}
    </>
  );
}

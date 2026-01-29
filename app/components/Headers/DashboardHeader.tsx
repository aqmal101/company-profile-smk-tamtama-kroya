import { PiUserCircleCheck } from "react-icons/pi";
import Dropdown from "../Dropdown";
import React from "react";
import { LuLogOut } from "react-icons/lu";
import { useAlert } from "../ui/alert";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function DashboardHeader() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const { showAlert } = useAlert();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
    showAlert({
      title: "Logout berhasil",
      description: "Anda diarahkan ke beranda",
      variant: "info",
    });
  };

  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <header className="fixed bg-white text-black shadow-lg w-full px-4 sm:px-6 lg:px-10 py-3 sm:py-4 z-100 top-0">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="w-auto sm:w-[36%] flex flex-row items-center justify-start">
          <Link href="/">
            <Image
              src="/header/logo.png"
              alt="logo-smk-tamtama-kroya"
              width={40}
              height={40}
            />
          </Link>
          <div className="hidden sm:flex flex-col ml-3">
            <h1 className="text-sm sm:text-base font-bold">
              SMK Tamtama Kroya
            </h1>
            <p className="text-xs sm:text-sm">
              PPDB {currentYear}/{currentYear + 1}
            </p>
          </div>
        </div>
        <Dropdown
          isOpen={modalOpen}
          onOpen={() => setModalOpen(true)}
          onClose={() => setModalOpen(false)}
          label="Miruku"
          leftIcon={<PiUserCircleCheck className="text-2xl" />}
          width="max-w-fit"
          color="bg-white"
          textColor="text-gray-900"
          rounded="rounded-sm"
          className="px-3.5 py-2"
        >
          <a
            onClick={handleLogout}
            className="w-full p-1 text-danger flex justify-start gap-3 items-center font-normal hover:translate-x-2 group hover:underline hover:underline-offset-2 transition-transform duration-200"
          >
            <LuLogOut className="w-6 h-6  items-end" />
            Logout
          </a>
        </Dropdown>
      </div>
    </header>
  );
}

import { NavItems } from "@/configs/navbarMenu";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";

const currentYear = new Date().getFullYear();

export const Header: React.FC = () => {
  const pathname = usePathname();

  const ppdbRoutes = ["/ppdb"];

  const isPPDBRoute = ppdbRoutes.some((route) => pathname.startsWith(route));

  return (
    <header className="fixed bg-white text-[#2D2D2D] shadow-lg w-full px-10 py-4 z-100">
      <div className="w-full flex flex-row border justify-between">
        <div className="w-[40%] flex flex-row items-center justify-start border">
          <Image
            src="/header/logo.png"
            alt="PPDB Logo"
            width={40}
            height={40}
          />
          {isPPDBRoute && (
            <div className="flex flex-col ml-3">
              <h1 className="text-base font-bold">SMK Tamtama Kroya</h1>
              <p className="text-sm">
                PPDB {currentYear}/{currentYear + 1}
              </p>
            </div>
          )}
        </div>
        <div className="w-[60%] flex flex-row items-center justify-end border">
          <div className="w-full border flex flex-row space-x-8">
            {NavItems.map((item) => (
              <div key={item.label} className="relative group/nav">
                <a
                  href={item.href}
                  className="flex flex-row justify-center items-center text-sm font-medium text-[#2D2D2D] hover:text-[#014921] transition-all duration-200 ease-in-out"
                >
                  {item.label}
                  {item.children ? (
                    <MdOutlineArrowDropDown
                      size={20}
                      className="group-hover:-rotate-90"
                    />
                  ) : (
                    ""
                  )}
                </a>
                {item?.children && (
                  <div
                    className="absolute left-0 top-full mt-0 w-fit min-w-40 bg-white shadow-lg rounded-md p-4 border
                    opacity-0 translate-y-2 pointer-events-none invisible
                    transition-all duration-200 ease-out
                    group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto group-hover/nav:visible
                    group-focus-within/nav:opacity-100 group-focus-within/nav:translate-y-0 group-focus-within/nav:pointer-events-auto group-focus-within/nav:visible"
                  >
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-[#2D2D2D]
                        hover:bg-[#014921] hover:text-white rounded
                        transition-colors duration-200 ease-in-out"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="min-w-fit px-3 py-2 bg-[#014921] text-white rounded">
            Daftar Sekarang
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

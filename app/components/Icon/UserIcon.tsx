import Image from "next/image";
import { LuUser, LuX } from "react-icons/lu";
import { RiUserStarLine } from "react-icons/ri";
import { useState } from "react";
import { createPortal } from "react-dom";

export type UserIconProps = {
  source: string | null;
  size?: number;
  isAdmin?: boolean;
  isPreview?: boolean;
};

export function ProfileUser({
  source,
  size = 64,
  isPreview = false,
}: UserIconProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isValidUrl = source?.includes("https://");

  const handlePreview = () => {
    if (isPreview && isValidUrl) {
      setIsModalVisible(true);
    }
  };

  const modalContent = isModalVisible ? (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/20 bg-opacity-50">
      <div className="relative bg-transparent p-4">
        <button
          className="absolute -top-6 -right-6 text-gray-500 bg-white p-2 rounded-full hover:text-gray-800"
          onClick={() => setIsModalVisible(false)}
        >
          <LuX className="text-2xl text-black" />
        </button>
        <Image
          src={source || ""}
          alt="User Avatar Preview"
          width={size * 4} // Larger preview size
          height={size * 4}
          quality={90}
          unoptimized
          className="object-cover w-full h-full max-w-xl max-h-xl"
        />
      </div>
    </div>
  ) : null;

  return (
    <div style={{ width: size, height: size }}>
      {source && isValidUrl ? (
        <>
          <Image
            src={source}
            alt="User Avatar"
            width={size * 2} // Load at 2x resolution
            height={size * 2}
            quality={90}
            unoptimized
            loading="lazy"
            className={`rounded-full object-cover w-full h-full ${isPreview ? "cursor-pointer" : ""}`}
            onClick={handlePreview}
          />
          {createPortal(modalContent, document.body)}
        </>
      ) : (
        <div className="w-full h-full bg-gray-300 rounded-full flex justify-center items-center">
          <LuUser className="text-2xl" />
        </div>
      )}
    </div>
  );
}

export function UserIcon({ isAdmin = false }: { isAdmin?: boolean }) {
  return (
    <div
      className={`w-10 h-10 ${isAdmin ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-700"} rounded-full flex justify-center items-center`}
    >
      {isAdmin ? (
        <RiUserStarLine className="text-2xl" />
      ) : (
        <LuUser className="text-2xl" />
      )}
    </div>
  );
}

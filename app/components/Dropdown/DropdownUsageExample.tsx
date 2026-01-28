/**
 * CONTOH PENGGUNAAN DROPDOWN COMPONENT
 * Menunjukkan berbagai cara menggunakan Dropdown yang reusable
 */

"use client";
import { useState } from "react";
import Image from "next/image";
import Dropdown from "./index";
import { BsWhatsapp } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";

// ============================================
// 1. WhatsApp Button Dropdown
// ============================================
export function WhatsAppDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const contactNumbers = [
    { name: "Kepala Sekolah", number: "6281325767718" },
    { name: "Bagian Pendaftaran", number: "6281234567890" },
    { name: "Bagian Kesiswaan", number: "6289876543210" },
  ];

  const message = encodeURIComponent(
    "Halo! Mohon informasikan pendaftaran murid baru di SMK Tamtama Kroya.",
  );

  return (
    <Dropdown
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      label="Hubungi via Whatsapp"
      leftIcon={<BsWhatsapp size={20} />}
      width="w-[60%]"
      color="bg-[#25d366]"
      textColor="text-white"
      rounded="rounded-md"
      borderColor="border-[#25d366]"
    >
      <div className="flex flex-col p-2 space-y-2">
        {contactNumbers.map((contact, index) => (
          <a
            key={index}
            href={`https://wa.me/${contact.number}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-3 text-primary flex justify-between items-center font-normal hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <span className="text-sm">{contact.name}</span>
            <BsWhatsapp size={18} className="text-[#25d366]" />
          </a>
        ))}
      </div>
    </Dropdown>
  );
}

// ============================================
// 2. User Avatar Dropdown (Dashboard)
// ============================================
export function UserAvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const userMenuItems = [
    { label: "Profil", icon: "👤", action: () => console.log("Profile") },
    { label: "Pengaturan", icon: "⚙️", action: () => console.log("Settings") },
    {
      label: "Logout",
      icon: <IoLogOut size={18} />,
      action: () => console.log("Logout"),
    },
  ];

  return (
    <Dropdown
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      label="John Doe"
      leftIcon={
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <Image
            src="/api/placeholder/32/32"
            alt="avatar"
            width={32}
            height={32}
          />
        </div>
      }
      rightIcon={null}
      width="w-auto"
      color="bg-white"
      textColor="text-gray-900"
      rounded="rounded-lg"
      borderColor="border-gray-300"
    >
      <div className="flex flex-col p-1 space-y-1">
        {userMenuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.action();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2 transition-colors duration-200"
          >
            <span className="text-lg">
              {typeof item.icon === "string" ? item.icon : item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </Dropdown>
  );
}

// ============================================
// 3. Filter/Sort Dropdown
// ============================================
export function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Terbaru");

  const filterOptions = [
    "Terbaru",
    "Terpopuler",
    "Rating Tertinggi",
    "Harga Terendah",
  ];

  return (
    <Dropdown
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      label={`Filter: ${selectedFilter}`}
      width="w-48"
      color="bg-blue-500"
      textColor="text-white"
      rounded="rounded-lg"
      borderColor="border-blue-500"
    >
      <div className="flex flex-col p-2 space-y-1">
        {filterOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedFilter(option);
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm rounded transition-colors duration-200 ${
              selectedFilter === option
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </Dropdown>
  );
}

"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import { SectionCard } from "@/components/Card/SectionCard";
import { TitleSection } from "@/components/TitleSection/index";
import { useState } from "react";

export default function BuktiPendaftaranPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [displayPreview, setDisplayPreview] = useState(false);

  const tabs = [
    { id: "tab1", label: "PDF Rangkap ke 2" },
    { id: "tab2", label: "PDF Rangkap ke 3" },
  ];

  return (
    <div className="w-full h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="h-full">
        <TitleSection
          title="Bukti Pendaftaran"
          subtitle="Halaman ini digunakan untuk mengedit dokumen PD yang akan dikirimkan ke calon murid baru sebagai bukti pendaftaran nya diterima oleh sekolah"
        />
        <div className="w-full h-100 bg-white rounded-md drop-shadow-sm p-3">
          {/* Tabs Navigation */}
          <div className="flex border flex-row  w-full rounded-none justify-between items-center gap-1 sm:gap-0 mb-2">
            <div className="w-fit h-fit rounded-sm bg-gray-300">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`w-64 px-4 sm:px-8 py-2 sm:py-3 rounded-sm font-semibold transition-all duration-300 text-sm ${
                    activeTab === index
                      ? "bg-[#1B5E20] text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <TextButton
              variant="outline"
              className="text-sm! py-2.5!"
              text={
                displayPreview ? "Sembunyikan Preview" : "Tampilkan Preview"
              }
              onClick={() => setDisplayPreview((prev) => !prev)}
            />
          </div>
          {activeTab === 0 ? (
            <div className="w-full gap-x-3 h-fit flex flex-row">
              <div className={`${displayPreview ? "w-1/2" : "w-full"}`}>
                <SectionCard
                  title="Edit Pengumuman PDF Rangkap Ke 2"
                  className="w-full px-2"
                  // isLoading={isLoadingCommittee}
                  // saveButtonDisabled={isBusy}
                  leftButton={
                    <TextButton
                      variant="outline"
                      text="Batalkan"
                      // isLoading={isBusy}
                    />
                  }
                ></SectionCard>
              </div>

              {displayPreview && (
                <div className="w-1/2 border border-gray-300 shadow-sm rounded-md bg-white p-4"></div>
              )}
            </div>
          ) : (
            <>Uploader</>
          )}
        </div>
      </div>
    </div>
  );
}

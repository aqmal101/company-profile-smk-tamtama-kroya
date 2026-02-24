"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import { SectionCard } from "@/components/Card/SectionCard";
import { TitleSection } from "@/components/TitleSection/index";
import { useAlert } from "@/components/ui/alert";
import DragDropFile from "@/components/Upload/DragDropFile";
import FileUploadPreview from "@/components/Upload/FileUploadPreview";
import { useState } from "react";

export default function BuktiPendaftaranPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [displayPreview, setDisplayPreview] = useState(true);
  const { showAlert } = useAlert();

  const tabs = [
    { id: "tab1", label: "PDF Rangkap ke 2" },
    { id: "tab2", label: "PDF Rangkap ke 3" },
  ];

  const [photoDrafts, setPhotoDrafts] = useState<
    Record<string, { file: File; previewUrl: string }>
  >({});

  const setDraftFile = (tabId: string, file: File | null) => {
    setPhotoDrafts((prev) => {
      const next = { ...prev };
      const existing = next[tabId];
      if (existing?.previewUrl) {
        URL.revokeObjectURL(existing.previewUrl);
      }

      if (!file) {
        delete next[tabId];
        return next;
      }

      next[tabId] = { file, previewUrl: URL.createObjectURL(file) };
      return next;
    });
  };
  return (
    <div className="w-full h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="h-full">
        <TitleSection
          title="Bukti Pendaftaran"
          subtitle="Halaman ini digunakan untuk mengedit dokumen PD yang akan dikirimkan ke calon murid baru sebagai bukti pendaftaran nya diterima oleh sekolah"
        />
        <div className="w-full h-fit bg-white rounded-md drop-shadow-sm p-3">
          {/* Tabs Navigation */}
          <div className="flex flex-row  w-full rounded-none justify-between items-center gap-1 sm:gap-0 mb-2">
            <div className="w-fit h-fit rounded-sm bg-white drop-shadow-md">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`w-64 px-4 sm:px-8 py-2 sm:py-3 rounded-sm font-semibold transition-all duration-300 text-sm ${
                    activeTab === index
                      ? "bg-[#1B5E20] text-white shadow-lg"
                      : "bg-white text-gray-700  hover:bg-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {activeTab === 0 ? (
            <div className="w-full gap-x-3 h-fit flex flex-row">
              <SectionCard
                title="Edit Pengumuman PDF Rangkap Ke 2"
                className="w-full h-full px-2"
                headerButton={
                  <TextButton
                    variant="outline"
                    className="text-sm! py-2!"
                    text={
                      displayPreview
                        ? "Sembunyikan Preview"
                        : "Tampilkan Preview"
                    }
                    onClick={() => setDisplayPreview((prev) => !prev)}
                  />
                }
                // isLoading={isLoadingCommittee}
                // saveButtonDisabled={isBusy}
                leftButton={
                  <TextButton
                    variant="outline"
                    text="Batalkan"
                    // isLoading={isBusy}
                  />
                }
              >
                <div className="w-full h-100 flex flex-row">
                  <div
                    className={`${displayPreview ? "w-1/2" : "w-full"} h-full border border-gray-300 shadow-sm rounded-md bg-white p-4`}
                  >
                    <div className="w-full h-full">Form Tab 1</div>
                  </div>
                  {displayPreview && (
                    <div className="w-1/2 h-full border border-gray-300 shadow-sm rounded-md bg-white p-4">
                      Preview Tab 1
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          ) : (
            <div className="w-full gap-x-3 h-fit flex flex-row">
              <SectionCard
                title="Edit Pengumuman PDF Rangkap Ke 3"
                className="w-full h-full px-2"
                headerButton={
                  <TextButton
                    variant="outline"
                    className="text-sm! py-2!"
                    text={
                      displayPreview
                        ? "Sembunyikan Preview"
                        : "Tampilkan Preview"
                    }
                    onClick={() => setDisplayPreview((prev) => !prev)}
                  />
                }
                cardFooter={false}
              >
                <div className="w-full max-h-screen h-[80vh] flex flex-row my-4 gap-4">
                  <div
                    className={`${displayPreview ? "w-1/2" : "w-full"} h-full`}
                  >
                    <SectionCard
                      className="w-full h-full p-2"
                      title="Dokumen Rangkap ke 3"
                      leftButton={
                        <TextButton variant="outline" text="Batalkan" />
                      }
                    >
                      <div className="w-full h-[60vh] p-4">
                        <DragDropFile
                          className="h-full"
                          accept="image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          textButton="Cari Dokumen"
                          initialFile={
                            photoDrafts[tabs[activeTab].id]?.file ?? null
                          }
                          onFile={(file) =>
                            setDraftFile(tabs[activeTab].id, file)
                          }
                          onRemove={() =>
                            setDraftFile(tabs[activeTab].id, null)
                          }
                          onValidate={(file) => {
                            if (file.size > 10 * 1024 * 1024) {
                              showAlert({
                                title: "Ukuran terlalu besar",
                                description: `Ukuran file maksimal 10MB`,
                                variant: "warning",
                              });
                              return `Ukuran file maksimal 10MB`;
                            }
                            const allowedTypes = [
                              "image/png",
                              "application/pdf",
                              "application/msword",
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            ];
                            if (!allowedTypes.includes(file.type)) {
                              showAlert({
                                title: "Format tidak didukung",
                                description:
                                  "Hanya file PNG, PDF, DOC, dan DOCX yang diterima",
                                variant: "warning",
                              });
                              return "Hanya file PNG, PDF, DOC, dan DOCX yang diterima";
                            }
                            return null;
                          }}
                        />
                      </div>
                    </SectionCard>
                  </div>
                  {displayPreview && (
                    <div className="w-1/2 h-full border border-gray-300 shadow-sm rounded-md bg-white p-4">
                      <FileUploadPreview
                        file={photoDrafts[tabs[activeTab].id]?.file ?? null}
                        previewUrl={
                          photoDrafts[tabs[activeTab].id]?.previewUrl ?? null
                        }
                        emptyText="Belum ada dokumen untuk dipreview"
                      />
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { TextButton } from "@/components/Buttons/TextButton";
import { SectionCard } from "@/components/Card/SectionCard";
import { TitleSection } from "@/components/TitleSection/index";
import { BenefitList, BenefitItem } from "@/components/Card/BenefitCard";
import { useState } from "react";

export default function AdminRegistrationPathPage() {
  const [akademik, setAkademik] = useState<BenefitItem[]>([
    {
      id: "a1",
      title: "Peringkat 1 Kelas",
      benefit: "Gratis SPP 9 Bulan",
      order: 1,
      isActive: true,
    },
    {
      id: "a2",
      title: "Peringkat 2 Kelas",
      benefit: "Untuk siswa dengan prestasi akademik",
      order: 2,
      isActive: true,
    },
    {
      id: "a3",
      title: "Peringkat 3 Kelas",
      benefit: "Untuk siswa dengan prestasi akademik",
      order: 3,
      isActive: true,
    },
  ]);

  const [nonAkademik, setNonAkademik] = useState<BenefitItem[]>([
    {
      id: "n1",
      title: "Juara Nasional",
      benefit: "Gratis SPP 1 Tahun",
      order: 1,
      isActive: true,
    },
    {
      id: "n2",
      title: "Juara Provinsi",
      benefit: "Untuk siswa dengan prestasi non-akademik",
      order: 2,
      isActive: true,
    },
    {
      id: "n3",
      title: "Juara Kabupaten",
      benefit: "Untuk siswa dengan prestasi non-akademik",
      order: 3,
      isActive: true,
    },
  ]);

  return (
    <div className="w-full min-h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="h-full w-full bg-white rounded-md drop-shadow-sm p-6">
        <TitleSection
          title="Edit Jalur Pendaftaran"
          subtitle="Menampilkan daftar jalur pendaftaran yang dapat diubah deskripsi dan fotonya"
        />
        <SectionCard
          title="Jalur Pendaftaran"
          className="w-full"
          // handleSaveChanges={handleSaveChanges}
          leftButton={
            <TextButton
              variant="outline"
              // icon={<LuPlus size={18} />}
              text="Batalkan"
              // onClick={handleAddRequirement}
            />
          }
        >
          <div className="space-y-6">
            <div className="border border-blue-200 rounded-md">
              <div className="p-3 bg-white rounded-t-md">
                <div className="font-medium text-gray-700">
                  Jalur Prestasi (Akademik)
                </div>
              </div>
              <BenefitList
                title="Prestasi Akademik"
                items={akademik}
                onChange={setAkademik}
                addLabel="Tambah Prestasi"
              />
            </div>

            <div className="border border-gray-200 rounded-md">
              <div className="p-3 bg-white rounded-t-md">
                <div className="font-medium text-gray-700">
                  Jalur Non-Akademik
                </div>
              </div>
              <BenefitList
                title="Prestasi Non-Akademik"
                items={nonAkademik}
                onChange={setNonAkademik}
                addLabel="Tambah Prestasi"
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

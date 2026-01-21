import { SectionTitle } from "@/components/SectionTitle";

export const SchoolFacility: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <section
      id={id || "fasilitas-sekolah"}
      className="w-full mb-12 px-24 py-10 h-fit space-y-12"
    >
      <SectionTitle
        title="Fasilitas Sekolah"
        subtitle="Fasilitas lengkap dan modern untuk mendukung proses belajar mengajar yang optimal."
        align="center"
      />

      <div className="w-full h-[70vh] border rounded-2xl overflow-hidden border-gray-300 bg-gray-300 flex flex-row"></div>
    </section>
  );
};

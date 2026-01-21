import { SectionTitle } from "@/components/SectionTitle";

export const ContactAndSocial: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <section
      id={id || "kontak-sosial-media"}
      className="w-full mb-12 px-24 py-10 h-fit space-y-12"
    >
      <SectionTitle
        title="Kontak & Sosial Media"
        subtitle="Butuh informasi lebih lanjut? Hubungi kami dan segera daftarkan dirimu sekarang."
        align="center"
      />

      <div className="w-full h-[70vh] border rounded-2xl overflow-hidden border-gray-300 bg-gray-300 flex flex-row"></div>
    </section>
  );
};

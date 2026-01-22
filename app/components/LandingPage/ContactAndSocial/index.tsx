import { SectionTitle } from "@/components/SectionTitle";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";

export const ContactAndSocial: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <section
      id={id || "kontak-sosial-media"}
      className="w-full mb-12 px-4 sm:px-8 lg:px-24 py-8 sm:py-10 h-fit space-y-12"
    >
      <SectionTitle
        title="Kontak & Sosial Media"
        subtitle="Butuh informasi lebih lanjut? Hubungi kami dan segera daftarkan dirimu sekarang."
        align="center"
      />

      <ScrollAnimationWrapper
        direction="up"
        className="w-full h-48 sm:h-64 lg:h-[70vh] border rounded-2xl overflow-hidden border-gray-300 bg-gray-300 flex flex-row"
      >
        <></>
      </ScrollAnimationWrapper>
    </section>
  );
};

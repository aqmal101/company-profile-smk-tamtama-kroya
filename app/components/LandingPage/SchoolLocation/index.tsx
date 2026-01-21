import { SectionTitle } from "@/components/SectionTitle";

export const SchoolLocation: React.FC<{ id?: string }> = ({ id }) => {
  return (
    <section
      id={id || "lokasi-sekolah"}
      className="w-full mb-12 px-24 py-10 h-fit space-y-12"
    >
      <SectionTitle
        title="Lokasi Sekolah"
        subtitle="Lokasi sekolah yang strategis dan mudah dijangkau oleh peserta didik."
        align="center"
      />

      <div className="w-full h-[70vh] border rounded-2xl overflow-hidden border-gray-300 flex flex-row">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4918.492276323309!2d109.24708601282072!3d-7.621409676956022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e65416d4622eb89%3A0x16173980f8b0f4c7!2sSMK%20Tamtama%20Kroya!5e0!3m2!1sen!2sid!4v1768843453168!5m2!1sen!2sid"
          className="w-full h-full"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

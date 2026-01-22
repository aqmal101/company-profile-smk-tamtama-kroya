import { SectionTitle } from "@/components/SectionTitle";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";

interface Facility {
  name: string;
  description: string;
  icon: React.ReactNode;
}

export const SchoolFacility: React.FC<{
  id?: string;
  facilityList: Facility[];
}> = ({ id, facilityList }) => {
  return (
    <section
      id={id || "fasilitas-sekolah"}
      className="w-full mb-12 px-4 max-md:px-12 lg:px-12 py-8 sm:py-10 h-fit space-y-12"
    >
      <SectionTitle
        title="Fasilitas Sekolah"
        subtitle="Fasilitas lengkap dan modern untuk mendukung proses belajar mengajar yang optimal."
        align="center"
      />

      <div className="w-full h-fit overflow-hidden grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilityList.map((facility, index) => (
          <ScrollAnimationWrapper key={index} direction="up">
            <div className="w-full h-full flex p-4 justify-start space-y-5 flex-col items-start border-r bg-white rounded-xl border border-gray-300">
              <div className="w-12 h-12 text-4xl flex justify-center items-center text-white rounded-md bg-primary">
                {facility.icon}
              </div>
              <h4 className="text-lg font-semibold">{facility.name}</h4>
              <p className="text-sm">{facility.description}</p>
            </div>
          </ScrollAnimationWrapper>
        ))}
      </div>
    </section>
  );
};

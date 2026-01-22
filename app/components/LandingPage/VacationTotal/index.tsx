import { BsLightningCharge } from "react-icons/bs";
import { FaGears } from "react-icons/fa6";
import { LiaCarSideSolid } from "react-icons/lia";
import { MdOutlineColorLens } from "react-icons/md";
import { SectionTitle } from "@/components/SectionTitle";
import VacationCard from "@/components/Card/VacationCard";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";

export const VacationTotal: React.FC<{ id?: string }> = ({ id }) => {
  const vacationList = [
    {
      name: "TKR",
      description: "Teknik Kendaraan Ringan",
      color: "#FF8E8E",
      total: 125,
      quota: 100,
      precentage: 83.33,
      isPopular: true,
      icon: <LiaCarSideSolid color="#FF8E8E" size={40} />,
    },
    {
      name: "DKV",
      description: "Desain Komunikasi Visual",
      color: "#2369D1",
      total: 100,
      quota: 100,
      precentage: 66.67,
      icon: <MdOutlineColorLens color="#2369D1" size={40} />,
    },
    {
      name: "MESIN",
      description: "Teknik Permesinan",
      color: "#5DB1F6",
      total: 125,
      quota: 100,
      precentage: 73.33,
      icon: <FaGears color="#5DB1F6" size={40} />,
    },
    {
      name: "TITL",
      description: "Teknik Instalasi Tenaga Listrik",
      color: "#4D4FA4",
      total: 125,
      quota: 100,
      precentage: 83.33,
      icon: <BsLightningCharge color="#4D4FA4" size={40} />,
    },
  ];
  return (
    <section
      id={id || "jumlah-peminat"}
      className="w-full mb-12 px-4 md:px-12 sm:px-6 lg:px-24 xl:px-32 py-8 sm:py-10 h-fit space-y-12"
    >
      <SectionTitle
        title="Jumlah Pendaftar per Jurusan"
        subtitle="Daftar pendaftar diperbarui secara berkala selama masa PPDB  berlangsung"
        align="center"
      />
      <div className="w-full grid grid-cols-1 max-sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 xl:gap-x-24">
        {vacationList.map((item, index) => (
          <ScrollAnimationWrapper
            key={index}
            direction="up"
            delay={index * 0.1}
            className="w-full"
          >
            <VacationCard item={item} index={index} />
          </ScrollAnimationWrapper>
        ))}
      </div>
    </section>
  );
};

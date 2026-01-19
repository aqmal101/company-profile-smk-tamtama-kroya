import { GiGraduateCap } from "react-icons/gi";

export const HeroSection: React.FC = () => {
  return (
    <section className="w-full h-[80vh] bg-[#F5F5F5] text-primary flex flex-row border border-green-500 items-center justify-center px-56 pt-20">
      <div className="w-full h-[90%] flex flex-row justify-between border-red-500">
        {/* Text Section */}
        <div className="relative w-[60%] border border-yellow-500 flex flex-col items-center justify-center py-10">
          <div className="w-full h-full flex-col space-y-4 border border-red-500">
            <h2 className="text-xl">Selamat Datang di</h2>
            <h1 className="text-3xl text-[#2D2D2D] font-semibold">
              Portal Penerimaan Peserta Didik Baru (PPDB) SMK Tamtama Kroya 2026
              / 2027
            </h1>
            <h2 className="text-xl text-[#014921]">
              🏅SMK Pusat Keunggulan (PK)
            </h2>
            <h3>
              Bergabunglah bersama kami untuk memulai perjalanan pendidikan yang
              membekali keterampilan, karakter, dan kesiapan menghadapi dunia
              kerja dan masa depan.
            </h3>
            <div className="w-full space-x-10 flex flex-row">
              <button className="bg-[#014921] text-white border w-full h-fit py-2 rounded-sm">
                Daftar Sekarang
              </button>
              <button className="border w-full bg-white border-gray-300 h-fit py-2 rounded-sm">
                Lihat Jurusan
              </button>
            </div>
          </div>
          <div className="absolute -left-16 top-9">
            <GiGraduateCap size={40} color="#014921" />
          </div>
        </div>
        {/* Text Section */}
        <div className="w-[34%] border border-yellow-500 flex items-center justify-center">
          <div className="w-full h-full bg-gray-300 rounded-2xl"></div>
        </div>
      </div>
    </section>
  );
};

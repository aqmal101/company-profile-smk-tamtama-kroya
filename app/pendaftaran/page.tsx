"use client";

export default function RegistrationPage() {
  return (
    <main className="h-screen min-h-screen bg-linear-to-b from-white to-gray-50 pt-16 sm:pt-20">
      <div className="w-full h-full p-20 border border-red-400">
        {/* Wrapper Layout Step Registration */}
        <div className="w-full">
          <div className="w-5/10 flex flex-col space-y-3 border border-gray-500">
            <p className="text-primary">
              Halo, calon murid <span className="font-semibold">Tamtama!</span>{" "}
              🙋🏻‍♀️🙋🏻‍♂
            </p>
            <p>
              📢 Pastikan semua data telah diisi dengan benar sebelum
              mengirimkan formulir. Jika sudah yakin, silakan klik tombol{" "}
              <span className="font-semibold">Daftar Sekarang.</span>
            </p>
          </div>
        </div>
        <div className="w-full h-fit flex flex-row">
          <div className="w-full h-fit relative my-20">
            <div className="absolute w-full h-full flex items-center justify-between flex-row space-x-6 z-10 px-20">
              {[
                "Biodata Siswa",
                "Biodata Orang Tua",
                "Biodata Wali",
                "Selesai",
              ].map((step, index) => (
                <div
                  key={index}
                  className="w-10 h-10 text-white rounded-full flex justify-center items-center text-xl font-bold bg-primary"
                >
                  0{index + 1}
                  {/* {step.toString().padStart(2, "0")} */}
                </div>
              ))}
            </div>
            <div className="absolute w-full h-full flex items-center justify-between flex-row z-10">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            <div className="w-full h-0.5 absolute top-0 bg-gray-200"></div>
          </div>
        </div>
        <div className="w-full min-h-125 rounded-3xl border border-gray-300"></div>
      </div>
    </main>
  );
}

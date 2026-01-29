"use client";

import { BaseModal } from "@/components/Modal/BaseModal";
import { TextButton } from "@/components/Buttons/TextButton";
import { FaCheckCircle } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationNumber?: string;
  studentName?: string;
  majorChoiceCode?: string;
  isTeacherMode?: boolean;
  teacherName?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  registrationNumber,
  studentName,
  majorChoiceCode,
  isTeacherMode = false,
  teacherName,
}) => {
  // Mapping major codes to full names
  const majorNames: Record<string, string> = {
    TKR: "Teknik Kendaraan Ringan",
    TITL: "Teknik Instalasi Tenaga Listrik",
    DKV: "Desain Komunikasi Visual",
    TP: "Teknik Pemesinan",
  };

  const majorName = majorChoiceCode
    ? majorNames[majorChoiceCode] || majorChoiceCode
    : "";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={true}
      size="lg"
    >
      <div className="flex w-full flex-col items-center justify-center text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-3 p-3 pt-0">
        <FaCheckCircle className=" text-green-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl" />
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-2xl font-bold text-primary px-2">
          Pendaftaran Berhasil!
        </h2>
        {isTeacherMode && teacherName && studentName ? (
          <p className="text-sm sm:text-base md:text-lg lg:text-lg text-gray-700 text-center px-2 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            Selamat, <span className="font-bold">{teacherName}</span> berhasil
            mendaftarkan <br className="hidden sm:block md:hidden lg:block" />{" "}
            ananda <span className="font-bold">{studentName}</span>
          </p>
        ) : studentName && !isTeacherMode ? (
          <p className="text-sm sm:text-base md:text-lg lg:text-lg text-gray-700 px-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            Selamat, <span className="font-bold">{studentName}</span>!
          </p>
        ) : null}
        <div className="bg-gray-50 p-2 sm:p-3 md:p-4 lg:p-2 xl:p-3 rounded-lg w-full space-y-2 sm:space-y-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Nomor Pendaftaran:
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-primary break-all leading-tight">
              {registrationNumber}
            </p>
          </div>
          {majorChoiceCode && (
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Jurusan yang Dipilih:
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-800">
                {majorName}
                {majorChoiceCode && (
                  <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">
                    ({majorChoiceCode})
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
        <div className="text-left space-y-1.5 sm:space-y-2 md:space-y-3 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          {isTeacherMode ? (
            <>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                📧 Bukti pendaftaran telah dikirim ke email siswa/orang tua.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                📧 Bukti pendaftaran telah dikirim ke email Anda.
              </p>
            </>
          )}
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            📄 Simpan bukti pendaftaran untuk ditunjukkan saat daftar ulang.
          </p>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            🏫 Silakan datang ke SMK Tamtama Kroya untuk melanjutkan proses
            pendaftaran.
          </p>
        </div>
        <div className="w-full space-y-2 grid grid-cols-1 gap-3 sm:space-y-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <TextButton
            variant="primary"
            text="Kembali ke Beranda"
            className="w-full px-4 h-full sm:px-6 md:px-8 py-2 text-sm sm:text-sm md:text-base"
            onClick={onClose}
            hoverEffect={false}
          />
          {isTeacherMode ? null : (
            <TextButton
              className="text-primary h-full border-primary w-full py-2 text-sm sm:text-sm md:text-base"
              icon={
                <IoLocationOutline className="text-base sm:text-lg md:text-xl" />
              }
              variant={"outline"}
              width="full"
              text="Lihat Lokasi Sekolah"
              hoverEffect={false}
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/K7yiBoFCgicosfzv9",
                  "_blank",
                )
              }
            />
          )}
        </div>
      </div>
    </BaseModal>
  );
};

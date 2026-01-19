"use client";

import { SectionTitle } from "@/components/SectionTitle";
import { FaCheck } from "react-icons/fa6";

interface Requirement {
  id: number;
  text: string;
}

interface RegistrationPeriod {
  id: number;
  period: string;
  startMonth: string;
  endMonth: string;
  status: string;
  icon: string;
}

interface RegistrationRequirementsSectionProps {
  requirements: Requirement[];
  periods: RegistrationPeriod[];
}

export const RegistrationRequirementsSection: React.FC<
  RegistrationRequirementsSectionProps
> = ({ requirements, periods }) => {
  return (
    <section className="w-full mb-12 px-4 sm:px-12 lg:px-24 py-10 h-fit space-y-12">
      <SectionTitle
        title="Syarat & Periode Pendaftaran"
        subtitle="Perhatikan ketentuan menerima pendaftaran dan mendaftar sesuai jadwal yang telah ditentukan."
        align="center"
      />

      {/* Tabs Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Persyaratan Tab */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-4">
            <h3 className="text-xl font-bold text-white">Syarat Pendaftaran</h3>
          </div>
          <div className="p-8 space-y-6">
            {requirements.map((requirement) => (
              <div key={requirement.id} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <FaCheck className="text-green-600" size={14} />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {requirement.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Periode Pendaftaran Tab */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] px-6 py-4">
            <h3 className="text-xl font-bold text-white">
              Periode Pendaftaran
            </h3>
          </div>
          <div className="p-8 space-y-6">
            {periods.map((period) => (
              <div
                key={period.id}
                className="pb-6 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">
                    Gelombang {period.period}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{period.icon}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {period.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {period.startMonth} - {period.endMonth}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

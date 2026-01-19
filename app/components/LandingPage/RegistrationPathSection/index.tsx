"use client";

import { useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";

interface PathTabProps {
  id: string;
  label: string;
  image?: string;
  items: Array<{
    grade: string;
    description: string;
    icon: string;
  }>;
}

interface RegistrationPathSectionProps {
  tabs: PathTabProps[];
}

export const RegistrationPathSection: React.FC<
  RegistrationPathSectionProps
> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <section className="w-full mb-12 px-4 sm:px-12 lg:px-24 py-10 h-fit space-y-12">
      <SectionTitle
        title="Jalur Pendaftaran"
        subtitle="Tersedia beberapa jalur pendaftaran yang dapat disesuaikan dengan prestasi dan kemampuan calon peserta didik."
        align="center"
      />

      {/* Tabs Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-[#1B5E20] text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTabData && (
        <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
            {/* Image Section */}
            <div className="flex items-center justify-center">
              {activeTabData.image ? (
                <img
                  src={activeTabData.image}
                  alt={activeTabData.label}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Foto pendaftaran</span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {activeTabData.label}
              </h3>
              <div className="space-y-4">
                {activeTabData.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{item.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {item.grade}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

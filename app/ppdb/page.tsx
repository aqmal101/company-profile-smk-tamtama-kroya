"use client";

import { HeroSection } from "@/components/LandingPage/HeroSection";
import { RegistrationPath } from "@/components/LandingPage/RegistrationPath";
import { VacationTotal } from "@/components/LandingPage/VacationTotal";
import { WhyChooseUs } from "@/components/LandingPage/WhyChooseUs";

export default function PpdbPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Mengapa harus SMK Tamtama Kroya? */}
      <WhyChooseUs />

      {/* Jumlah Pendaftar per Jurusan */}
      <VacationTotal />

      {/* Registration Path*/}
      <RegistrationPath />
    </main>
  );
}

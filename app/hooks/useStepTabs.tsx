"use client";

import { useCallback } from "react";
import { RegistrationData } from "@/utils/registrationTypes";

export interface UseStepTabsOptions {
  freeNavigationFrom?: string; // tab name from which free navigation allowed when complete
  isComplete?: (data: RegistrationData) => boolean;
  showAlert?: (opts: {
    title: string;
    description?: string;
    variant?: string;
  }) => void;
}

export function useStepTabs(
  tabs: string[],
  activeTab: string,
  setActiveTab: (tab: string) => void,
  registrationData: RegistrationData,
  options?: UseStepTabsOptions,
) {
  const freeNavigationFrom = options?.freeNavigationFrom ?? "Selesai";

  const defaultIsComplete = (data: RegistrationData) =>
    Boolean(
      data.biodataSiswa &&
      data.biodataOrangTua &&
      data.biodataWali &&
      data.pilihJurusan,
    );

  const isComplete = options?.isComplete ?? defaultIsComplete;

  const handleTabChange = useCallback(
    (tab: string) => {
      const targetIndex = tabs.indexOf(tab);
      const currentIndex = tabs.indexOf(activeTab);

      const complete = isComplete(registrationData);

      // If user is on `freeNavigationFrom` and data is complete, allow free navigation
      if (activeTab === freeNavigationFrom && complete) {
        setActiveTab(tab);
        return;
      }

      // Back navigation always allowed
      if (targetIndex <= currentIndex) {
        setActiveTab(tab);
        return;
      }

      // Allow only next step (sequential) when data is incomplete
      if (!complete) {
        if (targetIndex === currentIndex + 1) {
          // Ensure previous steps exist before moving forward
          const requiredChecks: Array<boolean> = [];
          if (targetIndex >= 1)
            requiredChecks.push(Boolean(registrationData.biodataSiswa));
          if (targetIndex >= 2)
            requiredChecks.push(Boolean(registrationData.biodataOrangTua));
          if (targetIndex >= 3)
            requiredChecks.push(Boolean(registrationData.biodataWali));

          if (requiredChecks.every(Boolean)) {
            setActiveTab(tab);
          } else {
            options?.showAlert?.({
              title: "Langkah Belum Lengkap",
              description: "Lengkapi langkah sebelumnya sebelum melanjutkan.",
            });
          }
        } else {
          options?.showAlert?.({
            title: "Tidak Dapat Melompat Langkah",
            description: "Silakan selesaikan langkah secara bertahap.",
          });
        }
        return;
      }

      // If data complete (but not on freeNavigationFrom), allow moving forward/back freely
      setActiveTab(tab);
    },
    [
      tabs,
      activeTab,
      setActiveTab,
      registrationData,
      isComplete,
      freeNavigationFrom,
      options,
    ],
  );

  return { handleTabChange };
}

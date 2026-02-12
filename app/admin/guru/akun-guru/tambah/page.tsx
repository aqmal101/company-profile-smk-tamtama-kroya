"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextButton } from "@/components/Buttons/TextButton";
import { SectionCard } from "@/components/Card/SectionCard";
import { TitleSection } from "@/components/TitleSection";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { useAlert } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { getAuthHeader } from "@/utils/auth";
import { transformAdonisValidationErrors } from "@/utils/adonisErrorTranslator";

interface SchoolLesson {
  id: number;
  name: string;
  abbreviation: string;
}

export default function AdminAddTeacherAccountPage() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [schoolLessons, setSchoolLessons] = useState<SchoolLesson[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<number[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);

  const TeacherSchema = z.object({
    fullName: z.string().min(1, "Nama Lengkap harus diisi"),
    username: z.string().min(1, "Username harus diisi"),
    password: z.string().min(6, "Password minimal 6 karakter"),
  });

  const form = useForm<z.infer<typeof TeacherSchema>>({
    resolver: zodResolver(TeacherSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
    },
  });

  // Fetch school lessons
  const fetchSchoolLessons = useCallback(async () => {
    setIsLoadingLessons(true);
    try {
      const response = await fetch("/api/school-lessons", {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      if (!response.ok) throw new Error("Failed to fetch school lessons");

      const data = await response.json();
      setSchoolLessons(data);
    } catch (error) {
      console.error("Error fetching school lessons:", error);
      showAlert({
        title: "Gagal",
        description: "Gagal memuat daftar mata pelajaran",
        variant: "error",
      });
    } finally {
      setIsLoadingLessons(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchSchoolLessons();
  }, [fetchSchoolLessons]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch("/api/backoffice/teachers/photo", {
        method: "POST",
        body: formData,
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      const data = await response.json();
      return data.photoUrl;
    } catch (error) {
      console.error("Error uploading photo:", error);
      showAlert({
        title: "Gagal",
        description: "Gagal mengunggah foto",
        variant: "error",
      });
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof TeacherSchema>) => {
    if (selectedLessons.length === 0) {
      showAlert({
        title: "Validasi",
        description: "Pilih minimal satu mata pelajaran",
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      let photoUrl: string | null = null;

      // Upload photo if selected
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile);
        if (!photoUrl) {
          setIsLoading(false);
          return;
        }
      }

      // Create teacher account
      const response = await fetch("/api/backoffice/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          fullName: values.fullName,
          username: values.username,
          password: values.password,
          schoolLessonIds: selectedLessons,
          photoUrl: photoUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle validation errors from backend
        if (
          errorData.errors &&
          Array.isArray(errorData.errors) &&
          errorData.errors.length > 0
        ) {
          const translatedErrors = transformAdonisValidationErrors(
            errorData.errors,
          );
          showAlert({
            title: "Validasi Gagal",
            description:
              errorData.message || "Periksa kembali data yang dimasukkan",
            variant: "error",
            errors: translatedErrors,
            autoDismissMs: undefined, // Don't auto-dismiss for validation errors
          });
          setIsLoading(false);
          return;
        }

        throw new Error(errorData.message || "Gagal membuat akun guru");
      }

      showAlert({
        title: "Berhasil",
        description: "Akun guru berhasil dibuat",
        variant: "success",
      });
      router.push("/admin/guru/akun-guru");
    } catch (error) {
      console.error("Error creating teacher:", error);
      showAlert({
        title: "Gagal",
        description:
          error instanceof Error ? error.message : "Gagal membuat akun guru",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="h-full">
        <TitleSection
          title="Tambah Akun Guru"
          subtitle="Buat akun baru untuk guru agar dapat mengakses sistem sesuai mata pelajaran yang diampu."
        />
        <SectionCard title="Formulir Akun Guru" className="w-full bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-6">
              <div className="grid grid-cols-2 gap-x-5 max-sm:grid-cols-1 gap-y-5">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          {...field}
                          label="Nama Lengkap"
                          placeholder="Masukkan Nama Lengkap"
                          isMandatory
                          error={form.formState.errors.fullName?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          {...field}
                          label="Username"
                          placeholder="Masukkan Username"
                          isMandatory
                          error={form.formState.errors.username?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormInput
                          {...field}
                          label="Password"
                          type="password"
                          placeholder="Masukkan Password"
                          isMandatory
                          error={form.formState.errors.password?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* School Lessons - Multiple Select */}
                <div className="form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mata Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      multiple
                      value={selectedLessons.map(String)}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions).map(
                          (option) => Number(option.value),
                        );
                        setSelectedLessons(values);
                      }}
                      disabled={isLoadingLessons}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Pilih Mata Pelajaran</option>
                      {schoolLessons.map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>
                          {lesson.name} ({lesson.abbreviation})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Gunakan Ctrl+Click untuk memilih lebih dari satu mata
                      pelajaran
                    </p>
                  </div>
                  {selectedLessons.length === 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      Pilih minimal satu mata pelajaran
                    </p>
                  )}
                </div>

                {/* Photo Upload */}
                <div className="form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Profil
                  </label>
                  <div className="flex flex-col gap-4">
                    {photoPreview && (
                      <Image
                        src={photoPreview}
                        alt="Preview"
                        width={96}
                        height={96}
                        className="rounded-lg object-cover border border-gray-200"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={isLoading}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        disabled:file:bg-gray-100
                        disabled:file:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-4 mt-10 max-sm:flex-col">
                <Link href="/admin/guru/akun-guru">
                  <TextButton
                    variant="secondary"
                    text="Kembali"
                    className="px-8 py-2 w-full"
                    disabled={isLoading}
                  />
                </Link>
                <TextButton
                  variant="primary"
                  text="Buat Akun"
                  className="px-8 py-2 w-full"
                  isSubmit
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              </div>
            </form>
          </Form>
        </SectionCard>
      </div>
    </div>
  );
}

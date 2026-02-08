/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import DragDropFile from "@/components/Upload/DragDropFile";
import { TitleSection } from "@/components/TitleSection/index";
import { SectionCard } from "@/components/Card/SectionCard";
import { InputText, InputTextArea } from "@/components/InputForm/TextInput";
import Toggle from "@/components/ui/toggle";
import { TextButton } from "@/components/Buttons/TextButton";
import { useAlert } from "@/components/ui/alert";
import { getAuthHeader } from "@/utils/auth";
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";

export default function KontakMediaPage() {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [original, setOriginal] = useState<any>(null);
  const [form, setForm] = useState<any>(null);

  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/backoffice/school-settings`, {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        });
        if (!res.ok) throw new Error("Gagal memuat data");
        const data = await res.json();
        setOriginal(data);
        // normalize shape for form
        setForm({
          email: data.email || "",
          phone: data.phone || "",
          website: data.website || "",
          address: data.address || "",
          whatsappNumbers: (data.whatsappNumbers || []).map((w: any) => ({
            ...w,
            isActive: typeof w.isActive === "boolean" ? w.isActive : true,
          })),
          socialMedia: {
            tiktok: {
              ...(data.socialMedia?.tiktok || { url: "", isActive: false }),
            },
            youtube: {
              ...(data.socialMedia?.youtube || { url: "", isActive: false }),
            },
            facebook: {
              ...(data.socialMedia?.facebook || { url: "", isActive: false }),
            },
            instagram: Array.isArray(data.socialMedia?.instagram)
              ? data.socialMedia.instagram.map((i: any) => ({
                  ...(i || {}),
                  isActive: typeof i.isActive === "boolean" ? i.isActive : true,
                }))
              : [],
          },
          brochureFrontUrl: data.brochureFrontUrl || null,
          brochureBackUrl: data.brochureBackUrl || null,
        });
      } catch (err) {
        console.error(err);
        showAlert({
          title: "Gagal",
          description: "Gagal memuat data",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showAlert]);

  const resetToOriginal = () => {
    if (!original) return;
    setForm({
      email: original.email || "",
      phone: original.phone || "",
      website: original.website || "",
      address: original.address || "",
      whatsappNumbers: (original.whatsappNumbers || []).map((w: any) => ({
        ...w,
        isActive: typeof w.isActive === "boolean" ? w.isActive : true,
      })),
      socialMedia: {
        tiktok: {
          ...(original.socialMedia?.tiktok || { url: "", isActive: false }),
        },
        youtube: {
          ...(original.socialMedia?.youtube || { url: "", isActive: false }),
        },
        facebook: {
          ...(original.socialMedia?.facebook || { url: "", isActive: false }),
        },
        instagram: Array.isArray(original.socialMedia?.instagram)
          ? original.socialMedia.instagram.map((i: any) => ({
              ...(i || {}),
              isActive: typeof i.isActive === "boolean" ? i.isActive : true,
            }))
          : [],
      },
      brochureFrontUrl: original.brochureFrontUrl || null,
      brochureBackUrl: original.brochureBackUrl || null,
    });
    setFrontFile(null);
    setBackFile(null);
  };

  // Helpers
  const isValidEmail = (s: string) => /\S+@\S+\.\S+/.test(s);
  const isValidUrl = (s: string) => {
    try {
      if (!s) return true; // allow empty
      new URL(s);
      return true;
    } catch {
      return false;
    }
  };

  // Whatsapp helpers
  const addWhatsapp = () => {
    if (!form) return;
    if ((form.whatsappNumbers || []).length >= 5) {
      showAlert({
        title: "Batas",
        description: "Maksimal 5 nomor Whatsapp",
        variant: "error",
      });
      return;
    }
    setForm((prev: any) => ({
      ...prev,
      whatsappNumbers: [
        ...(prev.whatsappNumbers || []),
        { name: "", label: "", number: "", isActive: true },
      ],
    }));
  };

  const removeWhatsapp = (idx: number) => {
    setForm((prev: any) => ({
      ...prev,
      whatsappNumbers: (prev.whatsappNumbers || []).filter(
        (_: any, i: number) => i !== idx,
      ),
    }));
  };

  // Instagram helpers
  const addInstagram = () => {
    setForm((prev: any) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        instagram: [
          ...(prev.socialMedia.instagram || []),
          { url: "", isActive: false },
        ],
      },
    }));
  };
  const removeInstagram = (idx: number) => {
    setForm((prev: any) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        instagram: (prev.socialMedia.instagram || []).filter(
          (_: any, i: number) => i !== idx,
        ),
      },
    }));
  };

  const handleSave = async () => {
    if (!form) return;

    // Basic validation
    if (form.email && !isValidEmail(form.email)) {
      showAlert({
        title: "Gagal",
        description: "Format email tidak valid",
        variant: "error",
      });
      return;
    }
    if (form.website && !isValidUrl(form.website)) {
      showAlert({
        title: "Gagal",
        description: "Format website tidak valid",
        variant: "error",
      });
      return;
    }

    setSaving(true);

    try {
      let brochureRes: any = {};

      // If files selected, upload first
      if (frontFile || backFile) {
        const fd = new FormData();
        if (frontFile) fd.append("front", frontFile);
        if (backFile) fd.append("back", backFile);

        const uploadRes = await fetch(
          `/api/backoffice/school-settings/brochure`,
          {
            method: "POST",
            headers: {
              ...getAuthHeader(),
            },
            body: fd as any,
          },
        );
        if (!uploadRes.ok) throw new Error("Gagal mengunggah brosur");
        brochureRes = await uploadRes.json();
      }

      const payload = {
        email: form.email || null,
        phone: form.phone || null,
        website: form.website || null,
        address: form.address || null,
        whatsappNumbers: (form.whatsappNumbers || []).map((w: any) => ({
          name: w.name || "",
          label: w.label || "",
          number: String((w.number || "").replace(/\D/g, "")),
          isActive: !!w.isActive,
        })),
        socialMedia: {
          tiktok: {
            url: form.socialMedia.tiktok.url || null,
            isActive: !!form.socialMedia.tiktok.isActive,
          },
          youtube: {
            url: form.socialMedia.youtube.url || null,
            isActive: !!form.socialMedia.youtube.isActive,
          },
          facebook: {
            url: form.socialMedia.facebook.url || null,
            isActive: !!form.socialMedia.facebook.isActive,
          },
          instagram: (form.socialMedia.instagram || []).map((i: any) => ({
            url: i.url || null,
            isActive: !!i.isActive,
          })),
        },
        brochureFrontUrl:
          brochureRes.brochureFrontUrl ?? form.brochureFrontUrl ?? null,
        brochureBackUrl:
          brochureRes.brochureBackUrl ?? form.brochureBackUrl ?? null,
      };

      const res = await fetch(`/api/backoffice/school-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "Gagal menyimpan perubahan");
      }

      const saved = await res.json();
      setOriginal(saved);
      resetToOriginal();
      showAlert({
        title: "Berhasil",
        description: "Perubahan berhasil disimpan",
        variant: "success",
      });
    } catch (err: any) {
      console.error(err);
      showAlert({
        title: "Gagal",
        description: err?.message || "Gagal menyimpan perubahan",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="w-full min-h-[calc(100vh-4px)] bg-gray-100 p-4">
        <div className="h-full w-full bg-white rounded-md drop-shadow-sm p-6">
          <TitleSection title="Kontak & Media Sosial" subtitle="Memuat..." />
          <div className="py-6">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4px)] bg-gray-100 p-4">
      <div className="h-full w-full bg-white rounded-md drop-shadow-sm p-6">
        <TitleSection
          title="Kontak & Media Sosial"
          subtitle="Halaman untuk mengedit isian dari kontak & sosial media yang perlu ditambahkan di landing page"
        />
        <div className="w-full grid grid-cols-2 gap-6">
          <div className="w-full h-fit">
            {/* Kontak Resmi Sekolah */}
            <SectionCard
              title="Kontak Resmi Sekolah"
              className="w-full border border-gray-400"
            >
              <div className="w-full p-3">
                <div>
                  <InputText
                    name="phone"
                    label="Telephone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p: any) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <InputText
                    name="email"
                    label="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p: any) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <InputText
                    name="website"
                    label="Website"
                    value={form.website}
                    onChange={(e) =>
                      setForm((p: any) => ({ ...p, website: e.target.value }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <InputTextArea
                    placeholder="Alamat sekolah"
                    value={form.address}
                    onChange={(e) =>
                      setForm((p: any) => ({ ...p, address: e.target.value }))
                    }
                    label={"Alamat Lengkap"}
                    name={"address"}
                  />
                </div>
              </div>
            </SectionCard>
            {/* Unggah Brosur Promosi */}
            <SectionCard
              title="Unggah Brosur Promosi"
              className="mt-6 border border-gray-400"
            >
              <div className="grid grid-cols-1 gap-6 p-3">
                <div>
                  <label className="font-medium">Brosur Depan</label>
                  <div className="border rounded p-4 mt-2">
                    <DragDropFile
                      accept="application/pdf,image/*"
                      previewUrl={form.brochureFrontUrl}
                      initialFile={frontFile}
                      onFile={(file) => setFrontFile(file)}
                      onValidate={(file) => {
                        if (
                          !file.type.startsWith("image/") &&
                          file.type !== "application/pdf"
                        ) {
                          showAlert({
                            title: "Format tidak didukung",
                            description:
                              "Hanya file PDF atau gambar (PNG/JPG) yang diterima",
                            variant: "warning",
                          });
                          return "Format tidak didukung";
                        }

                        return null;
                      }}
                      onRemove={() => setFrontFile(null)}
                      label="Brosur Depan"
                      description="PDF / Image"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium">Brosur Belakang</label>
                  <div className="border rounded p-4 mt-2">
                    <DragDropFile
                      accept="application/pdf,image/*"
                      previewUrl={form.brochureBackUrl}
                      initialFile={backFile}
                      onFile={(file) => setBackFile(file)}
                      onRemove={() => setBackFile(null)}
                      label="Brosur Belakang"
                      description="PDF / Image"
                    />
                  </div>
                </div>
              </div>{" "}
            </SectionCard>
          </div>
          <div className="w-full h-fit">
            {/* Media Sosial Resmi */}
            <SectionCard title="Media Sosial Resmi" className="mt-0">
              <div className="grid grid-cols-1 gap-6 p-3">
                <div>
                  <label className="font-medium">Instagram :</label>
                  <div className="mt-2 space-y-2">
                    {(form.socialMedia.instagram || []).map(
                      (inst: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            className="flex-1 border rounded p-2"
                            value={inst.url || ""}
                            onChange={(e) =>
                              setForm((p: any) => ({
                                ...p,
                                socialMedia: {
                                  ...p.socialMedia,
                                  instagram: p.socialMedia.instagram.map(
                                    (it: any, i: number) =>
                                      i === idx
                                        ? { ...it, url: e.target.value }
                                        : it,
                                  ),
                                },
                              }))
                            }
                            disabled={!!inst.isActive}
                          />
                          <Toggle
                            enabled={!!inst.isActive}
                            onChange={(val) =>
                              setForm((p: any) => ({
                                ...p,
                                socialMedia: {
                                  ...p.socialMedia,
                                  instagram: p.socialMedia.instagram.map(
                                    (it: any, i: number) =>
                                      i === idx ? { ...it, isActive: val } : it,
                                  ),
                                },
                              }))
                            }
                          />
                          <TextButton
                            variant="icon"
                            icon={<LuTrash2 className="text-xl" />}
                            onClick={() => removeInstagram(idx)}
                            className="text-red-600"
                          />
                        </div>
                      ),
                    )}
                    <div>
                      <TextButton
                        variant="primary"
                        text="+ Tambah Akun"
                        onClick={addInstagram}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-4">
                    {/* TikTok */}
                    <div>
                      <label className="font-medium">TikTok :</label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          className="flex-1 border rounded p-2"
                          value={form.socialMedia.tiktok.url || ""}
                          onChange={(e) =>
                            setForm((p: any) => ({
                              ...p,
                              socialMedia: {
                                ...p.socialMedia,
                                tiktok: {
                                  ...p.socialMedia.tiktok,
                                  url: e.target.value,
                                },
                              },
                            }))
                          }
                          disabled={!!form.socialMedia.tiktok.isActive}
                        />
                        <Toggle
                          enabled={!!form.socialMedia.tiktok.isActive}
                          onChange={(val) =>
                            setForm((p: any) => ({
                              ...p,
                              socialMedia: {
                                ...p.socialMedia,
                                tiktok: {
                                  ...p.socialMedia.tiktok,
                                  isActive: val,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* YouTube */}
                    <div>
                      <label className="font-medium">YouTube :</label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          className="flex-1 border rounded p-2"
                          value={form.socialMedia.youtube.url || ""}
                          onChange={(e) =>
                            setForm((p: any) => ({
                              ...p,
                              socialMedia: {
                                ...p.socialMedia,
                                youtube: {
                                  ...p.socialMedia.youtube,
                                  url: e.target.value,
                                },
                              },
                            }))
                          }
                          disabled={!!form.socialMedia.youtube.isActive}
                        />
                        <Toggle
                          enabled={!!form.socialMedia.youtube.isActive}
                          onChange={(val) =>
                            setForm((p: any) => ({
                              ...p,
                              socialMedia: {
                                ...p.socialMedia,
                                youtube: {
                                  ...p.socialMedia.youtube,
                                  isActive: val,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Facebook */}
                    <div>
                      <label className="font-medium">Facebook :</label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          className="flex-1 border rounded p-2"
                          value={form.socialMedia.facebook.url || ""}
                          onChange={(e) =>
                            setForm((p: any) => ({
                              ...p,
                              socialMedia: {
                                ...p.socialMedia,
                                facebook: {
                                  ...p.socialMedia.facebook,
                                  url: e.target.value,
                                },
                              },
                            }))
                          }
                          disabled={!!form.socialMedia.facebook.isActive}
                        />
                        <Toggle
                          enabled={!!form.socialMedia.facebook.isActive}
                          onChange={(val) =>
                            setForm((p: any) => ({
                              ...p,
                              socialMedia: {
                                ...p.socialMedia,
                                facebook: {
                                  ...p.socialMedia.facebook,
                                  isActive: val,
                                },
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Whatsapp list */}
                    <div>
                      <label className="font-medium">
                        Whatsapp (Narahubung) :
                      </label>
                      <div className="mt-2 space-y-2">
                        {(form.whatsappNumbers || []).map(
                          (w: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                placeholder="Label (contoh: Admin 1)"
                                className="w-40 border rounded p-2"
                                value={w.label || ""}
                                onChange={(e) =>
                                  setForm((p: any) => ({
                                    ...p,
                                    whatsappNumbers: p.whatsappNumbers.map(
                                      (it: any, i: number) =>
                                        i === idx
                                          ? { ...it, label: e.target.value }
                                          : it,
                                    ),
                                  }))
                                }
                              />
                              <input
                                placeholder="Nomor Whatsapp"
                                className="flex-1 border rounded p-2"
                                value={w.number || ""}
                                onChange={(e) =>
                                  setForm((p: any) => ({
                                    ...p,
                                    whatsappNumbers: p.whatsappNumbers.map(
                                      (it: any, i: number) =>
                                        i === idx
                                          ? { ...it, number: e.target.value }
                                          : it,
                                    ),
                                  }))
                                }
                                disabled={!!w.isActive}
                              />
                              <Toggle
                                enabled={!!w.isActive}
                                onChange={(val) =>
                                  setForm((p: any) => ({
                                    ...p,
                                    whatsappNumbers: p.whatsappNumbers.map(
                                      (it: any, i: number) =>
                                        i === idx
                                          ? { ...it, isActive: val }
                                          : it,
                                    ),
                                  }))
                                }
                              />
                              <TextButton
                                onClick={() => removeWhatsapp(idx)}
                                variant="icon"
                                icon={<LuTrash2 className="text-xl" />}
                                className="text-red-600"
                              >
                                Hapus
                              </TextButton>
                            </div>
                          ),
                        )}
                        <div>
                          <TextButton
                            variant="primary"
                            text="+ Tambah Nomor"
                            onClick={addWhatsapp}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

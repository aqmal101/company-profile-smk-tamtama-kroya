
export const NavItems = [
  { label: "Beranda", href: "/" },
  {
    label: "Tentang Sekolah",
    href: "/tentang-sekolah",
    children: [
      { label: "Kegiatan Sekolah", href: "/tentang-sekolah/kegiatan" },
      { label: "Fasilitas", href: "/tentang-sekolah/fasilitas" },
      { label: "Prestasi", href: "/tentang-sekolah/prestasi" },
      { label: "Profil Alumni", href: "/tentang-sekolah/alumni" },
    ],
  },
  {
    label: "Program Keahlian",
    href: "/program-keahlian",
   
  },
  { label: "PPDB", href: "/ppdb",
    children: [
      { label: "Jadwal & Alur Pendaftaran ", href: "/#syarat-periode-daftar" },
      { label: "Jalur Pendaftaran", href: "/#jalur-pendaftaran" },
      { label: "Syarat Pendaftaran", href: "/#syarat-periode-daftar" },
      { label: "Statistik Pendaftar", href: "/#jumlah-peminat" },
    ] },
  { label: "Informasi", href: "/informasi", children: [
      { label: "Lokasi Sekolah", href: "/#lokasi-sekolah" },
      { label: "Kontak", href: "/#kontak-sosial-media" },
  ] },
];

export const navFooterSection = 
[ { label: "Beranda", href: "/#" },  { label: "Mengapa Tamtama", href: "/#mengapa-pilih-tamtama" },{ label: "Minat Pendaftar", href: "/#jumlah-peminat" },  { label: "Jalur Pendaftaran", href: "/#jalur-pendaftaran" },  { label: "Syarat & Periode Pendaftaran", href: "/#syarat-periode-daftar" },  { label: "Fasilitas Sekolah", href: "/#fasilitas-sekolah" },{ label: "Lokasi Sekolah", href: "/#lokasi-sekolah" },  { label: "Sosial Media", href: "/#kontak-sosial-media" },  { label: "Info Brosur", href: "/#info-brosur" }
 
];


export const navFooterPage = [ { label: "Kegiatan Sekolah", href: "/tentang-sekolah/kegiatan" },  { label: "Fasilitas", href: "/tentang-sekolah/fasilitas" },{ label: "Profil Alumni", href: "/tentang-sekolah/alumni" },  { label: "Program Keahlian", href: "/program-keahlian" },  ];
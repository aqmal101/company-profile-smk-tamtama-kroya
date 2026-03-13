import { IconType } from "react-icons";
import { BsLightningCharge } from "react-icons/bs";
import { FaComputer, FaGears, FaMotorcycle, FaSeedling } from "react-icons/fa6";
import {
  FiActivity,
  FiBriefcase,
  FiClipboard,
  FiCode,
  FiMonitor,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { LiaCarSideSolid } from "react-icons/lia";
import {
  MdOutlineArchitecture,
  MdOutlineColorLens,
  MdOutlineScience,
} from "react-icons/md";
import { PiChefHat } from "react-icons/pi";

export type MajorLookupInput =
  | string
  | {
      name?: string | null;
      abbreviation?: string | null;
      code?: string | null;
    };

export type MajorMetadata = {
  code: string;
  name: string;
  color: string;
  Icon: IconType;
  aliases?: string[];
};

const FALLBACK_MAJOR_COLORS = [
  "#0EA5E9",
  "#F97316",
  "#14B8A6",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#22C55E",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
  "#3B82F6",
  "#F43F5E",
];

const MAJOR_STOP_WORDS = new Set([
  "DAN",
  "DI",
  "KE",
  "DENGAN",
  "PROGRAM",
  "KOMPETENSI",
  "KEAHLIAN",
]);

export const INDONESIAN_MAJOR_CATALOG: MajorMetadata[] = [
  {
    code: "TKR",
    name: "Teknik Kendaraan Ringan",
    color: "#E95B5B",
    Icon: LiaCarSideSolid,
    aliases: ["TKRO", "TEKNIK KENDARAAN RINGAN OTOMOTIF", "OTOMOTIF"],
  },
  {
    code: "TBSM",
    name: "Teknik dan Bisnis Sepeda Motor",
    color: "#F97316",
    Icon: FaMotorcycle,
    aliases: ["TSM", "TEKNIK SEPEDA MOTOR"],
  },
  {
    code: "TP",
    name: "Teknik Permesinan",
    color: "#3B82F6",
    Icon: FaGears,
    aliases: ["MESIN", "TEKNIK PEMESINAN", "TEKNIK MESIN"],
  },
  {
    code: "TITL",
    name: "Teknik Instalasi Tenaga Listrik",
    color: "#7C3AED",
    Icon: BsLightningCharge,
    aliases: ["TEKNIK LISTRIK", "INSTALASI TENAGA LISTRIK"],
  },
  {
    code: "TOI",
    name: "Teknik Otomasi Industri",
    color: "#9333EA",
    Icon: BsLightningCharge,
  },
  {
    code: "TAV",
    name: "Teknik Audio Video",
    color: "#2563EB",
    Icon: FiMonitor,
  },
  {
    code: "TKJ",
    name: "Teknik Komputer dan Jaringan",
    color: "#0EA5E9",
    Icon: FaComputer,
    aliases: ["TEKNIK KOMPUTER JARINGAN"],
  },
  {
    code: "TJKT",
    name: "Teknik Jaringan Komputer dan Telekomunikasi",
    color: "#0284C7",
    Icon: FaComputer,
    aliases: ["TEKNIK TELEKOMUNIKASI"],
  },
  {
    code: "RPL",
    name: "Rekayasa Perangkat Lunak",
    color: "#14B8A6",
    Icon: FiCode,
  },
  {
    code: "SIJA",
    name: "Sistem Informatika, Jaringan, dan Aplikasi",
    color: "#0F766E",
    Icon: FiCode,
    aliases: ["SISTEM INFORMATIKA JARINGAN DAN APLIKASI"],
  },
  {
    code: "DKV",
    name: "Desain Komunikasi Visual",
    color: "#EC4899",
    Icon: MdOutlineColorLens,
  },
  {
    code: "MM",
    name: "Multimedia",
    color: "#6366F1",
    Icon: FiMonitor,
  },
  {
    code: "ANIMASI",
    name: "Animasi",
    color: "#F43F5E",
    Icon: MdOutlineColorLens,
    aliases: ["ANM"],
  },
  {
    code: "AKL",
    name: "Akuntansi dan Keuangan Lembaga",
    color: "#22C55E",
    Icon: FiActivity,
    aliases: ["AKUNTANSI"],
  },
  {
    code: "OTKP",
    name: "Otomatisasi dan Tata Kelola Perkantoran",
    color: "#F59E0B",
    Icon: FiClipboard,
    aliases: ["ADMINISTRASI PERKANTORAN"],
  },
  {
    code: "MPLB",
    name: "Manajemen Perkantoran dan Layanan Bisnis",
    color: "#D97706",
    Icon: FiBriefcase,
  },
  {
    code: "BDP",
    name: "Bisnis Daring dan Pemasaran",
    color: "#06B6D4",
    Icon: FiShoppingBag,
    aliases: ["PEMASARAN"],
  },
  {
    code: "TB",
    name: "Tata Boga",
    color: "#EF4444",
    Icon: PiChefHat,
    aliases: ["KULINER"],
  },
  {
    code: "PH",
    name: "Perhotelan",
    color: "#8B5CF6",
    Icon: FiBriefcase,
    aliases: ["HOSPITALITY"],
  },
  {
    code: "KEP",
    name: "Keperawatan",
    color: "#10B981",
    Icon: FiActivity,
  },
  {
    code: "FAR",
    name: "Farmasi",
    color: "#84CC16",
    Icon: FiActivity,
    aliases: ["FARMASI KLINIS", "ASISTEN FARMASI"],
  },
  {
    code: "DPIB",
    name: "Desain Pemodelan dan Informasi Bangunan",
    color: "#C2410C",
    Icon: MdOutlineArchitecture,
  },
  {
    code: "BKP",
    name: "Bisnis Konstruksi dan Properti",
    color: "#B45309",
    Icon: MdOutlineArchitecture,
    aliases: ["KONSTRUKSI DAN PROPERTI"],
  },
  {
    code: "ATPH",
    name: "Agribisnis Tanaman Pangan dan Hortikultura",
    color: "#65A30D",
    Icon: FaSeedling,
    aliases: ["PERTANIAN"],
  },
  {
    code: "APHP",
    name: "Agribisnis Pengolahan Hasil Pertanian",
    color: "#15803D",
    Icon: FaSeedling,
  },
  {
    code: "IPA",
    name: "Ilmu Pengetahuan Alam",
    color: "#2563EB",
    Icon: MdOutlineScience,
  },
  {
    code: "IPS",
    name: "Ilmu Pengetahuan Sosial",
    color: "#64748B",
    Icon: FiUsers,
  },
  {
    code: "BAHASA",
    name: "Bahasa dan Budaya",
    color: "#A855F7",
    Icon: FiUsers,
    aliases: ["SASTRA"],
  },
];

const normalizeMajorText = (value: string): string =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/&/g, " DAN ")
    .replace(/[.,/()_-]+/g, " ")
    .replace(/\s+/g, " ");

const hashString = (value: string): number => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const createMajorAbbreviation = (value: string): string => {
  const tokens = normalizeMajorText(value)
    .split(" ")
    .filter(Boolean)
    .filter((token) => !MAJOR_STOP_WORDS.has(token));

  if (!tokens.length) {
    return "";
  }

  return tokens
    .map((token) => token[0])
    .join("")
    .slice(0, 6);
};

const getFallbackColor = (value: string, fallbackIndex: number): string => {
  const normalizedValue = normalizeMajorText(value);

  if (!normalizedValue) {
    return FALLBACK_MAJOR_COLORS[
      fallbackIndex % FALLBACK_MAJOR_COLORS.length
    ];
  }

  const hashedIndex = hashString(normalizedValue) % FALLBACK_MAJOR_COLORS.length;
  return FALLBACK_MAJOR_COLORS[hashedIndex];
};

const majorMetadataByKey = new Map<string, MajorMetadata>();

INDONESIAN_MAJOR_CATALOG.forEach((major) => {
  [major.code, major.name, ...(major.aliases || [])].forEach((key) => {
    const normalizedKey = normalizeMajorText(key);

    if (normalizedKey) {
      majorMetadataByKey.set(normalizedKey, major);
    }
  });
});

const getCandidateKeys = (input: MajorLookupInput): string[] => {
  if (typeof input === "string") {
    const normalizedInput = normalizeMajorText(input);
    const derivedAbbreviation = createMajorAbbreviation(input);

    return [normalizedInput, derivedAbbreviation].filter(Boolean);
  }

  const rawCode = input.abbreviation || input.code || "";
  const rawName = input.name || "";

  return [
    normalizeMajorText(rawCode),
    normalizeMajorText(rawName),
    createMajorAbbreviation(rawName),
  ].filter(Boolean);
};

export const getMajorMetadata = (
  input: MajorLookupInput,
  fallbackIndex: number = 0,
): MajorMetadata => {
  const candidateKeys = getCandidateKeys(input);

  for (const candidateKey of candidateKeys) {
    const matchedMajor = majorMetadataByKey.get(candidateKey);

    if (matchedMajor) {
      return matchedMajor;
    }
  }

  const rawName = typeof input === "string" ? input : input.name || "";
  const rawCode =
    typeof input === "string"
      ? createMajorAbbreviation(input)
      : input.abbreviation || input.code || createMajorAbbreviation(rawName);
  const safeCode = normalizeMajorText(rawCode) || "JURUSAN";
  const safeName = String(rawName || safeCode).trim() || safeCode;

  return {
    code: safeCode,
    name: safeName,
    color: getFallbackColor(candidateKeys[0] || safeCode, fallbackIndex),
    Icon: FiUsers,
  };
};

export const formatMajorLabel = (
  input: MajorLookupInput,
  fallbackIndex: number = 0,
): string => {
  const major = getMajorMetadata(input, fallbackIndex);

  if (normalizeMajorText(major.name) === normalizeMajorText(major.code)) {
    return major.code;
  }

  return `${major.name} (${major.code})`;
};

export const getMajorOptions = () =>
  INDONESIAN_MAJOR_CATALOG.map((major, index) => ({
    value: major.code,
    label: formatMajorLabel(major, index),
  }));

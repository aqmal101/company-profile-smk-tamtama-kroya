interface MajorItem {
  id: number;
  name: string;
  abbreviation: string;
  summary: string;
  graduateProspects: string[];
  capacity: number;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface MajorGallery {
  id: number;
  photoUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface MajorIndustryPartner {
  id: number;
  cover: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface MajorDetail extends MajorItem {
  slug: string;
  summary: string;
  description: string;
  mainCompetencies: string[];
  certifications: string[];
  vocationalSubjects: string[];
  studyDurationYears: number;
  galleryDescription: string;
  industryPartnerDescription: string;
  galleries: MajorGallery[];
  industryPartners: MajorIndustryPartner[];
}

interface MajorApiResponse {
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
  };
  data: MajorItem[];
}

export {
  type MajorItem,
  type MajorApiResponse,
  type MajorDetail,
  type MajorGallery,
  type MajorIndustryPartner,
};

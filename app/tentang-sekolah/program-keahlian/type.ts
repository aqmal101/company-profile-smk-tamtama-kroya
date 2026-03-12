export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface MajorListItem {
  name: string;
  slug: string;
  summary: string;
  abbreviation: string;
  photoUrl: string;
}

export interface MajorsListResponse {
  meta: PaginationMeta;
  items: MajorListItem[];
}

export interface GalleryItem {
  id: number;
  photoUrl: string;
  order: number;
}

export interface IndustryPartner {
  id: number;
  cover: string;
  name: string;
  description: string;
}

export interface MajorDetail {
  id: number;
  name: string;
  slug: string;
  summary: string;
  abbreviation: string;
  description: string;
  graduateProspects: string[];
  mainCompetencies: string[];
  certifications: string[];
  vocationalSubjects: string[];
  capacity: number;
  studyDurationYears: number;
  photoUrl: string;
  galleryDescription: string;
  industryPartnerDescription: string;
  galleries: GalleryItem[];
  industryPartners: IndustryPartner[];
}

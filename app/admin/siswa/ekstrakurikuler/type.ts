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

export interface ExtracurricularGallery {
  id: number;
  photoUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExtracurricularAchievement {
  id: number;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExtracurricularItem {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string;
  categories: string[];
  mentorName: string;
  description: string;
  schedule: string;
  location: string;
  isPublished: boolean;
  galleries: ExtracurricularGallery[];
  achievements: ExtracurricularAchievement[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ExtracurricularListResponse {
  meta: PaginationMeta;
  items: ExtracurricularItem[];
}

export interface ExtracurricularFormValues {
  name: string;
  slug: string;
  categories: string[];
  mentorName: string;
  schedule: string;
  location: string;
  description: string;
  thumbnailUrl: string;
  isPublished: boolean;
}

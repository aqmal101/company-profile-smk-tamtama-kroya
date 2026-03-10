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

export interface SchoolAchievementCategoryOption {
  id: number;
  name: string;
}

export interface SchoolAchievementListItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverPhotoUrl: string;
  galleryDescription?: string;
  competitionLevel: string;
  category: string;
  competitionDate: string;
  placeName?: string;
  organizerName?: string;
}

export interface SchoolAchievementListResponse {
  meta: PaginationMeta;
  data: SchoolAchievementListItem[];
}

export interface SchoolAchievementGalleryItem {
  id: number;
  photoUrl: string;
  order: number;
  schoolAchievementId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolAchievementAwardItem {
  id: number;
  name: string;
  order: number;
  schoolAchievementId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolAchievementDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  galleryDescription: string;
  competitionLevel: string;
  placeName: string;
  organizerName: string;
  competitionDate: string;
  category: string;
  participantName: string;
  coverPhotoUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  galleries: SchoolAchievementGalleryItem[];
  awards: SchoolAchievementAwardItem[];
}
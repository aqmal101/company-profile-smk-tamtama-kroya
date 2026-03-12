interface MajorItem {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  graduateProspects: string[];
  capacity: number;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
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

export { type MajorItem, type MajorApiResponse };

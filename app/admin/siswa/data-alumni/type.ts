interface AlumniItem {
  id: number;
  name: string;
  generationYear: number;
  photoUrl: string;
  major: string;
  currentJob: string;
  isPublished?: boolean;
}

interface AlumniApiResponse {
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
  data: AlumniItem[];
}


export type { AlumniItem, AlumniApiResponse };
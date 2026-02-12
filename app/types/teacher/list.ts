export interface Teacher {
  id: number;   
  fullName: string;
  userName: string;
  photoUrl: string | null;
  deletedAt: string | null;
  schoolLesson: Array<{
    id: number;
    name: string;
    abbreviation: string;
  }>;
}
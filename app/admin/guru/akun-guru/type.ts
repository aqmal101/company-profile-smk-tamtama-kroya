export interface TeacherDetail {
  id: number;
  fullName: string;
  username: string;
  role: string;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
  schoolLessons: Array<{
    id: number;
    name: string;
    abbreviation: string;
    createdAt: string;
    updatedAt: string;
  }>;
}


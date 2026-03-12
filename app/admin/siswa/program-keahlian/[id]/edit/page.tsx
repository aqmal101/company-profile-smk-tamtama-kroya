"use client";

import MajorFormPage from "../../MajorFormPage";
import { useParams } from "next/navigation";

export default function EditMajorPage() {
  const params = useParams();
  const id = Number(params?.id);

  return <MajorFormPage mode="edit" id={id} />;
}

"use client";

import ExtracurricularFormPage from "../../ExtracurricularFormPage";
import { resolveSlug } from "@/utils/resolveSlug";
import { useParams } from "next/navigation";

export default function EditExtracurricularPage() {
  const params = useParams();
  const slug = resolveSlug(params?.slug);

  return <ExtracurricularFormPage mode="edit" slug={slug} />;
}

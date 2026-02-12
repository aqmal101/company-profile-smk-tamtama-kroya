import { Teacher } from "@/types/teacher/list";

export function transformTeacherData(items: unknown): Teacher[] {
  let list: Array<Record<string, unknown>> = [];

  if (Array.isArray(items)) {
    list = items as Array<Record<string, unknown>>;
  } else if (items && typeof items === "object") {
    const obj = items as Record<string, unknown>;
    if (Array.isArray(obj.data)) list = obj.data as Array<Record<string, unknown>>;
    else if (Array.isArray(obj.rows)) list = obj.rows as Array<Record<string, unknown>>;
    else list = [obj];
  } else {
    console.log("No valid array found in input");
    return [];
  }

  const result = list.map((item) => {
    const id =
      typeof item["id"] === "number"
        ? (item["id"] as number)
        : parseInt(String(item["id"] ?? "0"), 10);
    const rawLessons =
      (item["schoolLessons"] ?? item["schoolLesson"]) as unknown;
    const schoolLesson = Array.isArray(rawLessons)
      ? rawLessons.map((lesson) => {
          const entry = lesson as Record<string, unknown>;
          return {
            id:
              typeof entry["id"] === "number"
                ? (entry["id"] as number)
                : parseInt(String(entry["id"] ?? "0"), 10),
            name: String(entry["name"] ?? ""),
            abbreviation:
              entry["abbreviation"] !== null && entry["abbreviation"] !== undefined
                ? String(entry["abbreviation"])
                : "",
          };
        })
      : [];

    return {
      id: Number.isNaN(id) ? 0 : id,
      fullName: String(item["fullName"] ?? item["name"] ?? ""),
      userName: String(item["userName"] ?? item["username"] ?? ""),
      photoUrl: (item["photoUrl"] as string | null) ?? null,
      deletedAt: (item["deletedAt"] as string | null) ?? null,
      schoolLesson,
    };
  });
  return result;
}

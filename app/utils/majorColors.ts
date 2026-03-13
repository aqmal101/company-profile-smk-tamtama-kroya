import { getMajorMetadata } from "./majorMetadata";

export const getMajorColor = (
  majorName: string,
  fallbackIndex: number = 0,
): string => getMajorMetadata(majorName, fallbackIndex).color;

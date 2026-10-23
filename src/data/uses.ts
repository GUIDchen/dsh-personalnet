import data from "./uses.zh.json";

export interface UseGroup {
  title: string;
  items: { name: string; note?: string }[];
}

export const USES: UseGroup[] = data.groups;

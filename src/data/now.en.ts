import data from "./now.en.json";
import type { NowSection } from "./now";

export const NOW_EN = data satisfies { updated: string; intro: string; sections: NowSection[] };

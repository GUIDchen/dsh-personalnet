import data from "./about.zh.json";

export interface AboutPrinciple {
  title: string;
  body: string;
}

export interface AboutStory {
  story: string[];
  principles: AboutPrinciple[];
  focus: string[];
}

export const ABOUT: AboutStory = data;

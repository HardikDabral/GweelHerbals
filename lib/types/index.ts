export type TalentCategory = "Dancer" | "Musician" | "Magician" | "Other";

export interface Artist {
  id: string;
  name: string;
  category: TalentCategory;
  bio: string;
  imageUrl?: string;
  modelUrl?: string;
  tags: string[];
  featured?: boolean;
}

export interface Class {
  id: string;
  title: string;
  description: string;
  instructor: string;
  schedule: string;
  duration: string;
  imageUrl?: string;
  modelUrl?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  imageUrl?: string;
}

export interface ApplicationForm {
  name: string;
  email: string;
  talentType: TalentCategory;
  bio: string;
  videoUrl?: string;
  portfolioUrl?: string;
}


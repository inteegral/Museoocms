// Shared domain types — import from here, don't redefine locally.

export type ProductionPhase = "scripting" | "translating" | "voicing" | "review";

export interface GuidePOI {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
  orderIndex: number;
  status?: "draft" | "in-progress" | "under-revision" | "complete";
}


export type POIStatus = "idea" | "draft" | "in-progress" | "under-revision" | "complete";

export interface POI {
  id: string;
  title: string;
  description: string;
  status: POIStatus;
  category: string;
  imageUrl?: string;
  audioScript?: string;
  scriptValidated?: boolean;
  translations?: string[];
  voices?: string[];
  updatedAt: string;
  isGeolocated?: boolean;
  assignedToGuides?: string[];
  assignee?: string;
  assigneeNote?: string;
}

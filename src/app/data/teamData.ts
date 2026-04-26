export type Role = "owner" | "admin" | "curator" | "viewer";
export type MemberStatus = "active" | "pending";

export interface GuideAssignment {
  id: string;
  title: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  joinedAt: string;
  bio: string;
  assignments: GuideAssignment[];
}

export const CURRENT_USER_ID = "m2";

export const teamMembers: TeamMember[] = [
  {
    id: "m1",
    name: "Marco Rossi",
    email: "marco.rossi@museum.it",
    role: "owner",
    status: "active",
    joinedAt: "Jan 2024",
    bio: "Museum director with 20 years of experience in heritage management and cultural programming.",
    assignments: [],
  },
  {
    id: "m2",
    name: "Anna Ferretti",
    email: "anna.ferretti@museum.it",
    role: "admin",
    status: "active",
    joinedAt: "Mar 2024",
    bio: "Content strategist focused on making art accessible to diverse audiences through storytelling.",
    assignments: [],
  },
  {
    id: "m3",
    name: "Luca Bianchi",
    email: "luca.bianchi@museum.it",
    role: "curator",
    status: "active",
    joinedAt: "Apr 2024",
    bio: "Art historian specialising in Renaissance painting. PhD from La Sapienza, Rome.",
    assignments: [
      { id: "guide-1", title: "Complete Museum Tour" },
      { id: "guide-2", title: "Highlights - Must-See Masterpieces" },
    ],
  },
  {
    id: "m4",
    name: "Sofia Chen",
    email: "sofia.chen@museum.it",
    role: "curator",
    status: "active",
    joinedAt: "Jun 2024",
    bio: "Egyptologist and education specialist. Former researcher at the British Museum.",
    assignments: [
      { id: "guide-3", title: "Family Tour" },
    ],
  },
  {
    id: "m5",
    name: "Thomas Weber",
    email: "thomas.weber@museum.it",
    role: "viewer",
    status: "active",
    joinedAt: "Sep 2024",
    bio: "",
    assignments: [],
  },
  {
    id: "m6",
    name: "",
    email: "giulia.moretti@partner.it",
    role: "curator",
    status: "pending",
    joinedAt: "",
    bio: "",
    assignments: [],
  },
];

export function getMemberByGuideId(guideId: string): TeamMember | undefined {
  return teamMembers.find((m) => m.assignments.some((a) => a.id === guideId));
}

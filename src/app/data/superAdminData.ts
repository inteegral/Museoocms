export type TenantPlan = "trial" | "starter" | "pro" | "enterprise";
export type TenantStatus = "active" | "suspended" | "trial";

export interface TenantGuide {
  id: string;
  title: string;
  status: "published" | "draft";
  languages: string[];
  pois: number;
}

export interface TenantMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "curator" | "viewer";
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  city: string;
  country: string;
  plan: TenantPlan;
  status: TenantStatus;
  mrr: number; // EUR
  guidesCount: number;
  membersCount: number;
  visitorsLastMonth: number;
  createdAt: string;
  lastActiveAt: string;
  guides: TenantGuide[];
  members: TenantMember[];
  notes: string;
}

export const tenants: Tenant[] = [
  {
    id: "t1",
    name: "Museo Nazionale di Roma",
    slug: "museo-nazionale-roma",
    city: "Rome",
    country: "Italy",
    plan: "pro",
    status: "active",
    mrr: 290,
    guidesCount: 3,
    membersCount: 5,
    visitorsLastMonth: 320,
    createdAt: "Jan 2024",
    lastActiveAt: "2 hours ago",
    notes: "",
    guides: [
      { id: "g1", title: "Complete Museum Tour", status: "published", languages: ["it", "en"], pois: 8 },
      { id: "g2", title: "Highlights - Must-See Masterpieces", status: "draft", languages: ["it"], pois: 5 },
      { id: "g3", title: "Family Tour", status: "draft", languages: ["it"], pois: 6 },
    ],
    members: [
      { id: "m1", name: "Marco Rossi", email: "marco.rossi@museum.it", role: "owner" },
      { id: "m2", name: "Anna Ferretti", email: "anna.ferretti@museum.it", role: "admin" },
      { id: "m3", name: "Luca Bianchi", email: "luca.bianchi@museum.it", role: "curator" },
      { id: "m4", name: "Sofia Chen", email: "sofia.chen@museum.it", role: "curator" },
      { id: "m5", name: "Thomas Weber", email: "thomas.weber@museum.it", role: "viewer" },
    ],
  },
  {
    id: "t2",
    name: "Galleria degli Uffizi",
    slug: "uffizi",
    city: "Florence",
    country: "Italy",
    plan: "enterprise",
    status: "active",
    mrr: 890,
    guidesCount: 8,
    membersCount: 12,
    visitorsLastMonth: 2140,
    createdAt: "Oct 2023",
    lastActiveAt: "1 hour ago",
    notes: "Annual contract, renewal in October.",
    guides: [
      { id: "u1", title: "Botticelli & the Renaissance", status: "published", languages: ["it", "en", "de", "fr"], pois: 12 },
      { id: "u2", title: "Raphael Room", status: "published", languages: ["it", "en"], pois: 6 },
      { id: "u3", title: "Leonardo Collection", status: "published", languages: ["it", "en", "zh"], pois: 8 },
      { id: "u4", title: "Self-Portraits Gallery", status: "published", languages: ["it", "en"], pois: 10 },
      { id: "u5", title: "Sculpture & Antiquities", status: "draft", languages: ["it"], pois: 4 },
    ],
    members: [
      { id: "u_m1", name: "Giulia Rossi", email: "g.rossi@uffizi.it", role: "owner" },
      { id: "u_m2", name: "Pietro Danti", email: "p.danti@uffizi.it", role: "admin" },
      { id: "u_m3", name: "Clara Vinci", email: "c.vinci@uffizi.it", role: "curator" },
    ],
  },
  {
    id: "t3",
    name: "MAXXI Roma",
    slug: "maxxi",
    city: "Rome",
    country: "Italy",
    plan: "starter",
    status: "active",
    mrr: 90,
    guidesCount: 1,
    membersCount: 2,
    visitorsLastMonth: 87,
    createdAt: "Mar 2024",
    lastActiveAt: "3 days ago",
    notes: "",
    guides: [
      { id: "mx1", title: "Contemporary Highlights", status: "published", languages: ["it", "en"], pois: 5 },
    ],
    members: [
      { id: "mx_m1", name: "Fabio Neri", email: "f.neri@maxxi.it", role: "owner" },
      { id: "mx_m2", name: "Valentina Serra", email: "v.serra@maxxi.it", role: "curator" },
    ],
  },
  {
    id: "t4",
    name: "Museo Egizio Torino",
    slug: "egizio-torino",
    city: "Turin",
    country: "Italy",
    plan: "pro",
    status: "active",
    mrr: 290,
    guidesCount: 4,
    membersCount: 6,
    visitorsLastMonth: 540,
    createdAt: "Dec 2023",
    lastActiveAt: "Yesterday",
    notes: "",
    guides: [
      { id: "eg1", title: "Ancient Egypt Collection", status: "published", languages: ["it", "en", "ar"], pois: 14 },
      { id: "eg2", title: "Mummies & Funerary Rites", status: "published", languages: ["it", "en"], pois: 8 },
      { id: "eg3", title: "Children's Egypt", status: "draft", languages: ["it"], pois: 5 },
      { id: "eg4", title: "Papyrus & Writing", status: "draft", languages: ["it"], pois: 4 },
    ],
    members: [
      { id: "eg_m1", name: "Carla Morra", email: "c.morra@museoegizio.it", role: "owner" },
      { id: "eg_m2", name: "Ahmed Hassan", email: "a.hassan@museoegizio.it", role: "curator" },
    ],
  },
  {
    id: "t5",
    name: "Pinacoteca di Brera",
    slug: "brera",
    city: "Milan",
    country: "Italy",
    plan: "trial",
    status: "trial",
    mrr: 0,
    guidesCount: 0,
    membersCount: 1,
    visitorsLastMonth: 0,
    createdAt: "Apr 2026",
    lastActiveAt: "5 days ago",
    notes: "Trial expires 2026-05-10. Follow up for upgrade.",
    guides: [],
    members: [
      { id: "br_m1", name: "Simone Conti", email: "s.conti@brera.it", role: "owner" },
    ],
  },
  {
    id: "t6",
    name: "Palazzo Ducale Venezia",
    slug: "palazzo-ducale",
    city: "Venice",
    country: "Italy",
    plan: "enterprise",
    status: "active",
    mrr: 890,
    guidesCount: 6,
    membersCount: 9,
    visitorsLastMonth: 1820,
    createdAt: "Aug 2023",
    lastActiveAt: "4 hours ago",
    notes: "Interested in AR module. Follow up Q3.",
    guides: [
      { id: "pd1", title: "Doge's Palace Full Tour", status: "published", languages: ["it", "en", "fr", "de", "zh"], pois: 16 },
      { id: "pd2", title: "Council of Ten", status: "published", languages: ["it", "en"], pois: 7 },
      { id: "pd3", title: "Secret Itineraries", status: "published", languages: ["it", "en", "fr"], pois: 9 },
    ],
    members: [
      { id: "pd_m1", name: "Roberto Valier", email: "r.valier@palazzoducale.it", role: "owner" },
      { id: "pd_m2", name: "Chiara Morosini", email: "c.morosini@palazzoducale.it", role: "admin" },
    ],
  },
];

export const platformStats = {
  totalOrganizations: tenants.length,
  activeOrganizations: tenants.filter((t) => t.status === "active").length,
  trialOrganizations: tenants.filter((t) => t.status === "trial").length,
  totalGuides: tenants.reduce((s, t) => s + t.guidesCount, 0),
  publishedGuides: tenants.reduce((s, t) => s + t.guides.filter((g) => g.status === "published").length, 0),
  totalVisitorsLastMonth: tenants.reduce((s, t) => s + t.visitorsLastMonth, 0),
  mrr: tenants.reduce((s, t) => s + t.mrr, 0),
  mrrGrowth: 18, // % month over month
};

export const recentActivity = [
  { id: "a1", type: "new_tenant", text: "Pinacoteca di Brera started a trial", time: "5 days ago", tenantId: "t5" },
  { id: "a2", type: "guide_published", text: "MAXXI Roma published «Contemporary Highlights»", time: "3 days ago", tenantId: "t3" },
  { id: "a3", type: "invite_accepted", text: "Ahmed Hassan joined Museo Egizio", time: "Yesterday", tenantId: "t4" },
  { id: "a4", type: "guide_published", text: "Uffizi published «Raphael Room»", time: "1 hour ago", tenantId: "t2" },
  { id: "a5", type: "new_tenant", text: "Galleria Borghese requested a demo", time: "Just now", tenantId: null },
];

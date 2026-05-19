export type NotifType = "translation" | "team" | "codes" | "guide" | "review";

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "translation",
    title: "Translation ready for review",
    description: "English translation of 'Complete Museum Tour' is marked complete.",
    time: "2m ago",
    read: false,
    link: "/guides",
  },
  {
    id: "n2",
    type: "team",
    title: "Team invite accepted",
    description: "Giulia Moretti joined the team as Curator.",
    time: "1h ago",
    read: false,
    link: "/team",
  },
  {
    id: "n3",
    type: "codes",
    title: "Access codes running low",
    description: "'Complete Museum Tour' has only 12% of on-site codes remaining.",
    time: "3h ago",
    read: false,
    link: "/monetization",
  },
  {
    id: "n4",
    type: "guide",
    title: "Guide ready for voicing",
    description: "'Family Tour' has all translations approved and can move to voicing.",
    time: "Yesterday",
    read: true,
    link: "/guides",
  },
  {
    id: "n5",
    type: "review",
    title: "New 5-star review",
    description: "A visitor left a 5★ review on 'Complete Museum Tour'.",
    time: "Yesterday",
    read: true,
    link: "/reviews",
  },
  {
    id: "n6",
    type: "guide",
    title: "Guide published",
    description: "'Highlights - Must-See Masterpieces' is now live.",
    time: "2 days ago",
    read: true,
    link: "/guides",
  },
];

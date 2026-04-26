import { useState } from "react";
import {
  Users, UserPlus, Crown, ShieldCheck, PenLine, Eye,
  MoreHorizontal, X, Check, Trash2, Headphones, Mail,
} from "lucide-react";
import { PageShell } from "./PageShell";
import { mockGuides } from "../../data/mockData";

type Role = "owner" | "admin" | "curator" | "viewer";
type MemberStatus = "active" | "pending";

interface GuideAssignment {
  id: string;
  title: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  joinedAt: string;
  assignments: GuideAssignment[];
}

const allGuides: GuideAssignment[] = mockGuides.map((g) => ({
  id: g.id,
  title: g.title,
}));

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "m1",
    name: "Marco Rossi",
    email: "marco.rossi@museum.it",
    role: "owner",
    status: "active",
    joinedAt: "Jan 2024",
    assignments: [],
  },
  {
    id: "m2",
    name: "Anna Ferretti",
    email: "anna.ferretti@museum.it",
    role: "admin",
    status: "active",
    joinedAt: "Mar 2024",
    assignments: [],
  },
  {
    id: "m3",
    name: "Luca Bianchi",
    email: "luca.bianchi@museum.it",
    role: "curator",
    status: "active",
    joinedAt: "Apr 2024",
    assignments: [allGuides[0], allGuides[1]],
  },
  {
    id: "m4",
    name: "Sofia Chen",
    email: "sofia.chen@museum.it",
    role: "curator",
    status: "active",
    joinedAt: "Jun 2024",
    assignments: [allGuides[2]],
  },
  {
    id: "m5",
    name: "Thomas Weber",
    email: "thomas.weber@museum.it",
    role: "viewer",
    status: "active",
    joinedAt: "Sep 2024",
    assignments: [],
  },
  {
    id: "m6",
    name: "",
    email: "giulia.moretti@partner.it",
    role: "curator",
    status: "pending",
    joinedAt: "",
    assignments: [],
  },
];

const ROLE_META: Record<Role, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }> = {
  owner: { label: "Owner", color: "text-zinc-900", bg: "bg-zinc-900", icon: Crown },
  admin: { label: "Admin", color: "text-blue-600", bg: "bg-blue-600", icon: ShieldCheck },
  curator: { label: "Curator", color: "text-violet-600", bg: "bg-violet-600", icon: PenLine },
  viewer: { label: "Viewer", color: "text-zinc-400", bg: "bg-zinc-400", icon: Eye },
};

function RoleBadge({ role }: { role: Role }) {
  const meta = ROLE_META[role];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full text-white ${meta.bg}`}>
      <Icon className="size-3" strokeWidth={2} />
      {meta.label}
    </span>
  );
}

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-teal-100 text-teal-700",
    "bg-rose-100 text-rose-700",
    "bg-zinc-100 text-zinc-600",
  ];
  const idx = name ? name.charCodeAt(0) % colors.length : 5;
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${colors[idx]}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
}

// ── Assign Guides Modal ──────────────────────────────────────────────────────

function AssignModal({
  member,
  onSave,
  onClose,
}: {
  member: TeamMember;
  onSave: (ids: string[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(member.assignments.map((a) => a.id))
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-[14px] font-semibold text-zinc-900">Assign Audio Guides</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">{member.name || member.email}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-2">
          {allGuides.map((g) => {
            const active = selected.has(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  active ? "bg-violet-50" : "hover:bg-zinc-50"
                }`}
              >
                <div className={`size-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                  active ? "bg-violet-600" : "border border-zinc-200"
                }`}>
                  {active && <Check className="size-3 text-white" strokeWidth={2.5} />}
                </div>
                <Headphones className={`size-4 flex-shrink-0 ${active ? "text-violet-500" : "text-zinc-300"}`} strokeWidth={1.5} />
                <span className={`text-[13px] font-medium flex-1 ${active ? "text-violet-800" : "text-zinc-700"}`}>
                  {g.title}
                </span>
              </button>
            );
          })}
        </div>
        <div className="px-4 py-3 border-t border-zinc-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave([...selected])}
            className="px-4 py-2 text-[13px] font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({
  onInvite,
  onClose,
}: {
  onInvite: (email: string, role: Role, guideIds: string[]) => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("curator");
  const [selectedGuides, setSelectedGuides] = useState<Set<string>>(new Set());

  const toggleGuide = (id: string) => {
    setSelectedGuides((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const canSubmit = email.trim().includes("@");

  return (
    <div
      className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <h2 className="text-[14px] font-semibold text-zinc-900">Invite team member</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
              <Mail className="size-4 text-zinc-300 flex-shrink-0" />
              <input
                type="email"
                placeholder="colleague@museum.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 text-[13px] text-zinc-800 bg-transparent border-none focus:outline-none placeholder:text-zinc-300"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
              Role
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(["admin", "curator", "viewer"] as Role[]).map((r) => {
                const meta = ROLE_META[r];
                const Icon = meta.icon;
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-medium transition-all ${
                      role === r
                        ? "border-violet-300 bg-violet-50 text-violet-700"
                        : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                    }`}
                  >
                    <Icon className="size-3.5" strokeWidth={1.5} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-400 leading-snug">
              {role === "admin" && "Can manage all content and team members."}
              {role === "curator" && "Can edit only the guides assigned to them."}
              {role === "viewer" && "Read-only access to all content."}
            </p>
          </div>

          {/* Guide assignment (curators only) */}
          {role === "curator" && (
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                Assign guides
              </label>
              <div className="space-y-1">
                {allGuides.map((g) => {
                  const active = selectedGuides.has(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGuide(g.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all text-left ${
                        active
                          ? "border-violet-200 bg-violet-50"
                          : "border-transparent hover:bg-zinc-50"
                      }`}
                    >
                      <div className={`size-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? "bg-violet-600" : "border border-zinc-200"
                      }`}>
                        {active && <Check className="size-2.5 text-white" strokeWidth={2.5} />}
                      </div>
                      <span className={`text-[12px] font-medium flex-1 ${active ? "text-violet-800" : "text-zinc-600"}`}>
                        {g.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-zinc-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-[13px] text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => canSubmit && onInvite(email.trim(), role, [...selectedGuides])}
            className="px-4 py-2 text-[13px] font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send invite
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

type FilterRole = Role | "all";

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [filter, setFilter] = useState<FilterRole>("all");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [assignTarget, setAssignTarget] = useState<TeamMember | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const displayed = filter === "all" ? members : members.filter((m) => m.role === filter);

  const stats = {
    total: members.length,
    curators: members.filter((m) => m.role === "curator").length,
    pending: members.filter((m) => m.status === "pending").length,
  };

  const handleInvite = (email: string, role: Role, guideIds: string[]) => {
    const newMember: TeamMember = {
      id: `m${Date.now()}`,
      name: "",
      email,
      role,
      status: "pending",
      joinedAt: "",
      assignments: allGuides.filter((g) => guideIds.includes(g.id)),
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteOpen(false);
  };

  const handleSaveAssignments = (memberId: string, guideIds: string[]) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, assignments: allGuides.filter((g) => guideIds.includes(g.id)) }
          : m
      )
    );
    setAssignTarget(null);
  };

  const handleRemove = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setMenuOpen(null);
  };

  const handleChangeRole = (memberId: string, role: Role) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, role, assignments: role === "curator" ? m.assignments : [] }
          : m
      )
    );
    setMenuOpen(null);
  };

  const filterTabs: { key: FilterRole; label: string; count: number }[] = [
    { key: "all", label: "All", count: members.length },
    { key: "owner", label: "Owner", count: members.filter((m) => m.role === "owner").length },
    { key: "admin", label: "Admin", count: members.filter((m) => m.role === "admin").length },
    { key: "curator", label: "Curators", count: stats.curators },
    { key: "viewer", label: "Viewers", count: members.filter((m) => m.role === "viewer").length },
  ];

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-zinc-900 flex items-center justify-center flex-shrink-0">
              <Users className="size-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">Team</h1>
              <p className="text-[13px] text-zinc-400 mt-0.5">Manage members and guide assignments</p>
            </div>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-700 text-white text-[13px] font-semibold rounded-lg transition-colors"
          >
            <UserPlus className="size-4" strokeWidth={1.5} />
            Invite member
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Members", value: stats.total },
            { label: "Curators", value: stats.curators },
            { label: "Pending invites", value: stats.pending },
          ].map((s) => (
            <div key={s.label} className="border border-zinc-100 rounded-xl px-5 py-4 bg-white">
              <p className="text-[24px] font-semibold text-zinc-900 tracking-tight">{s.value}</p>
              <p className="text-[12px] text-zinc-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-4">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                filter === tab.key
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1.5 text-[10px] ${filter === tab.key ? "text-zinc-400" : "text-zinc-400"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Member list */}
        <div className="border border-zinc-100 rounded-2xl overflow-hidden bg-white">
          {displayed.map((member, i) => {
            const isPending = member.status === "pending";
            const isCurator = member.role === "curator";
            const isMenuOpen = menuOpen === member.id;

            return (
              <div
                key={member.id}
                className={`flex items-center gap-4 px-5 py-4 ${
                  i < displayed.length - 1 ? "border-b border-zinc-50" : ""
                } ${isPending ? "bg-amber-50/40" : "hover:bg-zinc-50/60"} transition-colors`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar name={member.name} size={36} />
                  {isPending && (
                    <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-amber-400 border-2 border-white" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[13px] font-semibold ${isPending ? "text-zinc-400 italic" : "text-zinc-900"}`}>
                      {member.name || "Pending…"}
                    </span>
                    <RoleBadge role={member.role} />
                    {isPending && (
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                        Invite sent
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-zinc-400 mt-0.5 truncate">{member.email}</p>
                  {isCurator && member.assignments.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                      {member.assignments.map((g) => (
                        <span
                          key={g.id}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-700 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full"
                        >
                          <Headphones className="size-2.5" strokeWidth={1.5} />
                          {g.title}
                        </span>
                      ))}
                    </div>
                  )}
                  {isCurator && member.assignments.length === 0 && !isPending && (
                    <p className="text-[11px] text-zinc-300 mt-1">No guides assigned</p>
                  )}
                </div>

                {/* Joined */}
                {member.joinedAt && (
                  <span className="text-[11px] text-zinc-300 flex-shrink-0 hidden sm:block">
                    Since {member.joinedAt}
                  </span>
                )}

                {/* Assign button (curators) */}
                {isCurator && !isPending && (
                  <button
                    onClick={() => setAssignTarget(member)}
                    className="flex-shrink-0 px-3 py-1.5 text-[12px] font-medium text-violet-600 border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
                  >
                    Manage guides
                  </button>
                )}

                {/* Context menu */}
                {member.role !== "owner" && (
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setMenuOpen(isMenuOpen ? null : member.id)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                    {isMenuOpen && (
                      <div className="absolute right-0 top-8 bg-white border border-zinc-100 rounded-xl shadow-lg z-20 w-44 py-1 overflow-hidden">
                        {(["admin", "curator", "viewer"] as Role[]).map((r) => {
                          const meta = ROLE_META[r];
                          const Icon = meta.icon;
                          return (
                            <button
                              key={r}
                              onClick={() => handleChangeRole(member.id, r)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] transition-colors ${
                                member.role === r
                                  ? "text-zinc-900 font-semibold bg-zinc-50"
                                  : "text-zinc-600 hover:bg-zinc-50"
                              }`}
                            >
                              <Icon className="size-3.5" strokeWidth={1.5} />
                              {meta.label}
                              {member.role === r && <Check className="size-3 ml-auto text-zinc-400" />}
                            </button>
                          );
                        })}
                        <div className="h-px bg-zinc-100 my-1" />
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="size-3.5" strokeWidth={1.5} />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {displayed.length === 0 && (
            <div className="py-16 text-center">
              <Users className="size-8 text-zinc-200 mx-auto mb-3" strokeWidth={1} />
              <p className="text-[13px] text-zinc-400">No members in this category</p>
            </div>
          )}
        </div>

        {/* Role legend */}
        <div className="mt-6 border border-zinc-100 rounded-2xl p-5 bg-white">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-3">Role permissions</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["owner", "admin", "curator", "viewer"] as Role[]).map((r) => {
              const meta = ROLE_META[r];
              const Icon = meta.icon;
              const desc: Record<Role, string> = {
                owner: "Full access, billing, and settings",
                admin: "All content and team management",
                curator: "Only their assigned audio guides",
                viewer: "Read-only across all sections",
              };
              return (
                <div key={r} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`size-3.5 ${meta.color}`} strokeWidth={1.5} />
                    <span className={`text-[12px] font-semibold ${meta.color}`}>{meta.label}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">{desc[r]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {assignTarget && (
        <AssignModal
          member={assignTarget}
          onSave={(ids) => handleSaveAssignments(assignTarget.id, ids)}
          onClose={() => setAssignTarget(null)}
        />
      )}
      {inviteOpen && (
        <InviteModal
          onInvite={handleInvite}
          onClose={() => setInviteOpen(false)}
        />
      )}

      {/* Close menu on outside click */}
      {menuOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
      )}
    </PageShell>
  );
}

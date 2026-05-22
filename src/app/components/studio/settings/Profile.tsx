import { useState, useRef } from "react";
import { Check, Crown, ShieldCheck, PenLine, Eye, Camera } from "lucide-react";
import { PageShell } from "../_layout/PageShell";
import { teamMembers, CURRENT_USER_ID, type Role } from "../../../data/teamData";

const ROLE_META: Record<Role, { label: string; color: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }> = {
  owner: { label: "Owner", color: "text-zinc-900", icon: Crown },
  admin: { label: "Admin", color: "text-blue-600", icon: ShieldCheck },
  curator: { label: "Curator", color: "text-violet-600", icon: PenLine },
  viewer: { label: "Viewer", color: "text-zinc-400", icon: Eye },
};

function Avatar({ name, src, size = 72 }: { name: string; src?: string; size?: number }) {
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
  if (src) {
    return (
      <img src={src} alt={name} className="rounded-full object-cover flex-shrink-0" style={{ width: size, height: size }} />
    );
  }
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${colors[idx]}`}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials}
    </div>
  );
}

export function Profile() {
  const source = teamMembers.find((m) => m.id === CURRENT_USER_ID)!;

  const [name, setName] = useState(source.name);
  const [bio, setBio] = useState(source.bio);
  const [avatar, setAvatar] = useState<string | undefined>(source.avatar);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
    setSaved(false);
  };

  const BIO_MAX = 160;
  const roleMeta = ROLE_META[source.role];
  const RoleIcon = roleMeta.icon;

  const handleSave = () => {
    source.name = name;
    source.bio = bio;
    source.avatar = avatar;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const dirty = name !== source.name || bio !== source.bio || avatar !== source.avatar;

  return (
    <PageShell>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight">My Profile</h1>
          <p className="text-[13px] text-zinc-400 mt-0.5">
            Your information is visible to team members and appears on the guides you're responsible for.
          </p>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          {/* Avatar row */}
          <div className="px-6 py-6 border-b border-zinc-50 flex items-center gap-5">
            <div className="relative group flex-shrink-0">
              <Avatar name={name} src={avatar} size={64} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-zinc-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus-visible:opacity-100"
                title="Change photo"
              >
                <Camera className="size-5 text-white" strokeWidth={1.5} />
              </button>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-zinc-900">{name || "—"}</p>
              <div className={`flex items-center gap-1.5 mt-1 ${roleMeta.color}`}>
                <RoleIcon className="size-3.5" strokeWidth={1.5} />
                <span className="text-[12px] font-medium">{roleMeta.label}</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">{source.email}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-1.5 text-[11px] text-zinc-400 hover:text-zinc-700 underline underline-offset-2 transition-colors"
              >
                Change photo
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="px-6 py-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                Display name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setSaved(false); }}
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                placeholder="Your full name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => { if (e.target.value.length <= BIO_MAX) { setBio(e.target.value); setSaved(false); } }}
                rows={3}
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none placeholder:text-zinc-300"
                placeholder="A short introduction visible to your team and on your guide credits…"
              />
              <div className="flex justify-end mt-1">
                <span className={`text-[11px] ${bio.length >= BIO_MAX ? "text-red-400" : "text-zinc-300"}`}>
                  {bio.length}/{BIO_MAX}
                </span>
              </div>
            </div>

            {/* Role — read-only note */}
            <div className="px-4 py-3 bg-zinc-50 rounded-lg">
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Your role is <span className={`font-semibold ${roleMeta.color}`}>{roleMeta.label}</span> — set by your admin. Contact them to request a change.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-zinc-50 flex items-center justify-end gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-[12px] text-emerald-600">
                <Check className="size-3.5" strokeWidth={2.5} />
                Saved
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!dirty && !saved}
              className="px-5 py-2 text-[13px] font-medium bg-[#D33333] text-white rounded-lg hover:bg-[#b82c2c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
    </PageShell>
  );
}

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import type { TeamMember } from "../../../../data/teamData";

export function FinalReviewModal({
  title,
  guideId,
  currentUser,
  canSelfApprove,
  reviewableMembers,
  onClose,
  onRequestReview,
  onSelfApprove,
}: {
  title: string;
  guideId: string | undefined;
  currentUser: TeamMember;
  canSelfApprove: boolean;
  reviewableMembers: TeamMember[];
  onClose: () => void;
  onRequestReview: (to: TeamMember) => void;
  onSelfApprove: (user: TeamMember) => void;
}) {
  const [reviewMode, setReviewMode] = useState<"member" | "invite">("member");
  const [selectedReviewerId, setSelectedReviewerId] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  return (
    <div
      className="fixed inset-0 z-[60] bg-zinc-950/50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-gradient-to-r from-zinc-300 via-zinc-500 to-zinc-300" />
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Final Review</p>
            <p className="text-[15px] font-semibold text-zinc-900 leading-tight">{title}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 mt-0.5">
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Request review */}
          <div>
            <p className="text-[13px] font-semibold text-zinc-900 mb-0.5">Request review</p>
            <p className="text-[12px] text-zinc-500 mb-3">Send to a team member or invite someone external.</p>

            <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg mb-3">
              {(["member", "invite"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => { setReviewMode(mode); setSelectedReviewerId(""); setInviteEmail(""); }}
                  className={`flex-1 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
                    reviewMode === mode ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  {mode === "member" ? "Team member" : "Invite by email"}
                </button>
              ))}
            </div>

            {reviewMode === "member" && (
              <>
                <div className="relative mb-3">
                  <select
                    value={selectedReviewerId}
                    onChange={(e) => setSelectedReviewerId(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                  >
                    <option value="">Select reviewer…</option>
                    {reviewableMembers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} · {m.role}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
                </div>
                {selectedReviewerId && (() => {
                  const member = reviewableMembers.find((m) => m.id === selectedReviewerId);
                  if (!member) return null;
                  return (
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-zinc-50 rounded-xl mb-3">
                      <div className="size-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-zinc-800">{member.name}</p>
                        <p className="text-[11px] text-zinc-400 capitalize">{member.role}</p>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}

            {reviewMode === "invite" && (
              <div className="mb-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
                <p className="text-[11px] text-zinc-400 mt-1.5">
                  They'll receive a link to review this guide. No account needed.
                </p>
              </div>
            )}

            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Add a note… (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[12px] text-zinc-900 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900 mb-3"
            />

            <button
              disabled={reviewMode === "member" ? !selectedReviewerId : !inviteEmail.includes("@")}
              onClick={() => {
                const toMember: TeamMember = reviewMode === "member"
                  ? reviewableMembers.find((m) => m.id === selectedReviewerId)!
                  : { id: "invited", name: inviteEmail, email: inviteEmail, role: "curator", status: "pending", joinedAt: "", bio: "", assignments: [] };
                onRequestReview(toMember);
                setSelectedReviewerId("");
                setInviteEmail("");
                setReviewNote("");
                onClose();
              }}
              className="w-full py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {reviewMode === "member" ? "Send for review →" : "Send invitation →"}
            </button>
          </div>

          {/* Self-approve */}
          {canSelfApprove && (
            <div className="pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-zinc-100" />
                <span className="text-[11px] text-zinc-400 font-medium">or</span>
                <div className="flex-1 h-px bg-zinc-100" />
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 bg-zinc-50 rounded-xl mb-3">
                <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[10px] flex-shrink-0">
                  {currentUser.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-zinc-800">{currentUser.name}</p>
                  <p className="text-[10px] text-zinc-400 capitalize">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={() => { onSelfApprove(currentUser); onClose(); }}
                className="w-full py-2 border border-zinc-200 text-[12px] font-semibold text-zinc-600 rounded-xl hover:bg-zinc-50 transition-all"
              >
                Approve directly as {currentUser.role}
              </button>
              <p className="mt-2.5 text-center text-[10px] text-zinc-400">
                <Link
                  to={`/review/${guideId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-zinc-600 transition-colors"
                >
                  Go to review page
                </Link>
                {" "}· developer only
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { X, ImageIcon, LockOpen, DollarSign, UserCircle2, CheckCircle2, ClipboardList, Globe, Trophy, Calendar } from "lucide-react";
import { mockSurveys, mockChallenges } from "../../../data/mockData";
import { teamMembers, type TeamMember } from "../../../data/teamData";

const assignableMembers = teamMembers.filter((m) => m.status === "active");

export function GuideEditorSidebar({
  thumbnail,
  onThumbnailClear,
  onOpenCoverGallery,
  status,
  onStatusChange,
  expositionType,
  onExpositionTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  accessType,
  onAccessTypeClick,
  poiCount,
  responsible,
  onResponsibleChange,
  linkedSurveyId,
  onLinkedSurveyIdChange,
  linkedChallengeId,
  onLinkedChallengeIdChange,
}: {
  thumbnail: string;
  onThumbnailClear: () => void;
  onOpenCoverGallery: () => void;
  status: "draft" | "published";
  onStatusChange: (s: "draft" | "published") => void;
  expositionType: "permanent" | "temporary";
  onExpositionTypeChange: (t: "permanent" | "temporary") => void;
  startDate: string;
  onStartDateChange: (d: string) => void;
  endDate: string;
  onEndDateChange: (d: string) => void;
  accessType: "free" | "paid";
  onAccessTypeClick: (t: "free" | "paid") => void;
  poiCount: number;
  responsible: TeamMember | undefined;
  onResponsibleChange: (m: TeamMember | undefined) => void;
  linkedSurveyId: string;
  onLinkedSurveyIdChange: (id: string) => void;
  linkedChallengeId: string;
  onLinkedChallengeIdChange: (id: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>

      {/* Cover Image */}
      <div className="p-5 border-b border-zinc-200">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Cover Image</p>
        {thumbnail ? (
          <div className="relative group rounded-lg overflow-hidden aspect-video bg-zinc-200">
            <img src={thumbnail} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={onOpenCoverGallery}
                className="px-3 py-1.5 bg-white text-zinc-900 text-[12px] font-semibold rounded-lg shadow-md hover:bg-zinc-50 transition-colors"
              >
                Change
              </button>
              <button
                onClick={onThumbnailClear}
                className="p-1.5 bg-white text-zinc-900 rounded-lg shadow-md hover:bg-zinc-50 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenCoverGallery}
            className="w-full aspect-video rounded-lg border-2 border-dashed border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-100 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <ImageIcon className="size-6 text-zinc-300 group-hover:text-zinc-400 transition-colors" />
            <span className="text-[12px] font-medium text-zinc-400 group-hover:text-zinc-500 transition-colors">Choose cover image</span>
          </button>
        )}
      </div>

      {/* Publishing */}
      <div className="p-5 border-b border-zinc-200">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-4">Publishing</p>
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] font-medium text-zinc-500 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as "draft" | "published")}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[12px] font-medium text-zinc-500 mb-2">Availability</label>
            <div className="flex gap-1 p-1 bg-zinc-100 rounded-lg mb-2">
              {(["permanent", "temporary"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => onExpositionTypeChange(type)}
                  className={`flex-1 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
                    expositionType === type ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  {type === "permanent" ? "Permanent" : "Temporary"}
                </button>
              ))}
            </div>
            {expositionType === "temporary" && (
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Start</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">End</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                {endDate && new Date(endDate) < new Date() && (
                  <p className="flex items-center gap-1.5 text-[11px] text-amber-600">
                    <span className="size-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    This exposition has ended
                  </p>
                )}
                {startDate && endDate && new Date(endDate) >= new Date() && (
                  <p className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <Calendar className="size-3 flex-shrink-0" />
                    Active until {new Date(endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-medium text-zinc-500 mb-1.5">Access Type</label>
            <div className="space-y-1.5">
              {(["free", "paid"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => onAccessTypeClick(type)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    accessType === type ? "border-zinc-900 bg-white" : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`size-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${accessType === type ? "border-zinc-900" : "border-zinc-300"}`}>
                      {accessType === type && <div className="size-2 rounded-full bg-zinc-900" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        {type === "free" ? <LockOpen className="size-3.5 text-zinc-600" /> : <DollarSign className="size-3.5 text-zinc-600" />}
                        <span className="text-[13px] font-semibold text-zinc-900">{type === "free" ? "Free Access" : "Paid Access"}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{type === "free" ? "Universal QR code" : "Unique QR per visitor"}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {accessType === "paid" && (
              <p className="text-[11px] text-blue-600 mt-2 leading-relaxed">
                Generate QR codes in Monetization after publishing.
              </p>
            )}
          </div>

          <button
            className="w-full px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all disabled:opacity-40"
            disabled={poiCount === 0}
          >
            {status === "published" ? "Update Guide" : "Publish Guide"}
          </button>
        </div>
      </div>

      {/* Responsible */}
      <div className="p-5 border-b border-zinc-200">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Responsible</p>
        {responsible ? (
          <div className="group/resp">
            <div className="flex items-start gap-2.5">
              <div className="size-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-[11px] flex-shrink-0">
                {responsible.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-zinc-800 leading-tight">{responsible.name}</p>
                <p className="text-[11px] text-zinc-400">{responsible.email}</p>
                {responsible.bio && (
                  <p className="text-[11px] text-zinc-400 italic mt-1 leading-snug">{responsible.bio}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setPickerOpen(true)}
              className="mt-2 text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors underline underline-offset-2"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            onClick={() => setPickerOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 border border-dashed border-zinc-200 rounded-lg text-[12px] text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 hover:bg-zinc-50 transition-all"
          >
            <UserCircle2 className="size-4" strokeWidth={1.5} />
            Assign responsible
          </button>
        )}

        {pickerOpen && (
          <div
            className="fixed inset-0 bg-zinc-950/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPickerOpen(false)}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100">
                <p className="text-[13px] font-semibold text-zinc-900">Assign responsible</p>
                <button onClick={() => setPickerOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                  <X className="size-4" />
                </button>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {assignableMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { onResponsibleChange(m); setPickerOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${responsible?.id === m.id ? "bg-violet-50" : "hover:bg-zinc-50"}`}
                  >
                    <div className="size-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-[10px] flex-shrink-0">
                      {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-zinc-800">{m.name}</p>
                      {m.bio && <p className="text-[11px] text-zinc-400 truncate italic">{m.bio}</p>}
                    </div>
                    {responsible?.id === m.id && <CheckCircle2 className="size-4 text-violet-500 flex-shrink-0" />}
                  </button>
                ))}
                <div className="h-px bg-zinc-100 my-1" />
                <button
                  onClick={() => { onResponsibleChange(undefined); setPickerOpen(false); }}
                  className="w-full px-3 py-2 text-[12px] text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg text-left transition-colors"
                >
                  Remove assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="p-5 border-b border-zinc-200">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-3">Metadata</p>
        <div className="space-y-2.5 text-[12px]">
          <div className="flex justify-between">
            <span className="text-zinc-400">Created</span>
            <span className="font-medium text-zinc-700">Jan 22, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Last Modified</span>
            <span className="font-medium text-zinc-700">2 hours ago</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">POIs</span>
            <span className="font-medium text-zinc-700">{poiCount}</span>
          </div>
        </div>
      </div>

      {/* Survey */}
      <div className="p-5 border-b border-zinc-200">
        <div className="flex items-center gap-1.5 mb-3">
          <ClipboardList className="size-3.5 text-zinc-400" strokeWidth={1.5} />
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Survey</p>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
          Associate a feedback survey to be shown to visitors after completing this guide.
        </p>
        <div className="relative">
          <select
            value={linkedSurveyId}
            onChange={(e) => onLinkedSurveyIdChange(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
          >
            <option value="">No survey linked</option>
            {mockSurveys.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <Globe className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
        </div>
        {linkedSurveyId && (
          <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
            Survey linked
          </p>
        )}
      </div>

      {/* Challenge */}
      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-3">
          <Trophy className="size-3.5 text-zinc-400" strokeWidth={1.5} />
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Challenge</p>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
          Link a challenge to reward visitors who answer all quiz questions correctly.
        </p>
        <div className="relative">
          <select
            value={linkedChallengeId}
            onChange={(e) => onLinkedChallengeIdChange(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent cursor-pointer"
          >
            <option value="">No challenge linked</option>
            {mockChallenges.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <Trophy className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
        </div>
        {linkedChallengeId && (
          <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
            Challenge linked
          </p>
        )}
      </div>

    </div>
  );
}

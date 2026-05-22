import { X, Check, AlertCircle, Shield, Rocket, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router";
import type { TeamMember } from "../../../../data/teamData";

export interface PublishCheck {
  label: string;
  ok: boolean;
  detail?: string;
  action?: { label: string; onClick: () => void };
}

export function PublishModal({
  title,
  poiCount,
  publishChecks,
  allChecksOk,
  publishReadyPct,
  canPublish,
  approvalState,
  reviewRequest,
  guideId,
  onClose,
  onPublish,
  onFinalReview,
  onSimulateApproval,
}: {
  title: string;
  poiCount: number;
  publishChecks: PublishCheck[];
  allChecksOk: boolean;
  publishReadyPct: number;
  canPublish: boolean;
  approvalState: { approvedBy: TeamMember; date: string } | null;
  reviewRequest: { to: TeamMember; date: string } | null;
  guideId: string | undefined;
  onClose: () => void;
  onPublish: () => void;
  onFinalReview: () => void;
  onSimulateApproval: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="h-1 w-full bg-gradient-to-r from-zinc-300 via-zinc-500 to-zinc-300 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-100 flex-shrink-0">
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1">Publication</p>
            <p className="text-[15px] font-semibold text-zinc-900 leading-tight">{title}</p>
            <p className="text-[12px] text-zinc-400 mt-0.5">{poiCount} points of interest</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors mt-0.5">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-zinc-900">Publication Checklist</h3>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${allChecksOk ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {publishReadyPct}% ready
              </span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all duration-700 ${allChecksOk ? "bg-emerald-500" : "bg-amber-400"}`}
                style={{ width: `${publishReadyPct}%` }}
              />
            </div>
            <div className="space-y-2">
              {publishChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-50">
                  <div className={`size-6 rounded-full flex items-center justify-center flex-shrink-0 ${check.ok ? "bg-emerald-100" : "bg-amber-100"}`}>
                    {check.ok
                      ? <Check className="size-3.5 text-emerald-600" />
                      : <AlertCircle className="size-3.5 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-zinc-800">{check.label}</p>
                    {check.detail && <p className="text-[11px] text-zinc-400">{check.detail}</p>}
                  </div>
                  {!check.ok && check.action && (
                    <button
                      onClick={check.action.onClick}
                      className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      {check.action.label} →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review request banner */}
        {reviewRequest && !approvalState && (
          <div className="mx-6 mb-2 flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <Clock className="size-4 text-amber-600 flex-shrink-0" />
              <p className="text-[12px] font-medium text-amber-800 truncate">
                Review requested from <span className="font-semibold">{reviewRequest.to.name}</span> · {reviewRequest.date}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to={`/review/${guideId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap underline underline-offset-2"
              >
                Open review link ↗
              </Link>
              <button
                onClick={onSimulateApproval}
                className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap underline underline-offset-2"
              >
                Simulate approval
              </button>
            </div>
          </div>
        )}

        {/* Approval banner */}
        {approvalState && (
          <div className="mx-6 mb-2 flex items-center gap-2.5 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0" />
            <p className="text-[12px] font-medium text-emerald-800">
              Approved by <span className="font-semibold">{approvalState.approvedBy.name}</span> · {approvalState.date}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 flex-shrink-0">
          {!approvalState ? (
            <button
              onClick={onFinalReview}
              className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 text-[13px] font-semibold text-zinc-700 rounded-lg hover:bg-zinc-50 transition-all"
            >
              <Shield className="size-4" />
              Final Review
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700">
              <CheckCircle2 className="size-4" /> Approved
            </span>
          )}
          <button
            disabled={!canPublish}
            onClick={onPublish}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Rocket className="size-4" />
            Publish Guide
          </button>
        </div>
      </div>
    </div>
  );
}

import { X, Calendar } from "lucide-react";

interface MuseumEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  location?: string;
  status: "upcoming" | "ongoing" | "past";
}

const STATUS_COLORS = {
  upcoming: "bg-blue-50 text-blue-700",
  ongoing:  "bg-emerald-50 text-emerald-700",
  past:     "bg-zinc-100 text-zinc-500",
} as const;

const STATUS_LABELS = { upcoming: "Upcoming", ongoing: "Ongoing", past: "Past" } as const;

export function AddEventModal({ availableEvents, onLink, onClose }: {
  availableEvents: MuseumEvent[];
  onLink: (eventId: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 flex-shrink-0">
          <div>
            <p className="text-[14px] font-semibold text-zinc-900">Link an Event</p>
            <p className="text-[12px] text-zinc-400 mt-0.5">Select events to promote in this guide</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X className="size-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-3">
          {availableEvents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[13px] text-zinc-500">All events are already linked.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {availableEvents.map((event) => {
                const isSingleDay = event.startDate === event.endDate;
                return (
                  <button
                    key={event.id}
                    onClick={() => onLink(event.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all text-left"
                  >
                    <div className="size-10 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-100">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="size-4 text-zinc-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-zinc-800 truncate">{event.title}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1 truncate">
                        <Calendar className="size-3 flex-shrink-0" />
                        {isSingleDay
                          ? new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                          : `${new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                      </p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[event.status]}`}>
                      {STATUS_LABELS[event.status]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { Plus, X, Calendar } from "lucide-react";
import { Link } from "react-router";

interface LinkedEvent {
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
  ongoing: "bg-emerald-50 text-emerald-700",
  past: "bg-zinc-100 text-zinc-500",
} as const;

const STATUS_LABELS = { upcoming: "Upcoming", ongoing: "Ongoing", past: "Past" } as const;

export function EventsSection({
  linkedEvents,
  onAddEvent,
  onUnlinkEvent,
}: {
  linkedEvents: LinkedEvent[];
  onAddEvent: () => void;
  onUnlinkEvent: (eventId: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden" style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)" }}>
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-zinc-900">Events</h2>
          <p className="text-[12px] text-zinc-400 mt-0.5">
            Link global events to promote inside this guide.{" "}
            <Link to="/events" className="underline underline-offset-2 hover:text-zinc-600 transition-colors">
              Manage events →
            </Link>
          </p>
        </div>
        <button
          onClick={onAddEvent}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 text-[12px] font-semibold text-zinc-600 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all"
        >
          <Plus className="size-3.5" />
          Link Event
        </button>
      </div>

      <div className="p-4">
        {linkedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3">
              <Calendar className="size-5 text-zinc-300" />
            </div>
            <p className="text-[13px] text-zinc-500 mb-0.5">No events linked</p>
            <p className="text-[11px] text-zinc-400">
              Create events in{" "}
              <Link to="/events" className="underline underline-offset-2 hover:text-zinc-600 transition-colors">
                Events
              </Link>
              , then link them here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {linkedEvents.map((event) => {
              const isSingleDay = event.startDate === event.endDate;
              return (
                <div key={event.id} className="flex items-center gap-3 p-3 border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors">
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
                    <p className="text-[13px] font-semibold text-zinc-900 truncate leading-tight">{event.title}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1 truncate">
                      <Calendar className="size-3 flex-shrink-0" />
                      {isSingleDay
                        ? new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        : `${new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${new Date(event.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                      {event.location && <> · {event.location}</>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[event.status]}`}>
                      {STATUS_LABELS[event.status]}
                    </span>
                    <button
                      onClick={() => onUnlinkEvent(event.id)}
                      className="p-1 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

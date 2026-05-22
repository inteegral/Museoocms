import { useState } from "react";
import { Plus, Calendar, MapPin, X, BookOpen, Trash2, Pencil, Image as ImageIcon, Check } from "lucide-react";
import { PageShell } from "../_layout/PageShell";
import { mockEvents as initialMockEvents, mockGuides } from "../../../data/mockData";

const GALLERY = [
  "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=400&q=80",
  "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=400&q=80",
  "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&q=80",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80",
  "https://images.unsplash.com/photo-1566127444979-b3d2b654e3c2?w=400&q=80",
  "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=400&q=80",
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80",
  "https://images.unsplash.com/photo-1531243625752-c0eb5e6fbaf0?w=400&q=80",
  "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&q=80",
  "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80",
];

type MuseumEvent = typeof initialMockEvents[0];
type StatusFilter = "all" | "upcoming" | "ongoing" | "past";

const STATUS = {
  upcoming: {
    label: "Upcoming",
    dot: "bg-blue-400",
    pill: "bg-white/90 backdrop-blur-sm text-blue-700 border border-blue-100",
    pillSolid: "bg-blue-50 text-blue-700",
  },
  ongoing: {
    label: "Ongoing",
    dot: "bg-emerald-400",
    pill: "bg-white/90 backdrop-blur-sm text-emerald-700 border border-emerald-100",
    pillSolid: "bg-emerald-50 text-emerald-700",
  },
  past: {
    label: "Past",
    dot: "bg-zinc-300",
    pill: "bg-white/90 backdrop-blur-sm text-zinc-500 border border-zinc-200",
    pillSolid: "bg-zinc-100 text-zinc-500",
  },
};

function fmt(iso: string, short = false) {
  return new Date(iso).toLocaleDateString("en-GB", short
    ? { day: "numeric", month: "short" }
    : { day: "numeric", month: "short", year: "numeric" }
  );
}

function computeStatus(start: string, end: string): "upcoming" | "ongoing" | "past" {
  const now = new Date();
  if (now < new Date(start)) return "upcoming";
  if (now > new Date(end + "T23:59:59")) return "past";
  return "ongoing";
}

function EventCard({ event, onOpen }: { event: MuseumEvent; onOpen: () => void }) {
  const sc = STATUS[event.status];
  const isSingleDay = event.startDate === event.endDate;
  const guideCount = event.linkedGuides.length;

  return (
    <div
      onClick={onOpen}
      className="group bg-white rounded-2xl border border-zinc-100 overflow-hidden hover:border-zinc-200 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
      style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.05)" }}
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-zinc-100 overflow-hidden flex-shrink-0">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="size-10 text-zinc-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${sc.pill}`}>
          <span className={`size-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
          {sc.label}
        </span>
        <div className="absolute bottom-3 right-3 size-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
          <Pencil className="size-3.5 text-zinc-600" />
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <h3 className="text-[14px] font-semibold text-zinc-900 leading-snug tracking-tight mb-1.5 line-clamp-2">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-[12px] text-zinc-400 line-clamp-2 leading-relaxed mb-4 flex-1">
            {event.description}
          </p>
        )}

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <Calendar className="size-3.5 text-zinc-300 flex-shrink-0" />
            {isSingleDay
              ? fmt(event.startDate)
              : `${fmt(event.startDate, true)} – ${fmt(event.endDate, true)}`}
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-[12px] text-zinc-500">
              <MapPin className="size-3.5 text-zinc-300 flex-shrink-0" />
              {event.location}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-zinc-100">
          {guideCount === 0 ? (
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-300">
              <BookOpen className="size-3.5" />
              Not linked to any guide
            </span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {event.linkedGuides.map(gid => {
                const g = mockGuides.find(x => x.id === gid);
                if (!g) return null;
                return (
                  <span key={gid} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium ${
                    g.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                  }`}>
                    <BookOpen className="size-3" strokeWidth={1.5} />
                    {g.title}
                    {g.status === "published" && <span className="size-1.5 rounded-full bg-emerald-400 flex-shrink-0" />}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventDetailModal({
  event,
  onClose,
  onSave,
  onDelete,
}: {
  event: MuseumEvent;
  onClose: () => void;
  onSave: (updated: MuseumEvent) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState({
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    imageUrl: event.imageUrl,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const isSingleDay = form.startDate === form.endDate;
  const derivedStatus = form.startDate && form.endDate
    ? computeStatus(form.startDate, form.endDate)
    : event.status;
  const sc = STATUS[derivedStatus];

  const handleSave = () => {
    if (!form.title || !form.startDate) return;
    const endDate = form.endDate || form.startDate;
    onSave({
      ...event,
      ...form,
      endDate,
      status: computeStatus(form.startDate, endDate),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image header */}
        {form.imageUrl && (
          <div className="relative h-40 bg-zinc-100 flex-shrink-0 overflow-hidden">
            <img
              src={form.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className={`absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${sc.pill}`}>
              <span className={`size-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
              {sc.label}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            {!form.imageUrl && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-2 ${sc.pillSolid}`}>
                <span className={`size-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
                {sc.label}
              </span>
            )}
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full text-[18px] font-semibold text-zinc-900 border-none outline-none bg-transparent focus:ring-0 placeholder:text-zinc-300"
              placeholder="Event title"
            />
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors mt-1 flex-shrink-0">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 pb-2 space-y-4">
          {/* Description */}
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Add a description…"
            rows={3}
            className="w-full px-0 py-0 border-none outline-none bg-transparent text-[13px] text-zinc-600 resize-none placeholder:text-zinc-300 focus:ring-0 leading-relaxed"
          />

          <div className="h-px bg-zinc-100" />

          {/* Dates */}
          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Dates</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-zinc-400 mb-1">Start</p>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
              <div>
                <p className="text-[11px] text-zinc-400 mb-1">End</p>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  min={form.startDate}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[12px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>
            {form.startDate && form.endDate && !isSingleDay && (
              <p className="text-[11px] text-zinc-400 mt-1.5">
                {fmt(form.startDate, true)} – {fmt(form.endDate, true)}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-300 pointer-events-none" />
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Hall B, Ground Floor"
                className="w-full pl-8 pr-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">Image</label>
            {form.imageUrl ? (
              <div className="space-y-2">
                <div className="relative rounded-xl overflow-hidden">
                  <img src={form.imageUrl} alt="" className="w-full h-28 object-cover" />
                  <button
                    onClick={() => setShowGallery(true)}
                    className="absolute bottom-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-zinc-700 rounded-lg hover:bg-white transition-all shadow-sm"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                    className="absolute top-2 right-2 size-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-zinc-500 hover:text-red-600 transition-colors shadow-sm"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowGallery(true)}
                className="w-full h-20 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
              >
                <ImageIcon className="size-4 text-zinc-300" />
                <span className="text-[12px] text-zinc-400">Choose from gallery</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 flex-shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-zinc-500">Delete this event?</span>
              <button
                onClick={() => onDelete(event.id)}
                className="px-3 py-1.5 bg-red-600 text-white text-[12px] font-semibold rounded-lg hover:bg-red-700 transition-all"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-[12px] text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-200 text-[13px] font-semibold text-zinc-600 rounded-lg hover:bg-zinc-50 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!form.title || !form.startDate}
              onClick={handleSave}
              className="px-5 py-2 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Gallery picker */}
      {showGallery && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
          onClick={() => setShowGallery(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <p className="text-[14px] font-semibold text-zinc-900">Media Library</p>
              <button onClick={() => setShowGallery(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-4 gap-2 max-h-72 overflow-y-auto">
              {GALLERY.map((url) => {
                const selected = form.imageUrl === url;
                return (
                  <button
                    key={url}
                    onClick={() => { setForm((f) => ({ ...f, imageUrl: url })); setShowGallery(false); }}
                    className={`relative rounded-xl overflow-hidden aspect-square transition-all ${selected ? "ring-2 ring-zinc-900 ring-offset-2" : "hover:ring-2 hover:ring-zinc-400 hover:ring-offset-1"}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {selected && (
                      <div className="absolute inset-0 bg-zinc-900/30 flex items-center justify-center">
                        <div className="size-6 bg-zinc-900 rounded-full flex items-center justify-center">
                          <Check className="size-3.5 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_FORM = { title: "", description: "", startDate: "", endDate: "", location: "", imageUrl: "" };

export function Events() {
  const [events, setEvents] = useState<MuseumEvent[]>(initialMockEvents);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [showNew, setShowNew] = useState(false);
  const [showNewGallery, setShowNewGallery] = useState(false);
  const [openEvent, setOpenEvent] = useState<MuseumEvent | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const counts = {
    all: events.length,
    upcoming: events.filter((e) => e.status === "upcoming").length,
    ongoing: events.filter((e) => e.status === "ongoing").length,
    past: events.filter((e) => e.status === "past").length,
  };

  const filtered = filter === "all" ? events : events.filter((e) => e.status === filter);

  const handleCreate = () => {
    if (!form.title || !form.startDate) return;
    const endDate = form.endDate || form.startDate;
    const newEvent: MuseumEvent = {
      id: `event-${Date.now()}`,
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate,
      location: form.location,
      imageUrl: form.imageUrl,
      status: computeStatus(form.startDate, endDate),
      linkedGuides: [],
    };
    setEvents((prev) => [newEvent, ...prev]);
    setForm(EMPTY_FORM);
    setShowNew(false);
  };

  const handleSave = (updated: MuseumEvent) => {
    setEvents((prev) => prev.map((e) => e.id === updated.id ? updated : e));
    setOpenEvent(null);
  };

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setOpenEvent(null);
  };

  const filters: { key: StatusFilter; label: string }[] = [
    { key: "all",      label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "ongoing",  label: "Ongoing" },
    { key: "past",     label: "Past" },
  ];

  return (
    <>
      <PageShell>
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[26px] font-semibold text-zinc-900 tracking-tight mb-1">Events</h1>
              <p className="text-[13px] text-zinc-500">
                {counts.all} events
                {counts.ongoing > 0 && ` · ${counts.ongoing} ongoing`}
                {counts.upcoming > 0 && ` · ${counts.upcoming} upcoming`}
              </p>
            </div>
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D33333] text-white text-[13px] font-medium rounded-xl hover:bg-[#b82c2c] transition-all"
            >
              <Plus className="size-4" />
              New Event
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-xl p-1 mb-6 w-fit">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap ${
                  filter === key
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {label}
                <span className={`ml-1.5 text-[11px] ${filter === key ? "text-zinc-400" : "text-zinc-300"}`}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} onOpen={() => setOpenEvent(event)} />
            ))}
            <button
              onClick={() => setShowNew(true)}
              className="group flex flex-col items-center justify-center min-h-[280px] rounded-2xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
            >
              <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3 group-hover:bg-zinc-200 transition-all">
                <Plus className="size-5 text-zinc-500" />
              </div>
              <span className="text-[13px] font-semibold text-zinc-500 group-hover:text-zinc-700 transition-colors">
                New Event
              </span>
              <span className="text-[11px] text-zinc-400 mt-0.5">Add to museum programme</span>
            </button>
          </div>
        </div>
      </PageShell>

      {/* Event detail / edit modal */}
      {openEvent && (
        <EventDetailModal
          event={openEvent}
          onClose={() => setOpenEvent(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {/* Gallery picker for New Event */}
      {showNewGallery && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm"
          onClick={() => setShowNewGallery(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <p className="text-[14px] font-semibold text-zinc-900">Media Library</p>
              <button onClick={() => setShowNewGallery(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-4 gap-2 max-h-72 overflow-y-auto">
              {GALLERY.map((url) => {
                const selected = form.imageUrl === url;
                return (
                  <button
                    key={url}
                    onClick={() => { setForm((f) => ({ ...f, imageUrl: url })); setShowNewGallery(false); }}
                    className={`relative rounded-xl overflow-hidden aspect-square transition-all ${selected ? "ring-2 ring-zinc-900 ring-offset-2" : "hover:ring-2 hover:ring-zinc-400 hover:ring-offset-1"}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {selected && (
                      <div className="absolute inset-0 bg-zinc-900/30 flex items-center justify-center">
                        <div className="size-6 bg-zinc-900 rounded-full flex items-center justify-center">
                          <Check className="size-3.5 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {showNew && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm"
          onClick={() => setShowNew(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <div>
                <p className="text-[15px] font-semibold text-zinc-900">New Event</p>
                <p className="text-[12px] text-zinc-400 mt-0.5">Add to your museum programme</p>
              </div>
              <button onClick={() => setShowNew(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
                  Title <span className="text-zinc-300">(required)</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Greek Ceramics Special Exhibition"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the event…"
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-300 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
                    Start <span className="text-zinc-300">(required)</span>
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
                    End
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    min={form.startDate}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 -mt-2">Leave end date empty for single-day events.</p>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-300 pointer-events-none" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="Hall B, Ground Floor"
                    className="w-full pl-8 pr-3 py-2 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
                  Image
                </label>
                {form.imageUrl ? (
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={form.imageUrl} alt="" className="w-full h-28 object-cover" />
                      <button
                        onClick={() => setShowNewGallery(true)}
                        className="absolute bottom-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-zinc-700 rounded-lg hover:bg-white transition-all shadow-sm"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                        className="absolute top-2 right-2 size-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-zinc-500 hover:text-red-600 transition-colors shadow-sm"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewGallery(true)}
                    className="w-full h-20 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-zinc-400 hover:bg-zinc-50 transition-all"
                  >
                    <ImageIcon className="size-4 text-zinc-300" />
                    <span className="text-[12px] text-zinc-400">Choose from gallery</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100">
              <button
                onClick={() => { setShowNew(false); setForm(EMPTY_FORM); }}
                className="px-4 py-2 border border-zinc-200 text-[13px] font-semibold text-zinc-600 rounded-lg hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
              <button
                disabled={!form.title || !form.startDate}
                onClick={handleCreate}
                className="px-5 py-2 bg-[#D33333] text-white text-[13px] font-medium rounded-lg hover:bg-[#b82c2c] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

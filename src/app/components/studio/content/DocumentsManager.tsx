import { useState, useRef, useMemo } from "react";
import { FileText, Upload, X, Search, Plus } from "lucide-react";
import { PageShell } from "../_layout/PageShell";
import { mockPOIs, mockGuides, mockDocuments } from "../../../data/mockData";

type Doc = {
  id: string;
  filename: string;
  size: string;
  type: "pdf" | "docx" | "txt" | "md";
  uploadedAt: string;
  tags: string[];
};

const DOC_TYPE_COLORS: Record<string, string> = {
  pdf:  "bg-red-50 text-red-500",
  docx: "bg-blue-50 text-blue-500",
  txt:  "bg-zinc-100 text-zinc-500",
  md:   "bg-purple-50 text-purple-500",
};

function DocIcon({ type }: { type: string }) {
  return (
    <div className={`size-8 rounded-lg flex items-center justify-center flex-shrink-0 ${DOC_TYPE_COLORS[type] ?? "bg-zinc-100 text-zinc-500"}`}>
      <FileText className="size-4" strokeWidth={1.5} />
    </div>
  );
}

export function DocumentsManager() {
  const [docs, setDocs] = useState<Doc[]>(mockDocuments);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [uploadPending, setUploadPending] = useState<{ filename: string; size: string; type: Doc["type"] } | null>(null);
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [uploadTagSearch, setUploadTagSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() =>
    docs.filter(d => {
      const matchTag = activeTag === null || d.tags.includes(activeTag);
      const matchSearch = d.filename.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    }),
    [docs, activeTag, search]
  );

  const tagLabel = (tag: string) => {
    if (tag === "museo") return "#museo";
    return mockGuides.find(g => g.id === tag)?.title
      ?? mockPOIs.find(p => p.id === tag)?.title
      ?? tag;
  };

  const guideTagsWithDocs = mockGuides.filter(g => docs.some(d => d.tags.includes(g.id)));
  const poiTagsWithDocs   = mockPOIs.filter(p => docs.some(d => d.tags.includes(p.id)));

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    const type: Doc["type"] = ext === "pdf" ? "pdf" : ext === "docx" ? "docx" : ext === "md" ? "md" : "txt";
    const size = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    setUploadPending({ filename: file.name, size, type });
    setUploadTags([]);
    setUploadTagSearch("");
    e.target.value = "";
  }

  function confirmUpload() {
    if (!uploadPending) return;
    setDocs(prev => [...prev, {
      id: `doc-upload-${Date.now()}`,
      filename: uploadPending.filename,
      size: uploadPending.size,
      type: uploadPending.type,
      uploadedAt: new Date().toISOString().slice(0, 10),
      tags: uploadTags,
    }]);
    setUploadPending(null);
  }

  function toggleUploadTag(tag: string) {
    setUploadTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-zinc-900">Knowledge Base</h1>
            <p className="text-[13px] text-zinc-500 mt-0.5">Documenti del museo — organizzati per guida e punto d'ascolto</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D33333] hover:bg-[#b82c2c] text-white text-[13px] font-medium transition-colors"
          >
            <Upload className="size-4" strokeWidth={1.5} />
            Carica documento
          </button>
          <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={handleFileInput} />
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">

          {/* ── Left: Tag navigation ──────────────────────── */}
          <aside className="w-[200px] flex-shrink-0 bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Filtra per tag</p>
            </div>
            <div className="py-1.5">

              {/* All */}
              <button
                onClick={() => setActiveTag(null)}
                className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors ${activeTag === null ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"}`}
              >
                <span className="text-[12px] font-medium">Tutti i documenti</span>
                <span className="text-[10px] text-zinc-400">{docs.length}</span>
              </button>

              {/* #museo */}
              <button
                onClick={() => setActiveTag("museo")}
                className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors ${activeTag === "museo" ? "bg-blue-50 text-blue-700" : "text-zinc-500 hover:bg-zinc-50"}`}
              >
                <span className="text-[12px] font-semibold text-blue-600">#museo</span>
                <span className="text-[10px] text-zinc-400">{docs.filter(d => d.tags.includes("museo")).length}</span>
              </button>

              {/* Guide */}
              {guideTagsWithDocs.length > 0 && (
                <>
                  <p className="text-[9px] font-semibold text-zinc-300 uppercase tracking-widest px-4 pt-3 pb-1">Guide</p>
                  {guideTagsWithDocs.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setActiveTag(g.id)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors ${activeTag === g.id ? "bg-violet-50 text-violet-700" : "text-zinc-500 hover:bg-zinc-50"}`}
                    >
                      <span className="text-[12px] font-medium truncate pr-2">{g.title}</span>
                      <span className="text-[10px] text-zinc-400 flex-shrink-0">{docs.filter(d => d.tags.includes(g.id)).length}</span>
                    </button>
                  ))}
                </>
              )}

              {/* POI */}
              {poiTagsWithDocs.length > 0 && (
                <>
                  <p className="text-[9px] font-semibold text-zinc-300 uppercase tracking-widest px-4 pt-3 pb-1">POI</p>
                  {poiTagsWithDocs.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setActiveTag(p.id)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors ${activeTag === p.id ? "bg-amber-50 text-amber-700" : "text-zinc-500 hover:bg-zinc-50"}`}
                    >
                      <span className="text-[12px] font-medium truncate pr-2">{p.title}</span>
                      <span className="text-[10px] text-zinc-400 flex-shrink-0">{docs.filter(d => d.tags.includes(p.id)).length}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
            <div className="px-4 py-2.5 border-t border-zinc-100">
              <p className="text-[10px] text-zinc-400">{docs.length} documenti totali</p>
            </div>
          </aside>

          {/* ── Right: Document list ──────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Search */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl mb-4 focus-within:border-zinc-400 transition-colors">
              <Search className="size-4 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cerca documenti…"
                className="flex-1 bg-transparent outline-none text-[13px] text-zinc-700 placeholder-zinc-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Active tag badge */}
            {activeTag && (
              <div className="flex items-center gap-2 mb-3">
                <span className={`flex items-center gap-1.5 px-3 py-1 text-[12px] font-medium rounded-full ${
                  activeTag === "museo" ? "bg-blue-50 text-blue-700" :
                  activeTag.startsWith("guide-") ? "bg-violet-50 text-violet-700" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {tagLabel(activeTag)}
                  <button onClick={() => setActiveTag(null)} className="opacity-60 hover:opacity-100 transition-opacity">
                    <X className="size-3" />
                  </button>
                </span>
                <span className="text-[12px] text-zinc-400">{filtered.length} risultati</span>
              </div>
            )}

            {/* Docs */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
                <FileText className="size-12 mb-3" strokeWidth={1} />
                <p className="text-[13px]">Nessun documento trovato</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 px-4 py-3.5 bg-white rounded-xl border border-zinc-100 hover:border-zinc-200 transition-all"
                  >
                    <DocIcon type={doc.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-zinc-800 truncate">{doc.filename}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{doc.uploadedAt} · {doc.size}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {doc.tags.length === 0 ? (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-zinc-100 text-zinc-400">senza tag</span>
                      ) : doc.tags.map(tag => (
                        <span key={tag} className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full ${
                          tag === "museo"            ? "bg-blue-50 text-blue-600" :
                          tag.startsWith("guide-")  ? "bg-violet-50 text-violet-600" :
                                                      "bg-amber-50 text-amber-600"
                        }`}>
                          {tagLabel(tag)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Upload modal ──────────────────────────────────── */}
      {uploadPending && (
        <div className="fixed inset-0 bg-zinc-950/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setUploadPending(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <p className="text-[14px] font-semibold text-zinc-900">Assegna tag al documento</p>
              <button onClick={() => setUploadPending(null)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                <X className="size-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* File preview */}
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <DocIcon type={uploadPending.type} />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-zinc-800 truncate">{uploadPending.filename}</p>
                  <p className="text-[11px] text-zinc-400">{uploadPending.size}</p>
                </div>
              </div>

              {/* Tag search */}
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus-within:border-zinc-400 transition-colors">
                <Search className="size-3.5 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                <input
                  autoFocus
                  value={uploadTagSearch}
                  onChange={e => setUploadTagSearch(e.target.value)}
                  placeholder="Cerca guida o POI…"
                  className="flex-1 bg-transparent outline-none text-[12px] text-zinc-700 placeholder-zinc-400"
                />
                {uploadTagSearch && (
                  <button onClick={() => setUploadTagSearch("")} className="text-zinc-400 hover:text-zinc-600">
                    <X className="size-3" />
                  </button>
                )}
              </div>

              {/* Selected tags summary */}
              {uploadTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {uploadTags.map(tag => (
                    <span key={tag} className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full ${
                      tag === "museo" ? "bg-blue-100 text-blue-700" :
                      tag.startsWith("guide-") ? "bg-violet-100 text-violet-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {tagLabel(tag)}
                      <button onClick={() => toggleUploadTag(tag)} className="opacity-60 hover:opacity-100 transition-opacity ml-0.5">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Chip groups */}
              <div className="space-y-3">
                {/* #museo */}
                {(uploadTagSearch === "" || "#museo".includes(uploadTagSearch.toLowerCase()) || "istituzionale".includes(uploadTagSearch.toLowerCase())) && (
                  <div>
                    <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Museo</p>
                    <button
                      onClick={() => toggleUploadTag("museo")}
                      className={`px-3 py-1.5 text-[12px] font-semibold rounded-full border-2 transition-all ${
                        uploadTags.includes("museo")
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-blue-200 text-blue-600 hover:border-blue-400"
                      }`}
                    >
                      #museo
                    </button>
                  </div>
                )}

                {/* Guide chips */}
                {(() => {
                  const visibleGuides = mockGuides.filter(g =>
                    uploadTagSearch === "" || g.title.toLowerCase().includes(uploadTagSearch.toLowerCase())
                  );
                  if (visibleGuides.length === 0) return null;
                  return (
                    <div>
                      <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Guide</p>
                      <div className="flex flex-wrap gap-1.5">
                        {visibleGuides.map(g => (
                          <button
                            key={g.id}
                            onClick={() => toggleUploadTag(g.id)}
                            className={`px-3 py-1.5 text-[12px] font-medium rounded-full border-2 transition-all ${
                              uploadTags.includes(g.id)
                                ? "bg-violet-600 border-violet-600 text-white"
                                : "bg-white border-violet-200 text-violet-600 hover:border-violet-400"
                            }`}
                          >
                            {g.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* POI chips */}
                {(() => {
                  const visiblePOIs = mockPOIs.filter(p =>
                    uploadTagSearch === "" || p.title.toLowerCase().includes(uploadTagSearch.toLowerCase())
                  );
                  if (visiblePOIs.length === 0) return null;
                  return (
                    <div>
                      <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">POI</p>
                      <div className="flex flex-wrap gap-1.5">
                        {visiblePOIs.map(p => (
                          <button
                            key={p.id}
                            onClick={() => toggleUploadTag(p.id)}
                            className={`px-3 py-1.5 text-[12px] font-medium rounded-full border-2 transition-all ${
                              uploadTags.includes(p.id)
                                ? "bg-amber-500 border-amber-500 text-white"
                                : "bg-white border-amber-200 text-amber-600 hover:border-amber-400"
                            }`}
                          >
                            {p.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* No results */}
                {uploadTagSearch !== "" &&
                  !mockGuides.some(g => g.title.toLowerCase().includes(uploadTagSearch.toLowerCase())) &&
                  !mockPOIs.some(p => p.title.toLowerCase().includes(uploadTagSearch.toLowerCase())) &&
                  !"#museo istituzionale".includes(uploadTagSearch.toLowerCase()) && (
                  <p className="text-[12px] text-zinc-400 py-2">Nessun risultato per "{uploadTagSearch}"</p>
                )}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-zinc-100 flex gap-2 justify-end">
              <button onClick={() => setUploadPending(null)} className="px-4 py-2 text-[12px] text-zinc-500 hover:bg-zinc-100 rounded-xl transition-colors">
                Annulla
              </button>
              <button onClick={confirmUpload} className="flex items-center gap-2 px-4 py-2 text-[12px] font-medium bg-[#D33333] text-white rounded-xl hover:bg-[#b82c2c] transition-colors">
                <Plus className="size-3.5" strokeWidth={2.5} />
                Aggiungi alla Knowledge Base
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

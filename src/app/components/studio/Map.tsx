import { MapEditor } from "./MapEditor";
import { PageShell } from "./PageShell";

export function Map() {
  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[22px] font-semibold text-zinc-950 tracking-tight mb-1">
            Map Configuration
          </h1>
          <p className="text-[13px] text-zinc-400 leading-relaxed">
            Upload floor plans and position points of interest to create an interactive map for visitors
          </p>
        </div>

        {/* Map Editor */}
        <MapEditor />
      </div>
    </PageShell>
  );
}

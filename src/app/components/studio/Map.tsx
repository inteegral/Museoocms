import { MapEditor } from "./MapEditor";

export function Map() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[32px] font-semibold text-zinc-950 tracking-tight mb-2">
            Configurazione Mappa
          </h1>
          <p className="text-[15px] text-zinc-600 leading-relaxed">
            Carica le planimetrie del museo e posiziona i punti di interesse per creare una mappa interattiva per i visitatori
          </p>
        </div>

        {/* Map Editor */}
        <MapEditor />
      </div>
    </div>
  );
}

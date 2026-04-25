import { useState, useRef, useEffect } from "react";
import {
  Upload, Plus, X, MapPin, Trash2, Layers, ZoomIn, ZoomOut,
  Image as ImageIcon, Save, RotateCcw, Building2, GripVertical,
  LocateFixed, Satellite, Navigation, Globe,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type MapMode = "indoor" | "outdoor";

interface FloorMap  { id: string; name: string; imageUrl: string | null; order: number; }
interface POIMarker { id: string; name: string; x: number; y: number; floorId: string; lat?: number; lng?: number; }

// ── Tile helpers (zoom-aware) ─────────────────────────────────────────────────
const TILE = 256;

function toFrac(lat: number, lng: number, zoom: number) {
  const n = Math.pow(2, zoom);
  return {
    x: (lng + 180) / 360 * n,
    y: (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n,
  };
}
function fromFrac(fx: number, fy: number, zoom: number) {
  const n = Math.pow(2, zoom);
  return {
    lat: Math.atan(Math.sinh(Math.PI * (1 - 2 * fy / n))) * 180 / Math.PI,
    lng: fx / n * 360 - 180,
  };
}

// ── Mock POIs ─────────────────────────────────────────────────────────────────
const mockPOIs = [
  { id: "1", name: "Renaissance Hall" },
  { id: "2", name: "Ancient Sculptures" },
  { id: "3", name: "Modern Art Wing" },
  { id: "4", name: "Impressionist Gallery" },
  { id: "5", name: "Medieval Artifacts" },
  { id: "6", name: "Contemporary Exhibit" },
  { id: "7", name: "Asian Art Collection" },
  { id: "8", name: "Entrance Hall" },
];

// ── GeoModal ──────────────────────────────────────────────────────────────────
const GEO_ZOOM = 17;

function TileMap({ initLat, initLng, onMove }: { initLat: number; initLng: number; onMove: (lat: number, lng: number) => void }) {
  const W = 400, H = 240;
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingPin = useRef(false);
  const [pinPos, setPinPos] = useState({ x: W / 2, y: H / 2 });

  const center  = toFrac(initLat, initLng, GEO_ZOOM);
  const offsetX = W / 2 - center.x * TILE;
  const offsetY = H / 2 - center.y * TILE;

  const startTX = Math.floor((center.x * TILE - W / 2) / TILE) - 1;
  const endTX   = Math.ceil ((center.x * TILE + W / 2) / TILE) + 1;
  const startTY = Math.floor((center.y * TILE - H / 2) / TILE) - 1;
  const endTY   = Math.ceil ((center.y * TILE + H / 2) / TILE) + 1;

  const handlePinMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingPin.current = true;
    const onMov = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setPinPos({ x: Math.max(8, Math.min(W-8, ev.clientX-r.left)), y: Math.max(8, Math.min(H-8, ev.clientY-r.top)) });
    };
    const onUp = (ev: MouseEvent) => {
      isDraggingPin.current = false;
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const x = Math.max(8, Math.min(W-8, ev.clientX-r.left));
      const y = Math.max(8, Math.min(H-8, ev.clientY-r.top));
      setPinPos({ x, y });
      const { lat, lng } = fromFrac((x - offsetX) / TILE, (y - offsetY) / TILE, GEO_ZOOM);
      onMove(lat, lng);
      window.removeEventListener("mousemove", onMov);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMov);
    window.addEventListener("mouseup", onUp);
  };

  const tiles: React.ReactNode[] = [];
  for (let ty = startTY; ty <= endTY; ty++)
    for (let tx = startTX; tx <= endTX; tx++)
      tiles.push(<img key={`${tx}-${ty}`} src={`https://tile.openstreetmap.org/${GEO_ZOOM}/${tx}/${ty}.png`} alt="" draggable={false}
        style={{ position:"absolute", left: tx*TILE+offsetX, top: ty*TILE+offsetY, width:TILE, height:TILE }} />);

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 select-none" style={{ width: W, height: H }}>
      {tiles}
      <div onMouseDown={handlePinMouseDown} style={{ position:"absolute", left:pinPos.x, top:pinPos.y, transform:"translate(-50%,-100%)", cursor:"grab", zIndex:10, filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.35))", touchAction:"none" }}>
        <MapPin size={30} color="#D33333" fill="#D33333" strokeWidth={1.5} />
      </div>
      <div className="absolute top-2 left-2 bg-white/85 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-semibold text-zinc-600 pointer-events-none">Drag pin to refine</div>
      <div className="absolute bottom-1 right-1 bg-white/80 px-1.5 py-0.5 rounded text-[9px] text-zinc-400 pointer-events-none">© OpenStreetMap contributors</div>
    </div>
  );
}

function GeoModal({ marker, onSave, onClose }: { marker: POIMarker; onSave: (id: string, lat: number, lng: number) => void; onClose: () => void }) {
  const [lat, setLat]   = useState<string>(marker.lat != null ? String(marker.lat) : "");
  const [lng, setLng]   = useState<string>(marker.lng != null ? String(marker.lng) : "");
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState("");
  const [mapKey, setMapKey]     = useState(0);

  const hasCoords  = lat !== "" && lng !== "" && !isNaN(Number(lat)) && !isNaN(Number(lng));
  const commitInputs = () => { if (hasCoords) setMapKey(k => k+1); };

  const useMyLocation = () => {
    if (!navigator.geolocation) { setGeoError("Geolocation not supported."); return; }
    setLocating(true); setGeoError("");
    navigator.geolocation.getCurrentPosition(
      pos => { setLat(pos.coords.latitude.toFixed(6)); setLng(pos.coords.longitude.toFixed(6)); setLocating(false); setMapKey(k=>k+1); },
      ()  => { setGeoError("Unable to retrieve location. Check browser permissions."); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">GPS Location</p>
            <h2 className="text-[15px] font-semibold text-zinc-950">{marker.name}</h2>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"><X className="size-4 text-zinc-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {([["Latitude","41.902782",lat,setLat],["Longitude","12.496366",lng,setLng]] as [string,string,string,React.Dispatch<React.SetStateAction<string>>][]).map(([label,ph,val,set]) => (
              <div key={label}>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">{label}</label>
                <input type="number" step="0.000001" value={val} onChange={e=>set(e.target.value)} onBlur={commitInputs} onKeyDown={e=>e.key==="Enter"&&commitInputs()} placeholder={ph}
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition tabular-nums" />
              </div>
            ))}
          </div>
          <button onClick={useMyLocation} disabled={locating} className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 transition-all">
            {locating ? <><Navigation className="size-4 animate-spin text-[#D33333]" />Detecting…</> : <><LocateFixed className="size-4 text-[#D33333]" />Use my current location</>}
          </button>
          {geoError && <p className="text-[11px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{geoError}</p>}
          {hasCoords
            ? <TileMap key={mapKey} initLat={Number(lat)} initLng={Number(lng)} onMove={(la,ln)=>{ setLat(la.toFixed(6)); setLng(ln.toFixed(6)); }} />
            : <div className="h-[120px] rounded-xl border border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-2"><Satellite className="size-6 text-zinc-300" /><p className="text-[12px] text-zinc-400">Enter coordinates or use current location</p></div>
          }
        </div>
        <div className="px-6 pb-6 flex flex-col items-center gap-2">
          <button onClick={()=>{ if(hasCoords) onSave(marker.id, Number(lat), Number(lng)); }} disabled={!hasCoords}
            className="w-full py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all">Save GPS Location</button>
          {marker.lat != null
            ? <button onClick={()=>onSave(marker.id,NaN,NaN)} className="text-[12px] text-red-400 hover:text-red-600 transition-colors">Remove coordinates</button>
            : <button onClick={onClose} className="text-[12px] text-zinc-400 hover:text-zinc-600 transition-colors">Cancel</button>
          }
        </div>
      </div>
    </div>
  );
}

// ── Outdoor OSM map ───────────────────────────────────────────────────────────
const OUT_ZOOM = 17;
const OUT_DEFAULT = { lat: 41.9028, lng: 12.4964 };

function OutdoorMap({
  markers, setMarkers, geoMarkerId, setGeoMarkerId,
}: {
  markers: POIMarker[];
  setMarkers: React.Dispatch<React.SetStateAction<POIMarker[]>>;
  geoMarkerId: string | null;
  setGeoMarkerId: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const canvasRef     = useRef<HTMLDivElement>(null);
  const [centerLat, setCenterLat] = useState(OUT_DEFAULT.lat);
  const [centerLng, setCenterLng] = useState(OUT_DEFAULT.lng);
  const [isDragOver, setIsDragOver]   = useState(false);
  const [draggingId, setDraggingId]   = useState<string | null>(null);
  const justDraggedRef = useRef(false);
  const panRef = useRef<{ startX: number; startY: number; startLat: number; startLng: number } | null>(null);

  const W = 620, H = 560; // approximate canvas dimensions

  const center  = toFrac(centerLat, centerLng, OUT_ZOOM);
  const offsetX = W / 2 - center.x * TILE;
  const offsetY = H / 2 - center.y * TILE;

  const startTX = Math.floor((center.x * TILE - W/2) / TILE) - 1;
  const endTX   = Math.ceil ((center.x * TILE + W/2) / TILE) + 1;
  const startTY = Math.floor((center.y * TILE - H/2) / TILE) - 1;
  const endTY   = Math.ceil ((center.y * TILE + H/2) / TILE) + 1;

  const toPx = (lat: number, lng: number) => {
    const f = toFrac(lat, lng, OUT_ZOOM);
    return { x: f.x * TILE + offsetX, y: f.y * TILE + offsetY };
  };

  const pxToLatLng = (px: number, py: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const fx = (px - (rect.width  / 2 - center.x * TILE)) / TILE;
    const fy = (py - (rect.height / 2 - center.y * TILE)) / TILE;
    return fromFrac(fx, fy, OUT_ZOOM);
  };

  // ── Pan ──
  const handleMapMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-marker]")) return;
    panRef.current = { startX: e.clientX, startY: e.clientY, startLat: centerLat, startLng: centerLng };
  };
  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!panRef.current) return;
    const dx = e.clientX - panRef.current.startX;
    const dy = e.clientY - panRef.current.startY;
    const startFrac = toFrac(panRef.current.startLat, panRef.current.startLng, OUT_ZOOM);
    const { lat, lng } = fromFrac(startFrac.x - dx / TILE, startFrac.y - dy / TILE, OUT_ZOOM);
    setCenterLat(lat); setCenterLng(lng);
  };
  const handleMapMouseUp = () => { panRef.current = null; };

  // ── Drop ──
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    if (!canvasRef.current) return;
    const rect  = canvasRef.current.getBoundingClientRect();
    const { lat, lng } = pxToLatLng(e.clientX - rect.left, e.clientY - rect.top);
    const poiId    = e.dataTransfer.getData("poiId");
    const markerId = e.dataTransfer.getData("markerId");
    if (poiId) {
      const poi = mockPOIs.find(p => p.id === poiId);
      if (!poi) return;
      const exists = markers.findIndex(m => m.id === poiId);
      if (exists >= 0) setMarkers(ms => ms.map(m => m.id === poiId ? { ...m, lat, lng } : m));
      else setMarkers(ms => [...ms, { id: poi.id, name: poi.name, x: 0, y: 0, floorId: "outdoor", lat, lng }]);
    } else if (markerId) {
      setMarkers(ms => ms.map(m => m.id === markerId ? { ...m, lat, lng } : m));
      setDraggingId(null);
    }
  };

  const outdoorMarkers = markers.filter(m => m.lat != null && m.lng != null);
  const placedIds      = outdoorMarkers.map(m => m.id);
  const unplaced       = mockPOIs.filter(p => !placedIds.includes(p.id));
  const removeMarker   = (id: string) => setMarkers(ms => ms.filter(m => m.id !== id));

  const tiles: React.ReactNode[] = [];
  for (let ty = startTY; ty <= endTY; ty++)
    for (let tx = startTX; tx <= endTX; tx++)
      tiles.push(<img key={`${tx}-${ty}`} src={`https://tile.openstreetmap.org/${OUT_ZOOM}/${tx}/${ty}.png`} alt="" draggable={false}
        style={{ position:"absolute", left:tx*TILE+offsetX, top:ty*TILE+offsetY, width:TILE, height:TILE, pointerEvents:"none" }} />);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-5">
        {/* Unplaced POIs */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow:"0 1px 3px 0 rgba(0,0,0,0.04)" }}>
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50">
            <h3 className="text-[13px] font-semibold text-zinc-900">Available POIs</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Drag onto the map to set GPS position</p>
          </div>
          <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
            {unplaced.length === 0
              ? <div className="py-8 text-center"><Globe className="size-5 text-zinc-300 mx-auto mb-2" /><p className="text-[12px] text-zinc-400">All POIs placed</p></div>
              : unplaced.map(poi => (
                <div key={poi.id} draggable onDragStart={e=>{ e.dataTransfer.setData("poiId", poi.id); e.dataTransfer.effectAllowed="move"; }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 cursor-grab active:cursor-grabbing transition-colors select-none group">
                  <GripVertical className="size-3.5 text-zinc-300 group-hover:text-zinc-400 flex-shrink-0 transition-colors" />
                  <div className="size-6 rounded-md bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0">
                    <MapPin className="size-3 text-zinc-400" />
                  </div>
                  <span className="text-[13px] font-medium text-zinc-700 truncate">{poi.name}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Placed markers */}
        {outdoorMarkers.length > 0 && (
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow:"0 1px 3px 0 rgba(0,0,0,0.04)" }}>
            <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-zinc-900">Placed outdoors</h3>
              <button onClick={()=>setMarkers(ms=>ms.filter(m=>!placedIds.includes(m.id)))} className="text-[11px] text-red-500 hover:text-red-700 font-semibold transition-colors">Clear all</button>
            </div>
            <div className="p-2 space-y-1 max-h-[260px] overflow-y-auto">
              {outdoorMarkers.map(m => (
                <div key={m.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors group">
                  <div className="size-5 rounded-full bg-[#D33333] flex items-center justify-center flex-shrink-0">
                    <MapPin className="size-2.5 text-white" fill="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] text-zinc-700 truncate block">{m.name}</span>
                    <span className="text-[10px] text-zinc-400 tabular-nums">{m.lat!.toFixed(4)}, {m.lng!.toFixed(4)}</span>
                  </div>
                  <button onClick={()=>setGeoMarkerId(m.id)} className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-all">
                    <LocateFixed className="size-2.5" />GPS
                  </button>
                  <button onClick={()=>removeMarker(m.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-colors">
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* OSM Canvas */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow:"0 1px 3px 0 rgba(0,0,0,0.04)" }}>
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold text-zinc-900">Outdoor Map</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">Drag to pan · drop POIs from sidebar to place</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-white border border-zinc-200 rounded-lg p-0.5">
                <button onClick={()=>setCenterLat(l=>l)} className="px-2 py-1.5 hover:bg-zinc-100 rounded-md transition-colors">
                  <ZoomOut className="size-3.5 text-zinc-600" />
                </button>
                <span className="text-[11px] font-semibold text-zinc-600 px-2 tabular-nums">{OUT_ZOOM}</span>
                <button onClick={()=>setCenterLat(l=>l)} className="px-2 py-1.5 hover:bg-zinc-100 rounded-md transition-colors">
                  <ZoomIn className="size-3.5 text-zinc-600" />
                </button>
              </div>
              <button onClick={()=>{ setCenterLat(OUT_DEFAULT.lat); setCenterLng(OUT_DEFAULT.lng); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                <LocateFixed className="size-3.5 text-[#D33333]" />Reset
              </button>
            </div>
          </div>
          <div className="p-5 bg-zinc-50/50">
            <div
              ref={canvasRef}
              className={`relative overflow-hidden rounded-xl border-2 transition-colors cursor-grab active:cursor-grabbing ${isDragOver ? "border-[#D33333] shadow-[0_0_0_4px_rgba(211,51,51,0.08)]" : "border-zinc-200"}`}
              style={{ height: 560 }}
              onMouseDown={handleMapMouseDown}
              onMouseMove={handleMapMouseMove}
              onMouseUp={handleMapMouseUp}
              onMouseLeave={handleMapMouseUp}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Tiles */}
              <div className="absolute inset-0 overflow-hidden">{tiles}</div>

              {/* Drop overlay */}
              {isDragOver && (
                <div className="absolute inset-0 bg-[#D33333]/5 flex items-center justify-center pointer-events-none z-10">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-[#D33333]/20">
                    <p className="text-[12px] font-semibold text-[#D33333]">Drop to place</p>
                  </div>
                </div>
              )}

              {/* Markers */}
              {outdoorMarkers.map(marker => {
                const px = toPx(marker.lat!, marker.lng!);
                return (
                  <div key={marker.id}
                    data-marker="true"
                    draggable
                    onDragStart={e=>{ e.stopPropagation(); e.dataTransfer.setData("markerId",marker.id); e.dataTransfer.effectAllowed="move"; setDraggingId(marker.id); justDraggedRef.current=false; }}
                    onDragEnd={()=>{ setDraggingId(null); justDraggedRef.current=true; setTimeout(()=>{justDraggedRef.current=false;},200); }}
                    onClick={()=>{ if(!justDraggedRef.current) setGeoMarkerId(marker.id); }}
                    className={`absolute -translate-x-1/2 -translate-y-full group cursor-grab active:cursor-grabbing transition-opacity ${draggingId===marker.id?"opacity-30":"opacity-100"}`}
                    style={{ left:px.x, top:px.y, zIndex:5 }}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="size-8 bg-[#D33333] rounded-full border-[3px] border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                        <MapPin className="size-3.5 text-white" fill="white" />
                      </div>
                      <div className="w-px h-2 bg-[#D33333]" />
                      <div className="absolute top-0 size-8 bg-[#D33333] rounded-full animate-ping opacity-20 pointer-events-none" />
                      <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        <div className="bg-zinc-900 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-xl">
                          {marker.name}<br />
                          <span className="text-white/40 font-normal text-[10px]">click for GPS · drag to move</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Attribution */}
              <div className="absolute bottom-2 right-2 z-10 bg-white/80 px-1.5 py-0.5 rounded text-[9px] text-zinc-400 pointer-events-none">© OpenStreetMap contributors</div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-[#D33333]" /><span>Drag to reposition · click for GPS</span></div>
              </div>
              <span>{outdoorMarkers.length} {outdoorMarkers.length===1?"marker":"markers"} placed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MapEditor ─────────────────────────────────────────────────────────────────
export function MapEditor() {
  const [mapMode, setMapMode] = useState<MapMode>("indoor");

  // Indoor state
  const [floors, setFloors]         = useState<FloorMap[]>([
    { id: "ground", name: "Ground Floor", imageUrl: null, order: 0 },
    { id: "first",  name: "First Floor",  imageUrl: null, order: 1 },
  ]);
  const [activeFloorId, setActiveFloorId] = useState("ground");
  const [markers, setMarkers]             = useState<POIMarker[]>([]);
  const [isDragOver, setIsDragOver]       = useState(false);
  const [draggingMarkerId, setDraggingMarkerId] = useState<string | null>(null);
  const [showAddFloor, setShowAddFloor]   = useState(false);
  const [newFloorName, setNewFloorName]   = useState("");
  const [zoom, setZoom]                   = useState(100);
  const [geoMarkerId, setGeoMarkerId]     = useState<string | null>(null);
  const fileRef         = useRef<HTMLInputElement>(null);
  const justDraggedRef  = useRef(false);

  const activeFloor   = floors.find(f => f.id === activeFloorId)!;
  const activeMarkers = markers.filter(m => m.floorId === activeFloorId);
  const placedIds     = markers.map(m => m.id);
  const unplaced      = mockPOIs.filter(p => !placedIds.includes(p.id));
  const geoMarker     = geoMarkerId ? markers.find(m => m.id === geoMarkerId) ?? null : null;

  function dropPosition(e: React.DragEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: Math.min(Math.max(((e.clientX-rect.left)/rect.width)*100,2),98), y: Math.min(Math.max(((e.clientY-rect.top)/rect.height)*100,2),98) };
  }
  const onDragOver  = (e: React.DragEvent<HTMLDivElement>) => { if (!activeFloor.imageUrl) return; e.preventDefault(); e.dataTransfer.dropEffect="move"; setIsDragOver(true); };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false); };
  const onDrop      = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragOver(false);
    if (!activeFloor.imageUrl) return;
    const {x,y}    = dropPosition(e);
    const poiId    = e.dataTransfer.getData("poiId");
    const markerId = e.dataTransfer.getData("markerId");
    if (poiId) {
      const poi = mockPOIs.find(p => p.id === poiId);
      if (!poi) return;
      const idx = markers.findIndex(m => m.id === poiId);
      if (idx >= 0) setMarkers(ms => ms.map(m => m.id===poiId ? {...m,x,y,floorId:activeFloorId} : m));
      else setMarkers(ms => [...ms, {id:poi.id,name:poi.name,x,y,floorId:activeFloorId}]);
    } else if (markerId) {
      setMarkers(ms => ms.map(m => m.id===markerId ? {...m,x,y} : m));
      setDraggingMarkerId(null);
    }
  };
  const saveGeo = (id:string,lat:number,lng:number) => {
    if (isNaN(lat)||isNaN(lng)) setMarkers(ms=>ms.map(m=>m.id===id?{...m,lat:undefined,lng:undefined}:m));
    else setMarkers(ms=>ms.map(m=>m.id===id?{...m,lat,lng}:m));
    setGeoMarkerId(null);
  };
  const handleUpload = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>setFloors(fs=>fs.map(f=>f.id===activeFloorId?{...f,imageUrl:ev.target?.result as string}:f));
    reader.readAsDataURL(file);
  };
  const addFloor = () => {
    if (!newFloorName.trim()) return;
    const f:FloorMap={id:`floor-${Date.now()}`,name:newFloorName.trim(),imageUrl:null,order:floors.length};
    setFloors(fs=>[...fs,f]); setActiveFloorId(f.id); setNewFloorName(""); setShowAddFloor(false);
  };
  const deleteFloor  = (id:string) => {
    if (floors.length<=1) return;
    setFloors(fs=>fs.filter(f=>f.id!==id));
    setMarkers(ms=>ms.filter(m=>m.floorId!==id));
    if (activeFloorId===id) setActiveFloorId(floors[0].id);
  };
  const removeMarker = (id:string) => setMarkers(ms=>ms.filter(m=>m.id!==id));

  return (
    <div className="space-y-6">

      {/* ── Mode toggle ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-zinc-100 p-1 rounded-xl gap-1">
          {([
            { mode:"indoor"  as MapMode, Icon:Building2, label:"Indoor",  sub:"Floor plan"  },
            { mode:"outdoor" as MapMode, Icon:Globe,     label:"Outdoor", sub:"Street map"  },
          ]).map(({mode,Icon,label,sub})=>(
            <button key={mode} onClick={()=>setMapMode(mode)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-left transition-all ${mapMode===mode?"bg-white shadow-sm":"hover:bg-zinc-50"}`}
            >
              <Icon className={`size-4 flex-shrink-0 ${mapMode===mode?"text-zinc-900":"text-zinc-400"}`} />
              <div>
                <p className={`text-[13px] font-semibold leading-tight ${mapMode===mode?"text-zinc-900":"text-zinc-500"}`}>{label}</p>
                <p className={`text-[10px] leading-tight ${mapMode===mode?"text-zinc-400":"text-zinc-400"}`}>{sub}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-[12px] text-zinc-400">
          {mapMode==="indoor"
            ? "Upload a floor plan and place POIs on it — for museum rooms and galleries"
            : "Position POIs on a real-world map — for open-air sites or urban itineraries"}
        </p>
      </div>

      {/* ── Outdoor mode ───────────────────────────────────────────────── */}
      {mapMode === "outdoor" && (
        <OutdoorMap markers={markers} setMarkers={setMarkers} geoMarkerId={geoMarkerId} setGeoMarkerId={setGeoMarkerId} />
      )}

      {/* ── Indoor mode ────────────────────────────────────────────────── */}
      {mapMode === "indoor" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Floors */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{boxShadow:"0 1px 3px 0 rgba(0,0,0,0.04)"}}>
              <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-2"><Layers className="size-4 text-zinc-500" /><h3 className="text-[13px] font-semibold text-zinc-900">Floors & Areas</h3></div>
                <button onClick={()=>setShowAddFloor(true)} className="size-7 flex items-center justify-center rounded-md hover:bg-zinc-200 transition-colors"><Plus className="size-4 text-zinc-600" /></button>
              </div>
              <div className="p-2 space-y-1">
                {floors.map(floor=>{
                  const active=floor.id===activeFloorId;
                  return (
                    <div key={floor.id} onClick={()=>setActiveFloorId(floor.id)}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${active?"bg-zinc-900":"hover:bg-zinc-50"}`}>
                      <div className={`size-7 rounded-md flex items-center justify-center flex-shrink-0 ${active?"bg-white/15":"bg-zinc-100"}`}>
                        {floor.imageUrl?<ImageIcon className={`size-3.5 ${active?"text-white":"text-zinc-500"}`}/>:<Building2 className={`size-3.5 ${active?"text-white":"text-zinc-400"}`}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-semibold truncate ${active?"text-white":"text-zinc-900"}`}>{floor.name}</p>
                        <p className={`text-[11px] ${active?"text-white/60":"text-zinc-400"}`}>{markers.filter(m=>m.floorId===floor.id).length} POIs</p>
                      </div>
                      {floors.length>1&&<button onClick={e=>{e.stopPropagation();deleteFloor(floor.id);}} className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition-all ${active?"text-white hover:text-red-600":"text-zinc-400 hover:text-red-600"}`}><Trash2 className="size-3.5"/></button>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available POIs */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{boxShadow:"0 1px 3px 0 rgba(0,0,0,0.04)"}}>
              <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50">
                <h3 className="text-[13px] font-semibold text-zinc-900">Available POIs</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Drag onto the map to position</p>
              </div>
              <div className="p-2 space-y-1 max-h-[360px] overflow-y-auto">
                {unplaced.length===0
                  ?<div className="py-10 text-center"><MapPin className="size-6 text-zinc-300 mx-auto mb-2"/><p className="text-[12px] text-zinc-400">All POIs placed</p></div>
                  :unplaced.map(poi=>(
                    <div key={poi.id} draggable onDragStart={e=>{e.dataTransfer.setData("poiId",poi.id);e.dataTransfer.effectAllowed="move";}}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 cursor-grab active:cursor-grabbing transition-colors select-none group">
                      <GripVertical className="size-3.5 text-zinc-300 group-hover:text-zinc-400 flex-shrink-0 transition-colors"/>
                      <div className="size-6 rounded-md bg-white border border-zinc-200 flex items-center justify-center flex-shrink-0"><MapPin className="size-3 text-zinc-400"/></div>
                      <span className="text-[13px] font-medium text-zinc-700 truncate">{poi.name}</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Placed markers */}
            {activeMarkers.length>0&&(
              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{boxShadow:"0 1px 3px 0 rgba(0,0,0,0.04)"}}>
                <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                  <h3 className="text-[13px] font-semibold text-zinc-900">Placed on {activeFloor.name}</h3>
                  <button onClick={()=>setMarkers(ms=>ms.filter(m=>m.floorId!==activeFloorId))} className="text-[11px] text-red-500 hover:text-red-700 font-semibold transition-colors">Clear all</button>
                </div>
                <div className="p-2 space-y-1 max-h-[280px] overflow-y-auto">
                  {activeMarkers.map(m=>(
                    <div key={m.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors group">
                      <div className="size-5 rounded-full bg-[#D33333] flex items-center justify-center flex-shrink-0"><MapPin className="size-2.5 text-white" fill="white"/></div>
                      <span className="flex-1 text-[13px] text-zinc-700 truncate">{m.name}</span>
                      <button onClick={()=>setGeoMarkerId(m.id)} title={m.lat!=null?`GPS: ${m.lat.toFixed(4)}, ${m.lng!.toFixed(4)}`:"Set GPS location"}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${m.lat!=null?"bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100":"bg-zinc-100 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 opacity-0 group-hover:opacity-100"}`}>
                        <LocateFixed className="size-2.5"/>{m.lat!=null?"GPS":"Add GPS"}
                      </button>
                      <button onClick={()=>removeMarker(m.id)} className="p-1 rounded hover:bg-red-50 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><X className="size-3.5"/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Indoor canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{boxShadow:"0 1px 3px 0 rgba(0,0,0,0.04)"}}>
              <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-zinc-900">{activeFloor.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-white border border-zinc-200 rounded-lg p-0.5">
                    <button onClick={()=>setZoom(Math.max(50,zoom-10))} className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors"><ZoomOut className="size-3.5 text-zinc-600"/></button>
                    <span className="text-[11px] font-semibold text-zinc-600 px-2 tabular-nums">{zoom}%</span>
                    <button onClick={()=>setZoom(Math.min(200,zoom+10))} className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors"><ZoomIn className="size-3.5 text-zinc-600"/></button>
                  </div>
                  {activeFloor.imageUrl
                    ?<button onClick={()=>fileRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[12px] font-semibold rounded-lg hover:bg-zinc-50 transition-all"><RotateCcw className="size-3.5"/>Change</button>
                    :<button onClick={()=>fileRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-800 transition-all"><Upload className="size-3.5"/>Upload Floor Plan</button>
                  }
                </div>
              </div>
              <div className="p-5 bg-zinc-50/50">
                <div className={`relative bg-white rounded-xl overflow-hidden border-2 transition-colors ${isDragOver&&activeFloor.imageUrl?"border-[#D33333] shadow-[0_0_0_4px_rgba(211,51,51,0.08)]":"border-zinc-200"}`}
                  style={{height:560,transform:`scale(${zoom/100})`,transformOrigin:"top left"}}
                  onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                  {activeFloor.imageUrl?(
                    <>
                      <img src={activeFloor.imageUrl} alt={activeFloor.name} className="w-full h-full object-contain" draggable={false}/>
                      {isDragOver&&<div className="absolute inset-0 bg-[#D33333]/5 flex items-center justify-center pointer-events-none"><div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-[#D33333]/20"><p className="text-[12px] font-semibold text-[#D33333]">Drop to place</p></div></div>}
                      {activeMarkers.map(marker=>(
                        <div key={marker.id} draggable
                          onDragStart={e=>{e.stopPropagation();e.dataTransfer.setData("markerId",marker.id);e.dataTransfer.effectAllowed="move";setDraggingMarkerId(marker.id);justDraggedRef.current=false;}}
                          onDragEnd={()=>{setDraggingMarkerId(null);justDraggedRef.current=true;setTimeout(()=>{justDraggedRef.current=false;},200);}}
                          onClick={()=>{if(!justDraggedRef.current) setGeoMarkerId(marker.id);}}
                          className={`absolute -translate-x-1/2 -translate-y-full group cursor-grab active:cursor-grabbing transition-opacity ${draggingMarkerId===marker.id?"opacity-30":"opacity-100"}`}
                          style={{left:`${marker.x}%`,top:`${marker.y}%`}}>
                          <div className="relative flex flex-col items-center">
                            {marker.lat!=null&&<div className="absolute -top-1 -right-1 size-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center z-10"><LocateFixed className="size-2 text-white"/></div>}
                            <div className="size-8 bg-[#D33333] rounded-full border-[3px] border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"><MapPin className="size-3.5 text-white" fill="white"/></div>
                            <div className="w-px h-2 bg-[#D33333]"/>
                            <div className="absolute top-0 size-8 bg-[#D33333] rounded-full animate-ping opacity-20 pointer-events-none"/>
                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                              <div className="bg-zinc-900 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-xl">{marker.name}{marker.lat!=null?<><br/><span className="text-emerald-400 font-normal text-[10px]">GPS set</span></>:<><br/><span className="text-white/40 font-normal text-[10px]">click GPS · drag move</span></>}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ):(
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="size-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4"><ImageIcon className="size-8 text-zinc-300"/></div>
                      <p className="text-[14px] font-semibold text-zinc-700 mb-1">No floor plan uploaded</p>
                      <p className="text-[12px] text-zinc-400 mb-5 text-center max-w-[240px]">Upload a floor plan image to start placing POI markers</p>
                      <button onClick={()=>fileRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all"><Upload className="size-4"/>Upload Floor Plan</button>
                    </div>
                  )}
                </div>
                {activeFloor.imageUrl&&(
                  <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-[#D33333]"/><span>Drag to reposition · click to set GPS</span></div>
                      <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-emerald-500"/><span>GPS set</span></div>
                    </div>
                    <span>{activeMarkers.length} {activeMarkers.length===1?"marker":"markers"}</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden"/>
            </div>
          </div>
        </div>
      )}

      {/* Save actions */}
      <div className="flex gap-3">
        <button className="px-5 py-2.5 text-[13px] font-semibold text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all">Reset Changes</button>
        <button className="flex-1 px-5 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all inline-flex items-center justify-center gap-2"><Save className="size-4"/>Save Map Configuration</button>
      </div>

      {/* Add floor modal */}
      {showAddFloor&&(
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
              <h2 className="text-[15px] font-semibold text-zinc-950">Add Floor / Area</h2>
              <button onClick={()=>setShowAddFloor(false)} className="size-7 flex items-center justify-center rounded-md hover:bg-zinc-100 transition-colors"><X className="size-4 text-zinc-500"/></button>
            </div>
            <div className="px-6 py-5">
              <input autoFocus type="text" value={newFloorName} onChange={e=>setNewFloorName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addFloor()}
                placeholder="e.g. Second Floor, Outdoor Garden…"
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-lg text-[13px] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"/>
            </div>
            <div className="px-6 pb-6 flex flex-col items-center gap-2">
              <button onClick={addFloor} disabled={!newFloorName.trim()} className="w-full py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 disabled:opacity-40 transition-all">Add Floor</button>
              <button onClick={()=>setShowAddFloor(false)} className="text-[12px] text-zinc-400 hover:text-zinc-600 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* GPS modal */}
      {geoMarker&&<GeoModal marker={geoMarker} onSave={saveGeo} onClose={()=>setGeoMarkerId(null)}/>}
    </div>
  );
}

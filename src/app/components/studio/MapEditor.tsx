import { useState, useRef } from "react";
import {
  Upload,
  Plus,
  X,
  MapPin,
  Trash2,
  Layers,
  ZoomIn,
  ZoomOut,
  Move,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Building2
} from "lucide-react";

interface FloorMap {
  id: string;
  name: string;
  imageUrl: string | null;
  order: number;
}

interface POIMarker {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  floorId: string;
}

// Mock POIs from the audioguide
const mockPOIs = [
  { id: "1", name: "Renaissance Hall", audioGuideId: "guide-1" },
  { id: "2", name: "Ancient Sculptures", audioGuideId: "guide-1" },
  { id: "3", name: "Modern Art Wing", audioGuideId: "guide-1" },
  { id: "4", name: "Impressionist Gallery", audioGuideId: "guide-1" },
  { id: "5", name: "Medieval Artifacts", audioGuideId: "guide-1" },
  { id: "6", name: "Contemporary Exhibit", audioGuideId: "guide-1" },
  { id: "7", name: "Asian Art Collection", audioGuideId: "guide-1" },
  { id: "8", name: "Entrance Hall", audioGuideId: "guide-1" },
];

export function MapEditor() {
  const [floors, setFloors] = useState<FloorMap[]>([
    { id: "ground", name: "Ground Floor", imageUrl: null, order: 0 },
    { id: "first", name: "First Floor", imageUrl: null, order: 1 },
  ]);
  const [activeFloorId, setActiveFloorId] = useState("ground");
  const [markers, setMarkers] = useState<POIMarker[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showAddFloorModal, setShowAddFloorModal] = useState(false);
  const [newFloorName, setNewFloorName] = useState("");
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFloor = floors.find((f) => f.id === activeFloorId);
  const activeMarkers = markers.filter((m) => m.floorId === activeFloorId);
  const assignedPOIIds = markers.map((m) => m.id);
  const unassignedPOIs = mockPOIs.filter((poi) => !assignedPOIIds.includes(poi.id));

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedPOI || !activeFloor?.imageUrl) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const poi = mockPOIs.find((p) => p.id === selectedPOI);
    if (!poi) return;

    // Add or update marker
    const existingMarkerIndex = markers.findIndex((m) => m.id === selectedPOI);
    if (existingMarkerIndex >= 0) {
      const newMarkers = [...markers];
      newMarkers[existingMarkerIndex] = {
        ...newMarkers[existingMarkerIndex],
        x,
        y,
        floorId: activeFloorId,
      };
      setMarkers(newMarkers);
    } else {
      setMarkers([
        ...markers,
        {
          id: poi.id,
          name: poi.name,
          x,
          y,
          floorId: activeFloorId,
        },
      ]);
    }

    setSelectedPOI(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setFloors(
        floors.map((f) =>
          f.id === activeFloorId ? { ...f, imageUrl } : f
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const addNewFloor = () => {
    if (!newFloorName.trim()) return;

    const newFloor: FloorMap = {
      id: `floor-${Date.now()}`,
      name: newFloorName,
      imageUrl: null,
      order: floors.length,
    };

    setFloors([...floors, newFloor]);
    setNewFloorName("");
    setShowAddFloorModal(false);
    setActiveFloorId(newFloor.id);
  };

  const deleteFloor = (floorId: string) => {
    if (floors.length <= 1) return; // Keep at least one floor
    setFloors(floors.filter((f) => f.id !== floorId));
    setMarkers(markers.filter((m) => m.floorId !== floorId));
    if (activeFloorId === floorId) {
      setActiveFloorId(floors[0].id);
    }
  };

  const removeMarker = (markerId: string) => {
    setMarkers(markers.filter((m) => m.id !== markerId));
  };

  const clearAllMarkers = () => {
    setMarkers([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Floors & POIs */}
        <div className="lg:col-span-1 space-y-6">
          {/* Floor Selector */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-2">
                <Layers className="size-5 text-zinc-600" />
                <h3 className="text-[15px] font-semibold text-zinc-950">
                  Floors & Areas
                </h3>
              </div>
              <button
                onClick={() => setShowAddFloorModal(true)}
                className="p-1.5 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                <Plus className="size-4 text-zinc-700" />
              </button>
            </div>

            <div className="p-3 space-y-2">
              {floors.map((floor) => (
                <div
                  key={floor.id}
                  className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    activeFloorId === floor.id
                      ? "bg-zinc-900 text-white"
                      : "hover:bg-zinc-100"
                  }`}
                  onClick={() => setActiveFloorId(floor.id)}
                >
                  <div className={`size-8 rounded-lg flex items-center justify-center ${
                    activeFloorId === floor.id ? "bg-white/20" : "bg-zinc-100"
                  }`}>
                    {floor.imageUrl ? (
                      <ImageIcon className={`size-4 ${activeFloorId === floor.id ? "text-white" : "text-zinc-600"}`} />
                    ) : (
                      <Building2 className={`size-4 ${activeFloorId === floor.id ? "text-white" : "text-zinc-400"}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[14px] font-semibold ${
                      activeFloorId === floor.id ? "text-white" : "text-zinc-950"
                    }`}>
                      {floor.name}
                    </div>
                    <div className={`text-[12px] ${
                      activeFloorId === floor.id ? "text-white/70" : "text-zinc-500"
                    }`}>
                      {markers.filter((m) => m.floorId === floor.id).length} POIs
                    </div>
                  </div>
                  {floors.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFloor(floor.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-100 transition-all ${
                        activeFloorId === floor.id ? "text-white hover:text-red-600" : "text-zinc-400 hover:text-red-600"
                      }`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* POI List */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <h3 className="text-[15px] font-semibold text-zinc-950">
                Available POIs
              </h3>
              <p className="text-[12px] text-zinc-600 mt-1">
                Click a POI, then click the map to place it
              </p>
            </div>

            <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
              {unassignedPOIs.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <MapPin className="size-8 mx-auto mb-2 opacity-30" />
                  <p className="text-[13px]">All POIs placed</p>
                </div>
              ) : (
                unassignedPOIs.map((poi) => (
                  <button
                    key={poi.id}
                    onClick={() => setSelectedPOI(selectedPOI === poi.id ? null : poi.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                      selectedPOI === poi.id
                        ? "bg-blue-50 border-2 border-blue-500"
                        : "bg-zinc-50 border-2 border-transparent hover:border-zinc-300"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      selectedPOI === poi.id ? "bg-blue-500" : "bg-zinc-200"
                    }`}>
                      <MapPin className={`size-4 ${
                        selectedPOI === poi.id ? "text-white" : "text-zinc-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[14px] font-semibold ${
                        selectedPOI === poi.id ? "text-blue-900" : "text-zinc-950"
                      }`}>
                        {poi.name}
                      </div>
                    </div>
                    {selectedPOI === poi.id && (
                      <div className="size-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="size-3 text-white" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Placed Markers */}
          {activeMarkers.length > 0 && (
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
              <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-zinc-950">
                  Placed on {activeFloor?.name}
                </h3>
                <button
                  onClick={clearAllMarkers}
                  className="text-[12px] font-semibold text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>

              <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
                {activeMarkers.map((marker) => (
                  <div
                    key={marker.id}
                    className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200"
                  >
                    <MapPin className="size-4 text-emerald-600" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-zinc-950">
                        {marker.name}
                      </div>
                      <div className="text-[12px] text-zinc-500">
                        Position: {marker.x.toFixed(1)}%, {marker.y.toFixed(1)}%
                      </div>
                    </div>
                    <button
                      onClick={() => removeMarker(marker.id)}
                      className="p-1.5 hover:bg-red-100 rounded transition-colors text-zinc-400 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-zinc-950">
                  {activeFloor?.name}
                </h3>
                {selectedPOI && (
                  <p className="text-[12px] text-blue-600 mt-0.5">
                    Click on the map to place "{mockPOIs.find((p) => p.id === selectedPOI)?.name}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg p-1">
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                    className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
                  >
                    <ZoomOut className="size-4 text-zinc-600" />
                  </button>
                  <span className="text-[12px] font-semibold text-zinc-700 px-2">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                    className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
                  >
                    <ZoomIn className="size-4 text-zinc-600" />
                  </button>
                </div>

                {/* Upload Button */}
                {!activeFloor?.imageUrl && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all"
                  >
                    <Upload className="size-4" />
                    Upload Floor Plan
                  </button>
                )}

                {activeFloor?.imageUrl && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all"
                  >
                    <RotateCcw className="size-4" />
                    Change
                  </button>
                )}
              </div>
            </div>

            {/* Map Area */}
            <div className="p-6 bg-zinc-50">
              <div
                ref={mapContainerRef}
                className={`relative bg-white border-2 rounded-lg overflow-hidden ${
                  selectedPOI && activeFloor?.imageUrl
                    ? "border-blue-500 cursor-crosshair"
                    : "border-zinc-300"
                }`}
                style={{
                  height: "600px",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                }}
                onClick={handleMapClick}
              >
                {activeFloor?.imageUrl ? (
                  <>
                    {/* Floor Plan Image */}
                    <img
                      src={activeFloor.imageUrl}
                      alt={activeFloor.name}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />

                    {/* POI Markers */}
                    {activeMarkers.map((marker) => (
                      <div
                        key={marker.id}
                        className="absolute -translate-x-1/2 -translate-y-full group"
                        style={{
                          left: `${marker.x}%`,
                          top: `${marker.y}%`,
                        }}
                      >
                        {/* Marker Pin */}
                        <div className="relative">
                          <div className="size-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                            <MapPin className="size-4 text-white" fill="white" />
                          </div>

                          {/* Pulse Effect */}
                          <div className="absolute inset-0 size-8 bg-emerald-500 rounded-full animate-ping opacity-30" />

                          {/* Label */}
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            <div className="bg-zinc-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-lg">
                              {marker.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  // Empty State
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
                    <div className="size-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                      <ImageIcon className="size-10 text-zinc-400" />
                    </div>
                    <p className="text-[15px] font-semibold text-zinc-700 mb-2">
                      No floor plan uploaded
                    </p>
                    <p className="text-[13px] text-zinc-500 mb-4 text-center max-w-xs">
                      Upload a floor plan image to start placing POI markers
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-[13px] font-semibold rounded-lg hover:bg-zinc-800 transition-all"
                    >
                      <Upload className="size-4" />
                      Upload Floor Plan
                    </button>
                  </div>
                )}
              </div>

              {/* Helper Text */}
              {activeFloor?.imageUrl && (
                <div className="mt-4 flex items-center justify-between text-[12px] text-zinc-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="size-3 bg-emerald-500 rounded-full" />
                      <span>Placed POI</span>
                    </div>
                    {selectedPOI && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <MapPin className="size-3" />
                        <span>Click to place marker</span>
                      </div>
                    )}
                  </div>
                  <span>{activeMarkers.length} markers on this floor</span>
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Save Actions */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 px-5 py-3 text-[14px] font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all">
              Reset Changes
            </button>
            <button className="flex-1 px-5 py-3 bg-zinc-900 text-white text-[14px] font-semibold rounded-lg hover:bg-zinc-800 transition-all shadow-sm inline-flex items-center justify-center gap-2">
              <Save className="size-4" />
              Save Map Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Add Floor Modal */}
      {showAddFloorModal && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-zinc-950">Add New Floor/Area</h2>
              <button
                onClick={() => setShowAddFloorModal(false)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-[13px] font-semibold text-zinc-700 uppercase tracking-wide mb-2">
                Floor/Area Name
              </label>
              <input
                type="text"
                value={newFloorName}
                onChange={(e) => setNewFloorName(e.target.value)}
                placeholder="e.g., Second Floor, Outdoor Garden, etc."
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && addNewFloor()}
              />
            </div>

            <div className="px-6 py-5 border-t border-zinc-200 flex items-center justify-end gap-3 bg-zinc-50">
              <button
                onClick={() => setShowAddFloorModal(false)}
                className="px-5 py-2.5 text-[14px] font-semibold text-zinc-700 hover:bg-zinc-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addNewFloor}
                className="px-5 py-2.5 bg-zinc-900 text-white text-[14px] font-semibold rounded-lg hover:bg-zinc-800 transition-all shadow-sm"
              >
                Add Floor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

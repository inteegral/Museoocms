import {
  Upload,
  Search,
  X,
  MoreVertical,
  Trash2,
  Copy,
  Download,
  Image as ImageIcon,
  Grid3x3,
  List,
  Filter,
  Check,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { PageShell } from "./PageShell";
interface POIRef {
  id: string;
  name: string;
}

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  size: number; // in KB
  dimensions: { width: number; height: number };
  uploadedAt: string;
  usedIn: POIRef[];
  tags?: string[];
}

const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3c2?w=800",
    filename: "museum-entrance.jpg",
    size: 245,
    dimensions: { width: 1920, height: 1080 },
    uploadedAt: "2 hours ago",
    usedIn: [
      { id: "poi-1", name: "Museum Entrance Hall" },
      { id: "poi-7", name: "North Wing Lobby" },
    ],
    tags: ["architecture", "entrance"],
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=800",
    filename: "renaissance-hall.jpg",
    size: 312,
    dimensions: { width: 2048, height: 1536 },
    uploadedAt: "1 day ago",
    usedIn: [
      { id: "poi-2", name: "Renaissance Gallery" },
    ],
    tags: ["art", "renaissance"],
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800",
    filename: "baroque-painting.jpg",
    size: 189,
    dimensions: { width: 1600, height: 1200 },
    uploadedAt: "3 days ago",
    usedIn: [
      { id: "poi-5", name: "Flemish Masters Room" },
    ],
    tags: ["art", "baroque"],
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1564399580075-5dfe19c205f4?w=800",
    filename: "ancient-sculpture.jpg",
    size: 278,
    dimensions: { width: 1920, height: 2560 },
    uploadedAt: "5 days ago",
    usedIn: [],
    tags: ["sculpture", "ancient"],
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800",
    filename: "secret-garden.jpg",
    size: 421,
    dimensions: { width: 2400, height: 1600 },
    uploadedAt: "1 week ago",
    usedIn: [
      { id: "poi-6", name: "Roman Sculpture Garden" },
    ],
    tags: ["outdoor", "garden"],
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800",
    filename: "modern-art.jpg",
    size: 156,
    dimensions: { width: 1800, height: 1200 },
    uploadedAt: "1 week ago",
    usedIn: [],
    tags: ["modern", "contemporary"],
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
    filename: "exhibition-room.jpg",
    size: 298,
    dimensions: { width: 2048, height: 1365 },
    uploadedAt: "2 weeks ago",
    usedIn: [
      { id: "poi-3", name: "Egyptian Collection" },
      { id: "poi-8", name: "Temporary Exhibition" },
    ],
    tags: ["interior", "exhibition"],
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800",
    filename: "classical-statue.jpg",
    size: 334,
    dimensions: { width: 1920, height: 2880 },
    uploadedAt: "2 weeks ago",
    usedIn: [],
    tags: ["sculpture", "classical"],
  },
];

const formatFileSize = (kb: number) => {
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

export function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [filterUnused, setFilterUnused] = useState(false);

  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = !filterUnused || item.usedIn.length === 0;
    return matchesSearch && matchesFilter;
  });

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const selectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const deleteSelected = () => {
    if (confirm(`Delete ${selectedItems.size} image(s)?`)) {
      setMediaItems(mediaItems.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
    }
  };

  const deleteImage = (id: string) => {
    if (confirm("Delete this image?")) {
      setMediaItems(mediaItems.filter(item => item.id !== id));
      setSelectedImage(null);
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // Could add toast notification here
  };

  const totalSize = mediaItems.reduce((sum, item) => sum + item.size, 0);
  const storageLimit = 5 * 1024; // 5GB in MB
  const storagePercentage = (totalSize / 1024 / storageLimit) * 100;

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="space-y-3">
              <h1 className="text-[32px] font-semibold text-zinc-950 tracking-tight leading-tight">
                Media Library
              </h1>
              <p className="text-[15px] text-zinc-600 leading-relaxed max-w-2xl">
                Manage all your images in one place. Upload, organize, and use them across your audio guides.
              </p>
            </div>
            <button
              onClick={() => setShowUploadZone(!showUploadZone)}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#D33333] text-white text-[14px] font-semibold rounded-lg hover:bg-[#b82828] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Upload className="size-5" />
              Upload Images
            </button>
          </div>

          {/* Storage Stats */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6 mb-8" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[14px] font-semibold text-zinc-700 uppercase tracking-wide mb-1">
                  Storage Used
                </div>
                <div className="text-[24px] font-light text-zinc-950">
                  {formatFileSize(totalSize)} <span className="text-[16px] text-zinc-500">/ {storageLimit / 1024} GB</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-semibold text-zinc-700 uppercase tracking-wide mb-1">
                  Total Images
                </div>
                <div className="text-[24px] font-light text-zinc-950">
                  {mediaItems.length}
                </div>
              </div>
            </div>
            <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(storagePercentage, 100)}%`, backgroundColor: '#D33333' }}
              />
            </div>
          </div>

          {/* Upload Zone */}
          {showUploadZone && (
            <div className="bg-white border-2 border-dashed border-zinc-300 rounded-xl p-12 mb-8 text-center hover:border-zinc-400 transition-colors">
              <div className="size-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="size-8 text-zinc-400" />
              </div>
              <h3 className="text-[16px] font-semibold text-zinc-950 mb-2">
                Drop images here or click to browse
              </h3>
              <p className="text-[13px] text-zinc-600 mb-6">
                Supports: JPG, PNG, WebP • Max size: 10MB per image
              </p>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D33333] text-white text-[13px] font-semibold rounded-lg hover:bg-[#b82828] transition-all">
                Choose Files
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Filter */}
              <button
                onClick={() => setFilterUnused(!filterUnused)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-[13px] font-semibold transition-all ${
                  filterUnused
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <Filter className="size-4" />
                Unused Only
              </button>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <Grid3x3 className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "list"
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <List className="size-4" />
                </button>
              </div>

              {/* Bulk Actions */}
              {selectedItems.size > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAll}
                    className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[13px] font-semibold rounded-lg hover:bg-zinc-50 transition-all"
                  >
                    {selectedItems.size === filteredItems.length ? "Deselect All" : "Select All"}
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-[13px] font-semibold rounded-lg hover:bg-red-700 transition-all"
                  >
                    <Trash2 className="size-4" />
                    Delete ({selectedItems.size})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item) => {
              const isSelected = selectedItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`group relative bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                    isSelected
                      ? "border-zinc-900 shadow-lg"
                      : "border-zinc-200 hover:border-zinc-300 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedImage(item)}
                  style={{ boxShadow: isSelected ? 'none' : '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(item.id);
                    }}
                    className={`absolute top-3 left-3 z-10 size-6 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-zinc-900 border-zinc-900"
                        : "bg-white/90 border-white backdrop-blur-sm opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isSelected && <Check className="size-4 text-white" />}
                  </button>

                  {/* Image */}
                  <div className="aspect-square bg-zinc-100 overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.usedIn.length > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 flex items-center gap-1"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
                      >
                        <MapPin className="size-3 text-white/80 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-white text-[10px] font-medium truncate leading-none">
                          {item.usedIn[0].name}
                        </span>
                        {item.usedIn.length > 1 && (
                          <span className="text-white/70 text-[10px] flex-shrink-0">+{item.usedIn.length - 1}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <div className="font-semibold text-[12px] text-zinc-950 mb-1.5 truncate">
                      {item.filename}
                    </div>
                    {item.usedIn.length > 0 ? (
                      <div className="flex items-center gap-1 flex-wrap">
                        <MapPin className="size-3 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-[10px] text-zinc-600 font-medium truncate">
                          {item.usedIn[0].name}
                        </span>
                        {item.usedIn.length > 1 && (
                          <span className="text-[10px] text-zinc-400 flex-shrink-0">
                            +{item.usedIn.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-zinc-300">Not used</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                        onChange={selectAll}
                        className="size-4 rounded border-zinc-300"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-zinc-700 uppercase tracking-wide">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-zinc-700 uppercase tracking-wide">
                      Filename
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-zinc-700 uppercase tracking-wide">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-zinc-700 uppercase tracking-wide">
                      Dimensions
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-zinc-700 uppercase tracking-wide">
                      Used In
                    </th>
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-zinc-700 uppercase tracking-wide">
                      Uploaded
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          className="size-4 rounded border-zinc-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={item.url}
                          alt={item.filename}
                          className="size-12 rounded object-cover cursor-pointer"
                          onClick={() => setSelectedImage(item)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[14px] text-zinc-950">
                          {item.filename}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-zinc-600">
                          {formatFileSize(item.size)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-zinc-600">
                          {item.dimensions.width} × {item.dimensions.height}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.usedIn.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {item.usedIn.map((poi) => (
                              <span key={poi.id} className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600">
                                <MapPin className="size-3 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                                {poi.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[12px] text-zinc-300">Not used</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-zinc-600">
                          {item.uploadedAt}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedImage(item)}
                          className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded"
                        >
                          <MoreVertical className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="size-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="size-10 text-zinc-400" />
            </div>
            <h3 className="text-[18px] font-semibold text-zinc-950 mb-2">
              {searchQuery || filterUnused ? "No images found" : "No images yet"}
            </h3>
            <p className="text-[14px] text-zinc-600 mb-6">
              {searchQuery || filterUnused
                ? "Try adjusting your search or filters"
                : "Upload your first image to get started"}
            </p>
            {!searchQuery && !filterUnused && (
              <button
                onClick={() => setShowUploadZone(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D33333] text-white text-[14px] font-semibold rounded-lg hover:bg-[#b82828] transition-all"
              >
                <Upload className="size-4" />
                Upload Images
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-[18px] font-semibold text-zinc-950 truncate pr-4">
                {selectedImage.filename}
              </h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-lg flex-shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div className="bg-zinc-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.filename}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[14px] font-semibold text-zinc-700 uppercase tracking-wide mb-4">
                      Image Details
                    </h3>
                    <div className="space-y-3 text-[14px]">
                      <div className="flex justify-between py-2 border-b border-zinc-100">
                        <span className="text-zinc-600">Filename</span>
                        <span className="font-medium text-zinc-900">{selectedImage.filename}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-zinc-100">
                        <span className="text-zinc-600">Size</span>
                        <span className="font-medium text-zinc-900">{formatFileSize(selectedImage.size)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-zinc-100">
                        <span className="text-zinc-600">Dimensions</span>
                        <span className="font-medium text-zinc-900">
                          {selectedImage.dimensions.width} × {selectedImage.dimensions.height}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-zinc-100">
                        <span className="text-zinc-600">Uploaded</span>
                        <span className="font-medium text-zinc-900">{selectedImage.uploadedAt}</span>
                      </div>
                      <div className="py-2 border-b border-zinc-100">
                        <span className="text-zinc-600 text-[14px]">Used In</span>
                        {selectedImage.usedIn.length > 0 ? (
                          <div className="mt-2 flex flex-col gap-1.5">
                            {selectedImage.usedIn.map((poi) => (
                              <span key={poi.id} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-800">
                                <MapPin className="size-3.5 text-zinc-400 flex-shrink-0" strokeWidth={1.5} />
                                {poi.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[13px] text-zinc-400 mt-1">Not used in any POI</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* URL */}
                  <div>
                    <h3 className="text-[14px] font-semibold text-zinc-700 uppercase tracking-wide mb-3">
                      Image URL
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selectedImage.url}
                        readOnly
                        className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-[13px] text-zinc-700 font-mono"
                      />
                      <button
                        onClick={() => copyImageUrl(selectedImage.url)}
                        className="px-3 py-2 bg-[#D33333] text-white rounded-lg hover:bg-[#b82828] transition-all"
                        title="Copy URL"
                      >
                        <Copy className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div>
                      <h3 className="text-[14px] font-semibold text-zinc-700 uppercase tracking-wide mb-3">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedImage.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 bg-zinc-100 text-zinc-700 text-[12px] font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 space-y-2">
                    <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[14px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                      <Download className="size-4" />
                      Download
                    </button>
                    <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-[14px] font-semibold rounded-lg hover:bg-zinc-50 transition-all">
                      <ExternalLink className="size-4" />
                      Open in New Tab
                    </button>
                    <button
                      onClick={() => deleteImage(selectedImage.id)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 text-[14px] font-semibold rounded-lg hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="size-4" />
                      Delete Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

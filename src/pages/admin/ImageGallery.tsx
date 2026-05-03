import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, X, Search } from 'lucide-react';

interface GalleryImage {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  size: number;
  mime_type: string | null;
  created_at: string;
}

interface ImageGalleryProps {
  /** If provided, renders as a picker modal */
  onPick?: (url: string) => void;
  onClose?: () => void;
}

export default function ImageGallery({ onPick, onClose }: ImageGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setImages(data);
    setLoading(false);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${Date.now()}_${safeName}`;

      const { error: storageError } = await supabase.storage
        .from('media')
        .upload(path, file, { upsert: false, contentType: file.type });

      if (storageError) {
        console.error('Upload error:', storageError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);

      await supabase.from('images').insert({
        filename: file.name,
        storage_path: path,
        public_url: publicUrl,
        size: file.size,
        mime_type: file.type,
      });
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
    await loadImages();
    setUploading(false);
  };

  const handleDelete = async (img: GalleryImage) => {
    if (!confirm(`Delete "${img.filename}"?`)) return;

    await supabase.storage.from('media').remove([img.storage_path]);
    await supabase.from('images').delete().eq('id', img.id);
    setImages(prev => prev.filter(i => i.id !== img.id));
    if (selectedId === img.id) setSelectedId(null);
  };

  const copyUrl = async (img: GalleryImage) => {
    await navigator.clipboard.writeText(img.public_url);
    setCopiedId(img.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = images.filter(img =>
    img.filename.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isPickerMode = !!onPick;

  const content = (
    <div className={`flex flex-col ${isPickerMode ? 'h-full' : 'min-h-0'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 flex-shrink-0 ${isPickerMode ? 'rounded-t-2xl' : ''}`}>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {isPickerMode ? 'Choose Image' : 'Image Gallery'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{images.length} images uploaded</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          {isPickerMode && onClose && (
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-200 text-slate-500">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-6 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Drop zone hint */}
      <div
        className="mx-6 mt-3 mb-2 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-sm text-slate-400 cursor-pointer hover:border-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="w-5 h-5 mx-auto mb-1 opacity-50" />
        Drop images here or click to upload
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">{search ? 'No images match your search' : 'No images yet'}</p>
            <p className="text-sm mt-1">Upload images to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
            {filtered.map((img) => (
              <div
                key={img.id}
                className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedId === img.id
                    ? 'border-slate-900 ring-2 ring-slate-900 ring-offset-1'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
                onClick={() => {
                  setSelectedId(img.id);
                  if (isPickerMode && onPick) onPick(img.public_url);
                }}
              >
                <img
                  src={img.public_url}
                  alt={img.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1 p-2 w-full justify-center">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); copyUrl(img); }}
                      className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === img.id
                        ? <Check className="w-3.5 h-3.5 text-green-600" />
                        : <Copy className="w-3.5 h-3.5 text-slate-700" />
                      }
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(img); }}
                      className="p-1.5 bg-white/90 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Selected checkmark */}
                {selectedId === img.id && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Picker footer */}
      {isPickerMode && selectedId && (
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center gap-3 flex-shrink-0 rounded-b-2xl">
          {(() => {
            const img = images.find(i => i.id === selectedId);
            if (!img) return null;
            return (
              <>
                <img src={img.public_url} alt="" className="w-10 h-10 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{img.filename}</p>
                  <p className="text-xs text-slate-400">{formatSize(img.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onPick && onPick(img.public_url)}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Use Image
                </button>
              </>
            );
          })()}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleUpload(e.target.files)}
        className="hidden"
      />
    </div>
  );

  if (isPickerMode) return content;

  return (
    <div className="p-8 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Image Gallery</h1>
          <p className="text-slate-500 mt-1">Manage all uploaded media files</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        {content}
      </div>
    </div>
  );
}

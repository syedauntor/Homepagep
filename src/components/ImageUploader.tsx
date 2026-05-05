import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Link } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onChange(dataUrl);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file.');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError('Upload failed. Please try again.');
      setUploading(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
    setError('');
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setError('');
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}

      {value ? (
        <div className="relative inline-block w-full">
          <img
            src={value}
            alt="Uploaded"
            className="w-full max-h-56 object-cover rounded-xl border border-slate-200"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-36 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-slate-500 hover:bg-slate-50 transition-colors text-slate-500 disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span className="text-sm">Reading image...</span>
              </>
            ) : (
              <>
                <Upload size={24} />
                <span className="text-sm font-medium">Click to upload image</span>
                <span className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB</span>
              </>
            )}
          </button>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Upload size={14} />
              Upload from device
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Link size={14} />
              Use image URL
            </button>
          </div>

          {showUrlInput && (
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800 transition-colors"
              >
                Use
              </button>
            </div>
          )}
        </>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${Date.now()}_${safeName}`;

      const { error: storageError } = await supabase.storage
        .from('media')
        .upload(path, file, { upsert: false, contentType: file.type });

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);

      // Record in images table
      await supabase.from('images').insert({
        filename: file.name,
        storage_path: path,
        public_url: publicUrl,
        size: file.size,
        mime_type: file.type,
      });

      onChange(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
            alt="Featured"
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
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full h-36 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-slate-500 hover:bg-slate-50 transition-colors text-slate-500 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={24} />
              <span className="text-sm font-medium">Click to upload image</span>
              <span className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB</span>
            </>
          )}
        </button>
      )}

      {!value && !uploading && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Upload size={14} />
          Upload from device
        </button>
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

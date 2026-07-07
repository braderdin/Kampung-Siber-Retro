// Start: Asset Upload Zone Component
import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { dictionary } from '@/lib/dictionary';

interface AssetUploadZoneProps {
  className?: string;
}

export default function AssetUploadZone({ className }: AssetUploadZoneProps) {
  // Start: State Management
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguageStore();
  const t = dictionary[language];
  // End: State Management

  // Start: File Validation
  const validateFile = useCallback((file: File): boolean => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB for images
    
    if (file.size > MAX_FILE_SIZE) {
      alert(t.upload.imageSizeExceeded);
      return false;
    }
    
    return true;
  }, [t]);
  // End: File Validation

  // Start: Image Compression
  const compressImage = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        
        // Set maximum dimensions
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;
        
        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }, []);
  // End: Image Compression

  // Start: Upload Handler
  const handleUpload = useCallback(async (file: File) => {
    try {
      // Start: File Size Validation
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
      
      if (file.size > MAX_FILE_SIZE) {
        alert(`Saiz fail ${file.name} melebihi had 2MB`);
        return;
      }
      // End: File Size Validation

      setUploadProgress(10);
      
      let fileToUpload = file;
      
      // Start: Image Compression Pipeline
      if (file.type.startsWith('image/')) {
        const compressedFile = await compressImage(file);
        
        // Start: Post-Compression Size Check
        if (compressedFile.size > MAX_FILE_SIZE) {
          alert(`Saiz fail bocor ${compressedFile.name} masih melebihi had 2MB`);
          return;
        }
        // End: Post-Compression Size Check
        
        fileToUpload = compressedFile;
      }
      // End: Image Compression Pipeline

      // Start: File Reading
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(fileToUpload);
      });
      // End: File Reading

      // Start: API Call
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: fileToUpload.name,
          fileContent,
          contentType: fileToUpload.type,
          size: fileToUpload.size,
        }),
      });

      setUploadProgress(90);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Muat naik gagal');
      }

      const result = await response.json();
      
      setUploadProgress(100);
      
      alert(`${file.name} ${t.upload.success}`);
    } catch (error) {
      console.error('Upload Error:', error);
      alert(error instanceof Error ? error.message : t.upload.failed);
    } finally {
      setTimeout(() => setUploadProgress(0), 2000);
    }
  }, [compressImage, t]);
  // End: Upload Handler

  // Start: Drag and Drop Handlers
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  }, [handleUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  // End: Drag and Drop Handlers

  // Start: File Input Handler
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  }, [handleUpload]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  // End: File Input Handler

  // Start: Render UI
  return (
    <div className={className}>
      {/* Start: Upload Grid Mock */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-100 dark:bg-gray-800 rounded border-2 border-dashed border-gray-300 dark:border-gray-700"
          />
        ))}
      </div>
      {/* End: Upload Grid Mock */}

      {/* Start: Trigger Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnter={handleDragEnter}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onClick={triggerFileInput}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {t.upload.dropZone}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t.upload.instructions}
        </p>

        {/* Start: File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,text/css,application/javascript"
          className="hidden"
          onChange={handleFileInput}
        />
        {/* End: File Input */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerFileInput();
          }}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="mr-2 h-4 w-4" />
          {t.upload.browse}
        </button>

        {/* Start: Progress Indicator */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t.upload.uploading} {uploadProgress}%
            </p>
          </div>
        )}
        {/* End: Progress Indicator */}
      </div>

      {/* Start: Limitations Info */}
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
              {t.upload.tierLimitations}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {t.upload.sizeLimit}
            </p>
          </div>
        </div>
      </div>
      {/* End: Limitations Info */}
    </div>
  );
  // End: Render UI
}

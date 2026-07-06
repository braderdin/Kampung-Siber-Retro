// Start: Asset Upload Zone Component
import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface AssetUploadZoneProps {
  className?: string;
}

export default function AssetUploadZone({ className }: AssetUploadZoneProps) {
  // Start: State Management
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // End: State Management

  // Start: File Validation
  const validateFile = useCallback((file: File): boolean => {
    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
    
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size exceeds 25MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return false;
    }
    
    return true;
  }, []);
  // End: File Validation

  // Start: Upload Handler
  const handleUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    try {
      setUploadProgress(10);
      
      // Start: File Reading
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      // End: File Reading

      // Start: API Call
      const response = await fetch('/api/storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          fileContent,
          contentType: file.type,
          size: file.size,
        }),
      });

      setUploadProgress(90);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      setUploadProgress(100);
      
      alert(`${file.name} has been uploaded successfully`);
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setTimeout(() => setUploadProgress(0), 2000);
    }
  }, [validateFile]);
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
  // End: State Management

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
          Drop your asset here
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Or click to browse files (Max 25MB per file)
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
          Browse Files
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
              Uploading... {uploadProgress}%
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
              Profile Tier Limitations
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Individual file uploads are limited to 25MB. For larger assets, consider compression or splitting files.
            </p>
          </div>
        </div>
      </div>
      {/* End: Limitations Info */}
    </div>
  );
  // End: Render UI
}
// End: Asset Upload Zone Component

// Start: Asset Link Manager Component
import { useState } from 'react';
import { Link, Copy, Check, Image as ImgIcon } from 'lucide-react';

interface AssetLinkManagerProps {
  className?: string;
}

export default function AssetLinkManager({ className }: AssetLinkManagerProps) {
  // Start: State Management
  const [imgurLink, setImgurLink] = useState('');
  const [copied, setCopied] = useState(false);
  // End: State Management

  // Start: HTML Tag Generator
  const generateHtmlTag = (url: string): string => {
    if (!url) return '';
    return `<img src="${url}" alt="Asset" class="max-w-full h-auto" />`;
  };
  // End: HTML Tag Generator

  // Start: Copy to Clipboard
  const copyToClipboard = async () => {
    if (!imgurLink) {
      alert('Please enter an Imgur link first');
      return;
    }

    try {
      const htmlTag = generateHtmlTag(imgurLink);
      await navigator.clipboard.writeText(htmlTag);
      setCopied(true);
      
      alert('HTML image tag has been copied successfully');

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy Error:', error);
      alert('Failed to copy to clipboard');
    }
  };
  // End: Copy to Clipboard

  // Start: Link Validation
  const isValidImgurLink = (url: string): boolean => {
    const imgurPattern = /^https?:\/\/(i\.imgur\.com|imgur\.com\/a\/|imgur\.com\/gallery\/)/;
    return imgurPattern.test(url);
  };
  // End: Link Validation

  // Start: Handle Link Change
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setImgurLink(value);
  };
  // End: Handle Link Change

  // Start: Render HTML Preview
  const renderHtmlPreview = () => {
    if (!imgurLink) return null;
    
    const htmlTag = generateHtmlTag(imgurLink);
    
    return (
      <div className="mt-4">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
          Generated HTML Tag
        </label>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 font-mono text-xs text-gray-700 dark:text-gray-300 break-all">
          {htmlTag}
        </div>
      </div>
    );
  };
  // End: Render HTML Preview

  // Start: Render UI
  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Start: Link Input Section */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block flex items-center">
            <ImgIcon className="mr-2 h-3 w-3" />
            Imgur Image Link
          </label>
          <div className="relative">
            <input
              type="url"
              placeholder="https://i.imgur.com/xxxxxx.jpg"
              value={imgurLink}
              onChange={handleLinkChange}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                imgurLink && !isValidImgurLink(imgurLink) 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
            />
            <Link className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Start: Validation Feedback */}
          {imgurLink && !isValidImgurLink(imgurLink) && (
            <p className="text-xs text-red-500 mt-1">
              Please enter a valid Imgur image URL
            </p>
          )}
          {/* End: Validation Feedback */}
        </div>
        {/* End: Link Input Section */}

        {/* Start: Copy Button */}
        <button
          onClick={copyToClipboard}
          disabled={!imgurLink || !isValidImgurLink(imgurLink)}
          className={`w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            copied
              ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
              : (!imgurLink || !isValidImgurLink(imgurLink))
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy HTML Tag
            </>
          )}
        </button>
        {/* End: Copy Button */}

        {/* Start: HTML Preview */}
        {renderHtmlPreview()}
        {/* End: HTML Preview */}
      </div>
    </div>
  );
  // End: Render UI
}
// End: Asset Link Manager Component

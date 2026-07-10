"use client";

import { useState, useEffect, useCallback } from 'react';

interface CustomDomainSetupFormProps {
  residentUsername: string;
  existingDomain?: string;
  onDomainChange?: (domain: string, cname: string, txtRecord: string) => void;
  className?: string;
}

export default function CustomDomainSetupForm({
  residentUsername,
  existingDomain,
  onDomainChange,
  className
}: CustomDomainSetupFormProps) {
  const [domainInput, setDomainInput] = useState<string>(existingDomain || '');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'error'>('idle');
  const [cnameRecord, setCnameRecord] = useState<string>('');
  const [txtRecord, setTxtRecord] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (existingDomain) {
      setDomainInput(existingDomain);
    }
  }, [existingDomain]);

  const generateCnameRecord = useCallback((domain: string) => {
    return `cname.vercel-dns.com`;
  }, []);

  const generateTxtRecord = useCallback((domain: string) => {
    return `kampung-siber-verification=${btoa(domain)}`;
  }, []);

  const handleDomainChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDomain = e.target.value;
    setDomainInput(newDomain);
    
    if (newDomain && onDomainChange) {
      const cname = generateCnameRecord(newDomain);
      const txt = generateTxtRecord(newDomain);
      setCnameRecord(cname);
      setTxtRecord(txt);
      onDomainChange(newDomain, cname, txt);
    }
  }, [generateCnameRecord, generateTxtRecord, onDomainChange]);

  const handleVerifyDomain = async () => {
    if (!domainInput.trim()) return;
    
    setIsVerifying(true);
    setVerificationStatus('verifying');
    
    // Simulate domain verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Random verification result
    if (Math.random() > 0.3) {
      setVerificationStatus('verified');
    } else {
      setVerificationStatus('error');
    }
    
    setIsVerifying(false);
  };

  const handleSave = () => {
    if (verificationStatus === 'verified' && onDomainChange) {
      onDomainChange(domainInput, cnameRecord, txtRecord);
    }
  };

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'verifying': return 'text-yellow-500';
      case 'verified': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'verifying': return '⏳';
      case 'verified': return '✅';
      case 'error': return '❌';
      default: return '🔍';
    }
  }, []);

  if (!isClient) {
    return (
      <div className={`custom-domain-form ${className || ''}`}>
        <div className="retro-card p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`custom-domain-form ${className || ''}`}>
      <div className="retro-card border-2 border-dashed border-cyan-400/30">
        <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <span>Custom Domain Setup</span>
          </h3>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Domain Input */}
          <div className="retro-window-sm">
            <label className="retro-window-header bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 pixel-font">
                Domain Name
              </span>
            </label>
            <input
              type="text"
              value={domainInput}
              onChange={handleDomainChange}
              className="w-full p-3 bg-black/20 border border-gray-300 dark:border-gray-600 rounded-b retro-input text-green-400 font-mono"
              placeholder="example.com"
              maxLength={100}
            />
          </div>

          {/* Verification Status */}
          <div className="flex items-center gap-3">
            <div className={`text-lg pixel-font ${getStatusColor(verificationStatus)}`}>
              {getStatusIcon(verificationStatus)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 pixel-font">
              {verificationStatus === 'idle' && 'Enter your domain to begin verification'}
              {verificationStatus === 'verifying' && 'Verifying domain...'}
              {verificationStatus === 'verified' && 'Domain verified successfully!'}
              {verificationStatus === 'error' && 'Domain verification failed. Please check DNS records.'}
            </span>
          </div>

          {/* DNS Records */}
          {(cnameRecord || txtRecord) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="retro-window-sm">
                <label className="retro-window-header bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 pixel-font flex items-center gap-1">
                    <span>📌</span> CNAME Record
                  </span>
                </label>
                <div className="p-3">
                  <code className="font-mono text-xs text-cyan-400 break-all">
                    {cnameRecord}
                  </code>
                </div>
              </div>
              
              <div className="retro-window-sm">
                <label className="retro-window-header bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 pixel-font flex items-center gap-1">
                    <span>📝</span> TXT Record
                  </span>
                </label>
                <div className="p-3">
                  <code className="font-mono text-xs text-green-400 break-all">
                    {txtRecord}
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleVerifyDomain}
              disabled={isVerifying || !domainInput.trim()}
              className="retro-btn-secondary text-xs px-4 py-2"
            >
              {isVerifying ? '⏳ Verifying...' : 'Verify Domain'}
            </button>
            
            {verificationStatus === 'verified' && (
              <button
                onClick={handleSave}
                className="retro-btn-primary text-xs px-4 py-2"
              >
                Save Domain
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="retro-card mt-4 border-2 border-dashed border-gray-400/30">
        <div className="retro-card-header bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b-2 border-dashed border-gray-300 dark:border-gray-600">
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
            <span>📋</span>
            <span>Setup Instructions</span>
          </h4>
        </div>
        <div className="p-3">
          <ol className="list-decimal list-inside text-xs text-gray-600 dark:text-gray-400 pixel-font space-y-1">
            <li>Add CNAME record pointing to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">cname.vercel-dns.com</code></li>
            <li>Add TXT record for verification</li>
            <li>Wait 5-10 minutes for DNS propagation</li>
            <li>Click "Verify Domain" to confirm</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
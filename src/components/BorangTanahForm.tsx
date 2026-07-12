"use client";

import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';

interface DomainRegistration {
  id: string;
  userId: string;
  domainName: string;
  terraceTheme: string;
  customCSS: string;
  isActive: boolean;
  createdAt: string;
}

interface FormState {
  domainName: string;
  terraceTheme: string;
  customCSS: string;
  description: string;
  isPublic: boolean;
}

const TERRACE_THEMES = [
  { id: 'space_neon', name: 'Space Neon', description: 'Neon background between cosmic void' },
  { id: 'windows_gray', name: 'Windows Gray', description: 'Clean gray theme reminiscent of classic Windows 95' },
  { id: 'retro_matrix', name: 'Retro Matrix', description: 'Green code flow Matrix-style background' },
  { id: 'ocean_wave', name: 'Ocean Wave', description: 'Gentle blue wave background' },
  { id: 'sunset_gold', name: 'Sunset Gold', description: 'Classic golden sunset tones' }
];

export default function BorangTanahForm({ 
  userId = 'anonymous',
  onSuccess,
  className
}: {
  userId?: string;
  onSuccess?: () => void;
  className?: string;
}) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  const [formData, setFormData] = useState<FormState>({
    domainName: '',
    terraceTheme: 'space_neon',
    customCSS: '',
    description: '',
    isPublic: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState<DomainRegistration | null>(null);

  useEffect(() => {
    const loadExistingRegistration = () => {
      if (!userId) return;

      const stored = localStorage.getItem('domain_registrations');
      if (stored) {
        const registrations = JSON.parse(stored) as DomainRegistration[];
        const existing = registrations.find(r => r.userId === userId);
        if (existing) {
          setExistingRegistration(existing);
          setFormData({
            domainName: existing.domainName,
            terraceTheme: existing.terraceTheme,
            customCSS: existing.customCSS,
            description: '',
            isPublic: existing.isActive
          });
        }
      }
    };

    loadExistingRegistration();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      isPublic: e.target.checked
    }));
  };

  const validateForm = (): boolean => {
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/;
    if (!domainPattern.test(formData.domainName)) {
      setError('Invalid domain name. Use only letters, numbers, and hyphens (max 63 characters)');
      return false;
    }

    if (formData.domainName.length < 3) {
      setError('Domain name must be at least 3 characters');
      return false;
    }

    if (formData.customCSS.length > 5000) {
      setError('Custom CSS exceeds 5000 character limit');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const registration: DomainRegistration = {
        id: existingRegistration?.id || `${userId}-${Date.now()}`,
        userId: userId,
        domainName: formData.domainName,
        terraceTheme: formData.terraceTheme,
        customCSS: formData.customCSS,
        isActive: formData.isPublic,
        createdAt: existingRegistration?.createdAt || new Date().toISOString()
      };

      // Save to localStorage
      const stored = localStorage.getItem('domain_registrations');
      const registrations = stored ? JSON.parse(stored) : [];
      const updated = registrations.filter((r: DomainRegistration) => r.userId !== userId);
      updated.push(registration);
      localStorage.setItem('domain_registrations', JSON.stringify(updated));

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`borang-tanah-form ${className || ''}`}>
      {/* Start: Form Header */}
      <div className="retro-card-header bg-gray-200 dark:bg-gray-700 px-4 py-2 border-b border-gray-300 dark:border-gray-400 mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 pixel-font flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <span>Digital Land Registration Form</span>
        </h3>
      </div>
      {/* End: Form Header */}

      {/* Start: Success Message */}
      {success && (
        <div className="rounded-md bg-green-100 dark:bg-green-900 p-3 mb-4">
          <p className="text-sm text-green-800 dark:text-green-200 pixel-font">
            ✅ Registration successful! Your domain is now set up.
          </p>
        </div>
      )}
      {/* End: Success Message */}

      {/* Start: Error Message */}
      {error && (
        <div className="rounded-md bg-red-100 dark:bg-red-900 p-3 mb-4">
          <p className="text-sm text-red-800 dark:text-red-200 pixel-font">
            ❌ {error}
          </p>
        </div>
      )}
      {/* End: Error Message */}

      {/* Start: Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Domain Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 pixel-font mb-1">
            Domain Name
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pixel-font text-sm">
              kampung.
            </span>
            <input
              type="text"
              name="domainName"
              value={formData.domainName}
              onChange={handleInputChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pixel-font text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your_domain"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 pixel-font">
            Unique name for your website (example: "cyber_pioneer")
          </p>
        </div>

        {/* Terrace Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 pixel-font mb-2">
            Background Theme
          </label>
          <div className="grid grid-cols-1 gap-2">
            {TERRACE_THEMES.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setFormData(prev => ({ ...prev, terraceTheme: theme.id }))}
                className={`
                  p-3 rounded-md border cursor-pointer transition-all
                  ${formData.terraceTheme === theme.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="terraceTheme"
                    checked={formData.terraceTheme === theme.id}
                    onChange={() => setFormData(prev => ({ ...prev, terraceTheme: theme.id }))}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div>
                    <div className="pixel-font text-sm font-medium text-gray-800 dark:text-gray-200">
                      {theme.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {theme.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 pixel-font mb-1">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pixel-font text-sm resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us about your digital land..."
            rows={2}
            maxLength={200}
          />
        </div>

        {/* Custom CSS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 pixel-font mb-1">
            Custom CSS (Optional)
          </label>
          <textarea
            name="customCSS"
            value={formData.customCSS}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pixel-font text-sm font-mono resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder=".custom { background: #ff007f; }"
            rows={3}
            maxLength={5000}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 pixel-font">
            Add simple CSS styling for your website ({formData.customCSS.length}/5000)
          </p>
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={handleCheckboxChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-peer:after:translate-x-full peer:after:from-white peer:after:to-gray-200 peer:after:dark:bg-gray-500 after:absolute after:top-[-2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 pixel-font">
              Public Website
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full retro-btn-primary pixel-font text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Registering...' : 'Register Digital Land'}
        </button>
      </form>
      {/* End: Form */}
    </div>
  );
}

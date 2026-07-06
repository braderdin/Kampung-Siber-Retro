// Start: Imports
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// End: Imports

// Start: Type Definitions
interface TermsPageProps {
  className?: string;
}

interface TermsSection {
  id: string;
  title: string;
  content: string[];
}

interface TermsData {
  title: string;
  lastUpdated: string;
  sections: TermsSection[];
}
// End: Type Definitions

// Start: TermsPage Component
export default function TermsPage({ className }: TermsPageProps) {
  // Start: State Management
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const router = useRouter();
  // End: State Management

  // Start: Terms Data
  const termsData: TermsData = {
    title: 'Terms of Service',
    lastUpdated: '2024-01-15',
    sections: [
      {
        id: 'acceptance',
        title: 'Acceptance of Terms',
        content: [
          'By accessing or using the Kampung Siber Retro platform, you agree to be bound by these Terms of Service.',
          'These Terms constitute a legally binding agreement between you and Kampung Siber Retro.',
          'If you do not agree to all the terms and conditions, you may not use the platform.',
          'We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting.',
        ],
      },
      {
        id: 'use',
        title: 'Use of Service',
        content: [
          'The platform is intended for educational and entertainment purposes only.',
          'You agree to use the service in accordance with all applicable laws and regulations.',
          'You must not use the service for any unlawful purpose or in any manner which could damage, disable, or impair the service.',
          'You may not reverse engineer, decompile, or disassemble any portion of the platform.',
        ],
      },
      {
        id: 'content',
        title: 'User Content',
        content: [
          'You retain all rights to any content you submit to the platform.',
          'By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content.',
          'You represent and warrant that you own or have the necessary rights to submit the content.',
          'We reserve the right to remove any content that violates these Terms or is otherwise objectionable.',
        ],
      },
      {
        id: 'intellectual',
        title: 'Intellectual Property',
        content: [
          'All content, features, and functionality on the platform are owned by or licensed to Kampung Siber Retro.',
          'The platform name, logo, and associated design elements are trademarks of Kampung Siber Retro.',
          'You may not reproduce, distribute, or create derivative works without our express written permission.',
          'Open source components used in the platform remain subject to their respective licenses.',
        ],
      },
      {
        id: 'disclaimer',
        title: 'Disclaimer of Warranties',
        content: [
          'The platform is provided "as is" and "as available" without warranties of any kind.',
          'We do not warrant that the platform will be uninterrupted, secure, or error-free.',
          'We do not warrant that the results obtained from using the platform will be accurate or reliable.',
          'Some jurisdictions do not allow the exclusion of implied warranties, so the above may not apply to you.',
        ],
      },
      {
        id: 'limitation',
        title: 'Limitation of Liability',
        content: [
          'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages.',
          'Our total liability to you for all claims arising out of or related to these Terms shall not exceed $100.',
          'Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above may not apply to you.',
          'The foregoing limitations apply even if the limited remedy fails of its essential purpose.',
        ],
      },
      {
        id: 'termination',
        title: 'Termination',
        content: [
          'We may terminate or suspend your access to the platform immediately, without prior notice or liability.',
          'Upon termination, your right to use the platform will cease immediately.',
          'All provisions that by their nature should survive termination shall survive termination.',
          'If you violate any of the terms, we may terminate your access immediately.',
        ],
      },
      {
        id: 'governing',
        title: 'Governing Law',
        content: [
          'These Terms are governed by and construed in accordance with the laws of Malaysia.',
          'Any disputes arising under or related to these Terms shall be subject to the exclusive jurisdiction of the courts in Malaysia.',
          'We may bring legal proceedings in any court that has jurisdiction over the parties.',
          'These Terms constitute the entire agreement between you and us regarding the subject matter.',
        ],
      },
    ],
  };
  // End: Terms Data

  // Start: Handle Section Click
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId === activeSection ? null : sectionId);
  };
  // End: Handle Section Click

  // Start: Handle Back to Top
  const handleBackToTop = () => {
    setActiveSection(null);
    setShowFullContent(false);
  };
  // End: Handle Back to Top

  // Start: Render Terms Page
  return (
    <div className={`retro-window flex flex-col ${className || ''}`}>
      {/* Start: Window Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <span className="mr-2">📜</span>
          {termsData.title}
        </h3>
      </div>
      {/* End: Window Header */}

      {/* Start: Window Content */}
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="mb-3">
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            Last Updated: {termsData.lastUpdated}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            These Terms of Service govern your use of the Kampung Siber Retro platform. Please read them carefully before using our services.
          </p>
        </div>

        <div className="space-y-1">
          {termsData.sections.map((section) => (
            <div key={section.id} className="border border-gray-300 dark:border-gray-600 rounded">
              <button
                onClick={() => handleSectionClick(section.id)}
                className="w-full px-3 py-2 text-left flex justify-between items-center retro-btn-secondary text-xs"
              >
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {section.title}
                </span>
                <span className="text-xs">
                  {activeSection === section.id ? '▼' : '▶'}
                </span>
              </button>
              
              {activeSection === section.id && (
                <div className="px-3 pb-2">
                  <ul className="space-y-1">
                    {section.content.map((paragraph, index) => (
                      <li key={index} className="text-xs text-gray-700 dark:text-gray-300">
                        {paragraph}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {!showFullContent && (
          <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900/20 rounded border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              These are the key terms. For complete terms, please visit our full legal documentation.
            </p>
          </div>
        )}
      </div>
      {/* End: Window Content */}

      {/* Start: Window Footer */}
      <div className="retro-window-footer bg-gray-200 dark:bg-gray-700 px-3 py-2 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {termsData.sections.length} sections
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/privacy')}
            className="retro-btn-secondary text-xs"
          >
            Privacy Policy
          </button>
          <button
            onClick={handleBackToTop}
            className="retro-btn-secondary text-xs"
          >
            Top
          </button>
        </div>
      </div>
      {/* End: Window Footer */}
    </div>
  );
}
// End: TermsPage Component

'use client';

// Start: Imports
import { useState } from 'react';
// End: Imports

// Start: Type Definitions
interface Supporter {
  id: number;
  name: string;
  role: string;
  contribution: string;
  avatar: string;
  joinDate: string;
  verified: boolean;
}

interface SupporterPageProps {
  className?: string;
}
// End: Type Definitions

// Start: SupporterPage Component
export default function SupporterPage({ className }: SupporterPageProps) {
  // Start: State Management
  const [supporters] = useState<Supporter[]>([
    {
      id: 1,
      name: 'RetroCoder',
      role: 'Founder',
      contribution: 'Created the core platform architecture and initial codebase',
      avatar: '👨‍💻',
      joinDate: '2023-01-15',
      verified: true,
    },
    {
      id: 2,
      name: 'PixelPioneer',
      role: 'Lead Designer',
      contribution: 'Designed the Windows 95 UI system and visual assets',
      avatar: '🎨',
      joinDate: '2023-02-20',
      verified: true,
    },
    {
      id: 3,
      name: 'ByteBandit',
      role: 'Community Moderator',
      contribution: 'Manages community interactions and content quality',
      avatar: '🛡️',
      joinDate: '2023-03-10',
      verified: true,
    },
    {
      id: 4,
      name: 'NeonNomad',
      role: 'Documentation Lead',
      contribution: 'Maintains tutorials and developer documentation',
      avatar: '📖',
      joinDate: '2023-04-05',
      verified: false,
    },
    {
      id: 5,
      name: 'GlitchGuru',
      role: 'Bug Hunter',
      contribution: 'Identifies and resolves platform issues',
      avatar: '🐛',
      joinDate: '2023-05-12',
      verified: false,
    },
  ]);
  // End: State Management

  // Start: Render Supporter Card
  const renderSupporterCard = (supporter: Supporter) => (
    <div
      key={supporter.id}
      className="retro-window p-4 mb-4 border-2 border-gray-400 bg-white retro-shadow"
    >
      <div className="flex items-start space-x-3">
        <div className="text-3xl">{supporter.avatar}</div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-bold text-sm text-gray-800">{supporter.name}</h4>
            {supporter.verified && (
              <span className="text-blue-500 text-sm">✓</span>
            )}
          </div>
          <p className="text-xs text-gray-600 font-mono mb-1">{supporter.role}</p>
          <p className="text-xs text-gray-500 mb-2">{supporter.contribution}</p>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>Joined: {new Date(supporter.joinDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
  // End: Render Supporter Card

  // Start: Render Supporter Page
  return (
    <div className={`p-4 ${className || ''}`}>
      {/* Start: Window Title Bar */}
      <div className="retro-title-bar px-3 py-2 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">🏆 Hall of Fame</h2>
        <div className="flex space-x-1">
          <div className="w-8 h-8"></div>
          <div className="w-8 h-8"></div>
          <div className="w-8 h-8"></div>
        </div>
      </div>
      {/* End: Window Title Bar */}

      {/* Start: Introduction */}
      <div className="retro-window p-3 mb-4 border-2 border-gray-400 bg-white retro-shadow">
        <h3 className="font-bold text-sm text-gray-800 mb-2">Our Contributors</h3>
        <p className="text-xs text-gray-600">
          These amazing individuals have contributed to making Kampung Siber Retro what it is today. 
          Their dedication and expertise have helped build a thriving retro web development community.
        </p>
      </div>
      {/* End: Introduction */}

      {/* Start: Supporters Grid */}
      <div className="space-y-3">
        {supporters.map(renderSupporterCard)}
      </div>
      {/* End: Supporters Grid */}

      {/* Start: Become a Supporter */}
      <div className="retro-window p-3 mt-4 border-2 border-gray-400 bg-white retro-shadow">
        <h3 className="font-bold text-sm text-gray-800 mb-2">Want to Join?</h3>
        <p className="text-xs text-gray-600 mb-3">
          Contribute to the platform by submitting code, designs, documentation, or community support.
        </p>
        <button className="retro-btn-primary text-xs px-3 py-1">
          View Contribution Guidelines
        </button>
      </div>
      {/* End: Become a Supporter */}
    </div>
  );
}
// End: SupporterPage Component

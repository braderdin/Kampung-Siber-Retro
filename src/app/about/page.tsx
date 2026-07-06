'use client';

import { useState } from 'react';

interface MovementValue {
  title: string;
  description: string;
  icon: string;
}

interface AboutPageProps {
  className?: string;
}

export default function AboutPage({ className }: AboutPageProps) {
  const [activeTab, setActiveTab] = useState<'mission' | 'values' | 'history'>('mission');

  const movementValues: MovementValue[] = [
    {
      title: 'Preservation',
      description:
        'We preserve the art and craft of early web development, keeping alive the techniques and aesthetics of the 90s web.',
      icon: '🏛️',
    },
    {
      title: 'Education',
      description:
        'We educate a new generation of developers about the foundations of web technology through hands-on retro experiences.',
      icon: '🎓',
    },
    {
      title: 'Community',
      description:
        'We foster a global community of retro enthusiasts who share knowledge, resources, and creative projects.',
      icon: '👥',
    },
    {
      title: 'Innovation',
      description:
        'We innovate by blending retro aesthetics with modern development practices to create unique web experiences.',
      icon: '⚡',
    },
  ];

  const renderMissionTab = () => (
    <div className="space-y-3">
      <p className="text-xs text-gray-700 leading-relaxed">
        Kampung Siber Retro is a cyber village dedicated to celebrating and preserving the golden age of web development.
        We believe that understanding the past is essential for building the future of the web.
      </p>
      <p className="text-xs text-gray-700 leading-relaxed">
        Our platform provides tools, tutorials, and community spaces where developers can learn, create, and share
        retro-inspired web projects. From HTML tables to CSS filters, we embrace the limitations and creativity
        of early web design.
      </p>
      <p className="text-xs text-gray-700 leading-relaxed">
        Join us in our mission to keep the spirit of the early web alive, while building bridges to modern
        development practices through the lens of retro aesthetics and techniques.
      </p>
    </div>
  );

  const renderValuesTab = () => (
    <div className="space-y-3">
      {movementValues.map((value) => (
        <div
          key={value.title}
          className="retro-window p-3 border-2 border-gray-400 bg-white retro-shadow"
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{value.icon}</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800 mb-1">{value.title}</h4>
              <p className="text-xs text-gray-600">{value.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-3">
      <div className="retro-window p-3 border-2 border-gray-400 bg-white retro-shadow">
        <h4 className="font-bold text-sm text-gray-800 mb-2">Timeline</h4>
        <div className="relative border-l-2 border-gray-300 pl-4 space-y-4">
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            <p className="text-xs text-gray-700">
              <span className="font-bold">2023</span> - Project initiated to preserve retro web development
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            <p className="text-xs text-gray-700">
              <span className="font-bold">2024</span> - First public release with basic editor and sandbox
            </p>
          </div>
          <div className="relative">
            <div className="absolute -left-6 top-1 w-3 h-3 bg-blue-500 rounded-full"></div>
            <p className="text-xs text-gray-700">
              <span className="font-bold">2025</span> - Expanded community, tutorials, and supporter tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${className || ''}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">About Kampung Siber Retro</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            A living archive of the early web, reimagined for modern creators.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="retro-window p-6 border-2 border-gray-400 bg-white retro-shadow">
            <div className="flex space-x-2 border-b border-gray-200 pb-3 mb-4">
              {(['mission', 'values', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'mission' && renderMissionTab()}
            {activeTab === 'values' && renderValuesTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </div>

          <div className="space-y-4">
            <div className="retro-window p-4 border-2 border-gray-400 bg-white retro-shadow">
              <h2 className="font-bold text-sm text-gray-800 mb-2">What we stand for</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                We preserve the craft, teach the fundamentals, and build community around playful experimentation.
              </p>
            </div>
            <div className="retro-window p-4 border-2 border-gray-400 bg-white retro-shadow">
              <h2 className="font-bold text-sm text-gray-800 mb-2">How to participate</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Explore the tutorials, remix site files, and share your own retro creations with the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

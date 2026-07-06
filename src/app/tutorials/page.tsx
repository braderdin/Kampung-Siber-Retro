'use client';

// Start: Imports
import { useState } from 'react';
// End: Imports

// Start: Type Definitions
interface Tutorial {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  completed: boolean;
}

interface TutorialsPageProps {
  className?: string;
}
// End: Type Definitions

// Start: TutorialsPage Component
export default function TutorialsPage({ className }: TutorialsPageProps) {
  // Start: State Management
  const [tutorials] = useState<Tutorial[]>([
    {
      id: 1,
      title: 'HTML Basics for Retro Web Development',
      description: 'Learn the fundamentals of HTML with a focus on retro styling techniques.',
      difficulty: 'Beginner',
      category: 'HTML',
      completed: false,
    },
    {
      id: 2,
      title: 'CSS Styling with Windows 95 Aesthetics',
      description: 'Master CSS techniques to create authentic Windows 95 style interfaces.',
      difficulty: 'Beginner',
      category: 'CSS',
      completed: false,
    },
    {
      id: 3,
      title: 'JavaScript Fundamentals for Retro Games',
      description: 'Build classic arcade-style games using vanilla JavaScript.',
      difficulty: 'Intermediate',
      category: 'JavaScript',
      completed: false,
    },
    {
      id: 4,
      title: 'Pixel Art Creation Techniques',
      description: 'Learn to create and optimize pixel art for retro web experiences.',
      difficulty: 'Intermediate',
      category: 'Design',
      completed: false,
    },
    {
      id: 5,
      title: 'Audio Synthesis for Retro Sound Effects',
      description: 'Create authentic retro sound effects using the Web Audio API.',
      difficulty: 'Advanced',
      category: 'Audio',
      completed: false,
    },
  ]);
  // End: State Management

  // Start: Filter State
  const [filter, setFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  // End: Filter State

  // Start: Filtered Tutorials
  const filteredTutorials = tutorials.filter(tutorial => 
    filter === 'all' || tutorial.difficulty === filter
  );
  // End: Filtered Tutorials

  // Start: Render Tutorial Card
  const renderTutorialCard = (tutorial: Tutorial) => (
    <div
      key={tutorial.id}
      className="retro-window p-4 mb-3 border-2 border-gray-400 bg-white retro-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-sm text-gray-800">{tutorial.title}</h4>
        <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(tutorial.difficulty)}`}>
          {tutorial.difficulty}
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-2">{tutorial.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{tutorial.category}</span>
        <button
          onClick={() => alert(`Starting tutorial: ${tutorial.title}`)}
          className="retro-btn-primary text-xs px-3 py-1"
        >
          Start Tutorial
        </button>
      </div>
    </div>
  );
  // End: Render Tutorial Card

  // Start: Get Difficulty Color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  // End: Get Difficulty Color

  // Start: Render Tutorials Page
  return (
    <div className={`p-4 ${className || ''}`}>
      {/* Start: Window Title Bar */}
      <div className="retro-title-bar px-3 py-2 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">📚 Tutorials</h2>
        <div className="flex space-x-1">
          <div className="w-8 h-8"></div>
          <div className="w-8 h-8"></div>
          <div className="w-8 h-8"></div>
        </div>
      </div>
      {/* End: Window Title Bar */}

      {/* Start: Filter Buttons */}
      <div className="retro-window p-3 mb-4 border-2 border-gray-400 bg-white retro-shadow">
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All Tutorials
          </button>
          <button
            onClick={() => setFilter('Beginner')}
            className={`px-3 py-1 text-xs rounded ${
              filter === 'Beginner' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setFilter('Intermediate')}
            className={`px-3 py-1 text-xs rounded ${
              filter === 'Intermediate' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setFilter('Advanced')}
            className={`px-3 py-1 text-xs rounded ${
              filter === 'Advanced' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Advanced
          </button>
        </div>
        <p className="text-xs text-gray-600">
          Showing {filteredTutorials.length} of {tutorials.length} tutorials
        </p>
      </div>
      {/* End: Filter Buttons */}

      {/* Start: Tutorials List */}
      <div className="space-y-3">
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map(renderTutorialCard)
        ) : (
          <div className="retro-window p-4 border-2 border-gray-400 bg-white retro-shadow text-center">
            <p className="text-gray-500 text-sm">No tutorials match the selected filter.</p>
          </div>
        )}
      </div>
      {/* End: Tutorials List */}
    </div>
  );
}
// End: TutorialsPage Component

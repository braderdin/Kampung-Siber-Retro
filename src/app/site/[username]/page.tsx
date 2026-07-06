import { notFound } from 'next/navigation';

interface UserSitePageProps {
  params: {
    username: string;
  };
}

export default function UserSitePage({ params }: UserSitePageProps) {
  const { username } = params;

  if (!username || username.length < 2) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="retro-window w-full max-w-4xl">
        <div className="retro-window-title-bar">
          <div className="retro-window-title">{username}'s Site</div>
        </div>
        <div className="retro-window-client p-6">
          <h1 className="text-2xl font-bold mb-4 retro-heading">
            Welcome to {username}'s Retro Website
          </h1>
          <div className="retro-controls-grid">
            <div className="retro-control-item">
              <span className="retro-control-label">📁</span>
              <span className="retro-control-name">My Files</span>
            </div>
            <div className="retro-control-item">
              <span className="retro-control-label">📊</span>
              <span className="retro-control-name">Statistics</span>
            </div>
            <div className="retro-control-item">
              <span className="retro-control-label">⚙️</span>
              <span className="retro-control-name">Settings</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded border-2 retro-border">
            <p className="text-gray-600">
              This is a placeholder for {username}'s personal retro website.
              Content will be loaded dynamically based on user configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

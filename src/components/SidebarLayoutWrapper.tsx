"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarLayoutWrapperProps {
  children: React.ReactNode;
  residentUsername?: string;
  className?: string;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

export default function SidebarLayoutWrapper({
  children,
  residentUsername,
  className
}: SidebarLayoutWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const sidebarItems: SidebarItem[] = [
    { label: '🏠 Home', href: `/site/${residentUsername || 'demo'}`, icon: '🏠' },
    { label: '📝 Journal', href: `/site/${residentUsername || 'demo'}/journal`, icon: '📝' },
    { label: '🔗 Links', href: `/site/${residentUsername || 'demo'}/links`, icon: '🔗' },
    { label: '🏆 Achievements', href: `/site/${residentUsername || 'demo'}/achievements`, icon: '🏆' },
    { label: '⚙️ Settings', href: `/settings/${residentUsername || 'demo'}`, icon: '⚙️' }
  ];

  useEffect(() => {
    setIsClient(true);
    
    // Check for mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Auto-close sidebar on mobile when clicking items
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  const isActiveItem = useCallback((href: string) => {
    return pathname === href || (pathname && pathname.startsWith(href));
  }, [pathname]);

  const handleNavigation = useCallback((href: string) => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    router.push(href);
  }, [isMobile, router]);

  if (!isClient) {
    return (
      <div className={`sidebar-layout ${className || ''}`}>
        <div className="flex-1 p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className={`sidebar-layout ${className || ''}`}>
      {/* Start: Mobile Menu Toggle */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 retro-btn-secondary text-sm px-3 py-1"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      )}
      {/* End: Mobile Menu Toggle */}

      {/* Start: Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : ''}
          ${!isMobile ? 'translate-x-0' : ''}
          ${isClient ? '' : 'translate-x--full'}
        `}
      >
        <div className="h-full w-64 bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-md flex flex-col">
          {/* Start: Sidebar Header */}
          <div className="p-4 border-b-2 border-dashed border-cyan-400/30">
            <h2 className="text-lg font-bold text-cyan-400 pixel-font flex items-center gap-2">
              <span className="text-2xl">🧑</span>
              <span className="truncate">
                {residentUsername || 'Resident'}
              </span>
            </h2>
          </div>
          {/* End: Sidebar Header */}

          {/* Start: Navigation Items */}
          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded
                      transition-all duration-200 pixel-font text-sm
                      ${isActiveItem(item.href)
                        ? 'bg-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-cyan-300'
                      }
                    `}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* End: Navigation Items */}

          {/* Start: Sidebar Footer */}
          <div className="p-4 border-t-2 border-dashed border-cyan-400/30">
            <button
              onClick={toggleSidebar}
              className="w-full retro-btn-secondary text-xs px-3 py-1"
            >
              {isSidebarOpen ? 'Close' : 'Open'}
            </button>
          </div>
          {/* End: Sidebar Footer */}
        </div>
      </aside>
      {/* End: Sidebar */}

      {/* Start: Main Content */}
      <div 
        className={`
          min-h-screen transition-all duration-300
          ${isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-64' : 'ml-0')}
        `}
      >
        {children}
      </div>
      {/* End: Main Content */}

      {/* Start: Overlay (mobile) */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
      {/* End: Overlay */}
    </div>
  );
}
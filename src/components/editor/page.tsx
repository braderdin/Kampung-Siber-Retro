// Start: Dynamic User Site Page with R2 Content Rendering
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Metadata } from 'next'; // Start: Import Metadata type
import Win95DialogEmptyState from '@/components/ui/Win95DialogEmptyState'; // Start: Import Win95DialogEmptyState

// Start: Dynamic Metadata Generation (Client-side for now, can be server-side)
// Abangku, for true dynamic metadata that is SEO-friendly, this should ideally be a server component
// or use a server-side data fetching approach. For client-side rendering, it updates after hydration.
export function generateMetadata({ params }: { params: { username: string } }): Metadata {
  const username = params.username;
  return {
    title: `${username}'s Retro Site - Kampung Siber Retro`,
    description: `Explore the personal retro website of ${username} on Kampung Siber Retro.`,
    openGraph: {
      title: `${username}'s Retro Site`,
      description: `Explore the personal retro website of ${username} on Kampung Siber Retro.`,
      url: `https://kampung-siber.vercel.app/site/${username}`, // Update with actual domain
      siteName: 'Kampung Siber Retro',
      images: [
        {
          url: 'https://kampung-siber.vercel.app/og-image.jpg', // Placeholder image
          width: 1200,
          height: 630,
          alt: 'Kampung Siber Retro',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${username}'s Retro Site`,
      description: `Explore the personal retro website of ${username} on Kampung Siber Retro.`,
      creator: '@kampungsiber', // Update with actual Twitter handle
      images: ['https://kampung-siber.vercel.app/twitter-image.jpg'], // Placeholder image
    },
  };
}
// End: Dynamic Metadata Generation

export default function UserSitePage() {
  const params = useParams();
  const username = params.username as string;
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Start: Fetch User Site Content from R2
  const fetchUserSiteContent = useCallback(async () => {
    if (!username) {
      setError('Nama pengguna tidak ditemui'); // Formal Malay for "Username not found"
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Abangku, for a public site, authentication might not be needed.
      // However, if we want to restrict access or track, we might use a public token or API key.
      // For now, we'll assume the API route handles public access or uses a system token.
      const response = await fetch(`/api/storage/read?filename=${username}/index.html`);
      const data = await response.json();

      if (data.success && data.content) {
        setContent(data.content);
      } else {
        // Start: Error Guard - Display Win95DialogEmptyState if index.html not found
        setError(data.error || 'Kandungan laman tidak dijumpai'); // Formal Malay for "Site content not found"
        setContent(null); // Ensure content is null to trigger empty state
        // End: Error Guard
      }
    } catch (err) {
      console.error('Failed to fetch user site content:', err);
      setError('Gagal memuatkan kandungan laman'); // Formal Malay for "Failed to load site content"
      setContent(null); // Ensure content is null to trigger empty state
    } finally {
      setIsLoading(false);
    }
  }, [username]);
  // End: Fetch User Site Content from R2

  useEffect(() => {
    fetchUserSiteContent();
  }, [fetchUserSiteContent]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-400 pixel-font">Memuatkan laman {username}...</p> {/* Formal Malay for "Loading site..." */}
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Win95DialogEmptyState
          message={error || `Laman untuk ${username} tidak dijumpai. Sila pastikan nama pengguna adalah betul atau laman belum diterbitkan.`} // Formal Malay for "Site for [username] not found. Please ensure the username is correct or the site has not been published."
          secondaryActionRoute="/dashboard" // Example route for a secondary action
        />
      </div>
    );
  }

  return (
    // Start: Iframe for Rendering User Content
    <div className="min-h-screen w-full">
      <iframe
        srcDoc={content}
        title={`${username}'s Site`}
        className="w-full h-screen border-none"
        sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-same-origin"
        loading="lazy"
      />
    </div>
    // End: Iframe for Rendering User Content
  );
}
// End: Dynamic User Site Page with R2 Content Rendering
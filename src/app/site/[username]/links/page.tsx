import { ResidentLink } from "@/types/links";
import { ResidentLinkCollection } from "@/components/ResidentLinkCollection";
import HydrationGuard from "@/components/HydrationGuard";

interface LinksPageProps {
  params: {
    username: string;
  };
}

interface LinksData {
  links: ResidentLink[];
  hasNextPage: boolean;
  currentPage: number;
}

async function fetchLinks(username: string, page: number = 1): Promise<LinksData> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/users/${username}/links?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return { links: [], hasNextPage: false, currentPage: page };
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch links for ${username}:`, error);
    return { links: [], hasNextPage: false, currentPage: page };
  }
}

async function fetchUser(username: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/users/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export default async function LinksPage({ params }: LinksPageProps) {
  const { username } = params;
  const [linksData, user] = await Promise.all([
    fetchLinks(username),
    fetchUser(username),
  ]);

  const { links, hasNextPage, currentPage } = linksData;

  return (
    <HydrationGuard>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="font-pixel text-3xl text-white mb-2">
              {username}'s Links
            </h1>
            <p className="font-pixel text-xs text-gray-400">
              {links.length} curated links • {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ResidentLinkCollection
                links={links}
                username={username}
                maxLinks={50}
              />
            </div>

            <div className="space-y-6">
              <section className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4">
                <h2 className="font-pixel text-sm text-gray-300 mb-3">Quick Links</h2>
                <div className="space-y-2">
                  <a
                    href={`/site/${username}/journal`}
                    className="block font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    📔 Journal
                  </a>
                  <a
                    href={`/site/${username}/profile`}
                    className="block font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    👤 Profile
                  </a>
                  <a
                    href={`/site/${username}/guestbook`}
                    className="block font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    💬 Guestbook
                  </a>
                  <a
                    href={`/site/${username}/webring`}
                    className="block font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    🔗 Webring
                  </a>
                </div>
              </section>

              {user && (
                <section className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4">
                  <h2 className="font-pixel text-sm text-gray-300 mb-3">About {username}</h2>
                  <p className="font-pixel text-xs text-gray-400 line-clamp-4">
                    {user.bio || "No bio available."}
                  </p>
                  <a
                    href={`/site/${username}/profile`}
                    className="mt-2 inline-block font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View Full Profile →
                  </a>
                </section>
              )}
            </div>
          </div>

          {hasNextPage && (
            <div className="mt-8 text-center">
              <a
                href={`/site/${username}/links?page=${currentPage + 1}`}
                className="font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Load More Links →
              </a>
            </div>
          )}
        </div>
      </div>
    </HydrationGuard>
  );
}
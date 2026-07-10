import { JournalEntry } from "@/types/journal";
import HydrationGuard from "@/components/HydrationGuard";
import { JournalEntryForm } from "@/components/JournalEntryForm";

interface JournalPageProps {
  params: {
    username: string;
  };
}

interface JournalData {
  entries: JournalEntry[];
  hasNextPage: boolean;
  currentPage: number;
}

async function fetchJournalEntries(username: string, page: number = 1): Promise<JournalData> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/users/${username}/journal?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return { entries: [], hasNextPage: false, currentPage: page };
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch journal entries for ${username}:`, error);
    return { entries: [], hasNextPage: false, currentPage: page };
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

export default async function JournalPage({ params }: JournalPageProps) {
  const { username } = params;
  const [journalData, user] = await Promise.all([
    fetchJournalEntries(username),
    fetchUser(username),
  ]);

  const { entries, hasNextPage, currentPage } = journalData;

  return (
    <HydrationGuard>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="font-pixel text-3xl text-white mb-2">
              {username}'s Journal
            </h1>
            <p className="font-pixel text-xs text-gray-400">
              {entries.length} public entries • {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </header>

          <div className="space-y-6">
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-pixel text-xs text-gray-500">
                  No journal entries found.
                </p>
                <p className="font-pixel text-xs text-gray-600 mt-2">
                  Be the first to write something!
                </p>
              </div>
            ) : (
              entries.map((entry) => (
                <article
                  key={entry.id}
                  className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4 transition-all duration-200 hover:shadow-lg"
                >
                  <header className="mb-3">
                    <h2 className="font-pixel text-lg text-white mb-1">
                      {entry.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{new Date(entry.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                      {entry.isPublic && (
                        <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-full">
                          Public
                        </span>
                      )}
                    </div>
                  </header>

                  <div className="prose prose-sm prose-gray max-w-none">
                    <p className="font-pixel text-xs text-gray-300 whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>

                  <footer className="mt-3 pt-3 border-t border-gray-700/30 flex items-center justify-between">
                    <div className="font-pixel text-xs text-gray-500">
                      by {entry.username}
                    </div>
                    <a
                      href={`/site/${username}/journal/${entry.slug}`}
                      className="font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Read More →
                    </a>
                  </footer>
                </article>
              ))
            )}

            {hasNextPage && (
              <div className="text-center">
                <a
                  href={`/site/${username}/journal?page=${currentPage + 1}`}
                  className="font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Load More Entries →
                </a>
              </div>
            )}
          </div>

          <section className="mt-12 pt-8 border-t border-gray-700/30">
            <h2 className="font-pixel text-xl text-white mb-4">Write a New Entry</h2>
            <JournalEntryForm
              username={username}
              onSubmit={async (entry) => {
                await fetch(`/api/users/${username}/journal`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(entry),
                });
              }}
            />
          </section>
        </div>
      </div>
    </HydrationGuard>
  );
}
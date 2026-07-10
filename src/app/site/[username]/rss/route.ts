import { JournalEntry } from "@/types/journal";
import { NextRequest, NextResponse } from "next/server";

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

interface RSSFeed {
  title: string;
  link: string;
  description: string;
  lastBuildDate: string;
  items: RSSItem[];
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """)
    .replace(/'/g, "'");
}

function generateRSSFeed(data: RSSFeed): string {
  const itemsXML = data.items
    .map((item) => `
    <item>
      <title>${escapeXML(item.title)}</title>
      <link>${escapeXML(item.link)}</link>
      <description>${escapeXML(item.description)}</description>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <guid isPermaLink="false">${escapeXML(item.guid)}</guid>
    </item>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:slash="http://purl.org/rss/1.0/slash/">
    <channel>
      <title>${escapeXML(data.title)}</title>
      <link>${escapeXML(data.link)}</link>
      <description>${escapeXML(data.description)}</description>
      <lastBuildDate>${new Date(data.lastBuildDate).toUTCString()}</lastBuildDate>
      <language>en-US</language>
      <copyright>© ${new Date().getFullYear()} Kampung Siber Retro</copyright>
      <category>Retro Journal</category>
      <items>
${itemsXML}
      </items>
    </channel>
  </rss>`;
}

async function fetchJournalEntries(username: string, limit: number = 50): Promise<JournalEntry[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/users/${username}/journal?limit=${limit}&public=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.entries || [];
  } catch (error) {
    console.error(`Failed to fetch journal entries for ${username}:`, error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") || "anonymous";
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50", 10);

  const entries = await fetchJournalEntries(username, Math.min(limit, 100));

  const items: RSSItem[] = entries.map((entry) => ({
    title: entry.title,
    link: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/site/${username}/journal/${entry.slug}`,
    description: entry.content.length > 500
      ? entry.content.substring(0, 500) + "..."
      : entry.content,
    pubDate: entry.createdAt,
    guid: entry.id,
  }));

  const feed: RSSFeed = {
    title: `${username}'s Journal - Kampung Siber Retro`,
    link: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/site/${username}/journal`,
    description: `Retro-style journal entries from ${username} at Kampung Siber Retro - A digital village of retro web enthusiasts.`,
    lastBuildDate: new Date().toISOString(),
    items,
  };

  const rss = generateRSSFeed(feed);

  return new NextResponse(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}

export { GET as POST };
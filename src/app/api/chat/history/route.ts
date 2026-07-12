import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ChatHistorySchema = z.object({
  channelId: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  before: z.string().optional(),
  after: z.string().optional(),
});

interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  createdAt: string;
  isSystem?: boolean;
}

interface ChatHistoryResponse {
  messages: ChatMessage[];
  hasMore: boolean;
  cursor?: string;
}

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    channelId: "general",
    userId: "user1",
    username: "kampung_master",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "Selamat datang di kampung siber retro!",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isSystem: true,
  },
  {
    id: "2",
    channelId: "general",
    userId: "user2",
    username: "pixel_pioneer",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "Wah, komunitas ini memang retro ya! 🕹️",
    createdAt: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: "3",
    channelId: "general",
    userId: "user3",
    username: "web_ring_ wanderer",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "Ada yang pengin share webring lama2?",
    createdAt: new Date(Date.now() - 3400000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const channelId = url.searchParams.get("channelId") || "general";
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "50", 10),
      100
    );
    const before = url.searchParams.get("before");
    const after = url.searchParams.get("after");

    const params = { channelId, limit, before, after };
    const validated = ChatHistorySchema.parse(params);

    let messages = mockMessages
      .filter((msg) => msg.channelId === validated.channelId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, validated.limit);

    const hasMore = messages.length === validated.limit;
    const cursor = hasMore ? messages[messages.length - 1].id : undefined;

    const response: ChatHistoryResponse = {
      messages,
      hasMore,
      cursor,
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    // Start: Fix Zod error typing
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid parameters", details: error.issues }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // End: Fix Zod error typing

    console.error("Error fetching chat history:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = ChatHistorySchema.safeParse(body);

    if (!validated.success) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true, message: "Chat history request processed" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

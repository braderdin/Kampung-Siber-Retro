import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const DownloadSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  userId: z.string().optional(),
  userAgent: z.string().optional(),
});

interface AssetDownload {
  assetId: string;
  downloadCount: number;
  lastDownloaded: string;
}

interface RedisClient {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string | number) => Promise<void>;
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<void>;
}

declare global {
  var __redis__: RedisClient | undefined;
}

const getRedisClient = (): RedisClient | null => {
  if (typeof globalThis.__redis__ !== "undefined") {
    return globalThis.__redis__;
  }
  return null;
};

const mockDownloadCounts: Record<string, number> = {};

async function incrementDownloadCount(assetId: string): Promise<number> {
  const redis = getRedisClient();
  
  if (redis) {
    try {
      const count = await redis.incr(`asset:${assetId}:downloads`);
      await redis.expire(`asset:${assetId}:downloads`, 86400);
      return count;
    } catch (error) {
      console.error("Redis error:", error);
    }
  }

  mockDownloadCounts[assetId] = (mockDownloadCounts[assetId] || 0) + 1;
  return mockDownloadCounts[assetId];
}

async function recordDownload(
  assetId: string,
  userId?: string,
  userAgent?: string
): Promise<void> {
  const redis = getRedisClient();
  
  if (redis) {
    try {
      const key = `asset:${assetId}:download:${Date.now()}`;
      const data = JSON.stringify({
        userId: userId || "anonymous",
        userAgent: userAgent || "unknown",
        timestamp: Date.now(),
      });
      await redis.set(key, data);
      await redis.expire(key, 604800);
    } catch (error) {
      console.error("Failed to record download in Redis:", error);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userAgent = request.headers.get("user-agent") || undefined;

    const validated = DownloadSchema.safeParse({
      ...body,
      userAgent,
    });

    if (!validated.success) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Invalid request body", 
          details: validated.error.errors 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { assetId, userId } = validated.data;

    const downloadCount = await incrementDownloadCount(assetId);
    
    await recordDownload(assetId, userId, userAgent);

    return new NextResponse(
      JSON.stringify({
        success: true,
        assetId,
        downloadCount,
        message: "Download tracked successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing download:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const assetId = url.searchParams.get("assetId");

    if (!assetId) {
      return new NextResponse(
        JSON.stringify({ error: "Asset ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const redis = getRedisClient();
    let downloadCount = 0;

    if (redis) {
      try {
        const count = await redis.get(`asset:${assetId}:downloads`);
        downloadCount = count ? parseInt(count, 10) : 0;
      } catch (error) {
        console.error("Redis error:", error);
      }
    } else {
      downloadCount = mockDownloadCounts[assetId] || 0;
    }

    return new NextResponse(
      JSON.stringify({
        assetId,
        downloadCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching download count:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
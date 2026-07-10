import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ReportSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  targetId: z.string().optional(),
  targetType: z.enum(["post", "comment", "user", "profile"]).optional(),
  severity: z.enum(["low", "medium", "high"]).default("medium"),
  userId: z.string().optional(),
  userAgent: z.string().optional(),
  ip: z.string().optional(),
});

interface Report {
  id: string;
  subject: string;
  description: string;
  targetId?: string;
  targetType?: string;
  severity: "low" | "medium" | "high";
  userId?: string;
  createdAt: string;
  status: "pending" | "reviewed" | "resolved" | "rejected";
  adminNotes?: string;
}

interface ReportResponse {
  success: boolean;
  reportId?: string;
  message: string;
}

async function createReport(report: Partial<Report>): Promise<string> {
  const reportId = crypto.randomUUID();
  
  console.log("Report created:", {
    id: reportId,
    ...report,
    createdAt: new Date().toISOString(),
    status: "pending",
  });

  return reportId;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    const validated = ReportSchema.safeParse({
      ...body,
      ip,
      userAgent,
    });

    // Start: Fix Zod error typing
    if (!validated.success) {
      const errorDetails = validated.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return new NextResponse(
        JSON.stringify({ 
          error: "Validation failed", 
          details: errorDetails,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // End: Fix Zod error typing

    const { subject, description, targetId, targetType, severity, userId } = validated.data;

    const reportId = await createReport({
      subject,
      description,
      targetId,
      targetType,
      severity,
      userId: userId || "anonymous",
    });

    const response: ReportResponse = {
      success: true,
      reportId,
      message: "Report submitted successfully. Our moderation team will review it.",
    };

    return new NextResponse(JSON.stringify(response), {
      status: 201,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error processing report:", error);
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
    const status = url.searchParams.get("status");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 100);

    const mockReports: Report[] = [
      {
        id: "1",
        subject: "spam",
        description: "User posting spam content",
        targetId: "post-123",
        targetType: "post",
        severity: "high",
        userId: "user-1",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: "pending",
      },
    ];

    let reports = mockReports.slice(0, limit);

    if (status) {
      reports = reports.filter(r => r.status === status);
    }

    return new NextResponse(JSON.stringify({ reports, total: reports.length }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export { GET as PUT }

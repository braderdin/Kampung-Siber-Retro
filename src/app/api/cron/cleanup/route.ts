import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface CleanupResponse {
  success: boolean;
  message: string;
  deletedNotes?: number;
  deletedMetrics?: number;
  error?: string;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest): Promise<NextResponse<CleanupResponse>> {
  try {
    const cutoffDate = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();

    const { data: deletedNotes, error: notesError } = await supabase
      .from('anonymous_notes')
      .delete()
      .lt('created_at', cutoffDate)
      .select('id');

    if (notesError) {
      console.error('Error deleting expired notes:', notesError);
    }

    const { data: deletedMetrics, error: metricsError } = await supabase
      .from('text_metrics')
      .delete()
      .lt('created_at', cutoffDate)
      .select('id');

    if (metricsError) {
      console.error('Error deleting expired metrics:', metricsError);
    }

    const notesDeletedCount = deletedNotes?.length || 0;
    const metricsDeletedCount = deletedMetrics?.length || 0;

    return NextResponse.json({
      success: true,
      message: `Cleanup completed successfully. Removed ${notesDeletedCount} expired notes and ${metricsDeletedCount} expired metrics.`,
      deletedNotes: notesDeletedCount,
      deletedMetrics: metricsDeletedCount,
    });

  } catch (error) {
    console.error('Unexpected error in cron cleanup handler:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error during cleanup',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

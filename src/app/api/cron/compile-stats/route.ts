import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface StatsCompileResponse {
  success: boolean;
  message: string;
  totalVisits?: number;
  syncedAt?: string;
}

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || '';
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';

const redisFetch = async (path: string, method = 'GET') => {
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    return { error: 'Redis credentials not configured' };
  }
  
  const response = await fetch(`${UPSTASH_REDIS_REST_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });
  
  return response.json();
};

export async function GET(request: NextRequest): Promise<NextResponse<StatsCompileResponse>> {
  try {
    const visitCountData = await redisFetch('/get/site_visits_total');
    
    if (visitCountData.error) {
      throw new Error(visitCountData.error);
    }

    const totalVisits = parseInt(visitCountData.result) || 0;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, visit_count')
      .eq('id', 'global')
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: 'global',
        visit_count: totalVisits,
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      console.error('Error updating profile visit count:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'Site visit statistics compiled and synchronized successfully',
      totalVisits,
      syncedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Failed to compile stats:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to compile site statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

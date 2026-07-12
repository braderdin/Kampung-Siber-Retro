import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { ArcadeLeaderboardEntry } from '@/types/arcade';

const ScorePayloadSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username too long'),
  gameId: z.string().min(1, 'Game ID is required'),
  highScore: z.number().int().positive('Score must be a positive integer'),
});

type ScorePayload = z.infer<typeof ScorePayloadSchema>;

interface ApiResponse {
  success: boolean;
  message: string;
  data?: ArcadeLeaderboardEntry;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    
    const validationResult = ScorePayloadSchema.safeParse(body);
    
    // Start: Fix Zod error typing
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid payload: ' + errors.join(', '),
        },
        { status: 400 }
      );
    }
    // End: Fix Zod error typing

    const { username, gameId, highScore }: ScorePayload = validationResult.data;

    const { data, error } = await supabase
      .from('arcade_leaderboard')
      .insert({
        username,
        game_id: gameId,
        high_score: highScore,
        achieved_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save score to database',
        },
        { status: 500 }
      );
    }

    const leaderboardEntry: ArcadeLeaderboardEntry = {
      id: data.id,
      username: data.username,
      gameId: data.game_id,
      highScore: data.high_score,
      achievedAt: data.achieved_at,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Score saved successfully!',
        data: leaderboardEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error in arcade scores handler:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error occurred',
      },
      { status: 500 }
    );
  }
}

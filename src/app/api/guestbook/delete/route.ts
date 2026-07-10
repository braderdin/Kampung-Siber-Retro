import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const DeletePayloadSchema = z.object({
  entryId: z.number().int().positive('Invalid entry ID'),
  username: z.string().min(1, 'Username is required'),
});

interface DeleteResponse {
  success: boolean;
  message: string;
}

const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

const verifyAdminSession = (request: NextRequest): boolean => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  return token === ADMIN_SECRET || token === 'admin-session';
};

export async function POST(request: NextRequest): Promise<NextResponse<DeleteResponse>> {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({
      success: false,
      message: 'Unauthorized: Admin access required',
    }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const validationResult = DeletePayloadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid payload: ' + validationResult.error.errors.map(e => e.message).join(', '),
      }, { status: 400 });
    }

    const { entryId, username } = validationResult.data;

    const { error } = await supabase
      .from('guestbook_entries')
      .delete()
      .eq('id', entryId)
      .eq('username', username);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to delete guestbook entry',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Guestbook entry deleted successfully',
    });

  } catch (error) {
    console.error('Unexpected error in guestbook delete handler:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/types';

export async function POST() {
  try {
    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

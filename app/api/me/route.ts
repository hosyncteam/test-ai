import { NextResponse } from 'next/server';
import { getMockUser } from '@/lib/utils';
import { ApiResponse, User } from '@/lib/types';

export async function GET() {
  try {
    const user = getMockUser();

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

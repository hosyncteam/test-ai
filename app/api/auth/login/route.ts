import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { verifyPassword, generateMockToken } from '@/lib/utils';
import { ApiResponse, AuthUser } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    const user = mockDb.users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid email or password',
      }, { status: 401 });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid email or password',
      }, { status: 401 });
    }

    const token = generateMockToken();

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json<ApiResponse<AuthUser>>({
      success: true,
      data: { user: userData, token },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

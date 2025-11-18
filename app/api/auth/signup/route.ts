import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { hashPassword, generateMockToken } from '@/lib/utils';
import { ApiResponse, AuthUser } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Name, email, and password are required',
      }, { status: 400 });
    }

    const existingUser = mockDb.users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User with this email already exists',
      }, { status: 409 });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.users.push(newUser);

    const defaultSettings = {
      userId: newUser.id,
      linkExpires: false,
      allowDownload: true,
      twoFactorEnabled: false,
      selfReminderEnabled: true,
      selfReminderTiming: 'ONE_DAY' as const,
    };

    mockDb.settings.push(defaultSettings);

    const token = generateMockToken();

    const user = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return NextResponse.json<ApiResponse<AuthUser>>({
      success: true,
      data: { user, token },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

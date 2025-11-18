import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { getMockUser } from '@/lib/utils';
import { ApiResponse, Settings } from '@/lib/types';

export async function GET() {
  try {
    const user = getMockUser();
    
    let settings = mockDb.settings.find((s) => s.userId === user.id);
    
    if (!settings) {
      settings = {
        userId: user.id,
        linkExpires: false,
        allowDownload: true,
        twoFactorEnabled: false,
        selfReminderEnabled: true,
        selfReminderTiming: 'ONE_DAY' as const,
      };
      mockDb.settings.push(settings);
    }

    return NextResponse.json<ApiResponse<Settings>>({
      success: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getMockUser();
    const body = await request.json();

    const settingsIndex = mockDb.settings.findIndex((s) => s.userId === user.id);
    
    if (settingsIndex === -1) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Settings not found',
      }, { status: 404 });
    }

    mockDb.settings[settingsIndex] = {
      ...mockDb.settings[settingsIndex],
      ...body,
    };

    return NextResponse.json<ApiResponse<Settings>>({
      success: true,
      data: mockDb.settings[settingsIndex],
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

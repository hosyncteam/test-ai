import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { getMockUser } from '@/lib/utils';
import { ApiResponse, Recipient } from '@/lib/types';

export async function GET() {
  try {
    const user = getMockUser();
    const recipients = mockDb.recipients.filter((r) => r.userId === user.id);

    return NextResponse.json<ApiResponse<Recipient[]>>({
      success: true,
      data: recipients,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getMockUser();
    const body = await request.json();
    const { name, email, relationship } = body;

    if (!name || !email) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Name and email are required',
      }, { status: 400 });
    }

    const newRecipient = {
      id: `recipient-${Date.now()}`,
      userId: user.id,
      name,
      email,
      relationship: relationship || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.recipients.push(newRecipient);

    return NextResponse.json<ApiResponse<Recipient>>({
      success: true,
      data: newRecipient,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

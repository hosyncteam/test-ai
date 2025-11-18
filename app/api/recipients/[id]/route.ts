import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { getMockUser } from '@/lib/utils';
import { ApiResponse, Recipient } from '@/lib/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getMockUser();
    const { id } = await params;
    const body = await request.json();

    const recipientIndex = mockDb.recipients.findIndex(
      (r) => r.id === id && r.userId === user.id
    );

    if (recipientIndex === -1) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Recipient not found',
      }, { status: 404 });
    }

    mockDb.recipients[recipientIndex] = {
      ...mockDb.recipients[recipientIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json<ApiResponse<Recipient>>({
      success: true,
      data: mockDb.recipients[recipientIndex],
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getMockUser();
    const { id } = await params;

    const recipientIndex = mockDb.recipients.findIndex(
      (r) => r.id === id && r.userId === user.id
    );

    if (recipientIndex === -1) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Recipient not found',
      }, { status: 404 });
    }

    mockDb.recipients.splice(recipientIndex, 1);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: 'Recipient deleted successfully' },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

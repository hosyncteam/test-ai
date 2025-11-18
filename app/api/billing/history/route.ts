import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { getMockUser } from '@/lib/utils';
import { ApiResponse, BillingRecord } from '@/lib/types';

export async function GET() {
  try {
    const user = getMockUser();

    const billingHistory = mockDb.billingRecords
      .filter((b) => b.userId === user.id)
      .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

    return NextResponse.json<ApiResponse<BillingRecord[]>>({
      success: true,
      data: billingHistory,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

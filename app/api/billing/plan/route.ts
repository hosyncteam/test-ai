import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { getMockUser } from '@/lib/utils';
import { ApiResponse, Plan } from '@/lib/types';

export async function GET() {
  try {
    const user = getMockUser();

    const latestBilling = mockDb.billingRecords
      .filter((b) => b.userId === user.id)
      .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())[0];

    const currentPlan: Plan = latestBilling?.plan || 'STARTER';

    return NextResponse.json<ApiResponse<{ plan: Plan }>>({
      success: true,
      data: { plan: currentPlan },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

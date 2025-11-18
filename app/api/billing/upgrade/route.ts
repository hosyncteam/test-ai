import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { getMockUser } from '@/lib/utils';
import { ApiResponse, BillingRecord, Plan } from '@/lib/types';

const PLAN_PRICES: Record<Plan, number> = {
  STARTER: 5,
  PREMIUM: 29,
  FOREVER: 99,
};

export async function POST(request: NextRequest) {
  try {
    const user = getMockUser();
    const body = await request.json();
    const { plan } = body;

    if (!plan || !['STARTER', 'PREMIUM', 'FOREVER'].includes(plan)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid plan',
      }, { status: 400 });
    }

    const newBillingRecord = {
      id: `billing-${Date.now()}`,
      userId: user.id,
      plan: plan as Plan,
      amount: PLAN_PRICES[plan as Plan],
      currency: 'USD',
      paidAt: new Date().toISOString(),
    };

    mockDb.billingRecords.push(newBillingRecord);

    return NextResponse.json<ApiResponse<BillingRecord>>({
      success: true,
      data: newBillingRecord,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

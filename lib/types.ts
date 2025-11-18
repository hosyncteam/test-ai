export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Recipient = {
  id: string;
  userId: string;
  name: string;
  email: string;
  relationship?: string;
  createdAt: string;
  updatedAt: string;
};

export type VideoType = "TO_OTHERS" | "TO_SELF";
export type DeliveryStatus = "DRAFT" | "SCHEDULED" | "DELIVERED";

export type VideoMessage = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: VideoType;
  videoUrl: string;
  thumbnailUrl?: string;
  status: DeliveryStatus;
  deliveryAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  recipients?: VideoRecipient[];
};

export type VideoRecipient = {
  id: string;
  videoId: string;
  recipientId?: string;
  isSelf: boolean;
  recipient?: Recipient;
};

export type Plan = "STARTER" | "PREMIUM" | "FOREVER";

export type BillingRecord = {
  id: string;
  userId: string;
  plan: Plan;
  amount: number;
  currency: string;
  paidAt: string;
};

export type ReminderTiming = "SAME_DAY" | "ONE_DAY" | "ONE_WEEK" | "ONE_MONTH";

export type Settings = {
  userId: string;
  linkExpires: boolean;
  allowDownload: boolean;
  twoFactorEnabled: boolean;
  selfReminderEnabled: boolean;
  selfReminderTiming: ReminderTiming;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type AuthUser = {
  user: User;
  token: string;
};

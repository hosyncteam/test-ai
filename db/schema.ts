import { pgTable, uuid, varchar, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';

export const videoTypeEnum = pgEnum('video_type', ['TO_OTHERS', 'TO_SELF']);
export const deliveryStatusEnum = pgEnum('delivery_status', ['DRAFT', 'SCHEDULED', 'DELIVERED']);
export const planEnum = pgEnum('plan', ['STARTER', 'PREMIUM', 'FOREVER']);
export const reminderTimingEnum = pgEnum('reminder_timing', ['SAME_DAY', 'ONE_DAY', 'ONE_WEEK', 'ONE_MONTH']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const recipients = pgTable('recipients', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  relationship: varchar('relationship', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: videoTypeEnum('type').notNull(),
  videoUrl: varchar('video_url', { length: 500 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  status: deliveryStatusEnum('status').notNull().default('DRAFT'),
  deliveryAt: timestamp('delivery_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const videoRecipients = pgTable('video_recipients', {
  id: uuid('id').primaryKey().defaultRandom(),
  videoId: uuid('video_id').references(() => videos.id, { onDelete: 'cascade' }).notNull(),
  recipientId: uuid('recipient_id').references(() => recipients.id, { onDelete: 'cascade' }),
  isSelf: boolean('is_self').notNull().default(false),
});

export const billingRecords = pgTable('billing_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  plan: planEnum('plan').notNull(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  paidAt: timestamp('paid_at').defaultNow().notNull(),
});

export const settings = pgTable('settings', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  linkExpires: boolean('link_expires').notNull().default(false),
  allowDownload: boolean('allow_download').notNull().default(true),
  twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
  selfReminderEnabled: boolean('self_reminder_enabled').notNull().default(true),
  selfReminderTiming: reminderTimingEnum('self_reminder_timing').notNull().default('ONE_DAY'),
});

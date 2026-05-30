// ============================================================
// AA AI GROUP — Complete PostgreSQL Database Schema (Drizzle ORM)
// ============================================================
// 16 tables with UUID PKs, timestamps, enums, and full relations.
// ============================================================

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── ENUMS ────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "admin",
  "superadmin",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "completed",
  "cancelled",
  "refunded",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
  "expired",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "fpx",
  "manual_bank_transfer",
  "credit_card",
  "ewallet",
  "crypto",
]);

export const serviceStatusEnum = pgEnum("service_status", [
  "pending",
  "in_progress",
  "review",
  "revision",
  "completed",
  "cancelled",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "open",
  "in_progress",
  "awaiting_reply",
  "resolved",
  "closed",
]);

export const ticketPriorityEnum = pgEnum("ticket_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "paused",
  "cancelled",
  "expired",
  "trial",
]);

export const membershipTierEnum = pgEnum("membership_tier", [
  "free",
  "silver",
  "gold",
  "platinum",
  "diamond",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "payment_confirmed",
  "order_completed",
  "subscription_expiring",
  "new_product",
  "support_reply",
  "referral_reward",
  "system",
]);

export const productTypeEnum = pgEnum("product_type", [
  "app",
  "video_course",
  "digital_service",
  "template",
  "plugin",
  "bundle",
]);

export const digitalAccessStatusEnum = pgEnum("digital_access_status", [
  "active",
  "expired",
  "revoked",
  "pending",
]);

export const referralStatusEnum = pgEnum("referral_status", [
  "pending",
  "credited",
  "withdrawn",
  "expired",
]);

// ─── 1. USERS ─────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("customer").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 2. SETTINGS ──────────────────────────────────────────────
export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  description: text("description"),
  group: varchar("group", { length: 100 }),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 3. CATEGORIES ────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  iconUrl: text("icon_url"),
  parentId: uuid("parent_id"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 4. PRODUCTS ──────────────────────────────────────────────
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 500 }),
  type: productTypeEnum("type").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("MYR").notNull(),
  coverImageUrl: text("cover_image_url"),
  galleryUrls: jsonb("gallery_urls"),
  features: jsonb("features"),
  isPublished: boolean("is_published").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  downloadUrl: text("download_url"),
  version: varchar("version", { length: 50 }),
  totalSales: integer("total_sales").default(0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 5. ORDERS ────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  status: orderStatusEnum("status").default("pending").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  notes: text("notes"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 6. ORDER ITEMS ───────────────────────────────────────────
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 7. PAYMENTS ──────────────────────────────────────────────
export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  method: paymentMethodEnum("method").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("MYR").notNull(),
  transactionRef: varchar("transaction_ref", { length: 255 }),
  receiptUrl: text("receipt_url"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  notes: text("notes"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 8. DIGITAL ACCESS ───────────────────────────────────────
export const digitalAccess = pgTable("digital_access", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  licenseKey: varchar("license_key", { length: 255 }),
  downloadUrl: text("download_url"),
  accessUrl: text("access_url"),
  status: digitalAccessStatusEnum("status").default("active").notNull(),
  activatedAt: timestamp("activated_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  maxDownloads: integer("max_downloads").default(5),
  downloadCount: integer("download_count").default(0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 9. VIDEO COURSES ─────────────────────────────────────────
export const videoCourses = pgTable("video_courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  instructorName: varchar("instructor_name", { length: 255 }),
  level: varchar("level", { length: 50 }).default("beginner"),
  totalDurationMinutes: integer("total_duration_minutes").default(0),
  totalLessons: integer("total_lessons").default(0),
  isPublished: boolean("is_published").default(false).notNull(),
  sortOrder: integer("sort_order").default(0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 10. VIDEO LESSONS ────────────────────────────────────────
export const videoLessons = pgTable("video_lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => videoCourses.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  durationMinutes: integer("duration_minutes").default(0),
  sortOrder: integer("sort_order").default(0),
  isFree: boolean("is_free").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 11. SERVICE REQUESTS ─────────────────────────────────────
export const serviceRequests = pgTable("service_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: serviceStatusEnum("status").default("pending").notNull(),
  progress: integer("progress").default(0),
  assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
  startDate: timestamp("start_date", { withTimezone: true }),
  dueDate: timestamp("due_date", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  deliverables: jsonb("deliverables"),
  timeline: jsonb("timeline"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 12. SUPPORT TICKETS ──────────────────────────────────────
export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  ticketNumber: varchar("ticket_number", { length: 50 }).notNull().unique(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: ticketStatusEnum("status").default("open").notNull(),
  priority: ticketPriorityEnum("priority").default("medium").notNull(),
  category: varchar("category", { length: 100 }),
  assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
  messages: jsonb("messages"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 13. SUBSCRIPTIONS ───────────────────────────────────────
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  membershipId: uuid("membership_id").references(() => memberships.id, { onDelete: "set null" }),
  planName: varchar("plan_name", { length: 255 }).notNull(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("MYR").notNull(),
  billingCycle: varchar("billing_cycle", { length: 20 }).default("monthly"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  nextBillingDate: timestamp("next_billing_date", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 14. MEMBERSHIPS ─────────────────────────────────────────
export const memberships = pgTable("memberships", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  tier: membershipTierEnum("tier").notNull(),
  description: text("description"),
  monthlyPrice: decimal("monthly_price", { precision: 12, scale: 2 }),
  yearlyPrice: decimal("yearly_price", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("MYR").notNull(),
  features: jsonb("features"),
  maxProducts: integer("max_products"),
  maxDownloads: integer("max_downloads"),
  prioritySupport: boolean("priority_support").default(false),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 15. REFERRALS ────────────────────────────────────────────
export const referrals = pgTable("referrals", {
  id: uuid("id").defaultRandom().primaryKey(),
  referrerId: uuid("referrer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  referredId: uuid("referred_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  referralCode: varchar("referral_code", { length: 50 }).notNull(),
  status: referralStatusEnum("status").default("pending").notNull(),
  rewardPoints: integer("reward_points").default(0),
  rewardAmount: decimal("reward_amount", { precision: 12, scale: 2 }).default("0"),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  creditedAt: timestamp("credited_at", { withTimezone: true }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── 16. NOTIFICATIONS ───────────────────────────────────────
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  actionUrl: text("action_url"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ═══════════════════════════════════════════════════════════════
// RELATIONS
// ═══════════════════════════════════════════════════════════════

// ─── Users Relations ──────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  payments: many(payments),
  digitalAccesses: many(digitalAccess),
  serviceRequests: many(serviceRequests),
  supportTickets: many(supportTickets),
  subscriptions: many(subscriptions),
  referralsMade: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referred" }),
  notifications: many(notifications),
}));

// ─── Categories Relations ─────────────────────────────────────
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "categoryParent",
  }),
  children: many(categories, { relationName: "categoryParent" }),
  products: many(products),
}));

// ─── Products Relations ───────────────────────────────────────
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  digitalAccesses: many(digitalAccess),
  videoCourses: many(videoCourses),
  serviceRequests: many(serviceRequests),
  subscriptions: many(subscriptions),
}));

// ─── Orders Relations ─────────────────────────────────────────
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  payments: many(payments),
  digitalAccesses: many(digitalAccess),
  referrals: many(referrals),
}));

// ─── Order Items Relations ────────────────────────────────────
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// ─── Payments Relations ───────────────────────────────────────
export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [payments.approvedBy],
    references: [users.id],
    relationName: "paymentApprover",
  }),
}));

// ─── Digital Access Relations ─────────────────────────────────
export const digitalAccessRelations = relations(digitalAccess, ({ one }) => ({
  user: one(users, {
    fields: [digitalAccess.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [digitalAccess.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [digitalAccess.orderId],
    references: [orders.id],
  }),
}));

// ─── Video Courses Relations ──────────────────────────────────
export const videoCoursesRelations = relations(videoCourses, ({ one, many }) => ({
  product: one(products, {
    fields: [videoCourses.productId],
    references: [products.id],
  }),
  lessons: many(videoLessons),
}));

// ─── Video Lessons Relations ──────────────────────────────────
export const videoLessonsRelations = relations(videoLessons, ({ one }) => ({
  course: one(videoCourses, {
    fields: [videoLessons.courseId],
    references: [videoCourses.id],
  }),
}));

// ─── Service Requests Relations ───────────────────────────────
export const serviceRequestsRelations = relations(serviceRequests, ({ one }) => ({
  user: one(users, {
    fields: [serviceRequests.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [serviceRequests.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [serviceRequests.orderId],
    references: [orders.id],
  }),
  assignee: one(users, {
    fields: [serviceRequests.assignedTo],
    references: [users.id],
    relationName: "serviceAssignee",
  }),
}));

// ─── Support Tickets Relations ────────────────────────────────
export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id],
  }),
  assignee: one(users, {
    fields: [supportTickets.assignedTo],
    references: [users.id],
    relationName: "ticketAssignee",
  }),
}));

// ─── Subscriptions Relations ──────────────────────────────────
export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [subscriptions.productId],
    references: [products.id],
  }),
  membership: one(memberships, {
    fields: [subscriptions.membershipId],
    references: [memberships.id],
  }),
}));

// ─── Memberships Relations ────────────────────────────────────
export const membershipsRelations = relations(memberships, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

// ─── Referrals Relations ──────────────────────────────────────
export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: "referrer",
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
    relationName: "referred",
  }),
  order: one(orders, {
    fields: [referrals.orderId],
    references: [orders.id],
  }),
}));

// ─── Notifications Relations ──────────────────────────────────
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

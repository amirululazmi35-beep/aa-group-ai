import { pgTable, text, integer, doublePrecision, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Settings Table
export const settings = pgTable('settings', {
  id: text('id').primaryKey(),
  brandName: text('brand_name').notNull(),
  logoUrl: text('logo_url').notNull(),
  supportEmail: text('support_email').notNull(),
  supportPhone: text('support_phone').notNull(),
  themeColor: text('theme_color').notNull(),
  qrUrl: text('qr_url').notNull(),
  whatsappNumber: text('whatsapp_number').notNull(),
  maintenanceMode: boolean('maintenance_mode').default(false).notNull(),
  maintenanceMessage: text('maintenance_message').default('Sistem sedang dikemaskini.').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 2. Users Table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('customer').notNull(), // 'customer' | 'admin'
  phone: text('phone'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 3. Sessions Table (for Auth)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
});

// 4. Categories Table
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: integer('created_at').notNull(),
});

// 5. Products Table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => categories.id),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  type: text('type').notNull(), // 'app' | 'video_course' | 'service' | 'bundle' | 'other'
  shortDescription: text('short_description'),
  description: text('description'),
  price: doublePrecision('price').notNull(),
  comparePrice: doublePrecision('compare_price'),
  thumbnailUrl: text('thumbnail_url'),
  status: text('status').default('published').notNull(), // 'draft' | 'published' | 'archived'
  accessType: text('access_type').notNull(), // 'download_link' | 'license_key' | 'video_access' | 'service_request' | 'external_link'
  accessValue: text('access_value'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 6. Orders Table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(), // AAOD-00000001 format
  userId: text('user_id').notNull().references(() => users.id),
  totalAmount: doublePrecision('total_amount').notNull(),
  status: text('status').default('pending').notNull(), // 'pending' | 'paid' | 'failed' | 'refunded' | 'completed' | 'cancelled'
  paymentMethod: text('payment_method').notNull(),
  paymentReference: text('payment_reference'),
  paymentReceiptUrl: text('payment_receipt_url'),
  createdDate: text('created_date').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 7. Order Items Table
export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  unitPrice: doublePrecision('unit_price').notNull(),
  createdAt: integer('created_at').notNull(),
});

// 8. Digital Access Table
export const digitalAccess = pgTable('digital_access', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  productId: text('product_id').notNull().references(() => products.id),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  accessStatus: text('access_status').default('active').notNull(), // 'active' | 'expired' | 'revoked'
  accessUrl: text('access_url'),
  licenseKey: text('license_key'),
  expiresAt: integer('expires_at'),
  createdAt: integer('created_at').notNull(),
});

// 9. Video Lessons Table
export const videoLessons = pgTable('video_lessons', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url').notNull(),
  sortOrder: integer('sort_order').notNull(),
  isPreview: boolean('is_preview').default(false).notNull(),
  createdAt: integer('created_at').notNull(),
});

// 10. Service Requests Table
export const serviceRequests = pgTable('service_requests', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  productId: text('product_id').notNull().references(() => products.id),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  requirements: text('requirements').notNull(),
  status: text('status').default('pending').notNull(), // 'pending' | 'in_progress' | 'completed' | 'cancelled'
  adminNotes: text('admin_notes'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 11. Support Tickets Table
export const supportTickets = pgTable('support_tickets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  orderId: text('order_id').references(() => orders.id, { onDelete: 'set null' }),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('open').notNull(), // 'open' | 'replied' | 'closed'
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 12. Support Ticket Replies Table
export const ticketReplies = pgTable('ticket_replies', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => supportTickets.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  createdAt: integer('created_at').notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  orders: many(orders),
  digitalAccesses: many(digitalAccess),
  serviceRequests: many(serviceRequests),
  supportTickets: many(supportTickets),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  orderItems: many(orderItems),
  digitalAccesses: many(digitalAccess),
  videoLessons: many(videoLessons),
  serviceRequests: many(serviceRequests),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  orderItems: many(orderItems),
  digitalAccesses: many(digitalAccess),
  serviceRequests: many(serviceRequests),
  supportTickets: many(supportTickets),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const digitalAccessRelations = relations(digitalAccess, ({ one }) => ({
  user: one(users, { fields: [digitalAccess.userId], references: [users.id] }),
  product: one(products, { fields: [digitalAccess.productId], references: [products.id] }),
  order: one(orders, { fields: [digitalAccess.orderId], references: [orders.id] }),
}));

export const videoLessonsRelations = relations(videoLessons, ({ one }) => ({
  product: one(products, { fields: [videoLessons.productId], references: [products.id] }),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one }) => ({
  user: one(users, { fields: [serviceRequests.userId], references: [users.id] }),
  product: one(products, { fields: [serviceRequests.productId], references: [products.id] }),
  order: one(orders, { fields: [serviceRequests.orderId], references: [orders.id] }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, { fields: [supportTickets.userId], references: [users.id] }),
  order: one(orders, { fields: [supportTickets.orderId], references: [orders.id] }),
  replies: many(ticketReplies),
}));

export const ticketRepliesRelations = relations(ticketReplies, ({ one }) => ({
  ticket: one(supportTickets, { fields: [ticketReplies.ticketId], references: [supportTickets.id] }),
  sender: one(users, { fields: [ticketReplies.senderId], references: [users.id] }),
}));

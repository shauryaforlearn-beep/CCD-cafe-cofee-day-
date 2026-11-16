import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  fulfillment: text('fulfillment').notNull(),
  deliveryAddress: text('delivery_address'),
  cafeId: text('cafe_id').notNull(),
  cafeName: text('cafe_name').notNull(),
  prepMinutes: integer('prep_minutes').notNull(),
  subtotal: integer('subtotal').notNull(),
  gst: integer('gst').notNull(),
  deliveryFee: integer('delivery_fee').notNull(),
  total: integer('total').notNull(),
  status: text('status').notNull().default('confirmed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  menuItemId: text('menu_item_id').notNull(),
  itemName: text('item_name').notNull(),
  sizeLabel: text('size_label').notNull(),
  prepLabel: text('prep_label').notNull(),
  addonLabel: text('addon_label'),
  unitPrice: integer('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
});

export const reservations = pgTable('reservations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  cafeId: text('cafe_id').notNull(),
  cafeName: text('cafe_name').notNull(),
  guestCount: text('guest_count').notNull(),
  timeSlot: text('time_slot').notNull(),
  status: text('status').notNull().default('confirmed'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reservations: many(reservations),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  user: one(users, {
    fields: [reservations.userId],
    references: [users.id],
  }),
}));

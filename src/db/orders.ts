import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { orderItems, orders, users } from './schema.ts';

export interface CreateOrderItemInput {
  menuItemId: string;
  itemName: string;
  sizeLabel: string;
  prepLabel: string;
  addonLabel?: string | null;
  unitPrice: number;
  quantity: number;
}

export interface CreateOrderInput {
  userId: number;
  customerName: string;
  customerPhone: string;
  fulfillment: 'pickup' | 'delivery';
  deliveryAddress?: string | null;
  cafeId: string;
  cafeName: string;
  prepMinutes: number;
  items: CreateOrderItemInput[];
}

export async function createOrderForUser(input: CreateOrderInput) {
  try {
    const subtotal = input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const gst = Math.round(subtotal * 0.05);
    const deliveryFee = input.fulfillment === 'delivery' && subtotal > 0 ? 40 : 0;
    const total = subtotal + gst + deliveryFee;
    const orderNumber = `CCD-${Math.floor(4100 + Math.random() * 5800)}`;

    const created = await db.transaction(async (tx) => {
      const [insertedOrder] = await tx
        .insert(orders)
        .values({
          orderNumber,
          userId: input.userId,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          fulfillment: input.fulfillment,
          deliveryAddress: input.deliveryAddress ?? null,
          cafeId: input.cafeId,
          cafeName: input.cafeName,
          prepMinutes: input.prepMinutes,
          subtotal,
          gst,
          deliveryFee,
          total,
          status: 'confirmed',
        })
        .returning();

      const insertedItems = await tx
        .insert(orderItems)
        .values(
          input.items.map((item) => ({
            orderId: insertedOrder.id,
            menuItemId: item.menuItemId,
            itemName: item.itemName,
            sizeLabel: item.sizeLabel,
            prepLabel: item.prepLabel,
            addonLabel: item.addonLabel ?? null,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          }))
        )
        .returning();

      return { ...insertedOrder, items: insertedItems };
    });

    return created;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw new Error('Unable to place order. Please try again later.', { cause: error });
  }
}

export async function getOrdersByFirebaseUid(uid: string) {
  try {
    const userOrders = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerName: orders.customerName,
        customerPhone: orders.customerPhone,
        fulfillment: orders.fulfillment,
        deliveryAddress: orders.deliveryAddress,
        cafeId: orders.cafeId,
        cafeName: orders.cafeName,
        prepMinutes: orders.prepMinutes,
        subtotal: orders.subtotal,
        gst: orders.gst,
        deliveryFee: orders.deliveryFee,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(eq(users.uid, uid))
      .orderBy(desc(orders.createdAt));

    if (userOrders.length === 0) {
      return [];
    }

    const hydrated = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        return { ...order, items };
      })
    );

    return hydrated;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw new Error('Unable to load order history. Please try again later.', { cause: error });
  }
}

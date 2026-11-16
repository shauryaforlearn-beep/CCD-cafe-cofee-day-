import { desc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { reservations, users } from './schema.ts';

export interface CreateReservationInput {
  userId: number;
  cafeId: string;
  cafeName: string;
  guestCount: string;
  timeSlot: string;
}

export async function createReservationForUser(input: CreateReservationInput) {
  try {
    const [inserted] = await db
      .insert(reservations)
      .values({
        userId: input.userId,
        cafeId: input.cafeId,
        cafeName: input.cafeName,
        guestCount: input.guestCount,
        timeSlot: input.timeSlot,
        status: 'confirmed',
      })
      .returning();

    return inserted;
  } catch (error) {
    console.error('Failed to create reservation:', error);
    throw new Error('Unable to reserve table. Please try again later.', { cause: error });
  }
}

export async function getReservationsByFirebaseUid(uid: string) {
  try {
    return await db
      .select({
        id: reservations.id,
        cafeId: reservations.cafeId,
        cafeName: reservations.cafeName,
        guestCount: reservations.guestCount,
        timeSlot: reservations.timeSlot,
        status: reservations.status,
        createdAt: reservations.createdAt,
      })
      .from(reservations)
      .innerJoin(users, eq(reservations.userId, users.id))
      .where(eq(users.uid, uid))
      .orderBy(desc(reservations.createdAt));
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    throw new Error('Unable to load reservations. Please try again later.', { cause: error });
  }
}

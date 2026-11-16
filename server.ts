import 'dotenv/config';
import express from 'express';
import path from 'path';
import { AuthRequest, requireAuth } from './src/middleware/auth.ts';
import {
  createOrderForUser,
  CreateOrderItemInput,
  getOrdersByFirebaseUid,
} from './src/db/orders.ts';
import {
  createReservationForUser,
  getReservationsByFirebaseUid,
} from './src/db/reservations.ts';

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/orders', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const orderList = await getOrdersByFirebaseUid(uid);
      res.json({ orders: orderList });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/orders', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.dbUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const {
        customerName,
        customerPhone,
        fulfillment,
        deliveryAddress,
        cafeId,
        cafeName,
        prepMinutes,
        items,
      } = req.body as {
        customerName?: string;
        customerPhone?: string;
        fulfillment?: 'pickup' | 'delivery';
        deliveryAddress?: string;
        cafeId?: string;
        cafeName?: string;
        prepMinutes?: number;
        items?: CreateOrderItemInput[];
      };

      const cleanName = typeof customerName === 'string' ? customerName.trim() : '';
      const cleanPhone =
        typeof customerPhone === 'string' ? customerPhone.replace(/\s+/g, '') : '';
      const cleanAddress =
        typeof deliveryAddress === 'string' ? deliveryAddress.trim() : '';

      if (!cleanName) {
        res.status(400).json({ error: 'Please enter your name for the barista order slip.' });
        return;
      }
      if (!/^\d{10}$/.test(cleanPhone)) {
        res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
        return;
      }
      if (fulfillment !== 'pickup' && fulfillment !== 'delivery') {
        res.status(400).json({ error: 'Invalid fulfillment option.' });
        return;
      }
      if (fulfillment === 'delivery' && !cleanAddress) {
        res.status(400).json({ error: 'Please enter your delivery street address.' });
        return;
      }
      if (!cafeId || !cafeName || typeof prepMinutes !== 'number') {
        res.status(400).json({ error: 'Please select a valid café location.' });
        return;
      }
      if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Your order bag is empty.' });
        return;
      }

      const sanitizedItems: CreateOrderItemInput[] = items.map((entry) => ({
        menuItemId: String(entry.menuItemId || ''),
        itemName: String(entry.itemName || ''),
        sizeLabel: String(entry.sizeLabel || ''),
        prepLabel: String(entry.prepLabel || ''),
        addonLabel: entry.addonLabel ? String(entry.addonLabel) : null,
        unitPrice: Number(entry.unitPrice) || 0,
        quantity: Math.max(1, Number(entry.quantity) || 1),
      }));

      const order = await createOrderForUser({
        userId: req.dbUser.id,
        customerName: cleanName,
        customerPhone: cleanPhone,
        fulfillment,
        deliveryAddress: fulfillment === 'delivery' ? cleanAddress : null,
        cafeId,
        cafeName,
        prepMinutes,
        items: sanitizedItems,
      });

      res.status(201).json({ order });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create order';
      res.status(500).json({ error: message });
    }
  });

  app.get('/api/reservations', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      if (!uid) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const list = await getReservationsByFirebaseUid(uid);
      res.json({ reservations: list });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch reservations';
      res.status(500).json({ error: message });
    }
  });

  app.post('/api/reservations', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.dbUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { cafeId, cafeName, guestCount, timeSlot } = req.body as {
        cafeId?: string;
        cafeName?: string;
        guestCount?: string;
        timeSlot?: string;
      };

      if (!cafeId || !cafeName || !guestCount || !timeSlot) {
        res.status(400).json({ error: 'Please provide café, guest count, and time slot.' });
        return;
      }

      const reservation = await createReservationForUser({
        userId: req.dbUser.id,
        cafeId: String(cafeId),
        cafeName: String(cafeName),
        guestCount: String(guestCount),
        timeSlot: String(timeSlot),
      });

      res.status(201).json({ reservation });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save reservation';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

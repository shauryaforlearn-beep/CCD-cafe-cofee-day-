import { NextFunction, Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { adminAuth } from '../lib/firebase-admin.ts';
import { getOrCreateUser } from '../db/users.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  dbUser?: {
    id: number;
    uid: string;
    email: string;
    displayName: string | null;
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Please sign in with Google to continue.' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    const email = decodedToken.email || `${decodedToken.uid}@firebase.local`;
    const displayName =
      typeof decodedToken.name === 'string' ? decodedToken.name : null;
    req.dbUser = await getOrCreateUser(decodedToken.uid, email, displayName);

    next();
  } catch (error) {
    console.error('Authentication or user sync failed:', error);
    res.status(401).json({ error: 'Your session expired. Please sign in again.' });
  }
};

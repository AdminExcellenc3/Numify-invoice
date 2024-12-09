import { userOps } from '../db';
import type { User } from '../../types';

export async function login(email: string, password: string): Promise<User | null> {
  const user = userOps.getUserByEmail(email);
  
  if (!user) return null;
  // TODO: Add proper password hashing
  if (password !== user.password) return null;
  
  return user;
}
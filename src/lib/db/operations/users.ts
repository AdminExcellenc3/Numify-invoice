import { prepare } from '../core';
import type { User } from '../../../types';

export const userOps = {
  createUser: (params: any[]) => 
    prepare('INSERT INTO users (id, email, name, password, role, companyId) VALUES (?, ?, ?, ?, ?, ?)', params).step(),
  
  getUserByEmail: (email: string) => 
    prepare('SELECT * FROM users WHERE email = ?', [email]).get() as User | undefined,
};
import { prepare } from '../core';
import type { Company } from '../../../types';

export const companyOps = {
  createCompany: (params: any[]) =>
    prepare('INSERT INTO companies (id, name, address, phone, email, vatNumber, logo) VALUES (?, ?, ?, ?, ?, ?, ?)', params).step(),
  
  updateCompany: (params: any[]) =>
    prepare(`
      UPDATE companies
      SET name = ?, address = ?, phone = ?, email = ?, vatNumber = ?, logo = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, params).step(),
  
  getCompany: (id: string) =>
    prepare('SELECT * FROM companies WHERE id = ?', [id]).get() as Company | undefined,
};
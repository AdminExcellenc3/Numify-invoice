import { prepare } from '../core';
import type { Customer } from '../../../types';

export const customerOps = {
  getCustomers: (companyId: string) =>
    prepare('SELECT * FROM customers WHERE companyId = ? ORDER BY name ASC', [companyId]).all() as Customer[],
  
  createCustomer: (params: any[]) =>
    prepare('INSERT INTO customers (id, companyId, name, email, address, phone, vatNumber) VALUES (?, ?, ?, ?, ?, ?, ?)', params).step(),
  
  updateCustomer: (params: any[]) =>
    prepare(`
      UPDATE customers
      SET name = ?, email = ?, address = ?, phone = ?, vatNumber = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, params).step(),
  
  deleteCustomer: (id: string) =>
    prepare('DELETE FROM customers WHERE id = ?', [id]).step(),
};
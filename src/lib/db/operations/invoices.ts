import { prepare } from '../core';
import type { Invoice } from '../../../types';

export const invoiceOps = {
  getInvoices: (companyId: string) =>
    prepare(`
      SELECT i.*, c.name as customerName
      FROM invoices i
      JOIN customers c ON i.customerId = c.id
      WHERE i.companyId = ?
      ORDER BY i.date DESC
    `, [companyId]).all() as Invoice[],
  
  createInvoice: (params: any[]) =>
    prepare(`
      INSERT INTO invoices (id, companyId, customerId, number, date, dueDate, status, subtotal, vatTotal, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, params).step(),
  
  createInvoiceItem: (params: any[]) =>
    prepare(`
      INSERT INTO invoice_items (id, invoiceId, description, quantity, unitPrice, vatRate)
      VALUES (?, ?, ?, ?, ?, ?)
    `, params).step(),
  
  updateInvoiceStatus: (params: any[]) =>
    prepare(`
      UPDATE invoices
      SET status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, params).step(),
};
import { randomUUID } from 'crypto';
import { invoiceOps } from '../db';
import type { Invoice, InvoiceItem } from '../../types';

export async function getInvoices(companyId: string): Promise<Invoice[]> {
  return invoiceOps.getInvoices(companyId);
}

export async function createInvoice(
  data: Omit<Invoice, 'id'> & { items: Omit<InvoiceItem, 'id' | 'invoiceId'>[] }
): Promise<Invoice> {
  const id = randomUUID();
  const { companyId, customerId, number, date, dueDate, status, subtotal, vatTotal, total, items } = data;
  
  invoiceOps.createInvoice([
    id,
    companyId,
    customerId,
    number,
    date,
    dueDate,
    status,
    subtotal,
    vatTotal,
    total
  ]);
  
  for (const item of items) {
    const itemId = randomUUID();
    invoiceOps.createInvoiceItem([
      itemId,
      id,
      item.description,
      item.quantity,
      item.unitPrice,
      item.vatRate
    ]);
  }
  
  return { id, ...data };
}

export async function updateInvoiceStatus(id: string, status: Invoice['status']): Promise<Invoice> {
  invoiceOps.updateInvoiceStatus([status, id]);
  return invoiceOps.getInvoices(id)[0];
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'accountant' | 'employee';
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  vatNumber: string;
  logo?: string;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  vatNumber?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

export interface Invoice {
  id: string;
  companyId: string;
  customerId: string;
  number: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  subtotal: number;
  vatTotal: number;
  total: number;
}
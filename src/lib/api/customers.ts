import { randomUUID } from 'crypto';
import { customerOps } from '../db';
import type { Customer } from '../../types';

export async function getCustomers(companyId: string): Promise<Customer[]> {
  return customerOps.getCustomers(companyId);
}

export async function createCustomer(data: Omit<Customer, 'id'>): Promise<Customer> {
  const id = randomUUID();
  const { companyId, name, email, address, phone, vatNumber } = data;
  
  customerOps.createCustomer([id, companyId, name, email, address, phone, vatNumber]);
  return { id, ...data };
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  const { name, email, address, phone, vatNumber } = data;
  customerOps.updateCustomer([name, email, address, phone, vatNumber, id]);
  return { id, ...data } as Customer;
}

export async function deleteCustomer(id: string): Promise<void> {
  customerOps.deleteCustomer(id);
}
import { companyOps } from '../db';
import type { Company } from '../../types';

export async function getCompany(id: string): Promise<Company | null> {
  const company = companyOps.getCompany(id);
  return company || null;
}

export async function updateCompany(id: string, data: Partial<Company>): Promise<Company> {
  const { name, address, phone, email, vatNumber, logo } = data;
  companyOps.updateCompany([name, address, phone, email, vatNumber, logo, id]);
  const company = companyOps.getCompany(id);
  if (!company) throw new Error('Company not found');
  return company;
}
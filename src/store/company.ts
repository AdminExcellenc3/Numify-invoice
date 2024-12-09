import { create } from 'zustand';
import { getCompany, updateCompany } from '../lib/api';
import type { Company } from '../types';

interface CompanyState {
  company: Company | null;
  loading: boolean;
  error: string | null;
  fetchCompany: (id: string) => Promise<void>;
  updateCompany: (updates: Partial<Company>) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
  loading: false,
  error: null,
  fetchCompany: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const company = await getCompany(id);
      set({ company, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  updateCompany: async (updates) => {
    try {
      set({ loading: true, error: null });
      const company = get().company;
      if (!company) throw new Error('No company loaded');
      
      const updatedCompany = await updateCompany(company.id, updates);
      set({ company: updatedCompany, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
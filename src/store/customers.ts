import { create } from 'zustand';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../lib/api';
import type { Customer } from '../types';

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: (companyId: string) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: [],
  loading: false,
  error: null,
  fetchCustomers: async (companyId: string) => {
    try {
      set({ loading: true, error: null });
      const customers = await getCustomers(companyId);
      set({ customers, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  addCustomer: async (customer) => {
    try {
      set({ loading: true, error: null });
      const newCustomer = await createCustomer(customer);
      set((state) => ({
        customers: [...state.customers, newCustomer],
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  updateCustomer: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      const updatedCustomer = await updateCustomer(id, updates);
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === id ? updatedCustomer : customer
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  deleteCustomer: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteCustomer(id);
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
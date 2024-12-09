import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CustomerList } from '../../components/customers/CustomerList';
import { CustomerForm } from '../../components/customers/CustomerForm';
import { useCustomersStore } from '../../store/customers';
import { useAuthStore } from '../../store/auth';
import type { Customer } from '../../types';

export function CustomersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const { customers, addCustomer, updateCustomer, deleteCustomer } =
    useCustomersStore();
  const companyId = useAuthStore((state) => state.user?.companyId);

  const handleSubmit = (data: Omit<Customer, 'id' | 'companyId'>) => {
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, data);
    } else {
      addCustomer({ ...data, companyId: companyId! });
    }
    setIsFormOpen(false);
    setSelectedCustomer(undefined);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your customer database
          </p>
        </div>
        <Button
          className="flex items-center space-x-2"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>New Customer</span>
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        {isFormOpen ? (
          <div className="p-6">
            <CustomerForm
              customer={selectedCustomer}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedCustomer(undefined);
              }}
            />
          </div>
        ) : (
          <CustomerList
            customers={customers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
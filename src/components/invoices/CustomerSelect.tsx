import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { useCustomersStore } from '../../store/customers';

interface CustomerSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const CustomerSelect = forwardRef<HTMLSelectElement, CustomerSelectProps>(
  ({ className, error, ...props }, ref) => {
    const customers = useCustomersStore((state) => state.customers);

    return (
      <div className="space-y-1">
        <select
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2',
            'text-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
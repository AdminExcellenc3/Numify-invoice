import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CustomerSelect } from './CustomerSelect';
import { formatCurrency, generateInvoiceNumber } from '../../lib/utils';
import { type Invoice } from '../../types';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  vatRate: z.number().min(0, 'VAT rate must be positive'),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  number: z.string(),
  date: z.string(),
  dueDate: z.string(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  onSubmit: (data: Invoice) => void;
  onCancel: () => void;
}

export function InvoiceForm({ onSubmit, onCancel }: InvoiceFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      number: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      items: [{ description: '', quantity: 1, unitPrice: 0, vatRate: 21 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  const subtotal = items?.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
  const vatTotal = items?.reduce(
    (sum, item) =>
      sum +
      (item.quantity || 0) * (item.unitPrice || 0) * ((item.vatRate || 0) / 100),
    0
  );
  const total = subtotal + vatTotal;

  const onFormSubmit = (data: InvoiceFormData) => {
    onSubmit({
      ...data,
      id: crypto.randomUUID(),
      companyId: '1', // TODO: Get from auth store
      status: 'draft',
      subtotal,
      vatTotal,
      total,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Customer
          </label>
          <CustomerSelect
            {...register('customerId')}
            error={errors.customerId?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Invoice Number
          </label>
          <Input {...register('number')} error={errors.number?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Invoice Date
          </label>
          <Input
            type="date"
            {...register('date')}
            error={errors.date?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <Input
            type="date"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                description: '',
                quantity: 1,
                unitPrice: 0,
                vatRate: 21,
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-4 items-start bg-gray-50 p-4 rounded-lg"
            >
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Input
                  {...register(`items.${index}.description`)}
                  error={errors.items?.[index]?.description?.message}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <Input
                  type="number"
                  min="1"
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  error={errors.items?.[index]?.quantity?.message}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Unit Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(`items.${index}.unitPrice`, {
                    valueAsNumber: true,
                  })}
                  error={errors.items?.[index]?.unitPrice?.message}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  VAT Rate %
                </label>
                <Input
                  type="number"
                  min="0"
                  {...register(`items.${index}.vatRate`, {
                    valueAsNumber: true,
                  })}
                  error={errors.items?.[index]?.vatRate?.message}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div className="h-10 flex items-center text-sm">
                  {formatCurrency(
                    (items[index]?.quantity || 0) *
                      (items[index]?.unitPrice || 0)
                  )}
                </div>
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-6"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">Subtotal</dt>
            <dd className="text-sm font-medium">{formatCurrency(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm text-gray-600">VAT Total</dt>
            <dd className="text-sm font-medium">{formatCurrency(vatTotal)}</dd>
          </div>
          <div className="flex justify-between border-t pt-2">
            <dt className="text-base font-medium">Total</dt>
            <dd className="text-base font-medium">{formatCurrency(total)}</dd>
          </div>
        </dl>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Invoice</Button>
      </div>
    </form>
  );
}
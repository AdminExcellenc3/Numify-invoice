import { useNavigate } from 'react-router-dom';
import { InvoiceForm } from '../../components/invoices/InvoiceForm';
import type { Invoice } from '../../types';

export function NewInvoicePage() {
  const navigate = useNavigate();

  const handleSubmit = (invoice: Invoice) => {
    // TODO: Save invoice to store/backend
    console.log('New invoice:', invoice);
    navigate('/invoices');
  };

  const handleCancel = () => {
    navigate('/invoices');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Invoice</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create a new invoice for your customer
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6">
          <InvoiceForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
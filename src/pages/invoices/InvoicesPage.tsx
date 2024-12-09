import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function InvoicesPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and create your invoices
          </p>
        </div>
        <Button
          className="flex items-center space-x-2"
          onClick={() => navigate('/invoices/new')}
        >
          <Plus className="h-4 w-4" />
          <span>New Invoice</span>
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="p-6 text-center text-gray-500">
          No invoices created yet. Click the button above to create your first
          invoice.
        </div>
      </div>
    </div>
  );
}
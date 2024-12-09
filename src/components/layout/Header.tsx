import { useAuthStore } from '../../store/auth';

export function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="h-full px-6 flex items-center justify-end">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">{user?.name}</span>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user?.name.charAt(0)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
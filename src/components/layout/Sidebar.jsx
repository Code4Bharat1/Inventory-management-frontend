'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  ClipboardList,
  Users,
  Truck,
  Settings,
  HelpCircle,
  Plus,
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={18} />, href: '/dashboard' },
    { name: 'Inventory', icon: <Package size={18} />, href: '/inventory' },
    { name: 'Orders', icon: <ClipboardList size={18} />, href: '/orders' },
    { name: 'Customers', icon: <Users size={18} />, href: '/customers' },
    { name: 'Suppliers', icon: <Truck size={18} />, href: '/suppliers' },
    { name: 'Settings', icon: <Settings size={18} />, href: '/settings' },
  ];

  return (
    <div className="bg-gray-50 w-64 min-h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">InventoryPro</h2>

      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 p-2.5 my-2 rounded-lg transition-all ${
              pathname === item.href
                ? 'bg-blue-100 text-blue-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-gray-200">
        <button className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white p-2.5 rounded-lg mb-3 hover:bg-blue-700 transition">
          <Plus size={18} />
          New Product
        </button>
        <Link
          href="/help"
          className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2.5 rounded-lg transition"
        >
          <HelpCircle size={18} />
          Help and Docs
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

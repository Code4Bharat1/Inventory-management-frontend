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
  StoreIcon,
  ChevronDown,
  BellIcon
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const [isShopOpen, setIsShopOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={18} />, href: '/dashboard' },
    { name: 'Inventory', icon: <Package size={18} />, href: '/inventory' },
    { name: 'Orders', icon: <ClipboardList size={18} />, href: '/orders' },
    {
      name: 'Your Store',
      icon: <StoreIcon size={18} />,
      href: '/store'
    },
    {name : "Notification" , icon : <BellIcon size={18} /> , href:"/notification" },
    { name: 'Settings', icon: <Settings size={18} />, href: '/settings' },
  ];

  const toggleShopDropdown = () => {
    setIsShopOnline(!isShopOpen);
  };

  return (
    <div className="bg-gray-50 w-64 min-h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">InventoryPro</h2>

      <nav className="flex-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <div key={item.name}>
              {item.subItems ? (
                <>
                  <button
                    onClick={toggleShopDropdown}
                    className={`flex items-center justify-between w-full gap-3 p-2.5 my-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-100 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${
                        isShopOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isShopOpen && (
                    <div className="ml-6 mt-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`flex items-center gap-3 p-2.5 my-1 rounded-lg transition-all text-sm ${
                              isSubActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span className="w-4" />
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 p-2.5 my-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          );
        })}
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
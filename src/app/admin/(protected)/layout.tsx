"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Ticket, 
  Flower2, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { name: "Vouchers", href: "/admin/vouchers", icon: Ticket },
  { name: "Treatments", href: "/admin/treatments", icon: Flower2 },
  { name: "Packages", href: "/admin/packages", icon: Flower2 },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-mist flex font-sans">
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div className="fixed inset-0 bg-ink/50 transition-opacity" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-olive">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            
            {/* Mobile Sidebar Content */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 text-cream font-serif text-2xl">
                Teuk Admin
              </div>
              <nav className="mt-8 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        isActive ? "bg-gold text-olive" : "text-cream hover:bg-gold/20",
                        "group flex items-center px-2 py-3 text-base font-medium rounded-lg transition-colors"
                      )}
                    >
                      <item.icon className="mr-4 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-sage/30 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 group block w-full flex items-center text-cream hover:text-gold transition-colors"
              >
                <LogOut className="inline-block h-5 w-5 mr-3" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex-1 flex flex-col min-h-0 border-r border-mist bg-warm shadow-sm">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-6 font-serif text-2xl text-olive">
                Teuk Admin
              </div>
              <nav className="mt-8 flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/admin");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        isActive ? "bg-olive text-cream" : "text-ink/70 hover:bg-mist hover:text-olive",
                        "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors"
                      )}
                    >
                      <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-mist p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group flex items-center px-2 text-sm font-medium text-ink/70 hover:text-olive transition-colors"
              >
                <LogOut className="inline-block h-5 w-5 mr-3 text-ink/50 group-hover:text-olive" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-warm border-b border-mist flex items-center justify-between p-4 shadow-sm">
          <div className="font-serif text-xl text-olive">Teuk Admin</div>
          <button
            type="button"
            className="text-ink/60 hover:text-olive"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}

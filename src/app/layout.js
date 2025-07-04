"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";
import "./globals.css"; // Ensure global styles are imported

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = ["/auth", "/online-store", "/signup", "/login"].some(prefix =>
    pathname.startsWith(prefix)
  );


  return (
    <html lang="en">
      <body className="flex">
        <Toaster position="top-right" />
        {!isAuthPage && <Sidebar />}
        <main className="flex-1 p-4">{children}</main>
      </body>
    </html>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

// The landing page ("/") is a full-width page. Every tool page gets the sidebar.
export default function AppShell({ children }) {
  const pathname = usePathname();

  if (pathname === "/") return <main>{children}</main>;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="container">{children}</main>
    </div>
  );
}

import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  appShell?: boolean;
}

export function Layout({ children, appShell = false }: LayoutProps) {
  if (!appShell) {
    return (
      <div className="min-h-screen bg-[#f6eee9]">
        <Navbar />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6eee9]">
      <Navbar />
      <main className="pt-14 pb-28 md:pb-8">
        <div className="mx-auto max-w-md px-4 py-6">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

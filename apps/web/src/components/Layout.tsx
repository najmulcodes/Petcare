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
      <main className="pt-14 pb-28 md:pb-10">
        <div className="mx-auto w-full max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-6xl lg:px-8">
          <div className="py-6">{children}</div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

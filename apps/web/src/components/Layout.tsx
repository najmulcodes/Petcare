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
      <div className="min-h-screen">
        <Navbar />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16 pb-28 md:pb-10 lg:pt-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="py-5 sm:py-6 lg:py-8">{children}</div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

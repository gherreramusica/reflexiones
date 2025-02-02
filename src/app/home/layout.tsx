import { Children } from "react";
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col ">
      {/* header */}
      <header className="p-3 bg-black text-white text-center text-5xl font-bold border-b lg:hidden ">REFLEXIONES</header>
      <main>
        {children}
      </main>
    </div>
  );
}
  
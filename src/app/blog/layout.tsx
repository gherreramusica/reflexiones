import { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col ">
      {/* header */}
      <header className="p-3 bg-white text-black text-center text-3xl font-bold border-b"><Link href="/home" >REFLEXIONES</Link> </header>
      <main>
        {children}
      </main>
    </div>
  );
}
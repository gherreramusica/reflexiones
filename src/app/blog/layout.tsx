import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col ">
      {/* header */}
      <header className="p-3 bg-white text-black text-center text-5xl font-bold border-b">REFLEXIONES</header>
      <main>
        {children}
      </main>
    </div>
  );
}
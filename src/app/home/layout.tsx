import { ReactNode } from 'react';
import { Poppins } from 'next/font/google'
import Link from 'next/link';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Ajusta los pesos según lo que necesites
  variable: '--font-poppins', // Define una variable CSS para usarla en Tailwind
})


interface LayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: LayoutProps) {
  return (
    <div className={`h-screen flex flex-col ${poppins.variable}`}>
      {/* header */}
      <header className="p-3 bg-white text-black text-center text-5xl font-bold border-b"><Link href="/home" >REFLEXIONES</Link> </header>
      <main>
        {children}
      </main>
    </div>
  );
}
  
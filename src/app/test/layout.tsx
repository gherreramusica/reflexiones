import { ReactNode } from 'react';
import { Poppins } from 'next/font/google'

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
      <header className="p-3 bg-black text-white text-center text-5xl font-bold border-b lg:hidden ">REFLEXIONES</header>
      <main>
        {children}
      </main>
    </div>
  );
}
  
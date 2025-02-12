import { ReactNode } from "react";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col relative ">
            <h1 className="fixed hidden lg:block top-[45%] left-[0%]  text-[100px] font-bold text-gray-100  rotate-90">
  REFLEXIONES
</h1>
      {/* header */}
      <header className="p-3 sticky top-0 z-[99] bg-white text-black text-center text-3xl font-bold border-b">
        <div className="relative w-fit m-auto">
          <Link href="/home">
            <h1 className="relative text-3xl font-bold before:content-[''] before:block before:absolute before:right-0 before:bottom-[-5px] before:w-[10px] before:h-[10px] before:bg-green-400 before:text-blue-500">
              R
            </h1>
          </Link>{" "}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

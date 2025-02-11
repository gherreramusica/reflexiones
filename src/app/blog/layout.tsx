import { ReactNode } from "react";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

export default function BlogLayout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col ">
      {/* header */}
      <header className="p-3 bg-white text-black text-center text-3xl font-bold border-b">
      <div className="relative w-fit m-auto">
        <Link href="/home">
          <h1 className="relative text-3xl font-bold before:content-[''] before:absolute before:right-[0] before:bottom-[-5] before:text-blue-500 before:w-[10px] before:h-[10px] before:bg-green-400">
            R
          </h1>
        </Link>{" "}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

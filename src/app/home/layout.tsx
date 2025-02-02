import { Children } from "react";

export default function HomeLayout({children}) {
  return (
    <div className="h-screen flex flex-col ">
      {/* header */}
      <header className="p-3 bg-black text-white text-center text-5xl font-bold border-b lg:hidden ">REFLEXIONES</header>
      <main className="flex justify-evenly">
      {children}
      </main>
    </div>
  );
}
  
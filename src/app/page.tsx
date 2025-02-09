import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins', // Define la variable CSS
});

export default function Home() {
  return (
    <div className={`grid place-content-center h-[100vh] bg-[linear-gradient(to_bottom_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom_left,#e5e7eb_1px,transparent_1px)] bg-[size:10px_10px] ${poppins.variable}`}>
      <main className="md:text-8xl text-5xl grid place-content-center font-poppins">
         <Link href="/home" ><h1>REFLEXIONES</h1></Link>
        <p className="text-2xl">El poder de la palabra...</p>
      </main>
    </div>
  );
}



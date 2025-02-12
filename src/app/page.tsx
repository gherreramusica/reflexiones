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
         <Link href="/home" ><div className="relative"><h1 className="before:content-[''] before:absolute before:right-[0] before:bottom-[-25px] before:text-blue-500 before:w-[100px] before:h-[20px] before:bg-green-400">REFLEXIONES</h1></div></Link>

      </main>
    </div>
  );
}



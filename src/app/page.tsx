import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins', // Define la variable CSS
});

export default function Home() {
  return (
    <div className={`grid place-content-center min-h-screen bg-[linear-gradient(to_bottom_right,#e5e7eb_1px,transparent_4px),linear-gradient(to_bottom_left,#e5e7eb_1px,transparent_1px)] bg-[size:10px_10px] ${poppins.variable}`}>
      <main className="grid place-content-center font-[var(--font-poppins)]">
        <Link href="/home">
          <div className="relative">
            <h1 className="font-bold before:content-[''] before:absolute before:right-[0%] before:bottom-[2%] before:text-blue-500 before:w-[60px] before:h-[60px] before:bg-green-400 text-[200px] sm:text-[200px] md:text-[200px]">
              R
            </h1>
          </div>
        </Link>
      </main>
    </div>
  );
}

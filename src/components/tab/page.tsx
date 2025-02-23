'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Tab() {
    const pathname = usePathname();
    return (
        <div className="mt-5">
        <ul className="flex gap-3 justify-center">
          <Link href="/home">
            <li
              className={`p-2 text-sm rounded-lg ${
                pathname === "/home" ? "bg-black text-gray-200" : "bg-gray-100 text-gray-500"
              }`}
            >
              Notes
            </li>
          </Link>
          <Link href="/blog">
            <li
              className={`p-2 text-sm rounded-lg ${
                pathname === "/blog" ? "bg-black text-gray-200" : "bg-gray-100 text-gray-500"
              }`}
            >
              Articles
            </li>
          </Link>
          <Link href="/saves">
            <li
              className={`p-2 text-sm rounded-lg ${
                pathname === "/saves" ? "bg-black text-gray-200" : "bg-gray-100 text-gray-500"
              }`}
            >
              Saves
            </li>
          </Link>
        </ul>
      </div>
    );
}
'use client';
import { Link } from "lucide-react";
import { usePathname } from "next/navigation";



export default function Tab() {
    const pathname = usePathname();
    return (
        <div>
        <ul className="flex gap-3 justify-center">
          <Link href="/home">
            <li
              className={`bg-gray-100 p-2 rounded-md ${
                pathname === "/home" ? "border font-bold" : ""
              }`}
            >
              Notes
            </li>
          </Link>
          <Link href="/blog">
            <li
              className={`bg-gray-100 p-2 rounded-md ${
                pathname === "/blog" ? "border text-white font-bold" : ""
              }`}
            >
              Articles
            </li>
          </Link>
          <Link href="/saves">
            <li
              className={`bg-gray-100 p-2 rounded-md ${
                pathname === "/saves" ? "border text-white font-bold" : ""
              }`}
            >
              Saves
            </li>
          </Link>
        </ul>
      </div>
    );
}
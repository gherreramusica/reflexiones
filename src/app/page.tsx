'use client';

import Link from 'next/link';
import Header from '@/components/header/page';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <div className="flex flex-col items-center text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a Reflexiones</h1>
        <p className="text-lg text-gray-700 mb-6">Explora pensamientos y comparte tus reflexiones con el mundo.</p>
        <Link href="/login">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300">
            Empezar
          </button>
        </Link>
      </div>
      <style jsx>{`
        div {
          background: linear-gradient(to bottom, #ffffff, #ffff99);
        }
      `}</style>
    </div>
  );
}
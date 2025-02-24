"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Header from "@/components/header/page"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <motion.header
        className="px-4 lg:px-6 h-14 flex items-center justify-center border-b border-green-500"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      
          <Header/>
     
      </motion.header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-64 w-64 rounded-full bg-green-500 opacity-10"
              initial={{ x: "-50%", y: "-50%", scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.div
              className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-green-500 opacity-10"
              initial={{ x: "50%", y: "50%", scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div
              className="flex flex-col items-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Bienvenido a <span className="text-green-500">Reflexiones y Dichos</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Descubre sabiduría en cada palabra. Explora nuestra colección de reflexiones y dichos inspiradores.
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-green-500 px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50"
                  href="/login"
                >
                  Empezar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 justify-items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {[
                { title: "Inspiración Diaria", description: "Encuentra una nueva reflexión cada día para motivarte." },
                {
                  title: "Comparte Sabiduría",
                  description: "Comparte tus reflexiones favoritas con amigos y familiares.",
                },
                {
                  title: "Crece Personalmente",
                  description: "Utiliza nuestras reflexiones para tu desarrollo personal.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center space-y-2 p-4 rounded-lg max-w-xs w-full bg-white shadow-md border border-green-100"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                >
                  <div className="p-2 bg-green-500 rounded-full text-white">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-green-700">{item.title}</h2>
                  <p className="text-sm text-gray-500 text-center">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-12 text-green-700"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Reflexiones Destacadas
            </motion.h2>
            <motion.div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
                  }}
                >
                  <Image
                    src={`/placeholder.svg?height=200&width=400&text=Reflexión ${i}`}
                    alt={`Reflexión ${i}`}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-gray-600 italic">
                      "La vida es lo que pasa mientras estás ocupado haciendo otros planes."
                    </p>
                    <p className="text-green-600 mt-2 font-semibold">- John Lennon</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
              }}
            >
              <motion.div
                className="md:w-1/2"
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
              >
                <h2 className="text-3xl font-bold mb-4 text-green-700">Descubre Nuevas Perspectivas</h2>
                <p className="text-gray-600 mb-6">
                  Explora nuestra extensa colección de reflexiones y dichos que te inspirarán y te harán pensar. Cada
                  día es una oportunidad para crecer y aprender.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/explore"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-green-500 px-8 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  >
                    Explorar Más
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                className="md:w-1/2"
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
              >
                <Image
                  src="/placeholder.svg?height=300&width=500&text=Collage de Citas"
                  alt="Collage de Citas"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <motion.footer
        className="w-full py-6 flex flex-col sm:flex-row justify-center items-center px-4 md:px-6 border-t border-green-100 gap-2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs text-gray-500 text-center">© 2024 Reflexiones y Dichos. Todos los derechos reservados.</p>
        <nav className="flex gap-4 sm:gap-6 justify-center">
          <Link className="text-xs hover:underline underline-offset-4 text-green-600" href="#">
            Términos de Servicio
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-green-600" href="#">
            Privacidad
          </Link>
        </nav>
      </motion.footer>
    </div>
  )
}


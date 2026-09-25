import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parcial Web",
  description: "Lista de actores",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Define el idioma principal del documento HTML como español
    <html lang="es">
      <body>
        {/* Barra de navegación superior fija con fondo oscuro utilizando Tailwind */}
        <nav className="bg-gray-900 py-2">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4">
            {/* Enlace principal que redirige al inicio de la aplicación */}
            <Link href="/" className="py-1 text-xl font-bold text-white">Parcial Web</Link>
            {/* Enlaces de navegación secundarios para moverse rápidamente entre secciones */}
            <div className="flex gap-4">
              <Link href="/actores" className="py-2 text-white/60 transition-colors hover:text-white">Actores</Link>
              <Link href="/movies" className="py-2 text-white/60 transition-colors hover:text-white">Películas</Link>
              <Link href="/crear-actor" className="py-2 text-white/60 transition-colors hover:text-white">Crear Actor</Link>
              <Link href="/crear-pelicula" className="py-2 text-white/60 transition-colors hover:text-white">Crear Película</Link>
              <Link href="/crear-pelicula" className="py-2 text-white/60 transition-colors hover:text-white">Crear Película</Link>
            </div>
          </div>
        </nav>
        {/* Renderiza dinámicamente las páginas hijas o componentes correspondientes a la ruta actual */}
        {children}
      </body>
    </html>
  );
}

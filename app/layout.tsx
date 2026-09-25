import type { Metadata } from "next";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
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
        {/* Barra de navegación superior fija con fondo oscuro utilizando Bootstrap */}
        <nav className="navbar navbar-expand bg-dark" data-bs-theme="dark">
          <div className="container">
            {/* Enlace principal que redirige al inicio de la aplicación */}
            <Link href="/" className="navbar-brand fw-bold">Parcial Web</Link>
            {/* Enlaces de navegación secundarios para moverse rápidamente entre secciones */}
            <div className="navbar-nav">
              <Link href="/actores" className="nav-link">Actores</Link>
              <Link href="/crear-actor" className="nav-link">Crear Actor</Link>
            </div>
          </div>
        </nav>
        {/* Renderiza dinámicamente las páginas hijas o componentes correspondientes a la ruta actual */}
        {children}
      </body>
    </html>
  );
}
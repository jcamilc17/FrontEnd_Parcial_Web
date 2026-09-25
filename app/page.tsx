import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  // PARTE 3: Pagina de configuración de rutas y enlaces de navegación
  return (
    <nav>
      <div>
        <Link href="/">Inicio</Link>
      </div>
      <div>
        <Link href="/actores">Actores</Link>
      </div>
      <div>
        <Link href="/crear-actor">Crear Actor</Link>
      </div>
    </nav>
  );
}

import Link from 'next/link';

export default function Home() {
  // PARTE 3: Pagina de configuración de rutas y enlaces de navegación
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Encabezado de bienvenida: Título principal y descripción de la sección de gestión */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-5xl font-bold">Gestión de Actores</h1>
        <p className="mx-auto max-w-[600px] text-xl text-gray-500">
          Consulta, crea, edita y elimina actores desde un solo lugar.
        </p>
      </div>

      {/* Menú de navegación principal con tarjetas interactivas organizadas en cuadrícula */}
      <nav className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Tarjeta de acceso a la página de inicio */}
        <Link href="/" className="card-hover block h-full rounded-lg bg-white p-6 text-center shadow-sm">
          <div className="mb-2 text-4xl">🏠</div>
          <h5 className="mb-2 text-xl font-bold text-gray-900">Inicio</h5>
          <p className="text-sm text-gray-500">Vuelve a la página principal.</p>
        </Link>

        {/* Tarjeta de acceso a la lista completa de actores */}
        <Link href="/actores" className="card-hover block h-full rounded-lg bg-white p-6 text-center shadow-sm">
          <div className="mb-2 text-4xl">🎬</div>
          <h5 className="mb-2 text-xl font-bold text-gray-900">Actores</h5>
          <p className="text-sm text-gray-500">Explora la lista completa de actores.</p>
        </Link>

        {/* Tarjeta de acceso a la lista completa de películas */}
        <Link href="/movies" className="card-hover block h-full rounded-lg bg-white p-6 text-center shadow-sm">
          <div className="mb-2 text-4xl">🎞️</div>
          <h5 className="mb-2 text-xl font-bold text-gray-900">Películas</h5>
          <p className="text-sm text-gray-500">Explora la lista completa de películas.</p>
        </Link>

        {/* Tarjeta de acceso rápido al formulario para registrar un nuevo actor */}
        <Link href="/crear-actor" className="card-hover block h-full rounded-lg bg-white p-6 text-center shadow-sm">
          <div className="mb-2 text-4xl">➕</div>
          <h5 className="mb-2 text-xl font-bold text-gray-900">Crear Actor</h5>
          <p className="text-sm text-gray-500">Agrega un nuevo actor con el formulario.</p>
        </Link>

      </nav>
    </main>
  );
}

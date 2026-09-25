import Link from 'next/link';

export default function Home() {
  // PARTE 3: Pagina de configuración de rutas y enlaces de navegación
  return (
    <main className="container py-5">
      {/* Encabezado de bienvenida: Título principal y descripción de la sección de gestión */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">Gestión de Actores</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: "600px" }}>
          Consulta, crea, edita y elimina actores desde un solo lugar.
        </p>
      </div>

      {/* Menú de navegación principal con tarjetas interactivas organizadas en cuadrícula */}
      <nav className="row g-4 justify-content-center">
        {/* Tarjeta de acceso a la página de inicio */}
        <div className="col-12 col-md-4">
          <Link href="/" className="card h-100 border-0 shadow-sm text-decoration-none card-hover">
            <div className="card-body text-center p-4">
              <div className="fs-1 mb-2">🏠</div>
              <h5 className="fw-bold text-dark">Inicio</h5>
              <p className="text-muted small mb-0">Vuelve a la página principal.</p>
            </div>
          </Link>
        </div>

        {/* Tarjeta de acceso a la lista completa de actores */}
        <div className="col-12 col-md-4">
          <Link href="/actores" className="card h-100 border-0 shadow-sm text-decoration-none card-hover">
            <div className="card-body text-center p-4">
              <div className="fs-1 mb-2">🎬</div>
              <h5 className="fw-bold text-dark">Actores</h5>
              <p className="text-muted small mb-0">Explora la lista completa de actores.</p>
            </div>
          </Link>
        </div>

        {/* Tarjeta de acceso rápido al formulario para registrar un nuevo actor */}
        <div className="col-12 col-md-4">
          <Link href="/crear-actor" className="card h-100 border-0 shadow-sm text-decoration-none card-hover">
            <div className="card-body text-center p-4">
              <div className="fs-1 mb-2">➕</div>
              <h5 className="fw-bold text-dark">Crear Actor</h5>
              <p className="text-muted small mb-0">Agrega un nuevo actor con el formulario.</p>
            </div>
          </Link>
        </div>
      </nav>
    </main>
  );
}
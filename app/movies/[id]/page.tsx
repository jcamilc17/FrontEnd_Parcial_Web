"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API_URL = "http://localhost:3000/api/v1/movies";

// Tipos que describen la estructura de una película según la respuesta de la API
type Persona = {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};

type Pelicula = {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  director?: Persona;
  actors: Persona[];
  genre?: { id: string; type: string };
  platforms: { id: string; name: string; url: string }[];
  reviews: { id: string; text: string; score: number; creator: string }[];
  youtubeTrailer?: { id: string; name: string; url: string; duration: number; channel: string };
};

type Premio = { id: string; name: string; category: string; year: number; status: string };

// Formatea una fecha ISO al formato largo en español (ej: 3 de junio de 1925)
const formatearFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

// PARTE 8: Página de detalle que muestra todos los atributos de una película
export default function DetallePeliculaPage() {
  // Obtiene el ID de la película desde la URL (/movies/[id])
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Pelicula | null>(null);
  const [premios, setPremios] = useState<Premio[]>([]);
  const [error, setError] = useState("");

  // Función useEffect para cargar el detalle de la película desde la API
  useEffect(() => {
    // Realiza una petición HTTP GET al endpoint específico usando el ID de la película
    fetch(`${API_URL}/${id}`)
      .then((res) => {
        // Valida si la respuesta fue correcta; si no, lanza un error con el código de estado
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      // Actualiza el estado local con los datos obtenidos de la API
      .then((data) => setMovie(data))
      // Captura cualquier error de red o de servidor y notifica al usuario
      .catch(() => setError("No se pudo cargar la película."));

    // El detalle de la película no incluye los premios, así que se consultan en /movies/:id/prizes
    fetch(`${API_URL}/${id}/prizes`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPremios(data))
      .catch(() => setPremios([]));
  }, [id]); // Se ejecuta cada vez que el ID de la película cambie

  // Estado de error: se muestra si la petición falló
  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </div>
      </main>
    );
  }

  // Estado de carga: se muestra mientras llega la respuesta de la API
  if (!movie) {
    return <main className="mx-auto max-w-5xl px-4 py-12 text-center text-gray-500">Cargando...</main>;
  }

  // Atributos generales de la película mostrados en forma de lista
  const atributos = [
    { label: "Fecha de lanzamiento", value: formatearFecha(movie.releaseDate) },
    { label: "Duración", value: movie.duration },
    { label: "País", value: movie.country },
    { label: "Género", value: movie.genre?.type },
    { label: "Popularidad", value: movie.popularity },
    { label: "Director", value: movie.director?.name },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* Enlace para regresar a la lista de películas */}
      <Link href="/movies" className="mb-6 inline-block text-blue-600 hover:underline">
        ← Volver a películas
      </Link>

      {/* Encabezado: póster de la película junto a su título y atributos generales */}
      <section className="mb-8 flex flex-col gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-sm md:flex-row">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-64 w-full rounded-md object-cover md:w-64"
        />
        <div className="flex-1">
          <h1 className="mb-4 text-4xl font-bold">{movie.title}</h1>
          {/* Lista de atributos; solo se muestran los que tienen valor */}
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {atributos
              .filter(({ value }) => value !== undefined && value !== null && value !== "")
              .map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs font-semibold text-gray-500 uppercase">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
        </div>
      </section>

      {/* Listado de actores de la película, cada uno con su foto, nacionalidad y biografía */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Actores</h2>
        {movie.actors?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movie.actors.map((actor) => (
              <div key={actor.id} className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                <img src={actor.photo} alt={actor.name} className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="font-bold">{actor.name}</p>
                  <p className="text-sm text-gray-500">
                    {actor.nationality} · {formatearFecha(actor.birthDate)}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{actor.biography}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Esta película no tiene actores registrados.</p>
        )}
      </section>

      {/* Información del director de la película (solo si tiene uno asignado) */}
      {movie.director && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Director</h2>
          <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
            <img
              src={movie.director.photo}
              alt={movie.director.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <p className="font-bold">{movie.director.name}</p>
              <p className="text-sm text-gray-500">
                {movie.director.nationality} · {formatearFecha(movie.director.birthDate)}
              </p>
              <p className="mt-1 text-sm text-gray-600">{movie.director.biography}</p>
            </div>
          </div>
        </section>
      )}

      {/* Premios de la película con su categoría, año y si fue ganado o solo nominado */}
      {premios.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Premios</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {premios.map((p) => (
              <div key={p.id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="font-bold">🏆 {p.name}</p>
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-bold ${
                      p.status === "won" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {p.status === "won" ? "Ganado" : "Nominado"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {p.category} · {p.year}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Plataformas donde se puede ver la película, renderizadas como enlaces externos */}
      {movie.platforms?.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Plataformas</h2>
          <div className="flex flex-wrap gap-2">
            {movie.platforms.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-blue-600 px-3 py-1 text-sm text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
              >
                {p.name}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Tráiler de YouTube de la película (solo si existe) */}
      {movie.youtubeTrailer && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Tráiler</h2>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <a
              href={movie.youtubeTrailer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline"
            >
              {movie.youtubeTrailer.name}
            </a>
            <p className="text-sm text-gray-500">
              Canal: {movie.youtubeTrailer.channel} · Duración: {movie.youtubeTrailer.duration}
            </p>
          </div>
        </section>
      )}

      {/* Reseñas de la película con su autor, puntuación y texto */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Reseñas</h2>
        {movie.reviews?.length > 0 ? (
          <div className="flex flex-col gap-4">
            {movie.reviews.map((r) => (
              <div key={r.id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-bold">{r.creator}</p>
                  <span className="text-yellow-500">
                    {"★".repeat(r.score)}
                    <span className="text-gray-300">{"★".repeat(Math.max(0, 5 - r.score))}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">{r.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Esta película no tiene reseñas.</p>
        )}
      </section>
    </main>
  );
}

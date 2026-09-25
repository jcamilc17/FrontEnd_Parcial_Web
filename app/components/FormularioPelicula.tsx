"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CamposActor, DatosActor, actorVacio, inputClass, labelClass } from "./FormularioActor";
import FormularioPremio, { DatosPremio, premioVacio } from "./FormularioPremio";

const API_URL = "http://localhost:3000/api/v1";

// Datos propios de la película (coinciden con el MovieDto del back más sus relaciones obligatorias)
type DatosPelicula = {
  title: string;
  poster: string;
  duration: string;
  country: string;
  releaseDate: string;
  popularity: string;
  genreId: string;
  directorId: string;
  youtubeTrailerId: string;
};

const peliculaVacia: DatosPelicula = {
  title: "",
  poster: "",
  duration: "",
  country: "",
  releaseDate: "",
  popularity: "",
  genreId: "",
  directorId: "",
  youtubeTrailerId: "",
};

// Opción genérica para los selects de género, director y tráiler
type Opcion = { id: string; label: string };

// Realiza un POST a la API y devuelve el JSON de respuesta; si falla, lanza un error indicando el paso
async function post(url: string, paso: string, body?: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${paso} (Error ${res.status})`);
  return res.json();
}

// PARTE 10: Formulario para crear una película junto con su actor principal y su premio
function FormularioPelicula() {
  const router = useRouter();

  // Un estado por cada entidad del formulario: película, actor principal y premio
  const [pelicula, setPelicula] = useState<DatosPelicula>(peliculaVacia);
  const [actor, setActor] = useState<DatosActor>(actorVacio);
  const [premio, setPremio] = useState<DatosPremio>(premioVacio);

  // Opciones disponibles para las relaciones obligatorias de la película
  const [generos, setGeneros] = useState<Opcion[]>([]);
  const [directores, setDirectores] = useState<Opcion[]>([]);
  const [trailers, setTrailers] = useState<Opcion[]>([]);

  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Carga los géneros, directores y tráilers existentes; el back exige que la película tenga uno de cada uno
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/genres`).then((r) => r.json()),
      fetch(`${API_URL}/directors`).then((r) => r.json()),
      fetch(`${API_URL}/youtube-trailers`).then((r) => r.json()),
    ])
      .then(([g, d, t]) => {
        setGeneros(g.map((x: { id: string; type: string }) => ({ id: x.id, label: x.type })));
        setDirectores(d.map((x: { id: string; name: string }) => ({ id: x.id, label: x.name })));
        // Un tráiler solo puede pertenecer a una película, por eso se marcan los que ya están asignados
        setTrailers(
          t.map((x: { id: string; name: string; channel: string; movie: unknown }) => ({
            id: x.id,
            label: `${x.name} · ${x.channel}${x.movie ? " (ya asignado)" : ""}`,
          }))
        );
      })
      .catch(() => setError("No se pudieron cargar los géneros, directores o tráilers."));
  }, []); // Array de dependencias vacío para asegurar que se ejecute una sola vez

  // Actualiza únicamente el campo modificado de la película
  const actualizar = (campo: keyof DatosPelicula, valor: string) => setPelicula({ ...pelicula, [campo]: valor });

  // Envía las 5 peticiones al back en orden: cada asociación necesita los IDs de las entidades creadas antes
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Evita el comportamiento por defecto de recarga de la página al enviar el formulario
    e.preventDefault();
    setError("");
    setEnviando(true);

    try {
      // 1. Crear la película con sus relaciones obligatorias (género, director y tráiler)
      const nuevaPelicula = await post(`${API_URL}/movies`, "No se pudo crear la película", {
        title: pelicula.title,
        poster: pelicula.poster,
        duration: Number(pelicula.duration),
        country: pelicula.country,
        releaseDate: pelicula.releaseDate,
        popularity: Number(pelicula.popularity),
        genre: { id: pelicula.genreId },
        director: { id: pelicula.directorId },
        youtubeTrailer: { id: pelicula.youtubeTrailerId },
      });

      // 2. Crear el actor principal
      const nuevoActor = await post(`${API_URL}/actors`, "No se pudo crear el actor", actor);

      // 3. Asignar la película al actor
      await post(
        `${API_URL}/actors/${nuevoActor.id}/movies/${nuevaPelicula.id}`,
        "No se pudo asociar el actor a la película"
      );

      // 4. Crear el premio (el año se convierte a número porque el back lo valida como tal)
      const nuevoPremio = await post(`${API_URL}/prizes`, "No se pudo crear el premio", {
        ...premio,
        year: Number(premio.year),
      });

      // 5. Asignar el premio a la película
      await post(
        `${API_URL}/movies/${nuevaPelicula.id}/prizes/${nuevoPremio.id}`,
        "No se pudo asociar el premio a la película"
      );

      // Redirige al detalle de la película recién creada tras completar todas las peticiones
      router.push(`/movies/${nuevaPelicula.id}`);
    } catch (err) {
      // Muestra al usuario en qué paso falló el proceso
      setError(err instanceof Error ? err.message : "No se pudo crear la película.");
      setEnviando(false);
    }
  };

  // Campos de texto/número/fecha de la película
  const campos: { id: keyof DatosPelicula; label: string; type: string; mitad?: boolean }[] = [
    { id: "title", label: "Título", type: "text" },
    { id: "poster", label: "Póster (URL)", type: "url" },
    { id: "country", label: "País", type: "text", mitad: true },
    { id: "releaseDate", label: "Fecha de lanzamiento", type: "date", mitad: true },
    { id: "duration", label: "Duración", type: "number", mitad: true },
    { id: "popularity", label: "Popularidad", type: "number", mitad: true },
  ];

  // Selects de las relaciones obligatorias de la película
  const selects: { id: keyof DatosPelicula; label: string; opciones: Opcion[] }[] = [
    { id: "genreId", label: "Género", opciones: generos },
    { id: "directorId", label: "Director", opciones: directores },
    { id: "youtubeTrailerId", label: "Tráiler de YouTube", opciones: trailers },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Muestra una alerta de error en caso de que ocurra un problema al cargar o guardar */}
      {error && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </div>
      )}

      {/* Sección 1: Información de la película */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">🎞️ Película</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {campos.map(({ id, label, type, mitad }) => (
            <div key={id} className={mitad ? "" : "md:col-span-2"}>
              <label htmlFor={`movie-${id}`} className={labelClass}>{label}</label>
              <input
                id={`movie-${id}`}
                type={type}
                min={type === "number" ? 0 : undefined}
                value={pelicula[id]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => actualizar(id, e.target.value)}
                placeholder={type === "url" ? "https://..." : ""}
                className={inputClass}
                required
              />
            </div>
          ))}

          {/* Selects de género, director y tráiler cargados desde la API */}
          {selects.map(({ id, label, opciones }) => (
            <div key={id} className={id === "youtubeTrailerId" ? "md:col-span-2" : ""}>
              <label htmlFor={`movie-${id}`} className={labelClass}>{label}</label>
              <select
                id={`movie-${id}`}
                value={pelicula[id]}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => actualizar(id, e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Selecciona...</option>
                {opciones.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* Sección 2: Actor principal, reutilizando los campos del formulario de actores */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">🎭 Actor principal</h2>
        <CamposActor actor={actor} setActor={setActor} prefijo="actor-" />
      </section>

      {/* Sección 3: Premio de la película, usando el subcomponente FormularioPremio */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">🏆 Premio</h2>
        <FormularioPremio premio={premio} setPremio={setPremio} />
      </section>

      {/* Barra inferior de botones de acción: cancelar o enviar el formulario */}
      <div className="flex justify-end gap-2">
        <Link
          href="/movies"
          className="rounded-md border border-gray-500 bg-white px-4 py-2 text-gray-600 transition-colors hover:bg-gray-500 hover:text-white"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={enviando}
          className="cursor-pointer rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {/* El texto del botón cambia mientras se realizan las peticiones */}
          {enviando ? "Creando..." : "Crear película"}
        </button>
      </div>
    </form>
  );
}

export default FormularioPelicula;

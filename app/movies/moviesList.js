"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

function ListaMovies() {
  const [movieList, setMovieList] = useState([]);

  // PARTE 7: Función para cargar la lista de películas desde la API
  useEffect(() => {
    // Realiza una petición HTTP GET al endpoint de películas
    fetch("http://localhost:3000/api/v1/movies")
      // Convierte la respuesta recibida a formato JSON
      .then((response) => response.json())
      // El endpoint /movies no incluye los premios, así que se consultan por cada película en /movies/:id/prizes
      .then((data) =>
        Promise.all(
          data.map((movie) =>
            fetch(`http://localhost:3000/api/v1/movies/${movie.id}/prizes`)
              .then((res) => (res.ok ? res.json() : []))
              .then((prizes) => ({ ...movie, prizes }))
          )
        )
      )
      // Actualiza el estado local con las películas ya acompañadas de sus premios
      .then((data) => setMovieList(data))
      // Captura y muestra en consola cualquier error ocurrido durante la petición
      .catch((error) => console.error("Error cargando películas:", error));
  }, []); // Array de dependencias vacío para asegurar que se ejecute una sola vez

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Encabezado: Muestra el título de la sección, el contador de películas y el botón para crear una nueva */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-3xl font-bold">Películas</h2>
          <p className="text-gray-500">{movieList.length} películas registradas</p>
        </div>
        <Link
          href="/crear-pelicula"
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          + Crear película
        </Link>
      </div>

      {/* Estado vacío: Se muestra únicamente si la lista de películas se encuentra vacía */}
      {movieList.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-12 text-center text-gray-500">
          <p>No hay películas para mostrar.</p>
        </div>
      )}

      {/* Cuadrícula responsiva que mapea y renderiza una tarjeta por cada película en la lista */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {movieList.map((movie) => {
          // El autor de la película corresponde a su director (puede no existir)
          const autor = movie.director?.name;
          // Nombre del premio de la película (puede no existir)
          const premio = movie.prizes?.map((p) => p.name).join(", ");

          return (
            // Cada tarjeta es un enlace que lleva al detalle de la película
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="card-hover flex h-full flex-col rounded-lg bg-white p-4 shadow-sm"
            >
              {/* Título de la película */}
              <h5 className="mb-1 text-xl font-bold">{movie.title}</h5>

              {/* Fecha de lanzamiento formateada en español */}
              <h6 className="mb-4 text-sm text-gray-500">
                Lanzada el{" "}
                {new Date(movie.releaseDate).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </h6>

              {/* Autor y premio: se muestran únicamente si la película los tiene */}
              <div className="mt-auto flex flex-col gap-1 text-sm">
                {autor && (
                  <p>
                    <span className="font-semibold text-gray-500">Autor:</span> {autor}
                  </p>
                )}
                {premio && (
                  <p>
                    <span className="font-semibold text-gray-500">Premio:</span> 🏆 {premio}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ListaMovies;

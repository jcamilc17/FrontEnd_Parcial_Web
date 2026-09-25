"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

function ListaActores() {
  const [actorList, setActorList] = useState([]);

  // PARTE 1: Función para cargar la lista de actores desde la API 
  useEffect(() => {
    // Realiza una petición HTTP GET al endpoint de actores
    fetch("http://localhost:3000/api/v1/actors")
      // Convierte la respuesta recibida a formato JSON
      .then((response) => response.json())
      // Actualiza el estado local con los datos obtenidos de la API
      .then((data) => setActorList(data))
      // Captura y muestra en consola cualquier error ocurrido durante la petición
      .catch((error) => console.error("Error cargando actores:", error));
  }, []); // Array de dependencias vacío para asegurar que se ejecute una sola vez

  // PARTE 6: Función para eliminar un actor
  const handleDelete = async (id) => {
    // Muestra una ventana de confirmación al usuario antes de proceder con la acción
    if (!confirm("¿Seguro que quieres eliminar este actor?")) return;

    try {
      // Realiza una petición HTTP DELETE al endpoint específico usando el ID del actor
      const response = await fetch(`http://localhost:3000/api/v1/actors/${id}`, {
        method: "DELETE",
      });
      // Valida que la respuesta del servidor sea exitosa (código 2xx)
      if (!response.ok) throw new Error(`Error ${response.status}`);

      // Quitar el actor del estado: React actualiza la vista automáticamente filtrando el elemento eliminado
      setActorList((prev) => prev.filter((actor) => actor.id !== id));
    } catch (error) {
      // Muestra una alerta al usuario si ocurre un error en la red o en el servidor
      alert("No se pudo eliminar el actor.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Encabezado: Muestra el título de la sección, el contador de actores y el botón de navegación para crear uno nuevo */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-3xl font-bold">Actores</h2>
          <p className="text-gray-500">{actorList.length} actores registrados</p>
        </div>
        <Link
          href="/crear-actor"
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          + Crear actor
        </Link>
      </div>

      {/* Estado vacío: Se muestra únicamente si la lista de actores se encuentra vacía */}
      {actorList.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 py-12 text-center text-gray-500">
          <p>No hay actores para mostrar.</p>
        </div>
      )}

      {/* Cuadrícula responsiva que mapea y renderiza una tarjeta por cada actor en la lista */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {actorList.map((actor) => (
          <div key={actor.id} className="flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm">
            {/* Contenedor de la foto del actor con la etiqueta de nacionalidad posicionada de forma absoluta encima */}
            <div className="relative">
              <img
                src={actor.photo}
                alt={actor.name}
                className="h-80 w-full object-cover"
              />
              <span className="absolute top-0 right-0 m-4 rounded-md bg-gray-900 px-3 py-2 text-xs font-bold text-white opacity-75">
                {actor.nationality}
              </span>
            </div>

            {/* Cuerpo de la tarjeta: Contiene información principal, biografía y películas asociadas */}
            <div className="flex flex-1 flex-col p-4">
              <h5 className="mb-1 text-xl font-bold">{actor.name}</h5>
              <h6 className="mb-4 text-sm text-gray-500">
                Nacido el{" "}
                {new Date(actor.birthDate).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </h6>

              {/* Biografía recortada visualmente a un máximo de 3 líneas mediante estilos CSS */}
              <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                {actor.biography}
              </p>

              {/* Lista de películas del actor renderizadas como etiquetas/badges de forma dinámica */}
              {Array.isArray(actor.movies) && actor.movies.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-1">
                  {actor.movies.map((m, i) => (
                    <span
                      key={m.id ?? i}
                      className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-900"
                    >
                      {m.title ?? m}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Pie de la tarjeta: Botones de acción para modificar o eliminar al actor respectivo */}
            <div className="flex gap-2 bg-white px-4 pb-4">
              <Link
                href={`/actores/${actor.id}/editar`}
                className="flex-1 rounded-md border border-blue-600 px-2 py-1 text-center text-sm text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
              >
                Editar
              </Link>
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-md border border-red-600 px-2 py-1 text-sm text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                onClick={() => handleDelete(actor.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaActores;
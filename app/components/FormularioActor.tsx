"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = "http://localhost:3000/api/v1/actors";

// Datos que componen un actor (coinciden con el ActorDto del back)
export type DatosActor = {
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};

// Valores iniciales de un actor vacío (modo creación)
export const actorVacio: DatosActor = {
  name: "",
  photo: "",
  nationality: "",
  birthDate: "",
  biography: "",
};

// Clases compartidas por todos los inputs del formulario
export const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-blue-400 focus:ring-4 focus:ring-blue-200 focus:outline-none";

// Clases compartidas por todas las etiquetas de los campos
export const labelClass = "mb-2 block text-sm font-semibold text-gray-500 uppercase";

type CamposActorProps = {
  actor: DatosActor;
  setActor: (actor: DatosActor) => void;
  prefijo?: string; // prefijo para los ids de los inputs, evita ids repetidos si hay varios formularios en la página
};

// Subcomponente reutilizable con los campos del actor; lo usan FormularioActor y FormularioPelicula
export function CamposActor({ actor, setActor, prefijo = "" }: CamposActorProps) {
  // Configuración de los campos, cada uno con su clave dentro del objeto actor
  const campos: { id: keyof DatosActor; label: string; type: string }[] = [
    { id: "name", label: "Nombre", type: "text" },
    { id: "photo", label: "Foto (URL)", type: "url" },
    { id: "nationality", label: "Nacionalidad", type: "text" },
    { id: "birthDate", label: "Fecha de nacimiento", type: "date" },
    { id: "biography", label: "Biografía", type: "textarea" },
  ];

  // Actualiza únicamente el campo modificado conservando el resto de valores del actor
  const actualizar = (campo: keyof DatosActor, valor: string) => setActor({ ...actor, [campo]: valor });

  return (
    // Cuadrícula que mapea dinámicamente los campos del formulario
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {campos.map(({ id, label, type }) => (
        <div className={id === "nationality" || id === "birthDate" ? "" : "md:col-span-2"} key={id}>
          <label htmlFor={prefijo + id} className={labelClass}>
            {label}
          </label>
          {type === "textarea" ? (
            <textarea
              id={prefijo + id}
              rows={4}
              value={actor[id]}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => actualizar(id, e.target.value)}
              placeholder="Cuéntanos sobre el actor..."
              className={inputClass}
              required
            />
          ) : (
            <input
              id={prefijo + id}
              type={type}
              value={actor[id]}
              onChange={(e: ChangeEvent<HTMLInputElement>) => actualizar(id, e.target.value)}
              placeholder={type === "url" ? "https://..." : ""}
              className={inputClass}
              required
            />
          )}
        </div>
      ))}
    </div>
  );
}

type Props = {
  actorId?: string; // si viene, el formulario está en modo edición
};

// PARTE 2: Función componente Formulario crear y editar actores
function FormularioActor({ actorId }: Props) {
  const router = useRouter();
  const esEdicion = Boolean(actorId);

  // Un único estado con todos los campos del formulario del actor
  const [actor, setActor] = useState<DatosActor>(actorVacio);
  const [error, setError] = useState("");

  // PARTE 5: Función useEffect para cargar los datos del actor si estamos en modo edición
  useEffect(() => {
    // Si no existe un ID de actor (modo creación), detiene la ejecución del efecto
    if (!actorId) return;

    // Realiza una petición GET para obtener los datos específicos del actor por su ID
    fetch(`${API_URL}/${actorId}`)
      .then((res) => {
        // Valida si la respuesta fue correcta; si no, lanza un error con el código de estado
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Rellena el estado del formulario con la información obtenida del servidor
        setActor({
          name: data.name ?? "",
          photo: data.photo ?? "",
          nationality: data.nationality ?? "",
          // El input de fecha necesita el formato YYYY-MM-DD; se recorta la cadena para ajustarlo
          birthDate: (data.birthDate ?? "").slice(0, 10),
          biography: data.biography ?? "",
        });
      })
      .catch(() => setError("No se pudo cargar el actor."));
  }, [actorId]); // Se ejecuta cada vez que el ID del actor cambie

  // PARTE 4: Función que conecta formulario con la API para reflejar los cambios en lista de actores
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Evita el comportamiento por defecto de recarga de la página al enviar el formulario
    e.preventDefault();

    try {
      // Determina la URL y el método HTTP según si se trata de una edición (PUT) o de una creación (POST)
      const response = await fetch(esEdicion ? `${API_URL}/${actorId}` : API_URL, {
        method: esEdicion ? "PUT" : "POST",
        // Especifica que el cuerpo de la petición se enviará en formato JSON
        headers: { "Content-Type": "application/json" },
        // Convierte los datos del formulario a una cadena JSON para enviarlos en el cuerpo
        body: JSON.stringify(actor),
      });

      // Valida si la respuesta del servidor fue exitosa; de lo contrario, lanza un error con el código recibido
      if (!response.ok) throw new Error(`Error ${response.status}`);

      // Redirige al usuario a la vista principal de la lista de actores tras guardar con éxito
      router.push("/actores");
    } catch (err) {
      // Captura cualquier error de red o de servidor y actualiza el estado de error para notificar al usuario
      setError("No se pudo guardar el actor. Revisa los datos e intenta de nuevo.");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Vista previa de la foto (se renderiza de manera condicional únicamente cuando hay una URL cargada) */}
      {actor.photo && (
        <div className="border-b border-gray-200 bg-gray-50 p-4 text-center">
          <img
            src={actor.photo}
            alt="Vista previa"
            className="mx-auto h-40 w-40 rounded-xl object-cover shadow-sm"
          />
        </div>
      )}

      <div className="p-6">
        {/* Formulario principal vinculado a la función handleSubmit */}
        <form onSubmit={handleSubmit}>
          {/* Muestra una alerta de error en caso de que ocurra un problema al guardar o cargar */}
          {error && (
            <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800">
              {error}
            </div>
          )}

          {/* Campos del actor renderizados por el subcomponente reutilizable */}
          <CamposActor actor={actor} setActor={setActor} />

          {/* Barra inferior de botones de acción: cancelar o enviar el formulario */}
          <div className="mt-6 flex justify-end gap-2 border-t border-gray-200 pt-4">
            <Link
              href="/actores"
              className="rounded-md border border-gray-500 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-500 hover:text-white"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="cursor-pointer rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              {/* El texto del botón cambia dinámicamente según si estamos editando o creando un nuevo registro */}
              {esEdicion ? "Guardar cambios" : "Crear actor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioActor;

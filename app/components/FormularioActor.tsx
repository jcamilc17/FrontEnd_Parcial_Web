"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

const API_URL = "http://localhost:3000/api/v1/actors";

type Props = {
  actorId?: string; // si viene, el formulario está en modo edición
};

// PARTE 2: Función componente Formulario crear y editar actores
function FormularioActor({ actorId }: Props) {
  const router = useRouter();
  const esEdicion = Boolean(actorId);

  // Un useState por cada campo del formulario
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [biography, setBiography] = useState("");
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
      .then((actor) => {
        // Rellena los estados del formulario con la información obtenida del servidor
        setName(actor.name ?? "");
        setPhoto(actor.photo ?? "");
        setNationality(actor.nationality ?? "");
        // El input de fecha necesita el formato YYYY-MM-DD; se recorta la cadena para ajustarlo
        setBirthDate((actor.birthDate ?? "").slice(0, 10));
        setBiography(actor.biography ?? "");
      })
      .catch(() => setError("No se pudo cargar el actor."));
  }, [actorId]); // Se ejecuta cada vez que el ID del actor cambie

  // Configuración de los campos, cada uno con su valor y su setter
  const campos = [
    { id: "name", label: "Nombre", type: "text", value: name, setValue: setName },
    { id: "photo", label: "Foto (URL)", type: "url", value: photo, setValue: setPhoto },
    { id: "nationality", label: "Nacionalidad", type: "text", value: nationality, setValue: setNationality },
    { id: "birthDate", label: "Fecha de nacimiento", type: "date", value: birthDate, setValue: setBirthDate },
    { id: "biography", label: "Biografía", type: "textarea", value: biography, setValue: setBiography },
  ];

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
        body: JSON.stringify({ name, photo, nationality, birthDate, biography }),
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
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      {campos.map(({ id, label, type, value, setValue }) => (
        <Form.Group className="mb-3" controlId={id} key={id}>
          <Form.Label>{label}</Form.Label>
          {type === "textarea" ? (
            <Form.Control
              as="textarea"
              rows={4}
              value={value}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
              required
            />
          ) : (
            <Form.Control
              type={type}
              value={value}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              required
            />
          )}
        </Form.Group>
      ))}

      <Button variant="primary" type="submit">
        {esEdicion ? "Guardar cambios" : "Crear actor"}
      </Button>
    </Form>
  );
}

export default FormularioActor;
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

  // En modo edición, cargar los datos del actor al montar el componente
  useEffect(() => {
    if (!actorId) return;

    fetch(`${API_URL}/${actorId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((actor) => {
        setName(actor.name ?? "");
        setPhoto(actor.photo ?? "");
        setNationality(actor.nationality ?? "");
        // el input de fecha necesita el formato YYYY-MM-DD
        setBirthDate((actor.birthDate ?? "").slice(0, 10));
        setBiography(actor.biography ?? "");
      })
      .catch(() => setError("No se pudo cargar el actor."));
  }, [actorId]);

  // Configuración de los campos, cada uno con su valor y su setter
  const campos = [
    { id: "name", label: "Nombre", type: "text", value: name, setValue: setName },
    { id: "photo", label: "Foto (URL)", type: "url", value: photo, setValue: setPhoto },
    { id: "nationality", label: "Nacionalidad", type: "text", value: nationality, setValue: setNationality },
    { id: "birthDate", label: "Fecha de nacimiento", type: "date", value: birthDate, setValue: setBirthDate },
    { id: "biography", label: "Biografía", type: "textarea", value: biography, setValue: setBiography },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Crear: POST a /actors. Editar: PUT a /actors/:id
      const response = await fetch(esEdicion ? `${API_URL}/${actorId}` : API_URL, {
        method: esEdicion ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, photo, nationality, birthDate, biography }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      router.push("/actores");
    } catch (err) {
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
"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

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
    <div className="container py-5">
      {/* Encabezado: Muestra el título de la sección, el contador de actores y el botón de navegación para crear uno nuevo */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Actores</h2>
          <p className="text-muted mb-0">{actorList.length} actores registrados</p>
        </div>
        <Link href="/crear-actor" className="btn btn-primary">
          + Crear actor
        </Link>
      </div>

      {/* Estado vacío: Se muestra únicamente si la lista de actores se encuentra vacía */}
      {actorList.length === 0 && (
        <div className="text-center text-muted py-5 border rounded-3 bg-light">
          <p className="mb-0">No hay actores para mostrar.</p>
        </div>
      )}

      {/* Cuadrícula responsiva que mapea y renderiza una tarjeta por cada actor en la lista */}
      <Row xs={1} sm={2} lg={3} className="g-4">
        {actorList.map((actor) => (
          <Col key={actor.id}>
            <Card className="h-100 border-0 shadow-sm overflow-hidden">
              {/* Contenedor de la foto del actor con la etiqueta de nacionalidad posicionada de forma absoluta encima */}
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={actor.photo}
                  alt={actor.name}
                  style={{ height: "320px", objectFit: "cover" }}
                />
                <Badge bg="dark" className="position-absolute top-0 end-0 m-3 px-3 py-2 opacity-75">
                  {actor.nationality}
                </Badge>
              </div>

              {/* Cuerpo de la tarjeta: Contiene información principal, biografía y películas asociadas */}
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold fs-5 mb-1">{actor.name}</Card.Title>
                <Card.Subtitle className="text-muted small mb-3">
                  Nacido el{" "}
                  {new Date(actor.birthDate).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </Card.Subtitle>

                {/* Biografía recortada visualmente a un máximo de 3 líneas mediante estilos CSS */}
                <Card.Text
                  className="text-secondary small"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {actor.biography}
                </Card.Text>

                {/* Lista de películas del actor renderizadas como etiquetas/badges de forma dinámica */}
                {Array.isArray(actor.movies) && actor.movies.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mt-auto">
                    {actor.movies.map((m, i) => (
                      <Badge key={m.id ?? i} bg="light" text="dark" className="border fw-normal">
                        {m.title ?? m}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card.Body>

              {/* Pie de la tarjeta: Botones de acción para modificar o eliminar al actor respectivo */}
              <Card.Footer className="bg-white border-0 d-flex gap-2 pb-3">
                <Link
                  href={`/actores/${actor.id}/editar`}
                  className="btn btn-outline-primary btn-sm flex-fill"
                >
                  Editar
                </Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="flex-fill"
                  onClick={() => handleDelete(actor.id)}
                >
                  Eliminar
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ListaActores;
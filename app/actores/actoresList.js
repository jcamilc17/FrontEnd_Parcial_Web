"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function ListaActores() {
  const [actorList, setActorList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/actors")
      .then((response) => response.json())
      .then((data) => setActorList(data))
      .catch((error) => console.error("Error cargando actores:", error));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este actor?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/actors/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);

      // Quitar el actor del estado: React actualiza la vista automáticamente
      setActorList((prev) => prev.filter((actor) => actor.id !== id));
    } catch (error) {
      alert("No se pudo eliminar el actor.");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Actor List</h2>

      <Row xs={1} sm={2} md={3} className="g-4">
        {actorList.map((actor) => (
          <Col key={actor.id}>
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={actor.photo}
                alt={actor.name}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="d-flex gap-2 p-2">
                <Link href={`/actores/${actor.id}/editar`} className="btn btn-outline-primary btn-sm">
                  Editar
                </Link>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(actor.id)}>
                  Eliminar
                </Button>
              </div>
              <Card.Body>
                <Card.Title>{actor.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {actor.nationality}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Birth Date:</strong>{" "}
                  {new Date(actor.birthDate).toLocaleDateString()}
                </Card.Text>
                <Card.Text>{actor.biography}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Movies:{" "}
                  {Array.isArray(actor.movies)
                    ? actor.movies.map((m) => m.title ?? m).join(", ")
                    : actor.movies}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ListaActores;
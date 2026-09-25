# Cosas importantes parcial de web

Guía rápida para el parcial: comandos, fuentes y fragmentos de código por cada punto.

---

## 0. Preparación

### Backend
Desplegar la API con Docker (desde la carpeta del backend):

```bash
docker compose up
```

La API queda en `http://localhost:3000/api/v1/...`. Next.js detecta que el 3000 está ocupado y corre en el **3001** (revisar la terminal).

### Frontend
Crear el proyecto:

```bash
npx create-next-app@latest
```

Instalar Bootstrap (solo si se usan componentes o clases de Bootstrap):

```bash
npm install react-bootstrap bootstrap
```

### Limpiar lo que trae create-next-app (IMPORTANTE)

`app/layout.tsx` debe importar Bootstrap **antes** de `globals.css`:

```tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
```

En `app/globals.css` **borrar** `@import "tailwindcss";` y el bloque `@media (prefers-color-scheme: dark)`. Tailwind pisa los estilos de Bootstrap y el modo oscuro deja el texto casi blanco sobre fondo blanco.

### Probar la API desde la terminal (sin frontend)

```bash
# Listar
curl http://localhost:3000/api/v1/actors

# Crear (201 = funciona)
curl -i -X POST http://localhost:3000/api/v1/actors \
  -H "Content-Type: application/json" \
  -d '{"name":"Prueba","photo":"https://placehold.co/300x400","nationality":"Colombia","birthDate":"1990-05-15","biography":"Test"}'

# Obtener uno / Editar / Eliminar
curl -i http://localhost:3000/api/v1/actors/ID
curl -i -X PUT http://localhost:3000/api/v1/actors/ID -H "Content-Type: application/json" -d '{...}'
curl -i -X DELETE http://localhost:3000/api/v1/actors/ID
```

---

## Punto 1 – Lista de actores (fetch con useEffect + useState)

Traer cosas de la API en un componente. **Necesariamente** poner `"use client";` al principio del archivo (los hooks solo funcionan en el cliente; en el App Router todo es de servidor por defecto).

**Fuentes:**
- GeeksforGeeks – Fetching data with useEffect and useState: https://www.geeksforgeeks.org/reactjs/fetching-data-from-an-api-with-useeffect-and-usestate-hook/
- React docs – Fetching data with Effects: https://react.dev/reference/react/useEffect#fetching-data-with-effects
- React docs – Renderizar listas con `map` y `key`: https://react.dev/learn/rendering-lists
- Next.js – Directiva `"use client"`: https://nextjs.org/docs/app/api-reference/directives/use-client

```jsx
"use client";

import { useEffect, useState } from "react";

function ListaActores() {
  const [actorList, setActorList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/actors")
      .then((response) => response.json())
      .then((data) => setActorList(data))
      .catch((error) => console.error("Error cargando actores:", error));
  }, []); // [] = se ejecuta una sola vez al montar

  return (
    <ul>
      {actorList.map((actor) => (
        <li key={actor.id}>{actor.name}</li>
      ))}
    </ul>
  );
}

export default ListaActores;
```

**Para arreglos de cosas** (ej. películas):

```jsx
// Si son strings:
Array.isArray(actor.movies) ? actor.movies.join(", ") : actor.movies

// Si son objetos ({ id, title }) — join solo daría "[object Object]":
Array.isArray(actor.movies) ? actor.movies.map((m) => m.title ?? m).join(", ") : actor.movies
```

**Fechas:** usar `timeZone: "UTC"`, si no en Colombia muestra el día anterior:

```jsx
new Date(actor.birthDate).toLocaleDateString("es-CO", { timeZone: "UTC" })
```

Renderizar la lista en la página `app/actores/page.tsx`:

```tsx
import ListaActores from "./actoresList";

export default function ActorPage() {
  return <ListaActores />;
}
```

---

## Punto 2 – Formulario controlado para crear actores (POST)

Formulario **controlado** = cada input tiene `value={estado}` y `onChange={(e) => setEstado(e.target.value)}`. Un `useState` por campo. `e.preventDefault()` evita que la página se recargue al enviar.

**Fuentes:**
- React docs – Input controlado con estado: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
- React-Bootstrap – Forms: https://react-bootstrap.netlify.app/docs/forms/overview/
- MDN – Fetch con POST y JSON: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
- Next.js – `useRouter` (redirigir después de guardar): https://nextjs.org/docs/app/api-reference/functions/use-router

```tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation"; // OJO: next/navigation, NO next/router
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function FormularioActor() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [biography, setBiography] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/v1/actors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, photo, nationality, birthDate, biography }),
    });
    if (response.ok) router.push("/actores");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="name">
        <Form.Label>Nombre</Form.Label>
        <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
      </Form.Group>
      {/* ...igual para photo (type="url"), nationality, birthDate (type="date") */}
      <Form.Group className="mb-3" controlId="biography">
        <Form.Label>Biografía</Form.Label>
        <Form.Control as="textarea" rows={4} value={biography}
          onChange={(e) => setBiography(e.target.value)} required />
      </Form.Group>
      <Button type="submit">Crear actor</Button>
    </Form>
  );
}

export default FormularioActor;
```

- El enunciado dice "birthday" pero la API usa **`birthDate`** (mirar cómo vienen los datos en el GET).
- Error de TypeScript con `as` dinámico (`"textarea" | "input"`): hacer **dos `Form.Control` separados** con un ternario.
- Página: `app/crear-actor/page.tsx` → `<FormularioActor />`.

**Conectar formulario y lista:** el formulario hace POST, el backend guarda, y al volver a `/actores` el `useEffect` de la lista vuelve a pedir los datos y ya trae el nuevo. (Alternativa si piden estado compartido sin volver a pedir datos: Context en el layout → https://react.dev/reference/react/useContext)

---

## Punto 3 – Cards y routing

### Cards de React-Bootstrap

**Fuentes:**
- React-Bootstrap – Cards: https://react-bootstrap.netlify.app/docs/components/cards/
- React-Bootstrap – Grid (Row/Col): https://react-bootstrap.netlify.app/docs/layout/grid/

Usar `Row`/`Col` en vez de `CardGroup` cuando hay muchos elementos (grilla responsive). El `key` va en el elemento más externo del `map` (el `Col`).

```jsx
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

<Row xs={1} sm={2} md={3} className="g-4">
  {actorList.map((actor) => (
    <Col key={actor.id}>
      <Card className="h-100 shadow-sm">
        <Card.Img variant="top" src={actor.photo} alt={actor.name}
          style={{ height: "300px", objectFit: "cover" }} />
        <Card.Body>
          <Card.Title>{actor.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{actor.nationality}</Card.Subtitle>
          <Card.Text>{actor.biography}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>
```

### Routing en Next.js (App Router)

Para routing desde page de la app usar `Link`.

**Fuentes:**
- Next.js – Link: https://nextjs.org/docs/app/api-reference/components/link
- Next.js – Rutas dinámicas `[id]`: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes

**Las rutas son carpetas** (NO se usa `react-router-dom`, ni `BrowserRouter`, ni `Routes`):

```
app/
├── layout.tsx                  → envuelve todas las páginas (poner aquí el navbar)
├── page.tsx                    → /
├── actores/page.tsx            → /actores
├── crear-actor/page.tsx        → /crear-actor
└── actores/[id]/editar/page.tsx → /actores/abc123/editar
```

```tsx
import Link from "next/link"; // import por defecto, SIN llaves
<Link href="/actores">Actores</Link> // href, NO "to"
```

| react-router-dom | Next.js |
|---|---|
| `import { Link } from "react-router-dom"` | `import Link from "next/link"` |
| `<Link to="/x">` | `<Link href="/x">` |
| `useNavigate()` → `navigate("/x")` | `useRouter()` de `next/navigation` → `router.push("/x")` |
| `useParams()` | `useParams()` de `next/navigation`, o `params` en la page |
| `<Route path=...>` | Crear carpeta con `page.tsx` |

Navegar siempre con `Link` o `router.push`, nunca con `<a href>` (recarga toda la página y se pierde el estado).

---

## Punto 4 – Editar actores (GET por id + PUT)

Botón Editar en cada carta → página dinámica → el formulario carga los datos con `useEffect` y guarda con PUT.

**Fuentes:**
- Next.js – Rutas dinámicas y `params`: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
- React docs – `useEffect` con dependencias: https://react.dev/reference/react/useEffect
- MDN – Métodos HTTP (PUT/PATCH): https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods

Botón en la lista:

```jsx
<Link href={`/actores/${actor.id}/editar`} className="btn btn-outline-primary btn-sm">
  Editar
</Link>
```

`app/actores/[id]/editar/page.tsx` (en Next 15+ `params` es una promesa → `await`):

```tsx
import FormularioActor from "@/app/components/FormularioActor";

export default async function EditarActorPage({ params }: PageProps<"/actores/[id]/editar">) {
  const { id } = await params;
  return <FormularioActor actorId={id} />;
}
```

En el formulario (reutilizado para crear y editar):

```tsx
function FormularioActor({ actorId }: { actorId?: string }) {
  const esEdicion = Boolean(actorId);

  useEffect(() => {
    if (!actorId) return;
    fetch(`${API_URL}/${actorId}`)
      .then((res) => res.json())
      .then((actor) => {
        setName(actor.name ?? "");
        setBirthDate((actor.birthDate ?? "").slice(0, 10)); // input date = YYYY-MM-DD
        // ...resto de campos
      });
  }, [actorId]);

  // En handleSubmit:
  // fetch(esEdicion ? `${API_URL}/${actorId}` : API_URL,
  //       { method: esEdicion ? "PUT" : "POST", ... })
}
```

Si PUT da 404, probar `PATCH`.

---

## Punto 5 – Eliminar actor (DELETE + filter en el estado)

**Fuentes:**
- React docs – Actualizar arreglos en el estado (quitar con `filter`): https://react.dev/learn/updating-arrays-in-state#removing-from-an-array
- React docs – Manejar eventos (pasar funciones a `onClick`): https://react.dev/learn/responding-to-events

```jsx
const handleDelete = async (id) => {
  if (!confirm("¿Seguro que quieres eliminar este actor?")) return;
  const response = await fetch(`http://localhost:3000/api/v1/actors/${id}`, { method: "DELETE" });
  if (response.ok) {
    // arreglo NUEVO sin ese actor → React re-renderiza
    setActorList((prev) => prev.filter((actor) => actor.id !== id));
  }
};

<Button variant="outline-danger" size="sm" onClick={() => handleDelete(actor.id)}>
  Eliminar
</Button>
```

- `onClick={() => handleDelete(actor.id)}` con flecha. Sin la flecha (`onClick={handleDelete(actor.id)}`) se ejecuta al renderizar y borra todo.
- No usar `splice`: React solo re-renderiza con un arreglo nuevo.

---

## Errores que ya me pasaron y cómo arreglarlos

| Error | Solución |
|---|---|
| `Module not found: Can't resolve 'react-bootstrap/Card'` | `npm install react-bootstrap bootstrap` y reiniciar `npm run dev` |
| Cartas sin estilo, una debajo de otra | Falta `import "bootstrap/dist/css/bootstrap.min.css"` en `layout.tsx` |
| Fondo negro / texto invisible | Borrar Tailwind y el `@media (prefers-color-scheme: dark)` de `globals.css` |
| `Cannot find module 'react-router-dom'` | No se usa en Next: cambiar por `next/link` y `next/navigation` |
| `Cannot find module '../components/X'` | Revisar ruta y mayúsculas; usar alias `@/app/components/X` |
| `Type annotations can only be used in TypeScript files` | Renombrar `.js` → `.tsx`, o quitar los tipos (`: string`, `<any[]>`) |
| `Property 'rows' does not exist...` en `Form.Control` | No usar `as` dinámico; dos `Form.Control` con ternario |
| Fecha sale un día antes | `toLocaleDateString("es-CO", { timeZone: "UTC" })` |
| `git push`: `src refspec main does not match any` | Falta commit: `git add .` → `git commit -m "..."` → `git push -u origin main` |

## Preguntas típicas de sustentación

- **¿Por qué `"use client"`?** Los componentes del App Router son de servidor por defecto; `useState`/`useEffect` solo funcionan en el cliente.
- **¿Por qué `[]` en `useEffect`?** Para que el fetch se haga una sola vez al montar, no en cada render.
- **¿Qué es un formulario controlado?** El valor del input vive en el estado de React (`value` + `onChange`), no en el DOM.
- **¿Por qué `key`?** Para que React identifique cada elemento de la lista al actualizar.
- **¿Cómo persiste el actor creado?** El POST lo guarda en el backend; la lista lo trae con su GET al montarse.
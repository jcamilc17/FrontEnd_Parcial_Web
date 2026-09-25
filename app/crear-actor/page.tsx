import FormularioActor from "../components/FormularioActor";

export default function CrearActorPage() {
  return (
    <main className="container my-4" style={{ maxWidth: "600px" }}>
      <h1 className="mb-4">Crear Actor</h1>
      <FormularioActor />
    </main>
  );
}
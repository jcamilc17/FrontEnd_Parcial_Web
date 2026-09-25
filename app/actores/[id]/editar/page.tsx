import FormularioActor from "@/app/components/FormularioActor";

export default async function EditarActorPage({ params }: PageProps<"/actores/[id]/editar">) {
  const { id } = await params;

  return (
    <main className="container my-4" style={{ maxWidth: "600px" }}>
      <h1 className="mb-4">Editar Actor</h1>
      <FormularioActor actorId={id} />
    </main>
  );
}
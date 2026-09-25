import FormularioActor from "@/app/components/FormularioActor";

export default async function EditarActorPage({ params }: PageProps<"/actores/[id]/editar">) {
  const { id } = await params;

  return (
    <main className="mx-auto my-6 max-w-[600px] px-4">
      <h1 className="mb-6 text-4xl font-medium">Editar Actor</h1>
      <FormularioActor actorId={id} />
    </main>
  );
}

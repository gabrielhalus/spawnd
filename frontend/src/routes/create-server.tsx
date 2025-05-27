import type { GridSelectOption } from "@/components/ui/grid-select";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-server")({
  component: RouteComponent,
});

async function getServerVersions() {
  const res = await api["server-versions"].$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

function RouteComponent() {
  const { isPending, data, error } = useQuery({
    queryKey: ["get-server-versions"],
    queryFn: getServerVersions,
  });

  if (error) {
    return "An error has occured: " + error.message;
  }

  const parsedData: GridSelectOption[] =
    data?.mojang.map((v) => ({
      label: v.id,
      value: v.id,
      description: "Minecraft " + v.id,
    })) ?? [];

  return (
    <div>
      {isPending ? (
        "loading..."
      ) : (
        <pre>{JSON.stringify(parsedData, null, 2)}</pre>
      )}
    </div>
  );
}

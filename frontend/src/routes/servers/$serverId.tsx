import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/servers/$serverId")({
  component: Server,
});

async function getServer(id: string) {
  const res = await api.servers[":id"].$get({ param: { id } });
  if (!res.ok) {
    throw new Error("Server error");
  }
  return await res.json();
}

function Server() {
  const { serverId } = Route.useParams();

  const { isPending, data, error } = useQuery({
    queryKey: ["get-server", serverId],
    queryFn: ({ queryKey }) => getServer(queryKey[1]),
  });

  if (error) {
    return "An error has occured: " + error.message;
  }

  return <pre>{isPending ? "..." : JSON.stringify(data, null, 2)}</pre>;
}

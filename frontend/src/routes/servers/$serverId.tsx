import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/servers/$serverId")({
  component: Server,
});

async function getServer(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
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

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {isPending ? <Skeleton className="w-40 h-8" /> : data?.server.name}
      </h1>
    </div>
  );
}

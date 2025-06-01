import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ServerCard from "./-components/server-card";

export const Route = createFileRoute("/servers/")({
  component: Servers,
});

async function getAllServers() {
  const res = await api.servers.$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  return await res.json();
}

function Servers() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-all-servers"],
    queryFn: getAllServers,
  });

  if (error) {
    return "An error has occured: " + error.message;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {isPending ? (
        "..."
      ) : (
        <div className="p-4 space-y-4">
          {data.servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      )}
    </div>
  );
}

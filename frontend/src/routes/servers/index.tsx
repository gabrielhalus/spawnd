import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

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
            <Card>
              <CardHeader>
                <CardTitle>{server.name}</CardTitle>
                <CardDescription>
                  {server.type} - {server.version}
                </CardDescription>
                <CardDescription>{server.status}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

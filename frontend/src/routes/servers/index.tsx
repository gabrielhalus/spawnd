import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import ServerCard from "./-components/server-card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/servers/")({
  component: Servers,
});

async function getAllServers() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
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
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="w-40 h-5" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="w-20 h-4" />
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        data.servers.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))
      )}
    </div>
  );
}

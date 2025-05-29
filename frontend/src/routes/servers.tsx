import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/servers")({
  component: Servers,
});

async function getAllServers() {
  const res = await api.servers.$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
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
    <div>
      Hello "/servers"!
      <pre>{isPending ? "..." : JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

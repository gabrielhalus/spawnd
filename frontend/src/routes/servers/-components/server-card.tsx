import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Server } from "@server/shared/servers";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface ServerCardProps {
  server: Server;
}

function ServerCard({ server }: ServerCardProps) {
  const navigate = useNavigate();

  const [status, setStatus] = useState<string | null>(server.status);

  useEffect(() => {
    const ws = new WebSocket(`/ws/server-status?id=${server.id}`);

    ws.onmessage = (event) => {
      setStatus(event.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Card
      className="cursor-pointer hover:shadow-md"
      onClick={() =>
        navigate({ to: "/servers/$serverId", params: { serverId: server.id } })
      }
    >
      <CardHeader>
        <CardTitle>{server.name}</CardTitle>
        <CardDescription>
          {server.id} - {status}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default ServerCard;

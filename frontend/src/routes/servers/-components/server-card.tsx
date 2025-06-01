import type { Server } from "@server/shared/servers";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

interface ServerCardProps {
  server: Server;
}

function ServerCard({ server }: ServerCardProps) {
  const [status, setStatus] = useState<string | null>(server.status);

  useEffect(() => {
    const ws = new WebSocket(`/ws/server-status?id=${server.id}`);

    ws.onopen = () => {
      console.log(`Connected to "server-${server.id}" (${server.name})`);
    };

    ws.onmessage = (event) => {
      console.log("Received message from", server.id, event.data);
      setStatus(event.data);
    };

    ws.onclose = () => {
      console.log(`Disconnected from "server-${server.id}" (${server.name})`);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <Card>
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

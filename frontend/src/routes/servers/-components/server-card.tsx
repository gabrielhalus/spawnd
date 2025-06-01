import type { Server } from "@server/shared/servers";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServerCardProps {
  server: Server;
}

function ServerCard({ server }: ServerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{server.name}</CardTitle>
        <CardDescription>{server.status}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default ServerCard;

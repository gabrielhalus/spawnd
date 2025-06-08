import { Hono } from "hono";

const mockServers = [
  {
    id: "1",
    name: "Survival World",
    status: "online",
    players: { current: 14, max: 20 },
    cpu: 45,
    ram: { used: 6.2, total: 8 },
    uptime: "2d 14h 23m",
    version: "1.21.5",
    ip: "192.168.1.100:25565",
  },
  {
    id: "2",
    name: "Creative Build",
    status: "online",
    players: { current: 3, max: 10 },
    cpu: 12,
    ram: { used: 2.1, total: 4 },
    uptime: "5h 42m",
    version: "1.21.5",
    ip: "192.168.1.101:25565",
  },
  {
    id: "3",
    name: "PvP Arena",
    status: "offline",
    players: { current: 0, max: 16 },
    cpu: 0,
    ram: { used: 0, total: 6 },
    uptime: "0m",
    version: "1.21.5",
    ip: "192.168.1.102:25565",
  },
];

export default new Hono()
  .get("/", c => c.json({ servers: mockServers }));

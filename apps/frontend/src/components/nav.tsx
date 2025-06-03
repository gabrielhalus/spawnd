import { Link } from "@tanstack/react-router";

function Nav() {
  return (
    <div className="flex gap-2 p-2">
      <Link to="/" className="[&.active]:underline">
        Home
      </Link>
      <Link to="/servers" className="[&.active]:underline">
        Servers
      </Link>
      <Link to="/create-server" className="[&.active]:underline">
        Create server
      </Link>
    </div>
  );
}

export { Nav };

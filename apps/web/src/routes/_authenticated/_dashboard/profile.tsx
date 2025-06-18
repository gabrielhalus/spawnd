import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_dashboard/profile")({
  component: Profile,
  loader: () => ({
    crumb: "Profile",
  }),
});

function Profile() {
  return <div>Hello "/_authenticated/_dashboard/profile"!</div>;
}

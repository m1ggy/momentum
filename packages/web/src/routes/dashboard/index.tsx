import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  staticData: { isPublic: false },
});

function RouteComponent() {
  return <div>Hello "/dashboard/"!</div>;
}

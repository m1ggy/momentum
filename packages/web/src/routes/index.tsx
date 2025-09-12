import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  staticData: { isPublic: false },
});

function RouteComponent() {
  return <div>Hello "/"!</div>;
}

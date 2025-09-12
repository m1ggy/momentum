// src/routes/__root.tsx
import { Box } from "@radix-ui/themes";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import type { User } from "firebase/auth";

type RouterCtx = {
  queryClient: QueryClient;
  user: User | null;
};

export const Route = createRootRouteWithContext<RouterCtx>()({
  beforeLoad: ({ context, location, matches }) => {
    console.log({ matches, location, context });
    const isPublic = matches.find((m) => m.id == location.pathname)?.staticData
      ?.isPublic;

    if (!context.user && !isPublic) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    const isAuthPage = !matches.find((m) => m.id == location.pathname)
      ?.staticData.isPublic;
    if (context.user && isAuthPage) {
      throw redirect({ to: "/" });
    }
  },
  component: () => (
    <Box width={"100vw"} height={"100vh"}>
      <Outlet />
    </Box>
  ),
  staticData: { isPublic: true },
});

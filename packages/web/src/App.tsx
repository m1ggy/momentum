// app.tsx
import { Flex, Spinner, Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { auth } from "./lib/firebase";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Create router once
  const router = useMemo(
    () =>
      createRouter({
        routeTree,
        defaultPendingComponent: () => (
          <Flex justify="center" align="center">
            <Spinner />
          </Flex>
        ),
        context: { queryClient, user: null as User | null },
        defaultPreload: "intent",
        defaultPreloadStaleTime: 0,
        scrollRestoration: true,
      }),
    []
  );

  // Keep router context in sync with latest user
  useEffect(() => {
    router.update({
      context: { queryClient, user },
    });
  }, [router, user]);

  if (!authReady) {
    return (
      <Theme accentColor="indigo">
        <Flex justify="center" align="center" style={{ height: "100vh" }}>
          <Spinner />
        </Flex>
      </Theme>
    );
  }

  return (
    <Theme accentColor="indigo" panelBackground="translucent" appearance="dark">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Theme>
  );
}

export default App;

// Augment the router type with the new context shape
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }

  interface StaticDataRouteOption {
    isPublic?: boolean;
  }
}

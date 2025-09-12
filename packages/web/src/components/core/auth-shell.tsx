import { Box, Flex, Spinner } from "@radix-ui/themes";
import { useNavigate } from "@tanstack/react-router";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState, type PropsWithChildren } from "react";
import { auth } from "../../lib/firebase";

function AuthShell({ children }: PropsWithChildren) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (authReady && !user) {
      navigate({ to: "/login", replace: true });
    }
  }, [authReady, user, navigate]);

  if (!authReady) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Box>
          <Spinner />
        </Box>
      </Flex>
    );
  }

  return <>{children}</>;
}

export default AuthShell;

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, RectangleEllipsis } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod/v3";
import bg from "../assets/bg4.png";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type Schema = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  staticData: { isPublic: true },
});

function RouteComponent() {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  return (
    <Box
      height="100vh"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "multiply",
      }}
    >
      <Flex justify="center" align="center" height="100%">
        <Box p="3" maxWidth={"530px"} width={"100%"}>
          <Card>
            <Flex direction="column" gap="2" p="4">
              <Heading size="5">Welcome to Momentum!</Heading>

              <form>
                <Flex direction="column" gap="3">
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <Text size={"2"} weight={"medium"}>
                          Email Address
                        </Text>
                        <TextField.Root placeholder="Email" {...field}>
                          <TextField.Slot>
                            <Mail width={16} height={16} />
                          </TextField.Slot>
                        </TextField.Root>
                      </>
                    )}
                  />
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        <Text size={"2"} weight={"medium"}>
                          Password
                        </Text>
                        <TextField.Root
                          placeholder="Password"
                          type="password"
                          {...field}
                        >
                          <TextField.Slot>
                            <RectangleEllipsis width={16} height={16} />
                          </TextField.Slot>
                        </TextField.Root>
                      </>
                    )}
                  />
                  <Button disabled={!form.formState.isValid}>Login</Button>
                </Flex>
              </form>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
}

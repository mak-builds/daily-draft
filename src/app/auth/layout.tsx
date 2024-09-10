import { createClient } from "@/utils/supabase/server";
import { Flex } from "@chakra-ui/react";
import React from "react";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/admin/dashboard?tab=0");
  }

  return (
    <Flex
      height={"inherit"}
      alignItems={"center"}
      justifyContent={"center"}
      bgColor={"bianca.100"}
    >
      {children}
    </Flex>
  );
}

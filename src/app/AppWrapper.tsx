"use client";
import React, { ReactNode, Suspense } from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";

import theme from "@/themes";
import { Provider } from "react-redux";
import store from "@/redux/store";
import CustomToastComponent from "@/components/Toast";

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback="loading">
      <Provider store={store}>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <CustomToastComponent />
            <Box className="container">{children}</Box>
          </ChakraProvider>
        </CacheProvider>
      </Provider>
    </Suspense>
  );
}

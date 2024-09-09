import { Box, FlexProps, BoxProps, Flex } from "@chakra-ui/react";

interface ContainerProps extends BoxProps, FlexProps {
  children: React.ReactNode;
  containerAs?: "Flex" | "Box";
}

const RWContainer = ({
  children,
  containerAs = "Box",
  ...rest
}: ContainerProps) => {
  return (
    <>
      {containerAs === "Flex" ? (
        <Flex
          height={"inherit"}
          width={"inherit"}
          bgColor={"gray.300"}
          overflow={"hidden"}
          maxH={"inherit"}
          maxW={"inherit"}
          {...rest}
        >
          {children}
        </Flex>
      ) : (
        <Box
          height={"inherit"}
          width={"inherit"}
          bgColor={"gray.300"}
          overflow={"hidden"}
          maxH={"inherit"}
          maxW={"inherit"}
          {...rest}
        >
          {children}
        </Box>
      )}
    </>
  );
};

export default RWContainer;

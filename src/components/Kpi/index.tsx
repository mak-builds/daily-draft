import { Box, Flex, Text } from "@chakra-ui/react";
import { IoStatsChart } from "react-icons/io5";

const KpiComponent = (payload: any) => {
  const getIconComponent = (iconName: string) => {
    return iconName === "IoStatsChart" ? (
      <IoStatsChart style={{ color: "#702F6F" }} size={50} />
    ) : null;
  };

  return (
    <>
      {payload.loading ? (
        <Box className="box-shimmer" height={"126px"}></Box>
      ) : (
        <Flex
          bgColor={"white.900"}
          boxShadow={"rgba(112, 144, 176, 0.08) 1px 1px 10px"}
          p={6}
          borderRadius={"sm"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Flex flexDir={"column"}>
            <Text as={"h6"} color={"gray.600"}>
              {payload.title}
            </Text>
            <Text as={"h3"} fontWeight={"bold"}>
              {payload.value}
            </Text>
            <Flex alignItems={"center"}>
              <Text
                mr={1}
                color={payload.percentage >= 0 ? "green.200" : "red.900"}
              >
                {payload.percentage >= 0 ? "+" : "-"}
                {payload.percentage}%
              </Text>
              <Text as={"h6"} color={"gray.600"}>
                since last month
              </Text>
            </Flex>
          </Flex>
          <Flex>{getIconComponent(payload.icon)}</Flex>
        </Flex>
      )}
    </>
  );
};

export default KpiComponent;

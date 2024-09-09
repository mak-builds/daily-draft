import { getToasters } from "@/redux/SharedSlice";
import { Flex, Text } from "@chakra-ui/react";
import { MdError } from "react-icons/md";
import { useSelector } from "react-redux";

const CustomToastComponent = () => {
  const toast = useSelector(getToasters);

  if (!toast?.length) {
    return <></>;
  }

  const getBackground = (alertStatus: string) => {
    if (alertStatus === "error") return "red";

    return "brand.200";
  };

  const getAlertIcon = (alertStatus: string) => {
    if (alertStatus === "error") return <MdError />;

    return <MdError />;
  };

  return (
    <Flex
      flexDir={"column"}
      gap={4}
      position={"absolute"}
      top={0}
      right={4}
      bottom={"10px"}
      zIndex={"toaster"}
      mt={4}
    >
      {toast.map((data: any, index: number) => {
        return (
          <Flex
            key={index}
            w="75"
            gap={4}
            py="3"
            pl="4"
            pr="8"
            borderRadius="sm"
            color="white.900"
            bgColor={getBackground(data?.status)}
            boxShadow="lg"
            overflowWrap="break-word"
            overflow="hidden"
            flexDir={"column"}
          >
            <Flex alignItems={"center"}>
              {getAlertIcon(data?.status)}

              <Text ml="2" fontSize="sm">
                {data?.message}
              </Text>
            </Flex>
            {/* <div className="progress-bar">
              <div className="progress-bar-fill"></div>
            </div> */}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default CustomToastComponent;

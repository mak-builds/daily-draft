"use client";

import {
  fetchUserDetail,
  fetchUserIntrests,
  fetchUserPersonalityTraits,
  fetchUserSkills,
} from "@/app/actions/UserAction";
import { usersDetailsData } from "@/utils/global";
import { ParseEnum } from "@/utils/helpers/enumParser";
import { Box, Text, Flex, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const UserDetails = ({ params }: any) => {
  const [userData, setUserData] = useState(usersDetailsData);

  useEffect(() => {
    const fetchData = async () => {
      const response = (await fetchUserDetail({ userId: params?.userId })).data;
      setUserData((prevUserData) =>
        prevUserData.map((category) =>
          category.id === "personal_details"
            ? {
                ...category,
                loading: false,
                properties: category.properties?.map((property) => {
                  return {
                    ...property,
                    value: response[property.id],
                  };
                }),
              }
            : category.id === "profile_image"
            ? {
                ...category,
                loading: false,
                value: response["profile_image"],
              }
            : category.id === "bio"
            ? {
                ...category,
                loading: false,
                value: response["bio"],
              }
            : category
        )
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response: any[] = (
        await fetchUserIntrests({ userId: params?.userId })
      ).data;
      setUserData((prevUserData) =>
        prevUserData.map((category) =>
          category.id === "interests"
            ? {
                ...category,
                loading: false,
                properties: response,
              }
            : category
        )
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response: any[] = (
        await fetchUserSkills({ userId: params?.userId })
      ).data;
      setUserData((prevUserData) =>
        prevUserData.map((category) =>
          category.id === "skills"
            ? {
                ...category,
                loading: false,
                properties: response,
              }
            : category
        )
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response: any[] = (
        await fetchUserPersonalityTraits({ userId: params?.userId })
      ).data;
      setUserData((prevUserData) =>
        prevUserData.map((category) =>
          category.id === "personality_traits"
            ? {
                ...category,
                loading: false,
                properties: response,
              }
            : category
        )
      );
    };
    fetchData();
  }, []);

  return (
    <Flex gap={4} flexWrap={"wrap"} flexDir={"column"}>
      <Flex gap={4} width={"100%"} overflow={"hidden"}>
        <Flex width={"500px"}>
          {/* <Image
            src={userData[1].value}
            height={400}
            width={400}
            style={{ borderRadius: "8px" }}
            alt={"User_Image"}
          ></Image> */}
        </Flex>
        <Flex
          width={"100%"}
          flexDir={"column"}
          p={4}
          borderRadius={"md"}
          bgColor={"white.900"}
        >
          <Text as={"h2"} fontWeight={"bold"} mb={4}>
            General Information
          </Text>
          <SimpleGrid columns={{ base: 1, sm: 2, "2xl": 3 }} gap="20px">
            {userData.map((user, index) => {
              return (
                <React.Fragment key={index}>
                  {user.id === "personal_details" &&
                    user.properties?.map((data, index_) => {
                      return (
                        <Flex
                          key={index_}
                          px={4}
                          py={6}
                          flexDir={"column"}
                          boxShadow={"rgb(0 0 0 / 8%) 0px 20px 40px 4px"}
                          borderRadius={"md"}
                        >
                          <Text as={"h5"}>{data.name}</Text>
                          <Text as={"h4"} fontWeight={"bold"}>
                            {data.value || "NA"}
                          </Text>
                        </Flex>
                      );
                    })}
                </React.Fragment>
              );
            })}
          </SimpleGrid>
        </Flex>
      </Flex>
      <SimpleGrid columns={{ base: 1, sm: 2, xl: 3, "2xl": 4 }} gap="20px">
        {userData.map((user, index) => {
          return (
            <React.Fragment key={index}>
              {user.id !== "personal_details" &&
              user.id !== "profile_image" &&
              user.id !== "bio" ? (
                <Box
                  width={"inherit"}
                  bg={"white.900"}
                  p={4}
                  borderRadius={"md"}
                >
                  <Text mb={4} as={"h3"} fontWeight={"bold"}>
                    {user.name}
                  </Text>
                  {user.loading ? (
                    <Flex className="box-shimmer"></Flex>
                  ) : (
                    <Flex flexDir={"row"} gap={2} wrap={"wrap"}>
                      {user.properties?.map((value: any, index) => {
                        return (
                          <Text
                            as={"h5"}
                            fontWeight={"bold"}
                            key={index}
                            border={"1px solid"}
                            borderColor={"gray.500"}
                            width={"fit-content"}
                            px={4}
                            py={1}
                            borderRadius={"sm"}
                          >
                            {value ? ParseEnum(value) : "Null"}
                          </Text>
                        );
                      })}
                    </Flex>
                  )}
                </Box>
              ) : user.id === "bio" ? (
                <Box
                  width={"inherit"}
                  bg={"white.900"}
                  p={4}
                  borderRadius={"md"}
                >
                  <Text mb={4} as={"h3"} fontWeight={"bold"}>
                    {user.name}
                  </Text>
                  {user.loading ? (
                    <Flex className="box-shimmer"></Flex>
                  ) : (
                    <Text as={"h5"}>{user.value}</Text>
                  )}
                </Box>
              ) : (
                <></>
              )}
            </React.Fragment>
          );
        })}
      </SimpleGrid>
    </Flex>
  );
};

export default UserDetails;

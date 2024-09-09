"use client";

import {
  getSelectedTab,
  getSidebarData,
  setSelectedTab,
} from "@/redux/SharedSlice";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { useEffect, useState } from "react";
import {
  MdContactPage,
  MdHome,
  MdInsertInvitation,
  MdPerson,
} from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { RiAdminFill, RiPagesFill } from "react-icons/ri";
import { signOut } from "@/app/actions/authAction";
import { FaFlag } from "react-icons/fa";
import LogoutModal from "@/modals/LogoutModal";

const SideBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispath: AppDispatch = useDispatch();

  const [logoutModal, setLogoutModal] = useState(false);

  const sidebarData = useSelector(getSidebarData);
  const selectedTab = useSelector(getSelectedTab);

  const [accordionIndex, setAccordionIndex] = useState<number[]>(() =>
    searchParams.get("tab") ? [Number(searchParams.get("tab"))] : []
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    const subTab = searchParams.get("subTab");
    const subTabId = searchParams.get("subTabId");
    if (tab) {
      dispath(
        setSelectedTab({
          id: Number(tab),
          subTab: subTab || null,
          subTabId: subTabId !== null ? Number(subTabId) : null,
        })
      );
      setAccordionIndex([Number(tab)]);
    }
  }, []);

  const getIcon = (icon: string, tabId: number, selectedId: number) => {
    return icon === "MdPerson" ? (
      <MdPerson color={tabId === selectedId ? "#702F6F" : "#A3AED0"} />
    ) : icon === "MdHome" ? (
      <MdHome
        height={20}
        width={20}
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : icon === "IoIosPeople" ? (
      <IoIosPeople color={tabId === selectedId ? "#702F6F" : "#A3AED0"} />
    ) : icon === "MdInsertInvitation" ? (
      <MdInsertInvitation
        color={tabId === selectedId ? "#702F6F" : "#A3AED0"}
      />
    ) : icon === "RiAdminFill" ? (
      <RiAdminFill color={tabId === selectedId ? "#702F6F" : "#A3AED0"} />
    ) : icon === "RiPagesFill" ? (
      <RiPagesFill color={tabId === selectedId ? "#702F6F" : "#A3AED0"} />
    ) : icon === "FaFlag" ? (
      <FaFlag color={tabId === selectedId ? "#702F6F" : "#A3AED0"} />
    ) : icon === "MdContactPage" ? (
      <MdContactPage color={tabId === selectedId ? "#702F6F" : "#A3AED0"} />
    ) : (
      <></>
    );
  };

  const handleNavigate = (
    href: string,
    tab: number,
    subTab: string | null,
    subTabId: number | null
  ) => {
    dispath(
      setSelectedTab({
        id: tab,
        subTab: subTab || null,
        subTabId: subTabId !== null ? subTabId : null,
      })
    );
    router.push(href);
  };

  const handleLogOut = () => setLogoutModal(true);

  const handleAccordionChange = (index: number | number[]) => {
    setAccordionIndex(Array.isArray(index) ? index : [index]);
  };

  const handleConfirm = () => {
    signOut();
    setLogoutModal(false);
  };

  return (
    <Flex
      width={"200px"}
      bgColor={"white.900"}
      height={"inherit"}
      flexDir={"column"}
    >
      <Flex
        w={"100%"}
        justifyContent={"space-evenly"}
        borderRight={"1px solid"}
        borderColor={"gray.100"}
        alignItems={"center"}
      >
        <Text
          py={7}
          as={"h3"}
          fontWeight={"bold"}
          textAlign={"center"}
          letterSpacing={".3rem"}
        >
          Daill-Draft
        </Text>
      </Flex>
      <Divider />
      <Flex
        h={"inherit"}
        flexDir={"column"}
        justifyContent={"space-between"}
        p={4}
      >
        <Accordion
          index={accordionIndex}
          variant={"sidebar"}
          allowMultiple
          onChange={handleAccordionChange}
        >
          {sidebarData.map((tab, index) => (
            <AccordionItem key={index}>
              {tab.subTabs?.length > 0 ? (
                <AccordionButton onClick={() => setAccordionIndex([tab.id])}>
                  <Flex alignItems={"center"} flex="1" textAlign="left">
                    <Box mr={2}>
                      {getIcon(tab.icon, tab.id, selectedTab.id)}
                    </Box>
                    <Text
                      as={"h6"}
                      color={tab.id === selectedTab.id ? "" : "gray.600"}
                      fontWeight={tab.id === selectedTab.id ? "bold" : "normal"}
                    >
                      {tab.label}
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              ) : (
                <AccordionButton>
                  <Flex alignItems={"center"} flex="1" textAlign="left">
                    <Box mr={2}>
                      {getIcon(tab.icon, tab.id, selectedTab.id)}
                    </Box>
                    <Text
                      as={"h6"}
                      color={tab.id === selectedTab.id ? "" : "gray.600"}
                      fontWeight={tab.id === selectedTab.id ? "bold" : "normal"}
                      onClick={() =>
                        handleNavigate(tab.href, tab.id, null, null)
                      }
                    >
                      {tab.label}
                    </Text>
                  </Flex>
                </AccordionButton>
              )}
              {tab.subTabs?.length > 0 && (
                <AccordionPanel>
                  {tab.subTabs?.map((subTab, index) => {
                    return (
                      <Text
                        as={"h6"}
                        py={1}
                        cursor={"pointer"}
                        onClick={() =>
                          handleNavigate(
                            subTab.href,
                            tab.id,
                            subTab.label,
                            subTab.id
                          )
                        }
                        key={index}
                        color={
                          tab.id === selectedTab.id &&
                          subTab.id === selectedTab.subTabId
                            ? "brand.200"
                            : "gray.600 "
                        }
                      >
                        {subTab.label}
                      </Text>
                    );
                  })}
                </AccordionPanel>
              )}
            </AccordionItem>
          ))}
        </Accordion>
        <Button color={"red.400"} onClick={handleLogOut}>
          Log out
        </Button>
      </Flex>
      {logoutModal && (
        <LogoutModal
          onClose={() => setLogoutModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </Flex>
  );
};

export default SideBar;

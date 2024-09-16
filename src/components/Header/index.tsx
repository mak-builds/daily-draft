"use client";

import {
  Flex,
  Menu,
  MenuButton,
  Text,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import BreadCrumbComponent from "../Breadcrumb";
import { signOut } from "@/app/actions/authAction";
import { useState } from "react";
import LogoutModal from "@/modals/LogoutModal";

const HeaderComponent = () => {
  const [logoutModal, setLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    signOut();
    setLogoutModal(false);
  };

  const handleLogOut = () => setLogoutModal(true);

  return (
    <Flex
      width={"100%"}
      justifyContent={"space-between"}
      bg={"white.900"}
      p={4}
    >
      <BreadCrumbComponent />
      <Menu variant={"header"}>
        <MenuButton>AP</MenuButton>
        <MenuList>
          <Flex w="100%" mb="0px">
            <Text
              as={"h6"}
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              fontWeight="700"
            >
              👋&nbsp; Hey, Admin wassup
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem color="red.400" onClick={handleLogOut}>
              <Text as={"h6"}>Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
      {logoutModal && (
        <LogoutModal
          onClose={() => setLogoutModal(false)}
          onConfirm={handleConfirmLogout}
        />
      )}
    </Flex>
  );
};

export default HeaderComponent;

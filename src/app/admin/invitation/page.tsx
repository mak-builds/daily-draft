"use client";

import {
  fetchInvitation,
  fetchInvitationCount,
} from "@/app/actions/InvitationAction";
import TableComponent from "@/components/Table";
import InviteModal from "@/modals/InviteModal";
import { Header } from "@/types/table";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const headers: Header = {
  name: "Invitations",
  hasFilters: true,
  filters: [
    {
      id: "email",
      columnName: "Email ID",
      columnType: "String",
    },
    {
      id: "is_used",
      columnName: "Is Used",
      columnType: "Enum",
      columnItem: [
        { id: "true", name: "True" },
        { id: "false", name: "False" },
      ],
    },
    {
      id: "invited_by",
      columnName: "Invited BY",
      columnType: "Enum",
      columnItem: [
        { id: "admin", name: "Admin" },
        { id: "user", name: "User" },
      ],
    },
  ],
  properties: [
    { id: "index", columnName: "S.No", type: "Index" },
    { id: "email", columnName: "Email ID", type: "String", shouldSort: true },
    { id: "referral_code", columnName: "Referral Code", type: "String" },
    { id: "is_used", columnName: "Is Used", type: "Boolean" },
    { id: "invited_by", columnName: "Invited By", type: "String" },
    { id: "used_at", columnName: "Used At", type: "Date" },
    { id: "created_at", columnName: "Date of joining", type: "Date" },
  ],
};

const UsersPage = () => {
  const [inviteModal, setInviteModal] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const fetchTableData = async (payload: any) => {
    return (await fetchInvitation(payload)).data || [];
  };

  const fetchTableCount = async (payload: any) => {
    return (await fetchInvitationCount(payload)).count || 0;
  };

  const handleCreateClick = async () => {
    setInviteModal(true);
  };

  const handleInviteSuccess = () => {
    setInviteModal(false);
    setRefetchTrigger(true);
  };

  return (
    <Flex flexDir={"column"} maxH={"inherit"} height={"inherit"}>
      <TableComponent
        headers={headers}
        fetchTableData={fetchTableData}
        fetchTableCount={fetchTableCount}
        refetchStatus={refetchTrigger}
        refetchData={() => setRefetchTrigger(false)}
        addlRightButton={
          <Button
            alignItems={"center"}
            variant={"create_button"}
            onClick={handleCreateClick}
          >
            <FaPlus size={15} />
            <Text as={"h5"} ml={2}>
              Invite New User
            </Text>
          </Button>
        }
      />
      {inviteModal && (
        <InviteModal
          onClose={() => setInviteModal(false)}
          onSuccess={handleInviteSuccess}
        />
      )}
    </Flex>
  );
};

export default UsersPage;

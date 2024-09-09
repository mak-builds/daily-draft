"use client";

import {
  DeleteCommunity,
  fetchCommunityPosts,
  fetchCommunityPostsCount,
  fetchFollowersKPI,
} from "@/app/actions/communityAction";
import KpiComponent from "@/components/Kpi";
import TableComponent from "@/components/Table";
import ConfirmationModal from "@/modals/ConfirmationModal";
import PostsModal from "@/modals/CommunityPostsModal";
import { Header } from "@/types/table";
import { communityKpi } from "@/utils/global";
import { Button, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

const headers: Header = {
  name: "Reports",
  hasFilters: true,
  filters: [
    { id: "user_id.username", columnName: "Posted BY", columnType: "String" },
    {
      id: "community_id.name",
      columnName: "Community",
      columnType: "String",
    },
    {
      id: "status",
      columnName: "Status",
      columnType: "Enum",
      columnItem: [
        { id: "active", name: "Active" },
        { id: "inactive", name: "Inactive" },
        { id: "pending", name: "Pending" },
      ],
    },
  ],
  properties: [
    { id: "index", columnName: "S.No", type: "Index" },
    { id: "title", columnName: "Title", type: "String" },
    { id: "username", columnName: "Posted By", type: "String" },
    { id: "interestsName", columnName: "Inetrest", type: "String" },
    { id: "communityName", columnName: "Community", type: "String" },
    { id: "status", columnName: "Status", type: "Status" },
    { id: "created_at", columnName: "Date of joining", type: "Date" },
    {
      id: "action",
      columnName: "Action",
      actionValue: "status",
      type: "Action",
      actionData: [
        { id: "edit", name: "Edit" },
        { id: "delete", name: "Delete" },
      ],
    },
  ],
};

const CommunityDetails = ({ params }: any) => {
  const [kpiData, setKpiData] = useState(communityKpi);
  const [confirmationModal, setConfirmationModal]: any = useState({
    status: false,
    data: {},
  });
  const [showCommunityModal, setShowCommunityModal] = useState({
    status: false,
    editData: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchFollowersKPI(params?.communityId);
      setKpiData((prevUserData) =>
        prevUserData.map((kpi) =>
          kpi.id === 1
            ? {
                ...kpi,
                loading: false,
                value: response.data?.currentMonth || 0,
                percentage: response.data?.change || 0,
              }
            : kpi
        )
      );
    };
    fetchData();
  }, []);

  const fetchTableCount = async (payload: any) => {
    return (
      (await fetchCommunityPostsCount({ ...payload, id: params?.communityIds }))
        .count || 0
    );
  };

  const fetchTableData = async (payload: any) => {
    return (
      (
        await fetchCommunityPosts({
          ...payload,
          communityId: params?.communityId,
        })
      ).data || []
    );
  };

  const handleActionChange = async (actionId: string, data: any) => {
    if (actionId === "edit") {
      setShowCommunityModal({ status: true, editData: data });
    } else if (actionId === "delete") {
      setConfirmationModal({ status: true, data });
    }
  };

  const handleConfirm = async () => {
    setConfirmationModal({ status: false, data: {} });
    await DeleteCommunity({ id: confirmationModal.data?.id });
  };

  const handleConfirmationClose = () => {
    setConfirmationModal({ status: false, data: {} });
  };

  return (
    <Flex flexDir={"column"} maxH={"inherit"} height={"inherit"}>
      <SimpleGrid width={"100%"} columns={{ base: 4 }} gap="20px" mb="20px">
        {kpiData.map((kpi) => (
          <KpiComponent key={kpi.id} {...kpi} />
        ))}
      </SimpleGrid>
      <TableComponent
        hasKpis
        headers={headers}
        fetchTableData={fetchTableData}
        fetchTableCount={fetchTableCount}
        handleActionChange={handleActionChange}
        addlRightButton={
          <Button
            alignItems={"center"}
            variant={"create_button"}
            onClick={() =>
              setShowCommunityModal({ editData: {}, status: true })
            }
          >
            <FaPlus size={15} />
            <Text ml={2}>Create</Text>
          </Button>
        }
      />
      {showCommunityModal.status && (
        <PostsModal
          editData={showCommunityModal.editData}
          onClose={() => setShowCommunityModal({ editData: {}, status: false })}
        />
      )}
      {confirmationModal.status && (
        <ConfirmationModal
          onConfirm={handleConfirm}
          onClose={handleConfirmationClose}
        />
      )}
    </Flex>
  );
};

export default CommunityDetails;

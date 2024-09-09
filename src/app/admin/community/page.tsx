"use client";

import {
  DeleteCommunity,
  fetchCommunities,
  fetchCommunitiesCount,
} from "@/app/actions/communityAction";
import TableComponent from "@/components/Table";
import CommunityModal from "@/modals/CommunityModal";
import ConfirmationModal from "@/modals/ConfirmationModal";
import { setSelectedTab } from "@/redux/SharedSlice";
import { Header } from "@/types/table";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";

const headers: Header = {
  name: "Reports",
  hasFilters: true,
  filters: [
    { id: "name", columnName: "Community Name", columnType: "String" },
    {
      id: "created_by",
      columnName: "Created BY",
      columnType: "Enum",
      columnItem: [
        { id: "admin", name: "Admin" },
        { id: "user", name: "User" },
      ],
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
    { id: "name", columnName: "Community Name", type: "String" },
    { id: "interestsName", columnName: "Interests", type: "Number" },
    { id: "created_by", columnName: "Created By", type: "String" },
    { id: "follower_count", columnName: "Followers", type: "Number" },
    { id: "created_at", columnName: "Date of joining", type: "Date" },
    { id: "status", columnName: "Status", type: "Status" },
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

const Communities = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [confirmationModal, setConfirmationModal]: any = useState({
    status: false,
    data: {},
  });
  const [showCommunityModal, setShowCommunityModal] = useState({
    status: false,
    editData: {},
  });

  const fetchTableCount = async (payload: any) => {
    return (await fetchCommunitiesCount(payload)).count || 0;
  };

  const fetchTableData = async (payload: any) => {
    return (await fetchCommunities(payload)).data || [];
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
    setRefetchTrigger(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationModal({ status: false, data: {} });
  };

  const handleRowClick = (data: any) => {
    dispatch(setSelectedTab({ id: 3, subTab: "Details", subTabId: null }));
    router.push(`/admin/community/details/${data.id}?tab=3&subTab=Details`);
  };

  const handleSuccess = () => {
    setShowCommunityModal({ editData: {}, status: false });
    setRefetchTrigger(true);
  };

  return (
    <div>
      <TableComponent
        isClickable
        headers={headers}
        handleClick={handleRowClick}
        fetchTableData={fetchTableData}
        fetchTableCount={fetchTableCount}
        handleActionChange={handleActionChange}
        refetchStatus={refetchTrigger}
        refetchData={() => setRefetchTrigger(false)}
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
        <CommunityModal
          editData={showCommunityModal.editData}
          onSuccess={handleSuccess}
          onClose={() => setShowCommunityModal({ editData: {}, status: false })}
        />
      )}
      {confirmationModal.status && (
        <ConfirmationModal
          onConfirm={handleConfirm}
          onClose={handleConfirmationClose}
        />
      )}
    </div>
  );
};

export default Communities;

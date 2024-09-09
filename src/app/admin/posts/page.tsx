"use client";

import {
  deletePost,
  fetchPosts,
  fetchPostsCount,
} from "@/app/actions/PostsAction";
import TableComponent from "@/components/Table";
import ConfirmationModal from "@/modals/ConfirmationModal";
import PostsModal from "@/modals/PostsModal";
import { Header } from "@/types/table";
import { Button, Text } from "@chakra-ui/react";
import { useState } from "react";
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
    {
      id: "post_by",
      columnName: "Posted By Type",
      columnType: "Enum",
      columnItem: [
        { id: "admin", name: "Admin" },
        { id: "user", name: "User" },
      ],
    },
  ],
  properties: [
    { id: "index", columnName: "S.No", type: "Index" },
    { id: "title", columnName: "Title", type: "String" },
    { id: "username", columnName: "Posted By", type: "String" },
    { id: "interestsName", columnName: "Inetrest", type: "String" },
    { id: "communityName", columnName: "Community", type: "String" },
    { id: "post_by", columnName: "Post BY Type", type: "String" },
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

const PostsPage = () => {
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
    return (await fetchPostsCount(payload)).count || 0;
  };

  const fetchTableData = async (payload: any) => {
    return (await fetchPosts(payload)).data || [];
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
    await deletePost({ postId: confirmationModal.data?.id });
    setRefetchTrigger(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationModal({ status: false, data: {} });
  };

  const handleCommunityModalSuccess = () => {
    setShowCommunityModal({ status: false, editData: {} });
    setRefetchTrigger(true);
  };

  return (
    <>
      <TableComponent
        headers={headers}
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
        <PostsModal
          editData={showCommunityModal.editData}
          onSuccess={handleCommunityModalSuccess}
          onClose={() => setShowCommunityModal({ editData: {}, status: false })}
        />
      )}
      {confirmationModal.status && (
        <ConfirmationModal
          onConfirm={handleConfirm}
          onClose={handleConfirmationClose}
        />
      )}
    </>
  );
};

export default PostsPage;

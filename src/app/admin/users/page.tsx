"use client";

import { fetchFollowersKPI } from "@/app/actions/communityAction";
import {
  hardDeleteUsers,
  fetchAllUsers,
  fetchUsers,
  fetchUsersCount,
  handleUserStatus,
  softDeleteUsers,
} from "@/app/actions/UserAction";
import KpiComponent from "@/components/Kpi";
import TableComponent from "@/components/Table";
import ConfirmationModal from "@/modals/ConfirmationModal";
import { setSelectedTab, showToastWithTimeout } from "@/redux/SharedSlice";
import { Header } from "@/types/table";
import { communityKpi } from "@/utils/global";
import { AppDispatch } from "@/utils/helpers/globalHelper";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const headers: Header = {
  name: "Reports",
  hasFilters: true,
  hasDelete: true,
  filters: [
    { id: "username", columnName: "Name", columnType: "String" },
    { id: "email_id", columnName: "Email ID", columnType: "String" },
    {
      id: "age_group",
      columnName: "Age Group",
      columnType: "Enum",
      columnItem: [
        { id: "eighteen_to_thirty", name: "18-30" },
        { id: "thirty_one_to_fourty_five", name: "31-45" },
        { id: "fourty_six_to_sixty", name: "45-60" },
        { id: "sixty_plus", name: "60+" },
      ],
    },
    {
      id: "status",
      columnName: "Status",
      columnType: "Enum",
      columnItem: [
        { id: "active", name: "Active" },
        { id: "pending", name: "Pending" },
        { id: "inactive", name: "Inactive" },
        { id: "suspended", name: "Suspended" },
        { id: "soft_delete", name: "Soft Delete" },
      ],
    },
  ],
  properties: [
    { id: "delete", columnName: "Select", type: "Delete" },
    { id: "index", columnName: "S.No", type: "Index" },
    { id: "username", columnName: "Name", type: "String", shouldSort: true },
    {
      id: "email_id",
      columnName: "Email ID",
      type: "String",
      shouldSort: true,
    },
    { id: "age_group", columnName: "Age Group", type: "String" },
    { id: "profession", columnName: "Profession", type: "String" },
    { id: "created_at", columnName: "Date of joining", type: "Date" },
    {
      id: "menu",
      columnName: "Status",
      actionValue: "status",
      type: "Menu",
      menuData: [
        { id: "active", name: "Active" },
        { id: "pending", name: "Pending" },
        { id: "inactive", name: "Inactive" },
        { id: "suspended", name: "Suspended" },
        { id: "soft_delete", name: "Soft Delete" },
      ],
    },
  ],
};

const UsersPage = ({ params }: any) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const [kpiData, setKpiData] = useState(communityKpi);
  const [confirmationModal, setConfirmationModal]: any = useState({
    status: false,
    data: {},
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
    return (await fetchUsersCount(payload)).count || 0;
  };

  const fetchTableData = async (payload: any) => {
    return (await fetchUsers(payload)).data || [];
  };

  const fetchAllData = async () => {
    return (await fetchAllUsers()).data || [];
  };

  const handleConfirm = async () => {
    setConfirmationModal({ status: false, data: {} });
    // await DeleteCommunity({ id: confirmationModal.data?.id });
  };

  const handleConfirmationClose = () => {
    setConfirmationModal({ status: false, data: {} });
  };

  const handleMenuChange = async (actionId: string, data: any) => {
    const payload = { action: data, actionId };
    const response = await handleUserStatus(payload);
    if (response.success) return { shouldRefetch: true };
  };

  const handleRowClick = (data: any) => {
    dispatch(setSelectedTab({ id: 1, subTab: "Details", subTabId: null }));
    router.push(`/admin/users/details/${data.id}?tab=1&subTab=Details`);
  };

  const handleSoftDelete = async (users: any) => {
    dispatch(
      showToastWithTimeout({
        message: "It might take some time to delete the users",
        status: "success",
      })
    );
    const response = await softDeleteUsers({ users });
    if (response.success) {
      dispatch(
        showToastWithTimeout({
          message: "Users deleted successfully",
          status: "success",
        })
      );
    } else {
      dispatch(
        showToastWithTimeout({
          message: response.error,
          status: "error",
        })
      );
    }
    return { shouldRefetch: true };
  };

  const handleHardDelete = async (users: any) => {
    dispatch(
      showToastWithTimeout({
        message: "It might take some time to delete the users",
        status: "success",
      })
    );
    const response = await hardDeleteUsers({ users });
    if (response.success) {
      dispatch(
        showToastWithTimeout({
          message: "Users deleted successfully",
          status: "success",
        })
      );
    } else {
      dispatch(
        showToastWithTimeout({
          message: response.error,
          status: "error",
        })
      );
    }
    return { shouldRefetch: true };
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
        isClickable
        headers={headers}
        handleMenuChange={handleMenuChange}
        handleClick={handleRowClick}
        fetchTableData={fetchTableData}
        fetchTableCount={fetchTableCount}
        handleHardDelete={handleHardDelete}
        handleSoftDelete={handleSoftDelete}
        fetchAllData={fetchAllData}
      />
      {confirmationModal.status && (
        <ConfirmationModal
          onConfirm={handleConfirm}
          onClose={handleConfirmationClose}
        />
      )}
    </Flex>
  );
};

export default UsersPage;

"use client";

import {
  fetchUsersReport,
  fetchUsersReportCount,
  handleUsersReportStatus,
} from "@/app/actions/ReportAction";
import TableComponent from "@/components/Table";
import { Header } from "@/types/table";
import { Flex } from "@chakra-ui/react";

const headers: Header = {
  name: "Users Reports",
  hasFilters: true,
  filters: [
    {
      id: "user_id.username",
      columnName: "Reportee Name",
      columnType: "String",
    },
    {
      id: "user_id.email_id",
      columnName: "Reportee Email",
      columnType: "String",
    },
    {
      id: "reported_user_id.username",
      columnName: "Reporter Name",
      columnType: "String",
    },
    {
      id: "reported_user_id.email_id",
      columnName: "Reporter Email",
      columnType: "String",
    },
    {
      id: "report_status",
      columnName: "Report Status",
      columnType: "Enum",
      columnItem: [
        { id: "accepted", name: "Accepted" },
        { id: "rejected", name: "Rejected" },
        { id: "pending", name: "Pending" },
      ],
    },
  ],
  properties: [
    { id: "index", columnName: "S.No", type: "Index" },
    { id: "reportee_name", columnName: "Reportee Name", type: "String" },
    { id: "reportee_email", columnName: "Reportee Email", type: "String" },
    { id: "reporter_username", columnName: "Reporter Name", type: "String" },
    { id: "reporter_email", columnName: "Reporter Email", type: "String" },
    { id: "report_reason", columnName: "Reason For Report", type: "String" },
    { id: "created_at", columnName: "Reported Date", type: "Date" },
    {
      id: "menu",
      columnName: "Status",
      actionValue: "report_status",
      type: "Menu",
      menuData: [
        { id: "accepted", name: "Accepted" },
        { id: "rejected", name: "Rejected" },
        { id: "pending", name: "Pending" },
      ],
    },
  ],
};

const UsersReport = () => {
  const fetchTableCount = async (payload: any) => {
    return (await fetchUsersReportCount(payload)).count || 0;
  };

  const fetchTableData = async (payload: any) => {
    return (await fetchUsersReport(payload)).data || [];
  };

  const handleMenuChange = async (actionId: string, data: any) => {
    const payload = { action: data, actionId };
    const response = await handleUsersReportStatus(payload);
    if (response.success) return { shouldRefetch: true };
  };

  return (
    <Flex flexDir={"column"} maxH={"inherit"} height={"inherit"}>
      <TableComponent
        headers={headers}
        handleMenuChange={handleMenuChange}
        fetchTableCount={fetchTableCount}
        fetchTableData={fetchTableData}
      />
    </Flex>
  );
};

export default UsersReport;

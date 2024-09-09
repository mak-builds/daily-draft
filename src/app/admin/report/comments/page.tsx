"use client";

import {
  fetchCommentsReport,
  fetchCommentsReportCount,
  handleCommentsReportStatus,
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
    { id: "post_title", columnName: "Post Title", type: "String" },
    { id: "comment", columnName: "Comment", type: "String" },
    { id: "reportee_name", columnName: "Reportee Name", type: "String" },
    { id: "reportee_email", columnName: "Reportee Email", type: "String" },
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

const CommentsReport = () => {
  const fetchTableCount = async (payload: any) => {
    return (await fetchCommentsReportCount(payload)).count || 0;
  };

  const fetchTableData = async (payload: any) => {
    return (await fetchCommentsReport(payload)).data || [];
  };

  const handleMenuChange = async (actionId: string, data: any) => {
    const payload = { action: data, actionId };
    const response = await handleCommentsReportStatus(payload);
    if (response.success) return { shouldRefetch: true };
  };

  return (
    <Flex flexDir={"column"} maxH={"inherit"} height={"inherit"}>
      <TableComponent
        headers={headers}
        handleMenuChange={handleMenuChange}
        fetchTableData={fetchTableData}
        fetchTableCount={fetchTableCount}
      />
    </Flex>
  );
};

export default CommentsReport;

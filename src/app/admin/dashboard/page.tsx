"use client";

import { fetchUsers, fetchUsersCount } from "@/app/actions/dashboardAction";
import TableComponent from "@/components/Table";
import { Header } from "@/types/table";

const headers: Header = {
  name: "Reports",
  hasFilters: false,
  properties: [
    { id: "index", columnName: "S.No", type: "Index" },
    { id: "username", columnName: "User Name", type: "String" },
    { id: "email_id", columnName: "Email", type: "String" },
    { id: "country", columnName: "Country", type: "String" },
    { id: "age_group", columnName: "Age Group", type: "String" },
    { id: "profession", columnName: "Profession", type: "String" },
    { id: "created_at", columnName: "Date of joining", type: "Date" },
    { id: "status", columnName: "Status", type: "Status" },
  ],
};

const Dashboard = () => {
  const fetchTableCount = async (payload: any) => {
    return (await fetchUsersCount(payload)).count || 0;
  };

  const fetchTableData = async (payload: any) =>
    (await fetchUsers(payload)).data || [];

  return (
    <TableComponent
      headers={headers}
      fetchTableData={fetchTableData}
      fetchTableCount={fetchTableCount}
    />
  );
};

export default Dashboard;

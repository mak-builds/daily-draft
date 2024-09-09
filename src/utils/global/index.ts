export const getStatusBGColor = (status: string) => {
  return status === "active"
    ? "green.100"
    : status === "inactive"
    ? "red.100"
    : "yellow.100";
};

export const communityKpi = [
  {
    id: 1,
    title: "Followers",
    value: 60,
    percentage: 0,
    icon: "IoStatsChart",
    loading: true,
  },
  {
    id: 2,
    title: "Spendings",
    value: 60,
    percentage: 0,
    icon: "IoStatsChart",
    loading: false,
  },
  {
    id: 3,
    title: "Spendings",
    value: 60,
    percentage: 0,
    icon: "IoStatsChart",
    loading: false,
  },
  {
    id: 4,
    title: "Spendings",
    value: 60,
    percentage: 0,
    icon: "IoStatsChart",
    loading: false,
  },
];

export const usersDetailsData = [
  {
    id: "personal_details",
    name: "General Information",
    properties: [
      { id: "firstname", name: "First Name", value: "" },
      { id: "lastname", name: "Last Name", value: "" },
      { id: "email_id", name: "Email", value: "" },
      { id: "profession", name: "Profession", value: "" },
      { id: "country", name: "Country", value: "" },
      { id: "created_at", name: "Join date", value: "" },
    ],
    value: "",
    loading: true,
  },
  {
    id: "profile_image",
    name: "Image",
    value: "",
    loading: true,
  },
  {
    id: "bio",
    name: "Bio",
    value: "",
    loading: true,
  },
  {
    id: "interests",
    name: "Interests",
    properties: [],
    value: "",
    loading: true,
  },
  {
    id: "skills",
    name: "Skills",
    properties: [],
    value: "",
    loading: true,
  },
  {
    id: "personality_traits",
    name: "Personality Traits",
    properties: [],
    value: "",
    loading: true,
  },
];

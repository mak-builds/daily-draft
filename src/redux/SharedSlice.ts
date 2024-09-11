import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const sidebarTabs = [
  {
    id: 0,
    label: "Dashboard",
    icon: "MdHome",
    href: "/admin/dashboard?tab=0",
  },
  {
    id: 1,
    label: "Users",
    icon: "MdPerson",
    href: "/admin/users?tab=1",
  },
  {
    id: 2,
    label: "Invitations",
    icon: "MdInsertInvitation",
    href: "/admin/invitation?tab=2",
  },
  {
    id: 3,
    label: "Communities",
    icon: "IoIosPeople",
    href: "/admin/community?tab=3",
  },
  {
    id: 4,
    label: "Posts",
    icon: "RiPagesFill",
    href: "/admin/posts?tab=4",
  },
  {
    id: 5,
    label: "Report",
    icon: "FaFlag",
    href: "/admin/report?tab=5",
    subTabs: [
      {
        id: 0,
        label: "Posts",
        href: "/admin/report/posts?tab=5&subTab=Posts&subTabId=0",
      },
      {
        id: 1,
        label: "Users",
        href: "/admin/report/users?tab=5&subTab=Users&subTabId=1",
      },
      {
        id: 2,
        label: "Comments",
        href: "/admin/report/comments?tab=5&subTab=Comments&subTabId=2",
      },
    ],
  },
  {
    id: 6,
    label: "Content",
    icon: "MdContactPage",
    href: "/admin/content?tab=6",
    subTabs: [
      {
        id: 0,
        label: "Terms and Condition",
        href: "/admin/content/terms-condition?tab=6&subTabId=0",
      },
      {
        id: 1,
        label: "Privacy Policy",
        href: "/admin/content/privacy-policy?tab=6&subTabId=1",
      },
    ],
  },
  {
    id: 7,
    label: "Draft",
    icon: "MdContactPage",
    href: "/admin/draft?tab=7",
  },
];

interface SidebarTab {
  id: number;
  label: string;
  icon: string;
  href: string;
  subTabs: {
    id: number;
    label: string;
    href: string;
  }[];
}

interface SharedSliceState {
  toast: Toast[];
  sidebarData: SidebarTab[];
  backButton: {
    status: boolean;
    url: string;
  };
  selectedTab: {
    id: number;
    subTab?: string;
    subTabId?: number;
  };
}

interface sharedSliceInterface {
  sharedSlice: SharedSliceState;
}

interface Toast {
  id: any;
  message: string;
  status: "success" | "error";
}

const initialState = {
  toast: [] as Toast[],
  sidebarData: sidebarTabs,
  backButton: false,
  selectedTab: {
    id: 0,
    subTab: null,
    subTabId: null,
  },
};

export const showToastWithTimeout = createAsyncThunk(
  "sharedSlice/showToastWithTimeout",
  async ({ message, status }: any, thunkAPI) => {
    const id = Date.now().toString();
    thunkAPI.dispatch(sharedSlice.actions.showToast({ message, status, id }));
    setTimeout(() => {
      thunkAPI.dispatch(sharedSlice.actions.hideToast(id));
    }, 3000);
  }
);

const sharedSlice = createSlice({
  name: "sharedSlice",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast.push({
        id: action.payload.id,
        message: action.payload.message,
        status: action.payload.status,
      });
    },
    hideToast: (state, action) => {
      state.toast = state.toast.filter((toast: any) => {
        return toast.id !== action.payload;
      });
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    toggleBackButton: (state, action) => {
      state.backButton = action.payload;
    },
  },
});

export const { setSelectedTab, showToast, toggleBackButton } =
  sharedSlice.actions;

export const getSidebarData = (state: sharedSliceInterface) =>
  state.sharedSlice.sidebarData;
export const getSelectedTab = (state: sharedSliceInterface) =>
  state.sharedSlice.selectedTab;
export const getToasters = (state: sharedSliceInterface) =>
  state.sharedSlice.toast;
export const getBackButtonStatus = (state: sharedSliceInterface) =>
  state.sharedSlice.backButton;

export default sharedSlice.reducer;

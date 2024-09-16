import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const sidebarTabs = [
  {
    id: 0,
    label: "Content",
    icon: "MdContactPage",
    href: "/admin/content?tab=0",
    subTabs: [
      {
        id: 0,
        label: "Terms and Condition",
        href: "/admin/content/terms-condition?tab=0&subTabId=0",
      },
      {
        id: 1,
        label: "Privacy Policy",
        href: "/admin/content/privacy-policy?tab=0&subTabId=1",
      },
    ],
  },
  {
    id: 1,
    label: "Draft",
    icon: "MdContactPage",
    href: "/admin/draft?tab=1",
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

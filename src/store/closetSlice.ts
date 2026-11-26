import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Closet from "../interfaces/uniform/Closet.types";
import ClosetSummary from "../interfaces/DTOs/ClosetSummary.types";

interface ClosetSlice {
  isLoadingClosetSlice: boolean;
  dataListClosetSlice: Closet[];
  closetDataOptions: ClosetSummary[];
  closetUpdated: boolean;
  errorMessageClosetSlice?: string | undefined;
}

const initialState: ClosetSlice = {
  isLoadingClosetSlice: false,
  dataListClosetSlice: [],
  closetDataOptions: [],
  closetUpdated: false,
  errorMessageClosetSlice: undefined,
};

export const closetSlice = createSlice({
  name: "closet",
  initialState,
  reducers: {
    onLoadingClosetSlice: (state) => {
      state.isLoadingClosetSlice = true;
      state.closetUpdated = false;
      state.errorMessageClosetSlice = undefined;
    },

    onSetDataListClosetSlice: (state, action: PayloadAction<Closet[]>) => {
      state.isLoadingClosetSlice = false;
      state.dataListClosetSlice = action.payload;
      state.errorMessageClosetSlice = undefined;
    },

    onSetClosetUpdated: (state, action: PayloadAction<boolean>) => {
      state.isLoadingClosetSlice = false;
      state.closetUpdated = action.payload;
      state.errorMessageClosetSlice = undefined;
    },

    onSetclosetDataOptions: (state, action: PayloadAction<ClosetSummary[]>) => {
      state.isLoadingClosetSlice = false;
      state.closetDataOptions = action.payload;
      state.errorMessageClosetSlice = undefined;
    },

    onErrorMessageClosetSlice: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.isLoadingClosetSlice = false;
      state.closetUpdated = false;
      state.errorMessageClosetSlice = action.payload;
    },

    onResetClosetSlice: (state) => {
      state.closetUpdated = false;
    },
  },
});

export const {
  onLoadingClosetSlice,
  onSetDataListClosetSlice,
  onSetClosetUpdated,
  onSetclosetDataOptions,
  onErrorMessageClosetSlice,
  onResetClosetSlice,
} = closetSlice.actions;
export default closetSlice.reducer;

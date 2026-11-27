import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import MemberDTO from "../interfaces/MemberDTO";
import UniformOrder from "../interfaces/uniform/UniformOrder.types";

type OrderSliceDataList = {
  ok: boolean;
  member: MemberDTO;
  data: UniformOrder[];
};

interface OrderSlice {
  isLoadingOrderSlice: boolean;
  dataListOrderSlice?: OrderSliceDataList | null;
  orderCreated: boolean;
  errorMessageOrderSlice?: string | undefined;
}

const initialState: OrderSlice = {
  isLoadingOrderSlice: false,
  dataListOrderSlice: null,
  orderCreated: false,
  errorMessageOrderSlice: undefined,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    onLoadingOrderSlice: (state) => {
      state.isLoadingOrderSlice = true;
      state.errorMessageOrderSlice = undefined;
    },

    onSetDataListOrderSlice: (
      state,
      action: PayloadAction<OrderSliceDataList | undefined>,
    ) => {
      state.isLoadingOrderSlice = false;
      state.dataListOrderSlice = action.payload;
      state.errorMessageOrderSlice = undefined;
    },

    onSetOrderCreated: (state, action: PayloadAction<boolean>) => {
      state.isLoadingOrderSlice = false;
      state.orderCreated = action.payload;
      state.errorMessageOrderSlice = undefined;
    },

    onErrorOrderSlice: (state, action: PayloadAction<string | undefined>) => {
      state.isLoadingOrderSlice = false;
      state.errorMessageOrderSlice = action.payload;
    },

    onResetSave: (state) => {
      state.isLoadingOrderSlice = false;
      state.orderCreated = false;
    },
  },
});

export const {
  onLoadingOrderSlice,
  onSetDataListOrderSlice,
  onSetOrderCreated,
  onErrorOrderSlice,
  onResetSave,
} = orderSlice.actions;
export default orderSlice.reducer;

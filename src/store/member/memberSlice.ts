import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import MemberDTO from "../../interfaces/MemberDTO";

interface MemberSlice {
    isLoadingMemberSlice: boolean;
    memberDataList: MemberDTO[];
    errorMemberSliceMessage?: string;
}

const initialState: MemberSlice = {
    isLoadingMemberSlice: false,
    memberDataList: [],
    errorMemberSliceMessage: undefined
}

export const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {
        onLoadingMemberSlice: (state) => {
            state.isLoadingMemberSlice = true;
            state.errorMemberSliceMessage = undefined;
        },

        onSetMemberDataList: (state, action: PayloadAction<MemberDTO[]>) => {
            state.isLoadingMemberSlice = false;
            state.memberDataList = action.payload,
                state.errorMemberSliceMessage = undefined
        },

        onSetErrorMemberSlice: (state, action: PayloadAction<string>) => {
            state.isLoadingMemberSlice = false;
            state.memberDataList = [];
            state.errorMemberSliceMessage = action.payload;
        }
    }
});

export const {
    onLoadingMemberSlice,
    onSetErrorMemberSlice,
    onSetMemberDataList
} = memberSlice.actions;
export default memberSlice.reducer;
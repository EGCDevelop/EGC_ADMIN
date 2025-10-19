import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import MemberDTO from "../../interfaces/MemberDTO";

interface MemberSlice {
    isLoadingMemberSlice: boolean;
    memberDataList: MemberDTO[];
    lastCreate?: boolean;
    errorMemberSliceMessage?: string;
}

const initialState: MemberSlice = {
    isLoadingMemberSlice: false,
    memberDataList: [],
    lastCreate: false,
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
                state.errorMemberSliceMessage = undefined;
            state.lastCreate = false;
        },

        onCreateMember: (state, action: PayloadAction<boolean>) => {
            state.isLoadingMemberSlice = false;
            state.lastCreate = action.payload;
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
    onSetMemberDataList,
    onCreateMember
} = memberSlice.actions;
export default memberSlice.reducer;
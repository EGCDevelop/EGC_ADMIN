import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import MemberDTO from "../../interfaces/MemberDTO";

interface MemberSlice {
    isLoadingMemberSlice: boolean;
    memberDataList: MemberDTO[];
    lastCreate?: boolean;
    lastUpdate?: boolean;
    changeMemberState?: boolean;
    changeMemberPassword: boolean;
    errorMemberSliceMessage?: string;
}

const initialState: MemberSlice = {
    isLoadingMemberSlice: false,
    memberDataList: [],
    lastCreate: false,
    lastUpdate: false,
    changeMemberState: false,
    changeMemberPassword: false,
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
            state.lastUpdate = false;
        },

        onCreateMember: (state, action: PayloadAction<boolean>) => {
            state.isLoadingMemberSlice = false;
            state.lastCreate = action.payload;
        },

        onUpdateMember: (state, action: PayloadAction<boolean>) => {
            state.isLoadingMemberSlice = false;
            state.lastUpdate = action.payload;
        },

        onUpdateMemberStaste: (state, action: PayloadAction<boolean>) => {
            state.isLoadingMemberSlice = false;
            state.changeMemberState = action.payload;
        },

        onSetErrorMemberSlice: (state, action: PayloadAction<string>) => {
            state.isLoadingMemberSlice = false;
            state.memberDataList = [];
            state.errorMemberSliceMessage = action.payload;
        },

        onSetChangeMemberPassword: (state, action: PayloadAction<boolean>) => {
            state.isLoadingMemberSlice = false;
            state.changeMemberPassword = action.payload;
        },

        onResetStates: (state) => {
            state.lastCreate = false;
            state.lastUpdate = false;
            state.changeMemberState = false;
            state.changeMemberPassword = false;
        }
    }
});

export const {
    onLoadingMemberSlice,
    onSetErrorMemberSlice,
    onSetMemberDataList,
    onCreateMember,
    onUpdateMember,
    onUpdateMemberStaste,
    onSetChangeMemberPassword,
    onResetStates,
} = memberSlice.actions;
export default memberSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ComboboxData from "../../interfaces/ComboboxData";

interface GeneralSlice {
    isLoadingGeneralSlice: boolean;
    instructorPositionsList: ComboboxData[];
    establishmentList: ComboboxData[];
    careerList: ComboboxData[];
    squadsList: ComboboxData[];
    positionList: ComboboxData[];
    errorMessage?: string;
}

const initialState: GeneralSlice = {
    isLoadingGeneralSlice: false,
    instructorPositionsList: [],
    establishmentList: [],
    careerList: [],
    squadsList: [],
    positionList: [],
    errorMessage: undefined
}

export const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        onLoadingGeneralSlice: (state) => {
            state.isLoadingGeneralSlice = true;
            state.instructorPositionsList = [];
            state.errorMessage = undefined;
        },

        onSetGeneralSlice: (state, action: PayloadAction<ComboboxData[]>) => {
            state.isLoadingGeneralSlice = false;
            state.instructorPositionsList = action.payload,
                state.errorMessage = undefined
        },

        onSetEstablishmentList: (state, action: PayloadAction<ComboboxData[]>) => {
            state.isLoadingGeneralSlice = false;
            state.establishmentList = action.payload;
            state.errorMessage = undefined
        },

        onSetCareerList: (state, action: PayloadAction<ComboboxData[]>) => {
            state.isLoadingGeneralSlice = false;
            state.careerList = action.payload;
            state.errorMessage = undefined
        },

        onSetSquadsList: (state, action: PayloadAction<ComboboxData[]>) => {
            state.isLoadingGeneralSlice = false;
            state.squadsList = action.payload;
            state.errorMessage = undefined
        },

        onSetPositionList: (state, action: PayloadAction<ComboboxData[]>) => {
            state.isLoadingGeneralSlice = false;
            state.positionList = action.payload;
            state.errorMessage = undefined
        },

        onSetErrorGeneralSlice: (state, action: PayloadAction<string>) => {
            state.isLoadingGeneralSlice = false;
            state.instructorPositionsList = [];
            state.errorMessage = action.payload;
        }
    }
});

export const {
    onLoadingGeneralSlice,
    onSetGeneralSlice,
    onSetEstablishmentList,
    onSetErrorGeneralSlice,
    onSetCareerList,
    onSetSquadsList,
    onSetPositionList } = generalSlice.actions;
export default generalSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import EscuadrasInstructoresDTO from "../../interfaces/EscuadrasInstructoresDTO";
import Instructor from "../../interfaces/Instructor";

interface InstructorsSlice {
    isLoadingInstructorsSlice: boolean;
    assignedSquads: EscuadrasInstructoresDTO[];
    instructorDataList: Instructor[];
    errorMessageInstructors?: string;
    isInstructorDataUpdate: boolean;
    isInstructorCreated: boolean;
    isPasswordInstructorUpdate: boolean;
}

const initialState: InstructorsSlice = {
    isLoadingInstructorsSlice: false,
    assignedSquads: [],
    instructorDataList: [],
    errorMessageInstructors: undefined,
    isInstructorDataUpdate: false,
    isInstructorCreated: false,
    isPasswordInstructorUpdate: false,
}

export const instructorsSlice = createSlice({
    name: "instructors",
    initialState,
    reducers: {
        onLoadingInstructors: (state) => {
            state.isLoadingInstructorsSlice = true;
            state.assignedSquads = [];
            state.instructorDataList = [];
            state.isInstructorDataUpdate = false;
            state.isInstructorDataUpdate = false;
            state.errorMessageInstructors = undefined;
        },

        onSetAssignedSquadsInstructors: (state, action: PayloadAction<EscuadrasInstructoresDTO[]>) => {
            state.isLoadingInstructorsSlice = false;
            state.assignedSquads = action.payload;
            state.isInstructorDataUpdate = false;
            state.errorMessageInstructors = undefined;
        },

        onSetInstructorDataList: (state, action: PayloadAction<Instructor[]>) => {
            state.isLoadingInstructorsSlice = false;
            state.instructorDataList = action.payload;
            state.errorMessageInstructors = undefined;

        },

        onUpdateDataInstructor: (state, action: PayloadAction<boolean>) => {
            state.isLoadingInstructorsSlice = false;
            state.isInstructorDataUpdate = action.payload;
            state.errorMessageInstructors = undefined;
        },

        onUpdatePasswordInstructror: (state, action: PayloadAction<boolean>) => {
            state.isLoadingInstructorsSlice = false;
            state.isPasswordInstructorUpdate = action.payload;
            state.isInstructorDataUpdate = false;
            state.errorMessageInstructors = undefined;
        },

        onInstructorCreated: (state, action: PayloadAction<boolean>) => {
            state.isLoadingInstructorsSlice = false;
            state.isInstructorCreated = action.payload;
        },

        onSetErrorMessageInstructors: (state, action: PayloadAction<string>) => {
            state.isLoadingInstructorsSlice = false;
            state.assignedSquads = [];
            state.errorMessageInstructors = action.payload;
        }
    }
});

export const {
    onLoadingInstructors,
    onSetAssignedSquadsInstructors,
    onSetInstructorDataList,
    onUpdateDataInstructor,
    onUpdatePasswordInstructror,
    onSetErrorMessageInstructors,
    onInstructorCreated } = instructorsSlice.actions;
export default instructorsSlice.reducer;
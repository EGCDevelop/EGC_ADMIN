import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import EscuadrasInstructoresDTO from "../../interfaces/EscuadrasInstructoresDTO";

interface InstructorsSlice {
    isLoadingInstructorsSlice: boolean;
    assignedSquads: EscuadrasInstructoresDTO[];
    errorMessageInstructors?: string;
    isInstructorDataUpdate: boolean;
    isPasswordInstructorUpdate: boolean;
}

const initialState: InstructorsSlice = {
    isLoadingInstructorsSlice: false,
    assignedSquads: [],
    errorMessageInstructors: undefined,
    isInstructorDataUpdate: false,
    isPasswordInstructorUpdate: false,
}

export const instructorsSlice = createSlice({
    name: "instructors",
    initialState,
    reducers: {
        onLoadingInstructors: (state) => {
            state.isLoadingInstructorsSlice = true;
            state.assignedSquads = [];
            state.isInstructorDataUpdate = false;
            state.errorMessageInstructors = undefined;
        },

        onSetAssignedSquadsInstructors: (state, action: PayloadAction<EscuadrasInstructoresDTO[]>) => {
            state.isLoadingInstructorsSlice = false;
            state.assignedSquads = action.payload;
            state.isInstructorDataUpdate = false;
            state.errorMessageInstructors = undefined;
        },

        onUpdateDataInstructor: (state, action: PayloadAction<boolean>) => {
            state.isLoadingInstructorsSlice = false;
            state.isInstructorDataUpdate = action.payload;
            state.isPasswordInstructorUpdate = false;
            state.errorMessageInstructors = undefined;
        },

        onUpdatePasswordInstructror: (state, action: PayloadAction<boolean>) => {
            state.isLoadingInstructorsSlice = false;
            state.isPasswordInstructorUpdate = action.payload;
            state.isInstructorDataUpdate = false;
            state.errorMessageInstructors = undefined;
        },

        onSetErrorMessageInstructors: (state, action: PayloadAction<string>) => {
            state.isLoadingInstructorsSlice = false;
            state.assignedSquads = [];
            state.errorMessageInstructors = action.payload;
        }
    }
});

export const { onLoadingInstructors, onSetAssignedSquadsInstructors, onUpdateDataInstructor, onUpdatePasswordInstructror, onSetErrorMessageInstructors } = instructorsSlice.actions;
export default instructorsSlice.reducer;
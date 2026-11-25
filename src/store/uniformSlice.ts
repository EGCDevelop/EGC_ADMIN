import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ImplementsForm from "../interfaces/ImplementsForm";

interface UniformSlice {
    isLoadingUniformSlice: boolean;
    uniformsList: ImplementsForm[];
    lastCreatedUniformSlice?: boolean;
    lastUpdatedUniformSlice?: boolean;
    errorMessageUniformSlice?: string;
}

const initialState: UniformSlice = {
    isLoadingUniformSlice: false,
    uniformsList: [],
    lastCreatedUniformSlice: false,
    lastUpdatedUniformSlice: false,
    errorMessageUniformSlice: undefined
}

export const uniformSlice = createSlice({
    name: 'uniform',
    initialState,
    reducers: {
        onLoadingUniformSlice: (state) => {
            state.isLoadingUniformSlice = true;
            state.errorMessageUniformSlice = undefined;
        },

        onSetUniformDataList: (state, action: PayloadAction<ImplementsForm[]>) => {
            state.isLoadingUniformSlice = false;
            state.uniformsList = action.payload;
            state.errorMessageUniformSlice = undefined;
            state.lastCreatedUniformSlice = false;
            state.lastCreatedUniformSlice = false;
        },

        onCreateUniform: (state, action: PayloadAction<boolean>) => {
            state.isLoadingUniformSlice = false;
            state.lastCreatedUniformSlice = action.payload;
        },

        onUpdateUniform: (state, action: PayloadAction<boolean>) => {
            state.isLoadingUniformSlice = false;
            state.lastUpdatedUniformSlice = action.payload;
        },

        onErrorMessageUniformSlice: (state, action: PayloadAction<string | undefined>) => {
            state.isLoadingUniformSlice = false;
            state.errorMessageUniformSlice = action.payload;
        }
    }
});

export const {
    onLoadingUniformSlice,
    onSetUniformDataList,
    onCreateUniform,
    onUpdateUniform,
    onErrorMessageUniformSlice
} = uniformSlice.actions;
export default uniformSlice.reducer;
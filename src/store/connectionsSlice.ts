import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConnectionsSlice {
    isLoadingConnectionsSlice: boolean;
    dataBaseTypeConnectionSlice: number;
    changeEnviroment: boolean;
    errorMessageConnectionsSlice?: string;
}

const initialState: ConnectionsSlice = {
    isLoadingConnectionsSlice: false,
    dataBaseTypeConnectionSlice: 0,
    changeEnviroment: false,
    errorMessageConnectionsSlice: undefined
}

export const connectionsSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {
        onLoadingConnectionsSlice: (state) => {
            state.isLoadingConnectionsSlice = true;
            state.errorMessageConnectionsSlice = undefined;
        },

        onSetDataBaseTypeConnectionSlice: (state, action: PayloadAction<number>) => {
            state.isLoadingConnectionsSlice = false;
            state.dataBaseTypeConnectionSlice = action.payload;
        },

        onChangeEnviroment: (state, action: PayloadAction<boolean>) => {
            state.isLoadingConnectionsSlice = false;
            state.changeEnviroment = action.payload;
        },

        onSetErrorMessageDataBaseTypeConnectionSlice: (state, action: PayloadAction<string | undefined>) => {
            state.isLoadingConnectionsSlice = false;
            state.errorMessageConnectionsSlice = action.payload;
        }
    }
});

export const {
    onLoadingConnectionsSlice,
    onSetDataBaseTypeConnectionSlice,
    onSetErrorMessageDataBaseTypeConnectionSlice,
    onChangeEnviroment
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
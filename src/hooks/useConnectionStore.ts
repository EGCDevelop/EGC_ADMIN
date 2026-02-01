import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { onChangeEnviroment, onLoadingConnectionsSlice, onSetDataBaseTypeConnectionSlice, onSetErrorMessageDataBaseTypeConnectionSlice } from "../store/connectionsSlice";
import Config from "../utils/Config";

const apiUrl = Config.apiUrl;

export const useConnectionStore = () => {
    const {
        isLoadingConnectionsSlice,
        dataBaseTypeConnectionSlice,
        changeEnviroment,
        errorMessageConnectionsSlice
    } = useSelector((state: RootState) => state.connections);

    const dispatch = useDispatch<AppDispatch>();

    const GetEnviroment = async () => {
        dispatch(onLoadingConnectionsSlice());

        try {
            const response = await fetch(`${apiUrl}/Config/get_enviroment`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            
            if (!response.ok || !data.ok) {
                dispatch(onSetErrorMessageDataBaseTypeConnectionSlice(data.message || "Error al obtener puestos"))
                return;
            }

            dispatch(onSetDataBaseTypeConnectionSlice(data.state));

        } catch (error) {
            dispatch(onSetErrorMessageDataBaseTypeConnectionSlice((error as Error).message));
        }
    }

    const SetChangeEnviroment = async (state: number) => {
        dispatch(onLoadingConnectionsSlice());

        const json = {
            state
        }

        try {
            const response = await fetch(`${apiUrl}/Config/change_enviroment`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(json)
            }
            );

            const result = await response.json();

            if (!response.ok || !result.ok) {
                dispatch(onSetErrorMessageDataBaseTypeConnectionSlice(result.message || "Error al crear integrante"))
                return;
            }

            dispatch(onChangeEnviroment(response.ok === true));
        } catch (error) {
            dispatch(onSetErrorMessageDataBaseTypeConnectionSlice((error as Error).message));
        }
    }

    return {
        isLoadingConnectionsSlice,
        dataBaseTypeConnectionSlice,
        errorMessageConnectionsSlice,
        changeEnviroment,

        GetEnviroment,
        SetChangeEnviroment
    }


}
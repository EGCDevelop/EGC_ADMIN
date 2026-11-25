import { useDispatch, useSelector } from "react-redux";
import Config from "../utils/Config";
import { AppDispatch, RootState } from "../store/store";
import { onErrorMessageUniformSlice, onLoadingUniformSlice, onSetUniformDataList } from "../store/uniformSlice";
import { useAuthStore } from "./useAuthStore";

const apiUrl = Config.apiUrl;

export const useUniformStore = () => {
    const {
        isLoadingUniformSlice,
        uniformsList,
        lastCreatedUniformSlice,
        lastUpdatedUniformSlice,
        errorMessageUniformSlice
    } = useSelector((state: RootState) => state.uniform);

    const { user } = useAuthStore();

    const dispatch = useDispatch<AppDispatch>();

    const GetUniforms = async (state: number, name?: string) => {
        dispatch(onLoadingUniformSlice());

        try {
            const queryParams = new URLSearchParams();
            if (name) queryParams.append("name", name);
            queryParams.append("state", state.toString());

            const response = await fetch(`${apiUrl}/Uniforms/get_uniforms?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                dispatch(onErrorMessageUniformSlice(data.message || "Error al obtener integrantes"))
                return;
            }

            dispatch(onSetUniformDataList(data.list));
        } catch (error) {
            dispatch(onErrorMessageUniformSlice((error as Error).message));
        }
    }

    return {
        isLoadingUniformSlice,
        uniformsList,
        lastCreatedUniformSlice,
        lastUpdatedUniformSlice,
        errorMessageUniformSlice,

        GetUniforms,
    }
}
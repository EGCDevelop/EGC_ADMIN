import { useDispatch, useSelector } from "react-redux";
import Config from "../utils/Config";
import { AppDispatch, RootState } from "../store/store";
import {
  onCreateUniform,
  onErrorMessageUniformSlice,
  onLoadingUniformSlice,
  onResetShowAlert,
  onSetUniformDataList,
  onUpdateUniform,
} from "../store/uniformSlice";
import ImplementsForm from "../interfaces/ImplementsForm";

const apiUrl = Config.apiUrl;

export const useUniformStore = () => {
  const {
    isLoadingUniformSlice,
    uniformsList,
    lastCreatedUniformSlice,
    lastUpdatedUniformSlice,
    errorMessageUniformSlice,
  } = useSelector((state: RootState) => state.uniform);

  const dispatch = useDispatch<AppDispatch>();

  const GetUniforms = async (state: number, name?: string) => {
    dispatch(onLoadingUniformSlice());

    try {
      const queryParams = new URLSearchParams();
      if (name) queryParams.append("name", name);
      queryParams.append("state", state.toString());

      const response = await fetch(
        `${apiUrl}/Uniforms/get_uniforms?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        dispatch(
          onErrorMessageUniformSlice(
            data.message || "Error al obtener integrantes",
          ),
        );
        return;
      }

      dispatch(onSetUniformDataList(data.list));
    } catch (error) {
      dispatch(onErrorMessageUniformSlice((error as Error).message));
    }
  };

  const InsertUniform = async (data: ImplementsForm) => {
    dispatch(onLoadingUniformSlice());

    try {
      const response = await fetch(`${apiUrl}/Uniforms/insert_uniform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        dispatch(
          onErrorMessageUniformSlice(
            result.message || "Error al crear Implemento...",
          ),
        );
        return;
      }

      dispatch(onCreateUniform(result.ok === true));
    } catch (error) {
      dispatch(onErrorMessageUniformSlice((error as Error).message));
    }
  };

  const UpdateUniform = async (data: ImplementsForm) => {
    dispatch(onLoadingUniformSlice());

    try {
      const response = await fetch(`${apiUrl}/Uniforms/update_uniform`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        dispatch(
          onErrorMessageUniformSlice(
            result.message || "Error al actualizar implemento...",
          ),
        );
        return;
      }

      dispatch(onUpdateUniform(result.ok === true));
    } catch (error) {
      dispatch(onErrorMessageUniformSlice((error as Error).message));
    }
  };

  const ResetShowAlert = () => dispatch(onResetShowAlert());

  return {
    isLoadingUniformSlice,
    uniformsList,
    lastCreatedUniformSlice,
    lastUpdatedUniformSlice,
    errorMessageUniformSlice,

    GetUniforms,
    InsertUniform,
    UpdateUniform,
    ResetShowAlert,
  };
};

import { useDispatch, useSelector } from "react-redux";
import Config from "../utils/Config";
import { AppDispatch, RootState } from "../store/store";
import {
  onErrorMessageClosetSlice,
  onLoadingClosetSlice,
  onResetClosetSlice,
  onSetclosetDataOptions,
  onSetClosetUpdated,
  onSetDataListClosetSlice,
} from "../store/closetSlice";
import Closet from "../interfaces/uniform/Closet.types";

const apiUrl = Config.apiUrl;

export const useClosetStore = () => {
  const {
    isLoadingClosetSlice,
    dataListClosetSlice,
    closetUpdated,
    closetDataOptions,
    errorMessageClosetSlice,
  } = useSelector((state: RootState) => state.closet);

  const dispatch = useDispatch<AppDispatch>();

  const GetCloset = async (squadId: number, squadName: string) => {
    dispatch(onLoadingClosetSlice());

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("squadId", squadId.toString());

      const response = await fetch(
        `${apiUrl}/Closet/get_closet?${queryParams.toString()}`,
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
          onErrorMessageClosetSlice(
            data.message || `Error al obtener el closet ${squadName}`,
          ),
        );

        return;
      }

      dispatch(onSetDataListClosetSlice(data.list ?? []));
    } catch (error) {
      dispatch(onErrorMessageClosetSlice((error as Error).message));
    }
  };

  const UpdateCloset = async (closets: Closet[]) => {
    dispatch(onLoadingClosetSlice());

    try {
      const response = await fetch(`${apiUrl}/Closet/update_closet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(closets),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        dispatch(
          onErrorMessageClosetSlice(
            result.message || `Error guardar los cambios...`,
          ),
        );

        return;
      }

      dispatch(onSetClosetUpdated(result.ok === true));
    } catch (error) {
      dispatch(onErrorMessageClosetSlice((error as Error).message));
    }
  };

  const GetClosetSummary = async () => {
    dispatch(onLoadingClosetSlice());

    try {
      const response = await fetch(`${apiUrl}/Closet/get_closet_summary?`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        dispatch(
          onErrorMessageClosetSlice(
            data.message || `Error al obtener el listado de Closets... `,
          ),
        );

        return;
      }
      dispatch(onSetclosetDataOptions(data.list ?? []));
    } catch (error) {
      dispatch(onErrorMessageClosetSlice((error as Error).message));
    }
  };

  const ResetAlert = () => dispatch(onResetClosetSlice());

  return {
    isLoadingClosetSlice,
    dataListClosetSlice,
    closetUpdated,
    closetDataOptions,
    errorMessageClosetSlice,

    GetCloset,
    UpdateCloset,
    GetClosetSummary,
    ResetAlert,
  };
};

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  onErrorOrderSlice,
  onLoadingOrderSlice,
  onSetDataListOrderSlice,
} from "../store/orderSlice";
import Config from "../utils/Config";

const apiUrl = Config.apiUrl;

export const useOrderStore = () => {
  const { isLoadingOrderSlice, dataListOrderSlice, errorMessageOrderSlice } =
    useSelector((state: RootState) => state.order);

  const dispatch = useDispatch<AppDispatch>();

  const GetOrderByFilters = async (
    memberId: number,
    financialState: number,
    deliveryState: number,
  ) => {
    dispatch(onLoadingOrderSlice());

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("memberId", memberId.toString());
      queryParams.append("financialState", financialState.toString());
      queryParams.append("deliveryState", deliveryState.toString());

      const response = await fetch(
        `${apiUrl}/Order/get_order_by_filters?${queryParams.toString()}`,
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
          onErrorOrderSlice(
            data.message ||
              `Error al obtener pedidos para el usuario ${memberId}`,
          ),
        );
        return;
      }

      dispatch(onSetDataListOrderSlice(data));
    } catch (error) {
      dispatch(onErrorOrderSlice((error as Error).message));
    }
  };

  return {
    isLoadingOrderSlice,
    dataListOrderSlice,
    errorMessageOrderSlice,

    GetOrderByFilters,
  };
};

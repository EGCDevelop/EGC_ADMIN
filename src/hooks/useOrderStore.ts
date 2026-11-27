import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  onErrorOrderSlice,
  onLoadingOrderSlice,
  onResetSave,
  onSetDataListOrderSlice,
  onSetOrderCreated,
} from "../store/orderSlice";
import Config from "../utils/Config";
import SaveOrdenDTO from "../interfaces/DTOs/SaveOrdenDTO.types";

const apiUrl = Config.apiUrl;

export const useOrderStore = () => {
  const {
    isLoadingOrderSlice,
    dataListOrderSlice,
    orderCreated,
    errorMessageOrderSlice,
  } = useSelector((state: RootState) => state.order);

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

  const SaveOrder = async (data: SaveOrdenDTO) => {
    dispatch(onLoadingOrderSlice());
    console.log(data);
    try {
      const response = await fetch(`${apiUrl}/Order/save_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        //console.log("Detalle del 400:", result);
        console.log(JSON.stringify(result.errors, null, 2));
        dispatch(
          onErrorOrderSlice(result.message ?? `Error al crear pedido ...`),
        );
        return;
      }

      dispatch(onSetOrderCreated(result.ok === true));
    } catch (error) {
      dispatch(onErrorOrderSlice((error as Error).message));
    }
  };

  const ResetSave = () => dispatch(onResetSave());

  return {
    isLoadingOrderSlice,
    dataListOrderSlice,
    orderCreated,
    errorMessageOrderSlice,

    GetOrderByFilters,
    SaveOrder,
    ResetSave,
  };
};

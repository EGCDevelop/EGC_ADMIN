import { useDispatch, useSelector } from "react-redux";
import Config from "../utils/Config";
import { AppDispatch, RootState } from "../store/store";
import { onLoadingGeneralSlice, onSetCareerList, onSetDegreesList, onSetErrorGeneralSlice, onSetEstablishmentList, onSetGeneralSlice, onSetPositionList, onSetSquadsList } from "../store/general/generalSlice";
import ComboboxData from "../interfaces/ComboboxData";

const apiUrl = Config.apiUrl;

export const useGeneralStore = () => {
    const { isLoadingGeneralSlice, instructorPositionsList,
        establishmentList, careerList, squadsList, positionList,
        degreesList,
        errorMessage } = useSelector((state: RootState) => state.general);

    const dispatch = useDispatch<AppDispatch>();

    const GetInstructorPositions = async () => {
        dispatch(onLoadingGeneralSlice());

        try {
            const response = await fetch(`${apiUrl}/GeneralMethods/get_instructor_positions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },// Se envía como JsonObject
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                dispatch(onSetErrorGeneralSlice(data.message || "Error al obtener puestos"))
                return;
            }

            const comboPositions: ComboboxData[] = data.list.map((item: any) => ({
                id: item.id,
                value: item.descripcion,
            }));

            dispatch(onSetGeneralSlice(comboPositions));
        } catch (error) {
            dispatch(onSetErrorGeneralSlice((error as Error).message))
        }
    }

    const GetEstablishment = async () => {
        dispatch(onLoadingGeneralSlice());

        try {
            const response = await fetch(`${apiUrl}/GeneralMethods/get_establishment`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },// Se envía como JsonObject
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                dispatch(onSetErrorGeneralSlice(data.message || "Error al obtener puestos"))
                return;
            }

            const comboEstablishment: ComboboxData[] = data.list.map((item: any) => ({
                id: item.estIdEstablecimiento,
                value: item.estNombreEstablecimiento,
            }));

            dispatch(onSetEstablishmentList(comboEstablishment));
        } catch (error) {
            dispatch(onSetErrorGeneralSlice((error as Error).message))
        }
    }


    const GetCareer = async () => {
        dispatch(onLoadingGeneralSlice());

        try {
            const response = await fetch(`${apiUrl}/GeneralMethods/get_career`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },// Se envía como JsonObject
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                dispatch(onSetErrorGeneralSlice(data.message || "Error al obtener puestos"))
                return;
            }

            const comboCarrer: ComboboxData[] = data.list.map((item: any) => ({
                id: item.carIdCarrera,
                value: item.carNombreCarrera,
            }));

            dispatch(onSetCareerList(comboCarrer));
        } catch (error) {
            dispatch(onSetErrorGeneralSlice((error as Error).message))
        }
    }

    const GetSquads = async () => {
        dispatch(onLoadingGeneralSlice());

        try {
            const response = await fetch(`${apiUrl}/GeneralMethods/get_squads`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },// Se envía como JsonObject
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                dispatch(onSetErrorGeneralSlice(data.message || "Error al obtener puestos"))
                return;
            }

            const comboSquads: ComboboxData[] = data.list.map((item: any) => ({
                id: item.escIdEscuadra,
                value: item.escNombre,
            }));

            dispatch(onSetSquadsList(comboSquads));
        } catch (error) {
            dispatch(onSetErrorGeneralSlice((error as Error).message))
        }
    }

    const GetPosition = async () => {
        dispatch(onLoadingGeneralSlice());

        try {
            const response = await fetch(`${apiUrl}/GeneralMethods/get_position`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },// Se envía como JsonObject
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                dispatch(onSetErrorGeneralSlice(data.message || "Error al obtener puestos"))
                return;
            }

            const comboPosition: ComboboxData[] = data.list.map((item: any) => ({
                id: item.puIdPuesto,
                value: item.puNombre,
            }));

            dispatch(onSetPositionList(comboPosition));
        } catch (error) {
            dispatch(onSetErrorGeneralSlice((error as Error).message))
        }
    }

    const GetDegrees = async () => {
        dispatch(onLoadingGeneralSlice());

        try {
            const response = await fetch(`${apiUrl}/GeneralMethods/get_degrees`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },// Se envía como JsonObject
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                dispatch(onSetErrorGeneralSlice(data.message || "Error al obtener puestos"))
                return;
            }

            const comboPosition: ComboboxData[] = data.list.map((item: any) => ({
                id: item.graIdGrado,
                value: item.graNombreGrado,
            }));

            dispatch(onSetDegreesList(comboPosition));
        } catch (error) {
            dispatch(onSetErrorGeneralSlice((error as Error).message))
        }
    }

    return {
        isLoadingGeneralSlice,
        instructorPositionsList,
        establishmentList,
        careerList,
        squadsList,
        positionList,
        degreesList,
        errorMessage,

        GetInstructorPositions,
        GetEstablishment,
        GetCareer,
        GetSquads,
        GetPosition,
        GetDegrees
    }

}
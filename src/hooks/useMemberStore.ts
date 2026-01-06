import { useDispatch, useSelector } from "react-redux";
import Config from "../utils/Config";
import { AppDispatch, RootState } from "../store/store";
import { onCreateMember, onLoadingMemberSlice, onResetStates, onSetErrorMemberSlice, onSetMemberDataList, onUpdateMember, onUpdateMemberStaste } from "../store/member/memberSlice";
import Member from "../interfaces/Member";
import Utils from "../utils/Utils";
import { useAuthStore } from "./useAuthStore";

const apiUrl = Config.apiUrl;

export const useMemberStore = () => {
    const { isLoadingMemberSlice, memberDataList, lastCreate, lastUpdate,
        changeMemberState, errorMemberSliceMessage } = useSelector((state: RootState) => state.member);
        const { user } = useAuthStore();


    const dispatch = useDispatch<AppDispatch>();

    const GetMemberForInstructor = async (like?: string, squadId?: number,
        schoolId?: number, isNew?: number, memberState?: number, career?: number,
        positionId?: number
    ) => {
        dispatch(onLoadingMemberSlice());

        try {
            const queryParams = new URLSearchParams();

            if (like) queryParams.append("like", like);
            //if (squadId !== undefined) queryParams.append("squadId", squadId.toString());
            if (schoolId !== undefined) queryParams.append("schoolId", schoolId.toString());
            if (isNew !== undefined) queryParams.append("isNew", isNew.toString());
            if (memberState !== undefined) queryParams.append("memberState", memberState.toString());
            if (career !== undefined) queryParams.append("career", career.toString());
            if (positionId !== undefined) queryParams.append("positionId", positionId.toString());


            if (user!.rol === 1) {
                // Si es Admin y seleccionó algo, lo mandamos; si no, 0
                queryParams.append("squadId", squadId?.toString() || "0");
            } else {
                // Si NO es admin
                if (squadId && squadId !== 0) {
                    // Si seleccionó una específica del combo, mandamos solo esa
                    queryParams.append("squadId", squadId.toString());
                } else {
                    // Si no seleccionó ninguna, mandamos TODAS sus permitidas
                    queryParams.append("squadId", user!.squadIdList.join(','));
                }
            }

            const response = await fetch(`${apiUrl}/Member/get_member_for_instructor?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                dispatch(onSetErrorMemberSlice(data.message || "Error al obtener integrantes"))
                return;
            }

            dispatch(onSetMemberDataList(data.list));
        } catch (error) {
            dispatch(onSetErrorMemberSlice((error as Error).message))
        }
    }

    const InsertMember = async (data: Member) => {
        dispatch(onLoadingMemberSlice());
        try {
            let createUsername: string | null = Utils.normalize(data.usuario);

            if (data.idPuesto !== 8) {
                createUsername = data.usuario?.trim() ? Utils.normalize(data.usuario) : data.nombres.charAt(0).concat(data.apellidos.split(" ")[0]).toLowerCase();
            }

            const jsonData = {
                firstName: data.nombres,
                lastName: data.apellidos,
                age: data.edad ?? 0,
                cellPhone: data.telefono,
                squadId: data.idEscuadra,
                positionId: data.idPuesto,
                isActive: data.estadoIntegrante === 1,
                isAncient: data.esNuevo === 3,

                establecimientoId: data.idEstablecimiento,
                anotherEstablishment: Utils.normalize(data.establecimientoNombre),
                courseId: data.idCarrera,
                courseName: Utils.normalize(data.carreraNombre),
                degreeId: data.idGrado,
                degreeName: Utils.normalize(data.gradoNombre),
                section: data.seccion,

                fatherName: Utils.normalize(data.nombreEncargado),
                fatherCell: Utils.normalize(data.telefonoEncargado),
                username: createUsername
            };

            const response = await fetch(`${apiUrl}/Member/insert_member`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonData)
            }
            );

            const result = await response.json();

            if (!response.ok || !result.ok) {
                dispatch(onSetErrorMemberSlice(result.message || "Error al crear integrante"))
                return;
            }

            dispatch(onCreateMember(result.ok === true));
        } catch (error) {
            dispatch(onSetErrorMemberSlice((error as Error).message));
        }
    }


    const UpdateMember = async (data: Member) => {
        dispatch(onLoadingMemberSlice());
        try {
            let createUsername: string | null = Utils.normalize(data.usuario);
            let createPassword: string | null = null;

            if (data.idPuesto !== 8) {
                createUsername = data.nombres.charAt(0) + data.apellidos.split(" ")[0];
                createPassword = Utils.getPassword(data.idEscuadra);
            } else {
                createUsername = null;
            }

            const jsonData = {
                memberId: data.idIntegrante,
                firstName: data.nombres,
                lastName: data.apellidos,
                cellPhone: data.telefono,
                squadId: data.idEscuadra,
                positionId: data.idPuesto,
                isActive: data.estadoIntegrante,
                isAncient: data.esNuevo === 3 ? 1 : 0,
                age: data.edad ?? 0,

                establecimientoId: data.idEstablecimiento,
                anotherEstablishment: data.establecimientoNombre,
                courseId: data.idCarrera,
                courseName: data.carreraNombre,
                degreeId: data.idGrado,
                section: data.seccion,

                fatherName: data.nombreEncargado,
                fatherCell: data.telefonoEncargado,
                username: createUsername?.toLocaleLowerCase(),
                password: createPassword
            };

            const response = await fetch(`${apiUrl}/Member/update_member`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonData)
            }
            );

            const result = await response.json();

            if (!response.ok || !result.ok) {
                dispatch(onSetErrorMemberSlice(result.message || "Error al crear integrante"))
                return;
            }

            dispatch(onUpdateMember(result.ok === true));
        } catch (error) {
            dispatch(onSetErrorMemberSlice((error as Error).message));
        }
    }

    const UpdateMemberState = async (memberId: number, state: number, comment: string) => {
        dispatch(onLoadingMemberSlice());
        try {

            const jsonData = {
                memberId: memberId,
                newState: state,
                comment: Utils.normalize(comment)
            };

            const response = await fetch(`${apiUrl}/Member/update_member_state`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonData)
            }
            );

            const result = await response.json();

            if (!response.ok || !result.ok) {
                dispatch(onSetErrorMemberSlice(result.message || "Error al crear integrante"))
                return;
            }

            dispatch(onUpdateMemberStaste(result.ok === true));
        } catch (error) {
            dispatch(onSetErrorMemberSlice((error as Error).message));
        }
    }

    const ResetState = () => dispatch(onResetStates());

    return {
        isLoadingMemberSlice,
        memberDataList,
        errorMemberSliceMessage,
        lastCreate,
        lastUpdate,
        changeMemberState,

        GetMemberForInstructor,
        InsertMember,
        UpdateMember,
        UpdateMemberState,
        ResetState
    }
}
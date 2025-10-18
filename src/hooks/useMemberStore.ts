import { useDispatch, useSelector } from "react-redux";
import Config from "../utils/Config";
import { AppDispatch, RootState } from "../store/store";
import { onLoadingMemberSlice, onSetErrorMemberSlice, onSetMemberDataList } from "../store/member/memberSlice";

const apiUrl = Config.apiUrl;

export const useMemberStore = () => {
    const { isLoadingMemberSlice, memberDataList, errorMemberSliceMessage } = useSelector((state: RootState) => state.member);

    const dispatch = useDispatch<AppDispatch>();

    const GetMemberForInstructor = async (like?: string, squadId?: number,
        schoolId?: number, isNew?: number, memberState?: number, career?: number
    ) => {
        dispatch(onLoadingMemberSlice());

        try {
            const queryParams = new URLSearchParams();

            if (like) queryParams.append("like", like);
            if (squadId !== undefined) queryParams.append("squadId", squadId.toString());
            if (schoolId !== undefined) queryParams.append("schoolId", schoolId.toString());
            if (isNew !== undefined) queryParams.append("isNew", isNew.toString());
            if (memberState !== undefined) queryParams.append("memberState", memberState.toString());
            if (career !== undefined) queryParams.append("career", career.toString());

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

    return {
        isLoadingMemberSlice,
        memberDataList,
        errorMemberSliceMessage,

        GetMemberForInstructor
    }
}
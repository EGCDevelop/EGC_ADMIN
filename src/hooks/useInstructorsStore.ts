import { useDispatch, useSelector } from "react-redux";
import Config from "../utils/Config";
import { AppDispatch, RootState } from "../store/store";
import { onLoadingInstructors, onSetAssignedSquadsInstructors, onSetErrorMessageInstructors, onUpdateDataInstructor, onUpdatePasswordInstructror } from "../store/instructors/instructorsSlice";
import EscuadrasInstructoresDTO from "../interfaces/EscuadrasInstructoresDTO";
import ProfileINT from "../interfaces/ProfileINT";

const apiUrl = Config.apiUrl;

export const useInstructorsStore = () => {
    const { assignedSquads, isLoadingInstructorsSlice, isInstructorDataUpdate, isPasswordInstructorUpdate, errorMessageInstructors } = useSelector((state: RootState) => state.instructors);

    const dispatch = useDispatch<AppDispatch>();

    const GetAssignedSquadsInstructors = async (idInstructor: number) => {
        dispatch(onLoadingInstructors());

        try {
            const response = await fetch(`${apiUrl}/Instructor/get_assigned_squads_instructors?idInstructor=${idInstructor}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error(`Error al obtener escuadras: ${response.statusText}`);
            }

            const json = await response.json();

            if (!response.ok) {
                dispatch(onSetErrorMessageInstructors(
                    json.message || "Error al cargar escuadras"
                ))
                return;
            }

            // ✅ Convertir la respuesta a lista de EscuadrasInstructoresDTO
            const assignedSquads: EscuadrasInstructoresDTO[] = json.data.map(
                (item: any) => ({
                    id: item.id,
                    idEscuadra: item.idEscuadra,
                    idInstructor: item.idInstructor,
                    principal: item.principal,
                    nombre: item.nombre,
                })
            );

            dispatch(onSetAssignedSquadsInstructors(assignedSquads));
        } catch (error) {
            dispatch(onSetErrorMessageInstructors((error as Error).message));
        }
    }

    const UpdateInstructorProfile = async (data: ProfileINT) => {
        dispatch(onLoadingInstructors());

        try {
            const jsonData = {
                id: data.id,
                name: data.nombre,
                lastName: data.apellido,
                phone: data.telefono,
                email: data.correo
            }

            const response = await fetch(`${apiUrl}/Instructor/update_instructor_profile`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) throw new Error("Error al actualizar la solicitud");

            const json = await response.json();

            if (json.ok) {
                const storedData = localStorage.getItem("data-egc-admin");

                if (storedData) {
                    const userData = JSON.parse(storedData);

                    userData.telefono = json.telefono;
                    userData.nombre = json.nombre;
                    userData.apellido = json.apellido;
                    userData.correo = json.correo;

                    localStorage.setItem("data-egc-admin", JSON.stringify(userData));
                }

                dispatch(onUpdateDataInstructor(true));
            } else {
                dispatch(onSetErrorMessageInstructors("Error al actualizar los datos"));
            }
        } catch (error) {
            dispatch(onSetErrorMessageInstructors((error as Error).message));
        }
    }

    const ChangePasswordInstructor = async (password: string) => {
        dispatch(onLoadingInstructors());

        try {
            const storedData = localStorage.getItem("data-egc-admin");
            const data = JSON.parse(storedData!);

            const jsonData = {
                username: data.username,
                password: password
            }

            const response = await fetch(`${apiUrl}/Login/change_password_instructor`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) throw new Error("Error al actualizar la contraseña");

            const json = await response.json();

            dispatch(onUpdatePasswordInstructror(json.ok === true));
        } catch (error) {
            dispatch(onSetErrorMessageInstructors((error as Error).message));
        }
    }

    return {
        assignedSquads,
        isLoadingInstructorsSlice,
        isInstructorDataUpdate,
        isPasswordInstructorUpdate,
        errorMessageInstructors,

        GetAssignedSquadsInstructors,
        UpdateInstructorProfile,
        ChangePasswordInstructor
    }

}
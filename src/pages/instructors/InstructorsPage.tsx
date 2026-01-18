import { FaPlus, FaSearch, FaUser } from "react-icons/fa";
import { CustomInput } from "../components/CustomInput";
import { useForm } from "../../hooks/useForm";
import { CustomSelect } from "../components/CustomSelect";
import { FaEnvelopeOpenText, FaPhoneFlip, FaStar } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { InstructorModel } from "./components/InstructorModel";
import { useInstructorsStore } from "../../hooks/useInstructorsStore";
import { useDebounce } from "../../hooks/useDebounce";
import { CustomLoader } from "../components/CustomLoader";
import Utils from "../../utils/Utils";
import { useGeneralStore } from "../../hooks/useGeneralStore";
import { CustomAlert } from "../components/CustomAlert";
import './styles/instructors-page.css';
import EscuadrasInstructoresDTO from "../../interfaces/EscuadrasInstructoresDTO";
import Instructor from "../../interfaces/Instructor";

interface DataFilter {
    name: string;
    state: number;
    position: number;
}

export const InstructorsPage = () => {
    const {
        isLoadingInstructorsSlice,
        instructorDataList,
        isInstructorCreated,
        isInstructorDataUpdate,
        errorMessageInstructors,
        GetInstructor } = useInstructorsStore();

    const {
        isLoadingGeneralSlice,
        instructorPositionsList,
        errorMessage,
        GetInstructorPositions
    } = useGeneralStore();

    const { formData, onChange, onSelectChange } = useForm<DataFilter>({
        name: "",
        state: 0,
        position: 0,
    });

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<Instructor | null>(null);
    const nameDebounced = useDebounce(formData.name, 500);

    const [alert, setAlert] = useState<{
        title: string;
        message: string;
        status: "success" | "error";
    } | null>(null);

    const renderEscuadras = (escuadrasJson: string | null) => {
        if (!escuadrasJson) return null;

        try {
            // 1. Convertimos el string a un array genérico
            const rawData: any[] = JSON.parse(escuadrasJson);

            // 2. Mapeamos al formato de tu Interface EscuadrasInstructoresDTO
            const listaEscuadras: EscuadrasInstructoresDTO[] = rawData.map(item => ({
                id: item.Id,
                idEscuadra: item.IdEscuadra,
                idInstructor: item.IdInstructor || 0, // Por si el SP no lo devuelve
                principal: item.Principal,
                nombre: item.Nombre
            }));

            // 3. Iteramos para crear el componente
            return listaEscuadras.map((escuadra) => (
                <span
                    key={escuadra.id}
                    className={escuadra.principal === 1 ? "squads-list-principal" : "squads-list-secondary"}
                >
                    {escuadra.nombre}
                    {escuadra.principal === 1 && <FaStar className="icon-star-principal" />}
                </span>
            ));

        } catch (error) {
            console.error("Error al procesar escuadras:", error);
            return null;
        }
    }

    const onHandleOpenModal = (data: Instructor | null) => {
        setOpenModal(true);
        setDataUpdate(data);
    }

    useEffect(() => {
        if (openModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [openModal]);

    useEffect(() => {
        GetInstructorPositions();
    }, []);

    useEffect(() => {
        GetInstructor(formData.state, formData.position, nameDebounced);
    }, [formData.state, formData.position, nameDebounced, isInstructorCreated, isInstructorDataUpdate]);

    useEffect(() => {
        if (errorMessage) {
            setAlert({
                message: errorMessage,
                status: "error",
                title: "Error"
            });
        }
    }, [errorMessage])

    useEffect(() => {
        if (errorMessageInstructors) {
            setAlert({
                message: errorMessageInstructors,
                status: "error",
                title: "Error"
            });
        }
    }, [errorMessageInstructors])

    useEffect(() => {
        if (isInstructorCreated) {
            setAlert({
                title: "Exito",
                message: "Instructor creado exitosamente",
                status: "success"
            });
            setOpenModal(false);
        }
    }, [isInstructorCreated]);

    useEffect(() => {
        if (isInstructorDataUpdate) {
            setAlert({
                title: "Exito",
                message: "Instructor editado exitosamente",
                status: "success"
            });
            setOpenModal(false);
        }
    }, [isInstructorDataUpdate]);

    return (
        <>
            {
                (isLoadingInstructorsSlice || isLoadingGeneralSlice) && <CustomLoader />
            }
            {
                openModal && <InstructorModel dataUpdate={dataUpdate} onClose={() => setOpenModal(false)} />
            }
            {
                alert && <CustomAlert message={alert.message} title={alert.title} status={alert.status} onClose={() => setAlert(null)} />
            }
            <div className="member-page-main-container">
                <div className="member-page-header">
                    <div className="member-page-header-content">
                        <strong>Instructores</strong>
                        <p>Administra a los instructores del sistema de manera eficiente</p>
                    </div>
                    <div className="member-page-header-content">
                        <div className="member-page-general-acount">
                            <p>Personal</p>
                            <span>{instructorDataList.length}</span>
                        </div>
                        <button
                            type="button"
                            className="member-page-add-button"
                            onClick={() => onHandleOpenModal(null)}
                        >
                            <FaPlus />
                            Nuevo
                        </button>
                    </div>
                </div>

                <div className="member-page-filter-container">
                    <div className="content-search-member-page">
                        <CustomInput
                            type="search"
                            name="name"
                            placeholder="Buscar por nombre"
                            value={formData.name}
                            onChange={onChange}
                            icon={<FaSearch />}
                        />
                    </div>
                </div>

                <div className="member-page-filter-container">
                    <strong>Filtros</strong>
                    <div className="member-page-combobox-filter">
                        <CustomSelect
                            dataList={Utils.instructorStateDataList()}
                            name="state"
                            initValue
                            label="Estado"
                            value={formData.state}
                            onChange={onSelectChange}
                        />
                        <CustomSelect
                            dataList={instructorPositionsList}
                            name="position"
                            initValue
                            label="Puesto"
                            value={formData.position}
                            onChange={onSelectChange}
                        />
                    </div>
                </div>

                <div className="container-grid-instructor-page">
                    {/* card */}
                    {instructorDataList.map((instructor) => {
                        return <div key={instructor.id} className="container-card-instructor-page">
                            {/* header */}
                            <div className="content-header-card-instructor-page">
                                <div className="info-name-card-instructor-page">
                                    <span>{instructor.nombre}</span>
                                    <p>{instructor.apellido}</p>
                                </div>
                                <span>{`${instructor.estado === 1 ? 'Activo' : 'Inactivo'}`}</span>
                            </div>
                            {/* body */}
                            <div className="content-body-card-instructor-page">
                                <div className="content-contact-info-card-instructor-page">
                                    <p><FaEnvelopeOpenText />{instructor.correo}</p>
                                    <p><FaPhoneFlip /> {instructor.telefono}</p>
                                    <p><FaUser /> {instructor.usuario}</p>
                                </div>
                                <hr />
                                <div className="content-band-info-card-instructor-page">
                                    <div className="row-band-info-card-instructor-page">
                                        <p>Puesto:</p>
                                        <span>{instructor.idPuesto === 2 ? 'Instructor' : 'Apoyo'}</span>
                                    </div>
                                    <div className="row-band-info-card-instructor-page">
                                        <p>Área:</p>
                                        <span>{instructor.area}</span>
                                    </div>
                                    <div className="row-band-info-card-instructor-page">
                                        <p>Rol:</p>
                                        <span>{instructor.rol === 1 ? 'Admin' : instructor.rol === 2 ? 'Instructor' : 'Apoyo'}</span>
                                    </div>
                                </div>
                                <hr />
                                <div className="content-squads-asigned-card-instructor-page">
                                    <span>Escuadras asignadas:</span>
                                    <div className="squads-list-asigned-card-instructor-page">
                                        {
                                            renderEscuadras(instructor.escuadras)
                                        }
                                    </div>
                                </div>
                            </div>
                            <button type="button" onClick={() => onHandleOpenModal(instructor)} >Editar</button>
                        </div>
                    })}


                </div>
            </div>
        </>
    )
}

export default InstructorsPage;

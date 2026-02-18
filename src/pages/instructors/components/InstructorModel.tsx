import { FaTimes } from 'react-icons/fa';
import { CustomInput } from '../../components/CustomInput';
import { CustomSelect } from '../../components/CustomSelect';
import { useGeneralStore } from '../../../hooks/useGeneralStore';
import { FormEvent, useEffect, useState } from 'react';
import { CustomLoader } from '../../components/CustomLoader';
import Utils from '../../../utils/Utils';
import { useForm } from '../../../hooks/useForm';
import { FaFloppyDisk, FaPlus, FaStar, FaXmark } from 'react-icons/fa6';
import { CustomAlert } from '../../components/CustomAlert';
import INewInstructorDataForm from '../../../interfaces/INewInstructorDataForm';
import IAssignedSquad from '../../../interfaces/IAssignedSquad';
import { useInstructorsStore } from '../../../hooks/useInstructorsStore';
import Instructor from '../../../interfaces/Instructor';
import '../styles/instructor-model.css';
import { useAuthStore } from '../../../hooks/useAuthStore';

interface Props {
    dataUpdate: Instructor | null;
    onClose: () => void;
}

export const InstructorModel = ({ dataUpdate, onClose }: Props) => {
    const { user } = useAuthStore();
    const { 
        isLoadingInstructorsSlice, 
        errorMessageInstructors, 
        CreateInstructor, 
        UpdateInstructor 
    } = useInstructorsStore();
    
    const {
        isLoadingGeneralSlice,
        instructorPositionsList,
        squadsList,
        errorMessage,
        GetInstructorPositions,
        GetSquads,
    } = useGeneralStore();

    const { formData, setFormData, onChange, onSelectChange } = useForm<INewInstructorDataForm>({
        id: 0,
        name: "",
        lastName: "",
        tel: "",
        email: "",
        username: "",
        password: "",
        position: 0,
        area: "",
        rol: 0,
        state: 1
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    //Estado para la lista dinámica de escuadras
    const [assignedSquads, setAssignedSquads] = useState<IAssignedSquad[]>([]);

    // 2. Estados para la selección temporal del formulario pequeño
    const [tempSquadId, setTempSquadId] = useState<number>(0);
    const [tempIsPrincipal, setTempIsPrincipal] = useState<boolean | null>(null);

    const [alert, setAlert] = useState<{
        title: string;
        message: string;
        status: "success" | "error";
    } | null>(null);



    // Función para agregar a la lista
    const handleAddSquad = (e: React.MouseEvent) => {
        e.preventDefault();

        if (tempSquadId === 0 || tempIsPrincipal === null) {
            setAlert({ title: "Validación", message: "Seleccione una escuadra y el tipo de asignación", status: "error" });
            return;
        }

        // Buscar el nombre de la escuadra en la lista general de squadsList
        const squadInfo = squadsList.find(s => s.id === tempSquadId);

        const newSquad: IAssignedSquad = {
            squadId: tempSquadId,
            squadName: String(squadInfo?.value) || "Escuadra",
            isPrincipal: tempIsPrincipal
        };

        setAssignedSquads([...assignedSquads, newSquad]);

        // Limpiar selección [Requisito: Limpiar CustomSelect y opciones]
        setTempSquadId(0);
        setTempIsPrincipal(null);
    };


    // Función para quitar de la lista
    const handleRemoveSquad = (id: number) => {
        setAssignedSquads(assignedSquads.filter(s => s.squadId !== id));
    };

    const handleInsertOrUpdate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Ingresa un nombre";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Ingresa un apellido";
        }

        if (!formData.tel.trim()) {
            newErrors.tel = "Ingresa un teléfono";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Ingresa un correo";
        }

        if (formData.id === 0 && !formData.password.trim()) {
            newErrors.password = "Ingresa una contraseña";
        }

        if (formData.position === 0) {
            newErrors.position = "Selecciona un puesto";
        }

        if (!formData.area.trim()) {
            newErrors.area = "Ingresa una área";
        }

        if (formData.rol === 0) {
            newErrors.rol = "Selecciona un rol";
        }

        if (formData.state === 0) {
            newErrors.state = "Selecciona un estado";
        }

        if (assignedSquads.length === 0) {
            setAlert({
                title: "Atención",
                message: "Debes asignar al menos una escuadra al instructor",
                status: "error"
            });
            return;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // const payload = {
        //     ...formData,
        //     squads: assignedSquads
        // };

        // INSERT
        if (formData.id === 0) {
            CreateInstructor(formData, assignedSquads);
        }
        // UPDATE
        else {
            //console.log("Actualizando instructor con nuevas escuadras:", payload);
            UpdateInstructor(formData, assignedSquads);
        }
    }


    useEffect(() => {
        GetInstructorPositions();
        GetSquads();
    }, []);

    useEffect(() => {
        if (errorMessage) {
            setAlert({
                message: errorMessage,
                status: "error",
                title: "Error"
            });
        }
    }, [errorMessage]);

    useEffect(() => {
        if (errorMessageInstructors) {
            setAlert({
                message: errorMessageInstructors,
                status: "error",
                title: "Error"
            });
        }
    }, [errorMessageInstructors]);

    useEffect(() => {
        if (dataUpdate) {
            setFormData({
                ...formData,
                id: dataUpdate.id,
                name: dataUpdate.nombre ?? "",
                lastName: dataUpdate.apellido ?? "",
                tel: dataUpdate.telefono ?? "",
                email: dataUpdate.correo ?? "",
                username: dataUpdate.usuario,
                position: dataUpdate.idPuesto,
                area: dataUpdate.area,
                rol: dataUpdate.rol,
                state: dataUpdate.estado
            });

            if (dataUpdate.escuadras) {
                try {
                    const parsed = JSON.parse(dataUpdate.escuadras);
                    const initialSquads: IAssignedSquad[] = parsed.map((s: any) => ({
                        squadId: s.IdEscuadra,
                        squadName: s.Nombre,
                        isPrincipal: s.Principal === 1
                    }));
                    setAssignedSquads(initialSquads);
                } catch (error) {
                    setAlert({
                        message: `Error ${(error as Error).message}`,
                        status: 'error',
                        title: "Error al cargar escuadras iniciales",
                    })
                }
            }
        }
    }, []);

    return (
        <>
            {
                (isLoadingGeneralSlice || isLoadingInstructorsSlice) && <CustomLoader />
            }
            {
                alert && <CustomAlert message={alert.message} title={alert.title} onClose={() => setAlert(null)} status={alert.status} />
            }
            <div className="container-main-instructor-page">
                <div className="content-instructor-page">
                    <div className='container-header-instructor-page'>
                        <strong>{0 === 0 ? "Nuevo instructor" : "Editar Usuario"}</strong>
                        <FaTimes className="icon" onClick={onClose} />
                    </div>
                    <form method='POST' className='form-instructor-page' onSubmit={handleInsertOrUpdate}>
                        <div className="other-info-member-modal">
                            <div className="form-academic-information-member-modal">
                                <span>Información Académica</span>
                                <div className="inputs-grid">
                                    <div className="container-input-member-modal">
                                        <CustomInput
                                            key="name"
                                            label="Nombres"
                                            name="name"
                                            placeholder='Nombres'
                                            request
                                            value={formData.name}
                                            onChange={onChange}
                                            errorMessage={errors.name}
                                        />
                                    </div>
                                    <div className="container-input-member-modal">
                                        <CustomInput
                                            key="lastName"
                                            label="Apellidos"
                                            name="lastName"
                                            placeholder='Apellidos'
                                            request
                                            value={formData.lastName}
                                            onChange={onChange}
                                            errorMessage={errors.lastName}
                                        />
                                    </div>
                                    <div className="container-input-member-modal">
                                        <CustomInput
                                            key="tel"
                                            name="tel"
                                            label="Teléfono"
                                            request
                                            value={formData.tel}
                                            onChange={onChange}
                                            placeholder='00000000'
                                            errorMessage={errors.tel}
                                        />
                                    </div>
                                    <div className="container-input-member-modal">
                                        <CustomInput
                                            key="email"
                                            name="email"
                                            label="Correo"
                                            request
                                            value={formData.email}
                                            onChange={onChange}
                                            placeholder='example@bandaegc.com'
                                            errorMessage={errors.email}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="other-info-member-modal">
                            <div className="form-academic-information-member-modal">
                                <span>Credenciales</span>
                                <div className="inputs-grid">
                                    <div className="container-input-member-modal">
                                        <CustomInput
                                            key="username"
                                            name="username"
                                            label="Usuario"
                                            value={formData.username}
                                            onChange={onChange}
                                            request
                                            disabled
                                            placeholder='************'
                                        />
                                    </div>
                                    <div className="container-input-member-modal">
                                        <CustomInput
                                            key="password"
                                            type='password'
                                            name="password"
                                            label="Contraseña"
                                            placeholder='*************'
                                            request
                                            value={formData.password}
                                            onChange={onChange}
                                            errorMessage={errors.password}
                                            disabled={formData.id !== 0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="other-info-member-modal">
                            <div className="form-academic-information-member-modal">
                                <span>Asignación</span>
                                <div className="inputs-grid">
                                    <div className="container-input-member-modal">
                                        <CustomSelect
                                            key="position"
                                            name='position'
                                            label='Puesto'
                                            request
                                            value={formData.position}
                                            dataList={instructorPositionsList}
                                            initValue
                                            onChange={onSelectChange}
                                            errorMessage={errors.position}
                                            disabled={user!.rol !== 1}
                                        />
                                    </div>
                                    <div className="container-input-member-modal">
                                        <CustomInput
                                            key='area'
                                            name='area'
                                            label='Área'
                                            placeholder='Eje: Percusión, Vientos, etc.'
                                            request
                                            value={formData.area}
                                            onChange={onChange}
                                            errorMessage={errors.area}
                                            disabled={user!.rol !== 1}
                                        />
                                    </div>
                                    <div className="container-input-member-modal">
                                        <CustomSelect
                                            key="rol"
                                            name='rol'
                                            label='Rol'
                                            request
                                            initValue
                                            dataList={Utils.rolInstructorCombobox()}
                                            value={formData.rol}
                                            onChange={onSelectChange}
                                            errorMessage={errors.rol}
                                            disabled={user!.rol !== 1}
                                        />
                                    </div>
                                    <div className="container-input-member-modal">
                                        <CustomSelect
                                            key="state"
                                            name='state'
                                            label='Estado'
                                            request
                                            dataList={Utils.instructorStateDataList()}
                                            value={formData.state}
                                            onChange={onSelectChange}
                                            errorMessage={errors.state}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="other-info-member-modal">
                            <div className="form-academic-information-member-modal">
                                <span>Escuadras asignadas</span>

                                <div className='container-asigned-squads-instructor-page'>
                                    <div className='container-form-asigned-squads-instructor-page'>
                                        <div className='content-form-option-asigned-squads-instructor-page'>
                                            <div className="container-input-member-modal">
                                                <CustomSelect
                                                    key="tempSquad"
                                                    name='tempSquad'
                                                    label='Escuadra'
                                                    initValue
                                                    request
                                                    value={tempSquadId}
                                                    dataList={squadsList}
                                                    onChange={(e) => setTempSquadId(Number(e.target.value))}
                                                />
                                            </div>
                                            {/* Opción Principal */}
                                            <div className='container-radio-asigned-squads-instructor-page' onClick={() => setTempIsPrincipal(true)}>
                                                <div className={`${tempIsPrincipal === true ? 'option-selected' : ''}`}></div>
                                                <p>Principal</p>
                                            </div>
                                            {/* Opción Secundaria */}
                                            <div className='container-radio-asigned-squads-instructor-page' onClick={() => setTempIsPrincipal(false)}>
                                                <div className={`${tempIsPrincipal === false ? 'option-selected' : ''}`}></div>
                                                <p>Secundaria</p>
                                            </div>
                                            <button onClick={handleAddSquad}><FaPlus /> Agregar</button>
                                        </div>
                                        <div className='container-asigned-squads-list-instructor-page'>
                                            {assignedSquads.map((squad) => (
                                                <div key={squad.squadId} className='content-squads-list-instructor-page'>
                                                    {/* La estrella sigue siendo condicional: solo para el principal  */}
                                                    {squad.isPrincipal && <FaStar className='icon' />}

                                                    <p>{squad.squadName}</p>

                                                    {/* El texto siempre aparece, la clase y el contenido cambian según el estado */}
                                                    <p className={squad.isPrincipal ? 'principal-asigned-squads-instructor' : 'secondary-asigned-squads-instructor'}>
                                                        {squad.isPrincipal ? 'Principal' : 'Secundaria'}
                                                    </p>

                                                    <FaTimes
                                                        className='close'
                                                        onClick={() => handleRemoveSquad(squad.squadId)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-footer-member-modal">
                            <button type="button" onClick={onClose}>
                                <FaXmark />
                                Cancelar
                            </button>
                            <button type="submit">
                                <FaFloppyDisk /> Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

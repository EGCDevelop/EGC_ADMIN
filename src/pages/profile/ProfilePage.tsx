import { FaShield, FaUser } from "react-icons/fa6";
import { FaSave, FaTh, FaUserAlt, FaUsers } from "react-icons/fa";
import { CustomInput } from "../components/CustomInput";
import { CustomSelect } from "../components/CustomSelect";
import { FormEvent, useEffect, useState } from "react";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import { useLocation } from "react-router-dom";
import { useGeneralStore } from "../../hooks/useGeneralStore";
import { CustomLoader } from "../components/CustomLoader";
import { useForm } from "../../hooks/useForm";
import ProfileINT from "../../interfaces/ProfileINT";
import { useInstructorsStore } from "../../hooks/useInstructorsStore";
import { CustomAlert } from "../components/CustomAlert";
import Utils from "../../utils/Utils";
import "./styles/profile-page.css";

export const ProfilePage = () => {
  const { isLoadingGeneralSlice, instructorPositionsList, errorMessage, GetInstructorPositions } = useGeneralStore();
  const { isLoadingInstructorsSlice, assignedSquads, isInstructorDataUpdate, errorMessageInstructors, isPasswordInstructorUpdate, GetAssignedSquadsInstructors, UpdateInstructorProfile } = useInstructorsStore();
  const { formData, setFormData, onChange, onSelectChange } = useForm<ProfileINT>({
    id: 0,
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    puesto: 0,
    usuario: "",
    area: ""
  });
  const location = useLocation();
  const [changePasswordModal, setChangePasswordModal] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    status: "success" | "error";
  } | null>(null);


  useEffect(() => {
    GetInstructorPositions();
  }, []);

  useEffect(() => {
    if (formData.id !== 0) {
      GetAssignedSquadsInstructors(formData.id);
    }
  }, [formData.id, isInstructorDataUpdate]);

  useEffect(() => {
    const session = localStorage.getItem("data-egc-admin");
    if (session && instructorPositionsList) {
      const data = JSON.parse(session);
      setFormData({
        ...formData,
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        correo: data.correo,
        puesto: data.idPuesto,
        usuario: data.username,
        area: data.area
      });
    }
  }, [])

  useEffect(() => {
    if (location.state?.reload) {
      console.log("refrescando datos ...");
    }
  }, [location.state]);

  useEffect(() => {
    if (errorMessageInstructors) {
      setAlert({
        title: "Error",
        message: errorMessageInstructors,
        status: "error"
      });
    }
  }, [errorMessageInstructors]);

  useEffect(() => {
    if (errorMessage) {
      setAlert({
        title: "Error",
        message: errorMessage,
        status: "error"
      });
    }
  }, [errorMessage]);

  useEffect(() => {
    if (isPasswordInstructorUpdate) {
      setAlert({
        title: "Éxito",
        message: "Perfil actualizado exitosamente",
        status: "success"
      });
    }
  }, [isPasswordInstructorUpdate]);

  const handleUpdateProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es necesario";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es necesario";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es necesario";
    }

    if (!formData.telefono.trim() || !Utils.isEightDigits(formData.telefono)) {
      newErrors.telefono = "Ingresa un número valido";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es necesario";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    UpdateInstructorProfile(formData);
  }

  return (
    <>
      {
        alert && <CustomAlert
          title={alert.title}
          message={alert.message}
          status={alert.status}
          onClose={() => setAlert(null)}
        />
      }
      {
        (isLoadingGeneralSlice || isLoadingInstructorsSlice) && <CustomLoader />
      }
      {changePasswordModal && (
        <ChangePasswordModal onClose={() => setChangePasswordModal(false)} />
      )}
      <div className="profile-page-main-container">
        <div className="profile-page-header">
          <FaUser className="icon" />
          <div className="profile-page-header-content">
            <strong>{formData.nombre.concat(" ").concat(formData.apellido)}</strong>
            <span>{instructorPositionsList.find(
              (pos) => pos.id === formData.puesto
            )?.value} • {formData.area}</span>
            {/* <p>Administrador del Sistema</p> */}
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="profile-page-body-content">
          <div className="profile-page-filter-container">
            <span className="profile-page-subtitle">
              <FaUserAlt /> Información Personal
            </span>
            <div className="profile-inputs-grid">
              <div className="profile-input-modal">
                <CustomInput
                  name="nombre"
                  label="Nombre"
                  type="text"
                  request
                  value={formData.nombre}
                  onChange={onChange}
                  errorMessage={errors.nombre}
                />
              </div>
              <div className="profile-input-modal">
                <CustomInput
                  name="apellido"
                  label="Apellidos"
                  type="text"
                  request
                  value={formData.apellido}
                  onChange={onChange}
                  errorMessage={errors.apellido}
                />
              </div>
              <div className="profile-input-modal">
                <CustomInput
                  name="telefono"
                  label="Teléfono"
                  type="text"
                  request
                  value={formData.telefono}
                  onChange={onChange}
                  errorMessage={errors.telefono}
                />
              </div>
              <div className="profile-input-modal">
                <CustomInput
                  name="correo"
                  label="Correo"
                  type="text"
                  request
                  value={formData.correo}
                  onChange={onChange}
                  errorMessage={errors.correo}
                />
              </div>
              <div className="profile-input-modal">
                <CustomSelect
                  dataList={instructorPositionsList}
                  name="puesto"
                  disabled
                  label="Puesto"
                  request
                  value={formData.puesto}
                  onChange={onSelectChange}
                />
              </div>
              <div className="profile-input-modal">
                <CustomInput
                  name="usuario"
                  label="Usuario"
                  type="text"
                  disabled
                  request
                  value={formData.usuario}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
          {/* aqui el detalle escuadras y seguridad */}
          <div className="profile-page-detail-info">
            <div className="profile-page-wrap-info">
              <span className="profile-page-subtitle">
                <FaUsers /> Escuadras Asignadas
              </span>
              {assignedSquads.map((item) => {
                return (
                  <div key={item.id} className={`profile-page-card-squad-container`}>
                    <div className={`icon ${formData.puesto === 3 ? "apoyo" : "instructor"}`}>
                      <FaTh />
                    </div>

                    <div className="profile-page-card-info">
                      <span>{item.nombre}</span>
                      <p>{item.principal === 1 ? "Principal" : "Secundaria"}</p>
                    </div>
                    <span className={`profile-page-squad-indicator ${formData.puesto === 3 ? "apoyo" : "instructor"}`}>
                      {instructorPositionsList.find(
                        (pos) => pos.id === formData.puesto
                      )?.value}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="profile-page-wrap-info">
              <span className="profile-page-subtitle">
                <FaShield /> Seguridad
              </span>
              <div className="profile-page-card-squad-container">
                <div className="profile-page-change-password-container">
                  <div className="profile-page-change-password">
                    <div className="icon">
                      <FaTh />
                    </div>
                    <span>Contraseña</span>
                  </div>
                  <button
                    type="button"
                    className="profile-page-button-change-password"
                    onClick={() => setChangePasswordModal(true)}
                  >
                    <FaShield />
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="profile-page-save-button">
              <FaSave /> Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;

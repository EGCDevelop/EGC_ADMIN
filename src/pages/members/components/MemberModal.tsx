import { FaQrcode, FaTimes } from "react-icons/fa";
import { FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { CustomInput } from "../../components/CustomInput";
import { CustomSelect } from "../../components/CustomSelect";
import ComboboxData from "../../../interfaces/ComboboxData";
import { useForm } from "../../../hooks/useForm";
import Member from "../../../interfaces/Member";
import { FormEvent, useEffect, useState } from "react";
import { QRComponent } from "../../components/QRComponent";
import { useGeneralStore } from "../../../hooks/useGeneralStore";
import { CustomLoader } from "../../components/CustomLoader";
import Utils from "../../../utils/Utils";
import { useMemberStore } from "../../../hooks/useMemberStore";
import { CustomAlert } from "../../components/CustomAlert";
import MemberDTO from "../../../interfaces/MemberDTO";
import "../styles/member-modal.css";

interface Props {
  member: MemberDTO;
  onClose: () => void;
}

const states: ComboboxData[] = [
  {
    id: 0,
    value: "Inactivo",
  },
  {
    id: 1,
    value: "Activo",
  },
];

export const MemberModal = ({ member, onClose }: Props) => {
  const { isLoadingGeneralSlice, establishmentList, careerList, squadsList,
    positionList, degreesList, errorMessage, GetEstablishment, GetCareer, GetSquads,
    GetPosition, GetDegrees } = useGeneralStore();
  const { isLoadingMemberSlice, errorMemberSliceMessage, InsertMember, UpdateMember } = useMemberStore();
  const { formData, setFormData, onChange, onSelectChange } = useForm<Member>({
    idIntegrante: 0,
    nombres: "",
    apellidos: "",
    edad: 1,
    telefono: "",
    idEstablecimiento: 0,
    establecimientoNombre: "",
    idCarrera: 0,
    carreraNombre: "",
    idGrado: 0,
    gradoNombre: "",
    seccion: "",
    idEscuadra: 0,
    idPuesto: 8,
    esNuevo: 3,
    usuario: "",
    estadoIntegrante: 1,
    nombreEncargado: "",
    telefonoEncargado: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showOtherEstablishment, setShowOtherEstablishment] =
    useState<boolean>(false);
  const [showOtherCareer, setShowOtherCareer] = useState<boolean>(false);
  const [showOtherDegree, setShowOtherDegree] = useState<boolean>(false);

  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    status: "success" | "error";
  } | null>(null);

  useEffect(() => {
    GetEstablishment();
    GetCareer();
    GetSquads();
    GetPosition();
    GetDegrees();
  }, []);

  const handleInsertOrUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = "El nombre es obligatorio";
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "El apellido es obligatorio";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    }

    // TODO: Esto debe cambiar cuando ya conecte con DB
    if (formData.idEstablecimiento === 0)
      newErrors.idEstablecimiento = "Seleccione un establecimiento";

    if (
      formData.idEstablecimiento === 3 &&
      !formData.establecimientoNombre?.trim()
    )
      newErrors.establecimientoNombre = "El establecimiento es obligatorio";

    if (formData.idCarrera === 0)
      newErrors.idCarrera = "Seleccione una carrera";

    if (formData.idCarrera === 6 && !formData.carreraNombre?.trim())
      newErrors.carreraNombre = "El nombre de la carrera es obligatoria";

    if (formData.idGrado === 0) newErrors.idGrado = "Seleccione un grado";

    if (formData.idGrado === 7 && !formData.gradoNombre?.trim())
      newErrors.gradoNombre = "El nombre del grado es obligatorio";

    if (!formData.seccion.trim()) {
      newErrors.seccion = "La seccion es obligatoria";
    }

    if (formData.idEscuadra === 0) {
      newErrors.idEscuadra = "Seleccione una escuadra";
    }

    if (formData.idPuesto === 0) {
      newErrors.idPuesto = "Seleccione un puesto";
    }

    if (!formData.nombreEncargado.trim()) {
      newErrors.nombreEncargado = "El nombre del encargado es obligatorio";
    }

    if (!formData.telefonoEncargado.trim()) {
      newErrors.telefonoEncargado = "El teléfono del encargado es obligatorio";
    }


    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // insert
    if (formData.idIntegrante === 0) {
      InsertMember(formData);
    }
    // update
    else {
      UpdateMember(formData);
    }
  };

  useEffect(() => {
    if (member && member.intIdIntegrante !== 0) {
      setFormData({
        idIntegrante: member.intIdIntegrante,
        nombres: member.intNombres || "",
        apellidos: member.intApellidos || "",
        edad: member.intEdad || 1,
        telefono: member.intTelefono || "",
        idEstablecimiento: member.intestIdEstablecimiento || 0,
        establecimientoNombre: member.intEstablecimientoNombre || "",
        idCarrera: member.intcarIdCarrera || 0,
        carreraNombre: member.intCarreraNombre || "",
        idGrado: member.intgraIdGrado || 0,
        gradoNombre: member.graNombreGrado || "",
        seccion: member.intSeccion || "",
        idEscuadra: member.intescIdEscuadra || 0,
        idPuesto: member.intpuIdPuesto || 0,
        esNuevo: member.intEsNuevo !== 0 ? 3 : 1,
        usuario: member.intUsuario ?? "",
        estadoIntegrante: member.intEstadoIntegrante || 1,
        nombreEncargado: member.intNombreEncargado || "",
        telefonoEncargado: member.intTelefonoEncargado || "",
      });
    }
  }, [member]);


  useEffect(() => {
    if (errorMessage) {
      setAlert({
        title: "Error",
        message: errorMessage,
        status: "error"
      })
    }
  }, [errorMessage])

  useEffect(() => {
    if (errorMemberSliceMessage) {
      setAlert({
        title: "Error",
        message: errorMemberSliceMessage,
        status: "error"
      })
    }
  }, [errorMessage])

  return (
    <>
      {
        (isLoadingGeneralSlice || isLoadingMemberSlice) && <CustomLoader />
      }
      {
        alert && <CustomAlert
          message={alert.message}
          title={alert.title}
          status={alert.status}
          onClose={() => setAlert(null)}
        />
      }
      <div className="container-main-member-modal">
        <div className="content-member-modal">
          <div className="content-header-member-modal">
            <strong>{formData.idIntegrante === 0 ? "Crear Usuario" : "Editar Usuario"}</strong>
            <FaTimes className="icon" onClick={onClose} />
          </div>

          <form
            method="POST"
            className="form-member-modal"
            onSubmit={handleInsertOrUpdate}
          >
            <div className="form-header-member-modal">
              <div className="personal-info-member-modal">
                <div className="qr-content-member-modal">
                  <span>Código QR</span>
                  {
                    formData.idIntegrante === 0 ? <FaQrcode className="icon" /> : <QRComponent data={formData.idIntegrante!.toString()} />
                  }
                </div>
                <div className="personal-inputs-member-modal">
                  <span>Información Personal</span>
                  <div className="container-input-member-modal">
                    <CustomInput
                      name="nombres"
                      label="Nombres"
                      request
                      value={formData.nombres}
                      onChange={onChange}
                      errorMessage={errors.nombres}
                    />
                  </div>
                  <div className="container-input-member-modal">
                    <CustomInput
                      name="apellidos"
                      label="Apellidos"
                      request
                      value={formData.apellidos}
                      onChange={onChange}
                      errorMessage={errors.apellidos}
                    />
                  </div>
                  <div className="container-input-member-modal">
                    <CustomInput
                      name="edad"
                      label="Edad"
                      type="number"
                      request
                      value={formData.edad!.toString()}
                      onChange={onChange}
                    />
                  </div>
                  <div className="container-input-member-modal">
                    <CustomInput
                      name="telefono"
                      label="Teléfono"
                      request
                      value={formData.telefono}
                      onChange={onChange}
                      errorMessage={errors.telefono}
                    />
                  </div>
                </div>
              </div>
              <div className="form-other-info">
                <div className="other-info-member-modal">
                  <div className="form-academic-information-member-modal">
                    <span>Información Académica</span>

                    <div className="inputs-grid">
                      <div className="container-input-member-modal">
                        <CustomSelect
                          dataList={establishmentList}
                          name="idEstablecimiento"
                          label="Establecimiento"
                          initValue
                          request
                          value={formData.idEstablecimiento}
                          onChange={(e) => {
                            onSelectChange(e);
                            setShowOtherEstablishment(
                              Number(e.target.value) === 3
                            );
                          }}
                          errorMessage={errors.idEstablecimiento}
                        />
                      </div>
                      {(showOtherEstablishment || formData.idEstablecimiento === 3) && (
                        <div className="container-input-member-modal">
                          <CustomInput
                            name="establecimientoNombre"
                            label="Nombre establecimiento"
                            request
                            value={formData.establecimientoNombre!}
                            onChange={onChange}
                            errorMessage={errors.establecimientoNombre}
                          />
                        </div>
                      )}

                      <div className="container-input-member-modal">
                        <CustomSelect
                          dataList={careerList}
                          name="idCarrera"
                          label="Carrera"
                          initValue
                          request
                          value={formData.idCarrera}
                          onChange={(e) => {
                            onSelectChange(e);
                            setShowOtherCareer(Number(e.target.value) === 6);
                          }}
                          errorMessage={errors.idCarrera}
                        />
                      </div>
                      {(showOtherCareer || formData.idCarrera === 6) && (
                        <div className="container-input-member-modal">
                          <CustomInput
                            name="carreraNombre"
                            label="Nombre carrera"
                            request
                            value={formData.carreraNombre!}
                            onChange={onChange}
                            errorMessage={errors.carreraNombre}
                          />
                        </div>
                      )}
                      <div className="container-input-member-modal">
                        <CustomSelect
                          dataList={degreesList}
                          name="idGrado"
                          label="Grado"
                          initValue
                          request
                          value={formData.idGrado}
                          onChange={(e) => {
                            onSelectChange(e);
                            setShowOtherDegree(Number(e.target.value) === 7);
                          }}
                          errorMessage={errors.idGrado}
                        />
                      </div>
                      {(showOtherDegree || formData.idGrado === 7) && (
                        <div className="container-input-member-modal">
                          <CustomInput
                            name="gradoNombre"
                            label="Nombre grado"
                            request
                            value={formData.gradoNombre!}
                            onChange={onChange}
                            errorMessage={errors.gradoNombre}
                          />
                        </div>
                      )}
                      <div className="container-input-member-modal">
                        <CustomInput
                          name="seccion"
                          label="Sección"
                          request
                          value={formData.seccion!}
                          onChange={onChange}
                          errorMessage={errors.seccion}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="other-info-member-modal">
                  <div className="form-academic-information-member-modal">
                    <span>Información de la Banda</span>

                    <div className="inputs-grid">
                      <div className="container-input-member-modal">
                        <CustomSelect
                          dataList={squadsList}
                          name="idEscuadra"
                          label="Escuadra"
                          initValue
                          request
                          onChange={onSelectChange}
                          value={formData.idEscuadra}
                          errorMessage={errors.idEscuadra}
                        />
                      </div>
                      <div className="container-input-member-modal">
                        <CustomSelect
                          dataList={positionList}
                          name="idPuesto"
                          label="Puesto"
                          initValue
                          request
                          onChange={onSelectChange}
                          value={formData.idPuesto}
                          errorMessage={errors.idPuesto}
                        />
                      </div>
                      <div className="container-input-member-modal">
                        <CustomSelect
                          dataList={Utils.stateDataList()}
                          name="esNuevo"
                          label="¿Es nuevo integrante?"
                          request
                          disabled={formData.idIntegrante === 0}
                          onChange={onSelectChange}
                          value={formData.esNuevo}
                        />
                      </div>
                      <div className="container-input-member-modal">
                        <CustomInput
                          name="usuario"
                          label="Usuario"
                          disabled
                          value={formData.usuario!}
                          onChange={onChange}
                        />
                      </div>
                      <div className="container-input-member-modal">
                        <CustomSelect
                          dataList={states}
                          name="estadoIntegrante"
                          label="Estado"
                          request
                          disabled
                          onChange={onSelectChange}
                          value={formData.estadoIntegrante}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="other-info-member-modal">
                  <div className="form-academic-information-member-modal">
                    <span>Información del Encargado</span>
                    <div className="inputs-grid">
                      <div className="container-input-member-modal">
                        <CustomInput
                          name="nombreEncargado"
                          label="Nombre del encargado"
                          request
                          value={formData.nombreEncargado!}
                          onChange={onChange}
                          errorMessage={errors.nombreEncargado}
                        />
                      </div>
                      <div className="container-input-member-modal">
                        <CustomInput
                          name="telefonoEncargado"
                          label="Teléfono del encargado"
                          request
                          value={formData.telefonoEncargado!}
                          onChange={onChange}
                          errorMessage={errors.telefonoEncargado}
                        />
                      </div>
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
  );
};

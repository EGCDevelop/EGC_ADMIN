import { FaQrcode, FaTimes } from "react-icons/fa";
import { FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { CustomInput } from "../../components/CustomInput";
import { CustomSelect } from "../../components/CustomSelect";
import ComboboxData from "../../../interfaces/ComboboxData";
import "../styles/member-modal.css";
import { useForm } from "../../../hooks/useForm";
import Member from "../../../interfaces/Member";
import { FormEvent, useState } from "react";
import { QRComponent } from "../../components/QRComponent";

interface Props {
  onClose: () => void;
}

const establishmentData: ComboboxData[] = [
  {
    id: 1,
    value: "Enrique Gomez Carrillo",
  },
  {
    id: 2,
    value: "Romulo Gallego",
  },
  {
    id: 3,
    value: "Otro",
  },
];

const careersData: ComboboxData[] = [
  {
    id: 1,
    value: "Basicos",
  },
  {
    id: 2,
    value: "Perito contador",
  },
  {
    id: 3,
    value: "Secretariado bilinguie",
  },
  {
    id: 4,
    value: "Secretariado oficinista",
  },
  {
    id: 5,
    value: "Otro",
  },
];

const degrees: ComboboxData[] = [
  {
    id: 1,
    value: "Primero",
  },
  {
    id: 2,
    value: "Segundo",
  },
  {
    id: 3,
    value: "Tercero",
  },
  {
    id: 4,
    value: "Cuarto",
  },
  {
    id: 5,
    value: "Quinto",
  },
  {
    id: 6,
    value: "Sexto",
  },
  {
    id: 7,
    value: "Otro",
  },
];

const squadData: ComboboxData[] = [
  {
    id: 1,
    value: "Gastadores",
  },
  {
    id: 2,
    value: "Batonistas",
  },
  {
    id: 3,
    value: "Marcadoras",
  },
  {
    id: 4,
    value: "Tamborines",
  },
  {
    id: 5,
    value: "Redoblantes",
  },
];

const positionData: ComboboxData[] = [
  {
    id: 1,
    value: "Comandante",
  },
  {
    id: 2,
    value: "Subcomandante",
  },
  {
    id: 3,
    value: "Integrante",
  },
];

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

const isNewData: ComboboxData[] = [
  {
    id: 0,
    value: "No",
  },
  {
    id: 1,
    value: "Si",
  },
];

export const MemberModal = ({ onClose }: Props) => {
  const { formData, onChange, onSelectChange } = useForm<Member>({
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
    idPuesto: 0,
    esNuevo: 1,
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

    if (formData.idCarrera === 5 && !formData.carreraNombre?.trim())
      newErrors.carreraNombre = "El nombre de la carrera es obligatoria";

    if (formData.idGrado === 0) newErrors.idGrado = "Seleccione un grado";

    if (formData.idGrado === 7 && !formData.gradoNombre?.trim())
      newErrors.gradoNombre = "El nombre del grado es obligatorio";

    if (!formData.seccion.trim()) {
      newErrors.seccion = "La seccion es obligatoria";
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

    console.log(formData);
  };

  return (
    <>
      <div className="container-main-member-modal">
        <div className="content-member-modal">
          <div className="content-header-member-modal">
            <strong>Crear Usuario</strong>
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
                  {/* <FaQrcode className="icon" /> */}
                  <QRComponent data="100" />
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
                          dataList={establishmentData}
                          name="idEstablecimiento"
                          label="Establecimiento"
                          initValue
                          request
                          value={formData.idEstablecimiento}
                          onChange={(e) => {
                            console.log(e.target.value);
                            onSelectChange(e);
                            setShowOtherEstablishment(
                              Number(e.target.value) === 3
                            );
                          }}
                          errorMessage={errors.idEstablecimiento}
                        />
                      </div>
                      {showOtherEstablishment && (
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
                          dataList={careersData}
                          name="idCarrera"
                          label="Carrera"
                          initValue
                          request
                          value={formData.idCarrera}
                          onChange={(e) => {
                            onSelectChange(e);
                            setShowOtherCareer(Number(e.target.value) === 5);
                          }}
                          errorMessage={errors.idCarrera}
                        />
                      </div>
                      {showOtherCareer && (
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
                          dataList={degrees}
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
                      {showOtherDegree && (
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
                          dataList={squadData}
                          name="idEscuadra"
                          label="Escuadra"
                          initValue
                          request
                          onChange={onSelectChange}
                          value={formData.idEscuadra}
                        />
                      </div>
                      <div className="container-input-member-modal">
                        <CustomSelect
                          dataList={positionData}
                          name="idPuesto"
                          label="Puesto"
                          initValue
                          request
                          onChange={onSelectChange}
                          value={formData.idPuesto}
                        />
                      </div>
                      <div className="container-input-member-modal">
                        <CustomSelect
                          dataList={isNewData}
                          name="esNuevo"
                          label="¿Es nuevo integrante?"
                          request
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

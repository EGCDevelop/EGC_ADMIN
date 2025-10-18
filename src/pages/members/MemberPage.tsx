import {
  FaArrowLeft,
  FaArrowRight,
  FaDownload,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import "./styles/member-page.css";
import { FaPenToSquare } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { MemberModal } from "./components/MemberModal";
import { CancelMemberModal } from "./components/CancelMemberModal";
import { CustomInput } from "../components/CustomInput";
import { CustomSelect } from "../components/CustomSelect";
import { CustomAlert } from "../components/CustomAlert";
import { useGeneralStore } from "../../hooks/useGeneralStore";
import { CustomLoader } from "../components/CustomLoader";
import Utils from "../../utils/Utils";
import { useForm } from "../../hooks/useForm";
import { useMemberStore } from "../../hooks/useMemberStore";
import { useDebounce } from "../../hooks/useDebounce";

interface DataFilter {
  name: string;
  establishment: number;
  career: number;
  squad: number;
  position: number;
  isNew: number;
}

export const MemberPage = () => {
  const { isLoadingMemberSlice, errorMemberSliceMessage, memberDataList, GetMemberForInstructor } = useMemberStore();
  const { isLoadingGeneralSlice, establishmentList, careerList, squadsList,
    positionList, errorMessage, GetEstablishment, GetCareer, GetSquads,
    GetPosition } = useGeneralStore();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);
  const { formData, onChange, onSelectChange } = useForm<DataFilter>({
    name: "",
    establishment: 0,
    career: 0,
    squad: 0,
    position: 0,
    isNew: 2
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const totalPage = Math.ceil(memberDataList.length / pageSize);
  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    status: "success" | "error";
  } | null>(null);

  const paginatedData = memberDataList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );


  const debouncedName = useDebounce(formData.name, 500);

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
    if (openCancelModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [openCancelModal]);

  useEffect(() => {
    GetEstablishment();
    GetCareer();
    GetSquads();
    GetPosition();
  }, []);

  useEffect(() => {
    if (errorMessage || errorMemberSliceMessage) {
      const validateMessage = errorMessage ? errorMessage : errorMemberSliceMessage;
      setAlert({
        title: "Error",
        message: validateMessage!,
        status: "error"
      })
    }
  }, [errorMessage])

  useEffect(() => {
    GetMemberForInstructor(
      debouncedName,
      formData.squad,
      formData.establishment,
      formData.isNew,
      1,
      formData.career
    );
  }, [debouncedName, formData.establishment, formData.career, formData.squad, formData.position, formData.isNew])

  return (
    <>
      {(isLoadingGeneralSlice || isLoadingMemberSlice) && <CustomLoader />}
      {
        alert && <CustomAlert
          title={alert.title}
          message={alert.message}
          status={alert.status}
          onClose={() => setAlert(null)}
        />
      }
      {openModal && <MemberModal onClose={() => setOpenModal(false)} />}
      {openCancelModal && (
        <CancelMemberModal onClose={() => setOpenCancelModal(false)} />
      )}
      <div className="member-page-main-container">
        <div className="member-page-header">
          <div className="member-page-header-content">
            <strong>Gestión de Usuarios</strong>
            <p>Administra los integrantes del sistema de manera eficiente</p>
          </div>
          <div className="member-page-header-content">
            <div className="member-page-general-acount">
              <p>Total de usuarios</p>
              <span>{memberDataList.length}</span>
            </div>
            <button
              type="button"
              className="member-page-add-button"
              onClick={() => setOpenModal(true)}
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
              dataList={establishmentList}
              name="establishment"
              initValue
              label="Establecimiento"
              value={formData.establishment}
              onChange={onSelectChange}
            />

            <CustomSelect
              dataList={careerList}
              name="career"
              initValue
              label="Carrera"
              value={formData.career}
              onChange={onSelectChange}
            />

            <CustomSelect
              dataList={squadsList}
              name="squad"
              initValue
              label="Escuadra"
              value={formData.squad}
              onChange={onSelectChange}
            />

            <CustomSelect
              label="Puesto"
              dataList={positionList}
              name="position"
              initValue
              value={formData.position}
              onChange={onSelectChange}
            />

            <CustomSelect
              label="Estado"
              dataList={Utils.stateDataList()}
              name="isNew"
              initValue
              value={formData.isNew}
              onChange={onSelectChange}
            />
          </div>
        </div>

        <div className="member-page-table-container">
          <div className="member-page-table-header">
            <strong>Lista de usuarios</strong>
            <p>Gestiona la información de todos los integrantes</p>
          </div>
          <div className="member-page-table-wrapper">
            {/* Encabezados */}
            <div className="member-page-table-row header">
              <div className="cell header">NOMBRE COMPLETO</div>
              <div className="cell header">ESTABLECIMIENTO</div>
              <div className="cell header">ESCUADRA</div>
              <div className="cell header">CARRERA</div>
              <div className="cell header">ESTADO</div>
              <div className="cell header">PUESTO</div>
              <div className="cell header">ACCIONES</div>
            </div>

            {/* Filas */}
            {paginatedData.map((user) => (
              <div className="member-page-table-row" key={user.intIdIntegrante}>
                <div className="cell">{user.intNombres.concat(" ").concat(user.intApellidos)}</div>
                <div className="cell">
                  <p className="cell-squad">{user.escNombre}</p>
                </div>
                <div className="cell">{user.estNombreEstablecimiento}</div>
                <div className="cell">{user.carNombreCarrera}</div>
                <div className="cell">
                  <p
                    className={`${user.intEsNuevo ? "cell-state-inactive" : "cell-state-active"
                      }`}
                  >
                    {user.intEsNuevo ? "Nuevo" : "Antiguo"}
                  </p>
                </div>
                <div className="cell">{user.puNombre}</div>
                <div className="cell actions">
                  <div className="action-menu">
                    <button className="action-btn">⋮</button>
                    <div className="dropdown">
                      <button type="button">
                        <FaPenToSquare /> Editar
                      </button>
                      <button type="button">
                        <FaDownload /> Descargar QR
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenCancelModal(true)}
                      >
                        <FaTrash /> Dar baja
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="member-page-filter-container member-page-nav-table">
          <span>
            Página {currentPage} de {totalPage}
          </span>
          <div className="member-page-nav-container-button">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <FaArrowLeft /> Anterior
            </button>
            <button
              disabled={currentPage === totalPage}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPage))}
            >
              Siguiente <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberPage;

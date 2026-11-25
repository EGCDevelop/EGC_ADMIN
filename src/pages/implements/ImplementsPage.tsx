import { FaBagShopping, FaPlus } from "react-icons/fa6";
import { CustomInput } from "../components/CustomInput";
import { FaEdit, FaSearch } from "react-icons/fa";
import { useForm } from "../../hooks/useForm";
import { useDebounce } from "../../hooks/useDebounce";
import "./styles/implements-page.css";
import CustomModal from "../components/CustomModal";
import { useEffect, useState } from "react";
import { ImplementsModel } from "./components/ImplementsModel";
import { CustomSelect } from "../components/CustomSelect";
import Utils from "../../utils/Utils";
import { useUniformStore } from "../../hooks/useUniformStore";
import { CustomLoader } from "../components/CustomLoader";
import ImplementsForm from "../../interfaces/ImplementsForm";
import CustomFilter from "../components/CustomFilter";
import { CustomAlert } from "../components/CustomAlert";
import ErrorData from "../../interfaces/ErrorData.types";
import { useNavigate } from "react-router-dom";

interface DataSearch {
  search: string;
  state: number;
}

export const ImplementsPage = () => {
  const navigate = useNavigate();
  const {
    isLoadingUniformSlice,
    uniformsList,
    errorMessageUniformSlice,
    lastCreatedUniformSlice,
    lastUpdatedUniformSlice,
    GetUniforms,
    UpdateUniform,
    ResetShowAlert,
  } = useUniformStore();
  const [dataUpdate, setDataUpdate] = useState<
    ImplementsForm | undefined | null
  >(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeactivateModal, setOpenDeactivateModal] =
    useState<boolean>(false);
  const { formData, onChange, onSelectChange } = useForm<DataSearch>({
    search: "",
    state: 0,
  });

  const [alert, setAlert] = useState<ErrorData | null>(null);

  const debounceSearch = useDebounce(formData.search, 500);

  const onOpenModal = (data: ImplementsForm | undefined | null) => {
    setDataUpdate(data);
    setOpenModal(true);
  };

  const onDeactivate = (data: ImplementsForm) => {
    setOpenDeactivateModal(true);
    const newData: ImplementsForm = {
      ...data,
      state: data.state === 1 ? 2 : 1,
    };
    setDataUpdate(newData);
  };

  useEffect(() => {
    GetUniforms(formData.state, debounceSearch);
  }, [
    debounceSearch,
    formData.state,
    lastCreatedUniformSlice,
    lastUpdatedUniformSlice,
  ]);

  useEffect(() => {
    if (lastCreatedUniformSlice || lastUpdatedUniformSlice) {
      const susseccMessage: string = lastCreatedUniformSlice
        ? "Implemento creado exitosamente"
        : "Implemento actualizado exitosamente";
      setOpenModal(false);
      setOpenDeactivateModal(false);
      setAlert({
        title: "Exito",
        message: susseccMessage,
        status: lastCreatedUniformSlice ? "success" : "info",
      });

      setTimeout(() => {
        ResetShowAlert();
      }, 4000);
    }
  }, [lastCreatedUniformSlice, lastUpdatedUniformSlice]);

  useEffect(() => {
    if (errorMessageUniformSlice) {
      setAlert({
        title: "Error",
        message: errorMessageUniformSlice,
        status: "error",
      });
    }
  }, [errorMessageUniformSlice]);

  return (
    <>
      {isLoadingUniformSlice && <CustomLoader />}
      {alert && (
        <CustomAlert
          title={alert.title}
          message={alert.message}
          status={alert.status}
          onClose={() => setAlert(null)}
        />
      )}
      <CustomModal
        title="Nuevo Implemento"
        size="small"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <ImplementsModel
          onClose={() => setOpenModal(false)}
          data={dataUpdate}
        />
      </CustomModal>
      <CustomModal
        title={
          dataUpdate?.state === 2
            ? "Desactivar implemento"
            : "Activar implemento"
        }
        size="small"
        isOpen={openDeactivateModal}
        onClose={() => setOpenDeactivateModal(false)}
      >
        <div className="container-deactivate-buttons">
          <button onClick={() => UpdateUniform(dataUpdate!)}>Aceptar</button>
          <button onClick={() => setOpenDeactivateModal(false)}>Salir</button>
        </div>
      </CustomModal>
      <div className="member-page-main-container">
        <div className="member-page-header">
          <div className="member-page-header-content">
            <strong>Implementos</strong>
            <p>Gestiona los implementos disponibles para los uniformes.</p>
          </div>
          <div className="member-page-header-content">
            <button
              className="create-closet-button"
              onClick={() => navigate(`/closetOptions`)}
            >
              <FaBagShopping /> Clóset
            </button>
            <button
              type="button"
              className="member-page-add-button"
              onClick={() => onOpenModal(null)}
            >
              <FaPlus />
              Agregar
            </button>
          </div>
        </div>

        <CustomFilter>
          <CustomInput
            type="search"
            label="Por nombre"
            name="search"
            placeholder="Guerrera, Pantalon, Quepi, Ros, etc..."
            value={formData.search}
            onChange={onChange}
            icon={<FaSearch />}
          />

          <CustomSelect
            label="Estado"
            name="state"
            initValue
            dataList={Utils.instructorStateDataList()}
            value={formData.state}
            onChange={onSelectChange}
          />
        </CustomFilter>

        <div className="container-grid-implements">
          {uniformsList.map((data: ImplementsForm) => {
            return (
              <div key={data.id} className="container-card-implement">
                <div className="header-card-implement">
                  <strong>{data.name}</strong>
                  <span>{data.state === 1 ? "Activo" : "Inactivo"}</span>
                </div>
                <div className="body-card-implement">
                  <strong>{Utils.formatCurrency(data.price)}</strong>
                </div>
                <div className="footer-card-implement">
                  <button onClick={() => onDeactivate(data)}>
                    {data.state === 1 ? "Desactivar" : "Activar"}
                  </button>
                  <button onClick={() => onOpenModal(data)}>
                    <FaEdit /> Editar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ImplementsPage;

import { FaPlus } from "react-icons/fa6";
import { CustomInput } from "../components/CustomInput";
import { FaEdit, FaSearch } from "react-icons/fa";
import { useForm } from "../../hooks/useForm";
import { useDebounce } from "../../hooks/useDebounce";
import './styles/implements-page.css';
import CustomModal from "../components/CustomModal";
import { useEffect, useState } from "react";
import { ImplementsModel } from "./components/ImplementsModel";
import { CustomSelect } from "../components/CustomSelect";
import Utils from "../../utils/Utils";
import { useUniformStore } from "../../hooks/useUniformStore";
import { CustomLoader } from "../components/CustomLoader";
import ImplementsForm from "../../interfaces/ImplementsForm";
import CustomFilter from "../components/CustomFilter";


interface DataSearch {
    search: string;
    state: number;
}

export const ImplementsPage = () => {
    const { isLoadingUniformSlice, uniformsList, errorMessageUniformSlice, GetUniforms } = useUniformStore();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const { formData, onChange, onSelectChange } = useForm<DataSearch>({
        search: "",
        state: 0
    });

    const debounceSearch = useDebounce(formData.search, 500);

    useEffect(() => {
        GetUniforms(formData.state, debounceSearch)
    }, [debounceSearch, formData.state]);

    return (
        <>
            {
                isLoadingUniformSlice && <CustomLoader />
            }
            <CustomModal title="Nuevo Implemento" size="small" isOpen={openModal} onClose={() => setOpenModal(false)} >
                <ImplementsModel onClose={() => setOpenModal(false)} data={null} />
            </CustomModal>
            <div className="member-page-main-container">
                <div className="member-page-header">
                    <div className="member-page-header-content">
                        <strong>Implementos</strong>
                        <p>Gestiona los implementos disponibles para los uniformes.</p>
                    </div>
                    <div className="member-page-header-content">
                        <div className="member-page-general-acount">
                            <p>Implementos</p>
                            <span>50</span>
                        </div>
                        {/* {
                                        user!.rol === 1 &&
                                        <button
                                            type="button"
                                            className="member-page-add-button"
                                            onClick={() => onHandleOpenModal(null)}
                                        >
                                            <FaPlus />
                                            Nuevo
                                        </button>
                                    } */}
                        <button
                            type="button"
                            className="member-page-add-button"
                            onClick={() => setOpenModal(true)}
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
                    {
                        uniformsList.map((data: ImplementsForm) => {
                            return <div key={data.id} className="container-card-implement">
                                <div className="header-card-implement">
                                    <strong>{data.name}</strong>
                                    <span>{data.state === 1 ? 'Activo' : 'Inactivo'}</span>
                                </div>
                                <div className="body-card-implement">
                                    <strong>{Utils.formatCurrency(data.price)}</strong>
                                </div>
                                <div className="footer-card-implement">
                                    <button><FaEdit /> Editar</button>
                                    <button>Desactivar</button>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default ImplementsPage;
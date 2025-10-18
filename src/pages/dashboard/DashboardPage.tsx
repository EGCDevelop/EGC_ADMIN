import { FaFilter } from "react-icons/fa";
import ComboboxData from "../../interfaces/ComboboxData";
import { CustomSelect } from "../components/CustomSelect";
import "./styles/dashboard-page.css";
import { Chartbar } from "./components/Chartbar";
import { ChartPie } from "./components/ChartPie";
import { FaCalendar, FaChartPie } from "react-icons/fa6";

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

export const DashboardPage = () => {
  return (
    <>
      <div className="dashboard-page-main-content">
        <div className="dashboard-page-header">
          <div className="dashboard-page-header-content">
            <strong>Dashboard de Gestión</strong>
            <p>Análisis y estadísticas de la banda de guerra</p>
          </div>

          <div className="dashboard-page-header-content">
            <div className="dashboard-page-general-acount">
              <span>15</span>
              <p>Total de integrantes</p>
            </div>
          </div>
        </div>

        <div className="dashboard-page-filter-container">
          <strong>
            <FaFilter /> Filtros
          </strong>
          <div className="dashboard-page-combobox-filter">
            <CustomSelect
              dataList={establishmentData}
              name="establecimiento"
              initValue
              label="Establecimiento"
            />
            <CustomSelect
              dataList={establishmentData}
              name="establecimiento"
              initValue
              label="Carrera"
            />
            <CustomSelect
              dataList={establishmentData}
              name="establecimiento"
              initValue
              label="Escuadra"
            />
          </div>
        </div>

        <div className="dashboard-page-filter-container">
          <strong>
            <FaFilter /> Integrantes por Escuadra
          </strong>
          <div className="dashboard-page-chart-content">
            <div className="dashboard-page-chart-bar-content">
              <span>Integrantes</span>
              <Chartbar
                titlesData={[
                  "Gastadores",
                  "Batonistas",
                  "Vientos",
                  "Liras/Xilofonos",
                  "Marcadoras",
                  "Tamborines",
                  "Redoblantes",
                  "Bombines",
                  "Bombos",
                ]}
                amountData={[20, 20, 40, 25, 11, 21, 40, 30, 30]}
              />
            </div>

            <div className="dashboard-page-chart-bar-content">
              <span>Aspirantes</span>
              <Chartbar
                titlesData={["Aspirantes gastadores", "Aspirantes batonistas"]}
                amountData={[15, 70]}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-page-filter-container">
          <div className="dashboard-page-chart-content">
            <div className="dashboard-page-chart-bar-content">
              <strong>
                <FaChartPie /> Distribución por Establecimiento
              </strong>
              <ChartPie
                data={[
                  { value: 120, name: "Enrique Gomez Carrillo" },
                  { value: 80, name: "Romulo Gallego" },
                  { value: 25, name: "Otros" },
                ]}
              />
            </div>

            <div className="dashboard-page-chart-bar-content">
              <strong>
                <FaCalendar /> Nuevos vs Antiguos Integrantes
              </strong>
              <ChartPie
                data={[
                  { value: 120, name: "Antiguos" },
                  { value: 80, name: "Nuevos" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-page-filter-container">
          <strong>
            <FaCalendar /> Resumen Estadístico
          </strong>

          <div className="dashboard-page-summary-grid">
            <div className="dashboard-page-summary-card">
              <span className="number">120</span>
              <p className="title">Total Integrantes</p>
            </div>
            <div className="dashboard-page-summary-card">
              <span className="number">80</span>
              <p className="title">Nuevos Integrantes</p>
            </div>
            <div className="dashboard-page-summary-card">
              <span className="number">25</span>
              <p className="title">Integrantes Antiguos</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

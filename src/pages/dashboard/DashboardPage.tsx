import { FaFilter } from "react-icons/fa";
import { CustomSelect } from "../components/CustomSelect";
import { Chartbar } from "./components/Chartbar";
import { ChartPie } from "./components/ChartPie";
import { FaCalendar, FaChartPie } from "react-icons/fa6";
import { useGeneralStore } from "../../hooks/useGeneralStore";
import { useForm } from "../../hooks/useForm";
import { useEffect, useMemo, useState } from "react";
import { CustomLoader } from "../components/CustomLoader";
import { CustomAlert } from "../components/CustomAlert";
import { useMemberStore } from "../../hooks/useMemberStore";
import "./styles/dashboard-page.css";

interface DataFilter {
  idEstablishment: number;
  idCareer: number;
  idSquad: number;
}

export const DashboardPage = () => {
  const { isLoadingMemberSlice, errorMemberSliceMessage, memberDataList, GetMemberForInstructor } = useMemberStore();
  const { isLoadingGeneralSlice, establishmentList, careerList, squadsList,
    errorMessage, GetEstablishment, GetCareer, GetSquads } = useGeneralStore();

  const { formData, onSelectChange } = useForm<DataFilter>({
    idEstablishment: 0,
    idCareer: 0,
    idSquad: 0
  });

  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    status: "success" | "error";
  } | null>(null);

  const totalNewMembers = memberDataList.filter((member) => member.intEsNuevo === 1).length;
  const totalOldMembers = memberDataList.filter((member) => member.intEsNuevo === 0).length;
  const countBySquad: Record<number, number> = {};

  memberDataList.forEach((m) => {
    const id = m.intescIdEscuadra;
    countBySquad[id] = (countBySquad[id] || 0) + 1;
  });
  const titlesData = squadsList.map((s) => String(s.value));
  const amountData = squadsList.map((s) => countBySquad[s.id] || 0);


  const categoryData = useMemo(() => {
    // 1. Definimos los nombres de las categorías según tus notas
    const categoryNames: Record<number, string> = {
      1: "Categoría A",
      2: "Categoría B",
      3: "Fábrica"
    };

    // 2. Inicializamos el contador
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };

    // 3. Contamos las ocurrencias
    memberDataList.forEach((member) => {
      if (counts[member.categoria] !== undefined) {
        counts[member.categoria]++;
      }
    });

    // 4. Retornamos el formato final para ChartPie [{ value, name }]
    return Object.keys(counts).map((key) => ({
      name: categoryNames[Number(key)],
      value: counts[Number(key)]
    }));
  }, [memberDataList]);


  useEffect(() => {
    GetEstablishment();
    GetCareer();
    GetSquads();
  }, []);

  useEffect(() => {
    GetMemberForInstructor(
      "",
      formData.idSquad,
      formData.idEstablishment,
      2,
      1,
      formData.idCareer,
      0
    )
  }, [formData.idEstablishment, formData.idCareer, formData.idSquad])

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
  }, [errorMemberSliceMessage])

  const order = ["Gomez", "Romulo", "Otros"];

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};

    memberDataList.forEach((member) => {
      const name = member.estNombreEstablecimiento || "Sin nombre";
      counts[name] = (counts[name] || 0) + 1;
    });

    const data = Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));

    data.sort((a, b) => {
      const indexA = order.indexOf(a.name);
      const indexB = order.indexOf(b.name);

      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });

    return data;
  }, [memberDataList]);

  const newVsOldData = useMemo(() => {
    let nuevos = 0;
    let antiguos = 0;

    memberDataList.forEach((member) => {
      if (member.intEsNuevo === 1) {
        nuevos++;
      } else {
        antiguos++;
      }
    });

    return [
      { name: "Nuevos", value: nuevos },
      { name: "Antiguos", value: antiguos },
    ];
  }, [memberDataList]);

  return (
    <>
      {
        (isLoadingGeneralSlice || isLoadingMemberSlice) && <CustomLoader />
      }
      {
        alert && <CustomAlert
          title={alert.title}
          message={alert.message}
          status={alert.status}
          onClose={() => setAlert(null)}
        />
      }
      <div className="dashboard-page-main-content">
        <div className="dashboard-page-header">
          <div className="dashboard-page-header-content">
            <strong>Dashboard de Gestión</strong>
            <p>Análisis y estadísticas de la banda de guerra</p>
          </div>

          <div className="dashboard-page-header-content">
            <div className="dashboard-page-general-acount">
              <span>{memberDataList.length}</span>
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
              dataList={establishmentList}
              name="idEstablishment"
              initValue
              label="Establecimiento"
              value={formData.idEstablishment}
              onChange={onSelectChange}
            />
            <CustomSelect
              dataList={careerList}
              name="idCareer"
              initValue
              label="Carrera"
              value={formData.idCareer}
              onChange={onSelectChange}
            />
            <CustomSelect
              dataList={squadsList}
              name="idSquad"
              initValue
              label="Escuadra"
              value={formData.idSquad}
              onChange={onSelectChange}
            />
          </div>
        </div>

        <div className="dashboard-page-filter-container">
          <strong>
            <FaCalendar /> Resumen Estadístico
          </strong>

          <div className="dashboard-page-summary-grid">
            <div className="dashboard-page-summary-card">
              <span className="number">{memberDataList.length}</span>
              <p className="title">Total Integrantes</p>
            </div>
            <div className="dashboard-page-summary-card">
              <span className="number">{totalNewMembers}</span>
              <p className="title">Nuevos Integrantes</p>
            </div>
            <div className="dashboard-page-summary-card">
              <span className="number">{totalOldMembers}</span>
              <p className="title">Integrantes Antiguos</p>
            </div>

            <div className="dashboard-page-summary-card">
              <span className="number">{memberDataList.filter((m) => m.categoria === 1).length}</span>
              <p className="title">Categoría A</p>
            </div>

            <div className="dashboard-page-summary-card">
              <span className="number">{memberDataList.filter((m) => m.categoria === 2).length}</span>
              <p className="title">Categoría B</p>
            </div>

            <div className="dashboard-page-summary-card">
              <span className="number">{memberDataList.filter((m) => m.categoria === 3).length}</span>
              <p className="title">Fábrica</p>
            </div>
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
                titlesData={titlesData}
                amountData={amountData}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-page-filter-container">
          <div className="dashboard-page-chart-content">
            <div className="dashboard-page-chart-bar-content">
              <strong>
                <FaChartPie /> Integrantes por categoría
              </strong>
              <ChartPie
                data={categoryData} />
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
                data={chartData} />
            </div>

            <div className="dashboard-page-chart-bar-content">
              <strong>
                <FaCalendar /> Nuevos vs Antiguos Integrantes
              </strong>
              <ChartPie
                data={newVsOldData}
              />
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default DashboardPage;

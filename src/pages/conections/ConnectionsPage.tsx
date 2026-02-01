import { useEffect, useState } from "react";
import { useConnectionStore } from "../../hooks/useConnectionStore";
import { CustomLoader } from "../components/CustomLoader";
import { CustomAlert } from "../components/CustomAlert";
import { useForm } from "../../hooks/useForm";
import './connections.css';

export const ConnectionsPage = () => {
  const {
    isLoadingConnectionsSlice,
    dataBaseTypeConnectionSlice,
    changeEnviroment,
    errorMessageConnectionsSlice,
    GetEnviroment,
    SetChangeEnviroment

  } = useConnectionStore();

  const { state, setFormData } = useForm({
    state: 0 // 0 = Test, 1 = Prod
  });

  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    status: "success" | "error";
  } | null>(null);

  const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked ? 1 : 0;

    // Actualizamos el hook local
    setFormData({ state: newValue });

    // Llamamos a tu servicio de ASP.NET
    SetChangeEnviroment(newValue);
  };

  useEffect(() => {
    GetEnviroment();
  }, []);

  useEffect(() => {
    if (dataBaseTypeConnectionSlice !== undefined) {
      setFormData({ state: dataBaseTypeConnectionSlice });
    }
  }, [dataBaseTypeConnectionSlice]);

  useEffect(() => {
    if (errorMessageConnectionsSlice) {
      setAlert({
        message: errorMessageConnectionsSlice,
        status: "error",
        title: "Error"
      });
    }
  }, [errorMessageConnectionsSlice]);

    useEffect(() => {
    if (changeEnviroment) {
      setAlert({
        message: "DB cambiada exitosamente!!",
        status: "success",
        title: "¡EXITO!"
      });
    }
  }, [changeEnviroment]);


  return (
    <>
      {
        isLoadingConnectionsSlice && <CustomLoader />
      }
      {
        alert && <CustomAlert
          message={alert.message}
          title={alert.title}
          onClose={() => setAlert(null)}
          status={alert.status} />
      }
      <div className="container-connections-page">
        <span className="label-text">
          {state === 1 ? "MODO PRODUCCIÓN" : "MODO TESTING"}
        </span>
        <div className="content-options-connections-page">
          <p>TESTING</p>
          <p>PRODUCCION</p>
        </div>
        <input 
          type="checkbox" 
          name="state" 
          role="switch" 
          className="liquid-3" 
          checked={state === 1}
          onChange={handleToggle} 
        />
      </div>

    </>
  )
}

export default ConnectionsPage;

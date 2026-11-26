import { FaArrowLeft } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { CgMusic } from "react-icons/cg";
import { GrTarget } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useClosetStore } from "../../hooks/useClosetStore";
import { CustomLoader } from "../components/CustomLoader";
import { useEffect, useState } from "react";
import ClosetSummary from "../../interfaces/DTOs/ClosetSummary.types";
import PaymentUtils from "../../utils/paymentUtils";
import { IconType } from "react-icons";
import ErrorData from "../../interfaces/ErrorData.types";
import { CustomAlert } from "../components/CustomAlert";
import styles from "./styles/closet-options-page.module.css";

const icons: IconType[] = [FaShieldAlt, GrTarget, CgMusic];

export const ClosetOptionsPage = () => {
  const navigate = useNavigate();
  const {
    isLoadingClosetSlice,
    closetDataOptions,
    errorMessageClosetSlice,
    GetClosetSummary,
  } = useClosetStore();

  const [aler, setAlert] = useState<ErrorData | null>(null);

  useEffect(() => {
    GetClosetSummary();
  }, []);

  useEffect(() => {
    if (errorMessageClosetSlice) {
      setAlert({
        title: "Error",
        message: errorMessageClosetSlice,
        status: "error",
      });
    }
  }, [errorMessageClosetSlice]);

  return (
    <>
      {isLoadingClosetSlice && <CustomLoader />}
      {aler && (
        <CustomAlert
          title={aler.title}
          message={aler.message}
          status={aler.status}
          onClose={() => setAlert(null)}
        />
      )}
      <main className={styles.page}>
        <header>
          <p className={styles.eyebrow}>Catálogo</p>
          <h1 className={styles.title}>Configuración de Clósets</h1>
          <p className={styles.subtitle}>
            Selecciona una escuadra para administrar los implementos que
            conforman su clóset.
          </p>
        </header>

        <section className={styles.grid}>
          {closetDataOptions.map((item: ClosetSummary) => {
            const GetIcon =
              item.id === 1 ? icons[0] : item.id === 2 ? icons[1] : icons[2];
            return (
              <article key={item.id} className={styles.card}>
                <div className={styles.iconBox}>
                  <GetIcon className={styles.icon} strokeWidth={1.25} />
                </div>
                <h2 className={styles.cardTitle}>{item.escuadra}</h2>
                <p className={styles.cardText}>Configuración de implementos</p>
                <div className={styles.stats}>
                  <span>{item.cantidad} implementos</span>
                  <span className={styles.statsValue}>
                    {PaymentUtils.getMoney(item.precio)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/closetBuilder/${item.id}`)}
                  className={`${styles.button} ${styles.buttonOutline} ${styles.buttonFull}`}
                >
                  Configurar clóset
                </button>
              </article>
            );
          })}
        </section>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`${styles.button} ${styles.buttonGhost}`}
        >
          <FaArrowLeft className={styles.buttonIcon} />
          Volver a implementos
        </button>
      </main>
    </>
  );
};

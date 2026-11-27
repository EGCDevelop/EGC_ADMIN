import { BiPlus, BiShield } from "react-icons/bi";
import styles from "./styles/closet-builder-page.module.css";
import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useUniformStore } from "../../hooks/useUniformStore";
import { CustomLoader } from "../components/CustomLoader";
import ErrorData from "../../interfaces/ErrorData.types";
import { CustomAlert } from "../components/CustomAlert";
import ImplementsForm from "../../interfaces/ImplementsForm";
import PaymentUtils from "../../utils/paymentUtils";
import { useNavigate, useParams } from "react-router-dom";
import { useClosetStore } from "../../hooks/useClosetStore";
import Closet from "../../interfaces/uniform/Closet.types";
import { getSquadId } from "../../utils/getSquadId";

const CLOSET_NAME = ["Gastadores", "Batonistas", "Banda"];
const ClosetIcon = BiShield;

export const ClosetBuilderPage = () => {
  const navigate = useNavigate();
  const { closetId } = useParams<{ closetId: string }>();

  const {
    isLoadingClosetSlice,
    dataListClosetSlice,
    closetUpdated,
    errorMessageClosetSlice,
    GetCloset,
    UpdateCloset,
    ResetAlert,
  } = useClosetStore();

  const {
    isLoadingUniformSlice,
    uniformsList,
    errorMessageUniformSlice,
    GetUniforms,
  } = useUniformStore();

  const [alert, setAlert] = useState<ErrorData | null>(null);
  const [closetName, setClosetName] = useState<string>("");
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(true);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [closetItems, setClosetItems] = useState<Closet[]>([]);

  // Disponibles = todos los uniformes que NO están en el clóset
  const availableItems = useMemo(
    () =>
      (uniformsList as ImplementsForm[]).filter(
        (uniform) => !closetItems.some((c) => c.uniformId === uniform.id),
      ),
    [uniformsList, closetItems],
  );

  const selectedItems = useMemo(
    () =>
      closetItems
        .map((c) =>
          (uniformsList as ImplementsForm[]).find((u) => u.id === c.uniformId),
        )
        .filter((u): u is ImplementsForm => u !== undefined),
    [uniformsList, closetItems],
  );

  // Valor total: solo items activos (state === 1)
  const totalValue = useMemo(
    () =>
      selectedItems
        .filter((item) => item.state === 1)
        .reduce((sum, item) => sum + Number(item.price ?? 0), 0),
    [selectedItems],
  );

  /* ---------- Acciones ---------- */
  const markDirty = () => {
    setDirty(true);
    setSaved(false);
  };

  const addItem = (uniformId: number) => {
    if (closetItems.some((c) => c.uniformId === uniformId)) return;
    const newItem: Closet = {
      id: 0,
      uniformId,
      squadId: getSquadId(Number(closetId)),
      estado: 1,
    };
    setClosetItems((current) => [...current, newItem]);
    markDirty();
  };

  const removeItem = (uniformId: number) => {
    if (!closetItems.some((c) => c.uniformId === uniformId)) return;
    setClosetItems((current) =>
      current.filter((c) => c.uniformId !== uniformId),
    );
    markDirty();
  };

  const goBack = () => {
    navigate(-1);
  };

  const saveCloset = () => {
    UpdateCloset(closetItems);

    if (closetUpdated) {
      setSaved(true);
      setDirty(false);
    }
  };

  useEffect(() => {
    setClosetItems(dataListClosetSlice);
  }, [dataListClosetSlice]);

  useEffect(() => {
    if (
      Number(closetId) === 1 ||
      Number(closetId) === 12 ||
      Number(closetId) === 14 ||
      Number(closetId) === 16
    ) {
      setClosetName(CLOSET_NAME[0]);
    } else if (
      Number(closetId) === 2 ||
      Number(closetId) === 13 ||
      Number(closetId) === 15
    ) {
      setClosetName(CLOSET_NAME[1]);
    } else {
      setClosetName(CLOSET_NAME[2]);
    }
  }, []);

  useEffect(() => {
    GetUniforms(1, "");
  }, []);

  useEffect(() => {
    GetUniforms(1, "");
  }, [closetUpdated]);

  useEffect(() => {
    GetCloset(Number(closetId), closetName);
  }, []);

  useEffect(() => {
    if (errorMessageUniformSlice) {
      setAlert({
        title: "Error",
        message: errorMessageUniformSlice,
        status: "error",
      });
    }
  }, [errorMessageUniformSlice]);

  useEffect(() => {
    if (closetUpdated) {
      setAlert({
        title: "Exito",
        message: `El closet ${closetName} fue actualizado correctamente`,
        status: "success",
      });

      setTimeout(() => {
        ResetAlert();
      }, 4000);
    }
  }, [closetUpdated]);

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
      {(isLoadingUniformSlice || isLoadingClosetSlice) && <CustomLoader />}
      {alert && (
        <CustomAlert
          title={alert.title}
          message={alert.message}
          status={alert.status}
          onClose={() => setAlert(null)}
        />
      )}
      <main className={styles.page}>
        <header className={styles.header}>
          <div>
            <div className={styles.titleRow}>
              <div className={styles.titleIconBox}>
                <ClosetIcon className={styles.titleIcon} />
              </div>
              <div>
                <p className={styles.eyebrow}>Constructor de clóset</p>
                <h1 className={styles.title}>Clóset de {closetName}</h1>
              </div>
            </div>
            <p className={styles.subtitle}>
              Selecciona los implementos que conforman esta configuración.
            </p>
          </div>
          <div className={styles.headerActions}>
            <span
              className={`${styles.status} ${saved ? styles.statusSaved : styles.statusDirty}`}
            >
              {saved ? "Cambios guardados" : "Cambios sin guardar"}
            </span>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonOutline}`}
              onClick={goBack}
            >
              <FaArrowLeft className={styles.iconLeft} />
              Volver
            </button>
          </div>
        </header>

        {/* Panel: implementos disponibles (soltar aquí = quitar del clóset) */}
        <section className={styles.panels}>
          <div
            className={`${styles.panel} ${draggingId ? styles.panelDragging : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggingId !== null) removeItem(draggingId);
              setDraggingId(null);
            }}
          >
            <div className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>Implementos disponibles</h2>
              </div>
              <span className={styles.badge}>{availableItems.length}</span>
            </div>

            <div className={styles.list}>
              {availableItems.length ? (
                availableItems.map((item: ImplementsForm) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggingId(item.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className={`${styles.item} ${styles.itemHover}`}
                  >
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemMeta}>
                        {item.price == null
                          ? "Precio no definido"
                          : PaymentUtils.getMoney(Number(item.price))}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.buttonSm} ${styles.buttonOutline}`}
                      onClick={() => addItem(item.id)}
                    >
                      <BiPlus className={styles.iconPlus} />
                      Agregar
                    </button>
                  </div>
                ))
              ) : (
                <p className={`${styles.empty} ${styles.emptySm}`}>
                  No hay implementos disponibles con esta búsqueda.
                </p>
              )}
            </div>
          </div>

          {/* Panel: implementos del clóset (soltar aquí = agregar) */}
          <div
            className={`${styles.panel} ${draggingId ? styles.panelDragging : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggingId !== null) addItem(draggingId);
              setDraggingId(null);
            }}
          >
            <div className={`${styles.panelHeader} ${styles.panelHeaderTop}`}>
              <div>
                <h2 className={styles.panelTitle}>Implementos del clóset</h2>
                <p className={styles.panelText}>
                  {dataListClosetSlice.length} seleccionados
                </p>
              </div>
              <div className={styles.totalBox}>
                <p className={styles.totalLabel}>Valor total</p>
                <p className={styles.totalValue}>
                  {PaymentUtils.getMoney(totalValue)}
                </p>
              </div>
            </div>

            <div className={styles.list}>
              {selectedItems.length ? (
                selectedItems.map((item: ImplementsForm) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => setDraggingId(item.id)}
                    onDragEnd={() => setDraggingId(null)}
                    className={styles.item}
                  >
                    <div>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemMeta}>
                        {item.state === 1
                          ? item.price == null
                            ? "Precio no definido"
                            : PaymentUtils.getMoney(Number(item.price))
                          : "Inactivo · se conserva en este clóset"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.buttonSm} ${styles.buttonGhost}`}
                      onClick={() => removeItem(item.id)}
                    >
                      Quitar
                    </button>
                  </div>
                ))
              ) : (
                <div className={`${styles.empty} ${styles.emptyLg}`}>
                  Este clóset todavía no tiene implementos. Arrastra elementos
                  desde el panel de disponibles o utiliza el botón Agregar.
                </div>
              )}
            </div>
          </div>
        </section>

        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonOutline}`}
            onClick={goBack}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={saveCloset}
            disabled={!dirty}
          >
            Guardar cambios
          </button>
        </div>
      </main>
    </>
  );
};

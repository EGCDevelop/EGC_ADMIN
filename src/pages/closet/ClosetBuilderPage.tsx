import { BiPlus, BiShield } from "react-icons/bi";
import styles from "./styles/closet-builder-page.module.css";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

type Implemento = {
  UNIId: number;
  UNINombre: string;
  UNIPrecio: number | null;
  UNIEstado: number; // 1 = activo, 2 = inactivo
};

// Datos ficticios. Incluyen un implemento inactivo y uno sin precio
// para que se vean los estados especiales de la pantalla.
const MOCK_IMPLEMENTOS: Implemento[] = [
  { UNIId: 1, UNINombre: "Quepi/Ros", UNIPrecio: 100, UNIEstado: 1 },
  { UNIId: 2, UNINombre: "Guerrera", UNIPrecio: 200, UNIEstado: 1 },
  { UNIId: 3, UNINombre: "Charreteras", UNIPrecio: 50, UNIEstado: 1 },
  { UNIId: 4, UNINombre: "Pantalón", UNIPrecio: 100, UNIEstado: 1 },
  { UNIId: 5, UNINombre: "Cordonaje", UNIPrecio: 50, UNIEstado: 2 },
  { UNIId: 6, UNINombre: "Faja", UNIPrecio: null, UNIEstado: 1 },
];

// Clóset con el que arranca la maqueta (Guerrera + Cordonaje inactivo).
const INITIAL_SELECTED_IDS = [2, 5];

const CLOSET_NAME = "Gastadores";
const ClosetIcon = BiShield;

const money = (value: number) => `Q${value.toFixed(2)}`;

type Props = {
  onBack?: () => void;
  onSaved?: () => void;
};

export const ClosetBuilderPage = ({ onBack, onSaved }: Props) => {
  const [implementos] = useState<Implemento[]>(MOCK_IMPLEMENTOS);
  const [selectedIds, setSelectedIds] =
    useState<number[]>(INITIAL_SELECTED_IDS);
  const [search, setSearch] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(true);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const activeCatalog = implementos.filter((item) => item.UNIEstado === 1);
  const selected = activeCatalog.filter((item) =>
    selectedIds.includes(item.UNIId),
  );
  const inactiveSelected = implementos.filter(
    (item) => selectedIds.includes(item.UNIId) && item.UNIEstado !== 1,
  );
  const available = activeCatalog.filter(
    (item) =>
      !selectedIds.includes(item.UNIId) &&
      item.UNINombre.toLowerCase().includes(search.toLowerCase()),
  );
  const total = selected.reduce(
    (sum, item) => sum + (item.UNIPrecio == null ? 0 : Number(item.UNIPrecio)),
    0,
  );
  const hasUndefinedPrice = selected.some((item) => item.UNIPrecio == null);
  const selectedRows = [
    ...selected,
    ...inactiveSelected.filter(
      (item) => !selected.some((active) => active.UNIId === item.UNIId),
    ),
  ];

  const updateCloset = (nextIds: number[]) => {
    setSelectedIds(Array.from(new Set(nextIds)));
    setDirty(true);
    setSaved(false);
  };
  const addItem = (id: number) => updateCloset([...selectedIds, id]);
  const removeItem = (id: number) =>
    updateCloset(selectedIds.filter((itemId) => itemId !== id));

  const goBack = () => {
    if (
      dirty &&
      !window.confirm("Hay cambios sin guardar. ¿Deseas salir sin guardarlos?")
    )
      return;
    onBack?.();
  };
  const saveCloset = () => {
    setSaved(true);
    setDirty(false);
    onSaved?.();
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <div className={styles.titleIconBox}>
              <ClosetIcon className={styles.titleIcon} />
            </div>
            <div>
              <p className={styles.eyebrow}>Constructor de clóset</p>
              <h1 className={styles.title}>Clóset de {CLOSET_NAME}</h1>
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
            Volver a clósets
          </button>
        </div>
      </header>

      <section className={styles.panels}>
        {/* Panel: implementos disponibles (soltar aquí = quitar del clóset) */}
        <div
          className={`${styles.panel} ${draggingId ? styles.panelDragging : ""}`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (draggingId) removeItem(draggingId);
            setDraggingId(null);
          }}
        >
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Implementos disponibles</h2>
              <p className={styles.panelText}>
                Arrastra o agrega implementos activos.
              </p>
            </div>
            <span className={styles.badge}>{available.length}</span>
          </div>

          <input
            className={styles.input}
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className={styles.list}>
            {available.length ? (
              available.map((item) => (
                <div
                  key={item.UNIId}
                  draggable
                  onDragStart={() => setDraggingId(item.UNIId)}
                  onDragEnd={() => setDraggingId(null)}
                  className={`${styles.item} ${styles.itemHover}`}
                >
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.UNINombre}</p>
                    <p className={styles.itemMeta}>
                      {item.UNIPrecio == null
                        ? "Precio no definido"
                        : money(Number(item.UNIPrecio))}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.buttonSm} ${styles.buttonOutline}`}
                    onClick={() => addItem(item.UNIId)}
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
            if (draggingId) addItem(draggingId);
            setDraggingId(null);
          }}
        >
          <div className={`${styles.panelHeader} ${styles.panelHeaderTop}`}>
            <div>
              <h2 className={styles.panelTitle}>Implementos del clóset</h2>
              <p className={styles.panelText}>
                {selected.length} seleccionados
              </p>
            </div>
            <div className={styles.totalBox}>
              <p className={styles.totalLabel}>Valor total</p>
              <p className={styles.totalValue}>{money(total)}</p>
            </div>
          </div>

          {hasUndefinedPrice && (
            <p className={styles.warning}>
              Total provisional: hay implementos sin precio definido.
            </p>
          )}

          <div className={styles.list}>
            {selectedRows.length ? (
              selectedRows.map((item) => (
                <div
                  key={item.UNIId}
                  draggable
                  onDragStart={() => setDraggingId(item.UNIId)}
                  onDragEnd={() => setDraggingId(null)}
                  className={styles.item}
                >
                  <div>
                    <p className={styles.itemName}>{item.UNINombre}</p>
                    <p className={styles.itemMeta}>
                      {item.UNIEstado === 1
                        ? item.UNIPrecio == null
                          ? "Precio no definido"
                          : money(Number(item.UNIPrecio))
                        : "Inactivo · se conserva en este clóset"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.buttonSm} ${styles.buttonGhost}`}
                    onClick={() => removeItem(item.UNIId)}
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
  );
};

import styles from "./styles/payment-control-page.module.css";
import { useState } from "react";
import {
  FaArrowLeft,
  FaCreditCard,
  FaDownload,
  FaPlus,
  FaUser,
} from "react-icons/fa6";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  delivered: boolean;
  deliveredAt?: string;
};

type Payment = {
  amount: number;
  date: string;
  paymentMethod: string;
  cashReceived: number;
  change: number;
  notes: string;
  receivedDetails: Record<number, number>;
  changeDetails: Record<number, number>;
};

/* ---------- Datos ficticios ---------- */
const MOCK_MEMBER = {
  IdIntegrante: 1,
  Nombres: "Carlos Eduardo",
  Apellidos: "García López",
  EscuadraNombre: "Gastadores",
  EstablecimientoNombre: "Enrique Gomez Carrillo",
  CarreraNombre: "Basicos",
  PuestoNombre: "Comandante General",
  EsNuevo: false,
};

const MOCK_ITEMS: OrderItem[] = [
  {
    id: "kep",
    name: "Quepi/Ros",
    price: 100,
    delivered: true,
    deliveredAt: "12/11/2026",
  },
  { id: "gue", name: "Guerrera", price: 200, delivered: false },
  { id: "pan", name: "Pantalón", price: 100, delivered: false },
];

const MOCK_PAYMENTS: Payment[] = [
  {
    amount: 150,
    date: "2026-11-12",
    paymentMethod: "Efectivo",
    cashReceived: 200,
    change: 50,
    notes: "",
    receivedDetails: { 100: 2 },
    changeDetails: { 50: 1 },
  },
];

const DENOMINATIONS = [1, 5, 10, 20, 50, 100, 200];

const money = (value: number) => `Q${value.toFixed(2)}`;
const cashTotal = (details: Record<number, number>) =>
  DENOMINATIONS.reduce(
    (sum, denomination) => sum + denomination * (details[denomination] || 0),
    0,
  );
const describeCash = (details?: Record<number, number>) =>
  Object.entries(details || {})
    .filter(([, quantity]) => Number(quantity) > 0)
    .map(
      ([denomination, quantity]) =>
        `${quantity} × Q${denomination} = ${money(Number(denomination) * Number(quantity))}`,
    )
    .join(", ");

type Props = {
  /** Texto del botón de regreso: "Volver a pedidos" (desde Pedidos de Uniforme) o "Volver a usuarios" */
  backLabel?: string;
  onBack?: () => void;
  /** Arranca sin pedido para revisar el estado vacío (selección de implementos) */
  startEmpty?: boolean;
};

export const PaymentControlPage = ({
  backLabel = "Volver a pedidos",
  onBack,
  startEmpty = false,
}: Props) => {
  const selectedUser = MOCK_MEMBER;

  const [uniformItems, setUniformItems] = useState<OrderItem[]>(
    startEmpty ? [] : MOCK_ITEMS,
  );
  const [uniformPayments, setUniformPayments] = useState<Payment[]>(
    startEmpty ? [] : MOCK_PAYMENTS,
  );
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [receivedCash, setReceivedCash] = useState<Record<number, number>>({});
  const [changeCash, setChangeCash] = useState<Record<number, number>>({});
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isGeneratingStatement, setIsGeneratingStatement] = useState(false);
  const [showStatement, setShowStatement] = useState(false);

  /* ---------- Cálculos ---------- */
  const total = uniformItems.reduce((sum, item) => sum + item.price, 0);
  const paid = uniformPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );
  const balance = Math.max(0, total - paid);
  const paymentStatus =
    paid === 0
      ? "Pendiente de pago"
      : paid >= total
        ? "Pagado"
        : "Pago parcial";
  const deliveredCount = uniformItems.filter((item) => item.delivered).length;
  const deliveryStatus =
    deliveredCount === 0
      ? "Pendiente de entrega"
      : deliveredCount === uniformItems.length
        ? "Entregado completo"
        : "Entrega parcial";

  const receivedTotal = cashTotal(receivedCash);
  const amount = Number(paymentAmount);
  const change = Math.max(
    0,
    receivedTotal - (Number.isFinite(amount) ? amount : 0),
  );
  const changeTotal = cashTotal(changeCash);

  /* ---------- Acciones ---------- */
  const addPayment = () => {
    setPaymentError("");
    if (
      !Number.isInteger(amount) ||
      amount <= 0 ||
      amount > balance ||
      !paymentDate
    )
      return setPaymentError(
        "El monto del pago debe ser válido y no superar el saldo pendiente.",
      );
    if (receivedTotal <= 0)
      return setPaymentError(
        "Registra al menos un billete en el efectivo recibido.",
      );
    if (receivedTotal < amount)
      return setPaymentError(
        "El efectivo recibido es insuficiente para cubrir el pago.",
      );
    if (change > 0 && changeTotal !== change)
      return setPaymentError(
        "El desglose del vuelto no coincide con el vuelto calculado.",
      );
    const payment: Payment = {
      amount,
      date: paymentDate,
      paymentMethod: "Efectivo",
      cashReceived: receivedTotal,
      change,
      notes: paymentNotes,
      receivedDetails: receivedCash,
      changeDetails: changeCash,
    };
    setUniformPayments((current) => [...current, payment]);
    setPaymentAmount("");
    setReceivedCash({});
    setChangeCash({});
    setPaymentNotes("");
    setShowPaymentForm(false);
  };

  // Maqueta: simula la generación del PDF. Aquí iría la generación real (jsPDF).
  const generateAccountStatement = () => {
    setIsGeneratingStatement(true);
    setTimeout(() => {
      setIsGeneratingStatement(false);
      setShowStatement(true);
    }, 800);
  };

  const memberFields = [
    ["Nombre completo", `${selectedUser.Nombres} ${selectedUser.Apellidos}`],
    ["Escuadra", selectedUser.EscuadraNombre],
    ["Establecimiento", selectedUser.EstablecimientoNombre],
    ["Carrera", selectedUser.CarreraNombre],
    ["Puesto", selectedUser.PuestoNombre],
    ["Estado", selectedUser.EsNuevo ? "Nuevo" : "Antiguo"],
  ];

  return (
    <div className={styles.page}>
      {/* Encabezado */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Control de Uniforme</h1>
          <p className={styles.subtitle}>
            Gestión de pedidos, pagos y entregas del integrante
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonOutline}`}
            onClick={generateAccountStatement}
            disabled={isGeneratingStatement}
          >
            <FaDownload className={styles.iconLeft} />
            {isGeneratingStatement
              ? "Generando estado de cuenta..."
              : "Descargar estado de cuenta"}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonOutline}`}
            onClick={onBack}
          >
            <FaArrowLeft className={styles.iconLeft} />
            {backLabel}
          </button>
        </div>
      </div>

      {/* Información del integrante */}
      <div className={`${styles.card} ${styles.cardSpaced}`}>
        <div className={styles.cardIconHeader}>
          <FaUser className={styles.headerIcon} />
          <h2 className={styles.cardTitle}>Información del integrante</h2>
        </div>
        <div className={styles.infoGrid}>
          {memberFields.map(([label, value]) => (
            <div key={label}>
              <p className={styles.infoLabel}>{label}</p>
              <p className={styles.infoValue}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pedido actual + Pagos */}
      <div className={`${styles.mainGrid}`}>
        <div className={`${styles.card} ${styles.orderCard}`}>
          <div className={styles.cardHeaderRow}>
            <div>
              <h2 className={styles.cardTitle}>Pedido actual</h2>
              <p className={styles.cardSub}>{uniformItems.length ? "Implementos solicitados" : "Aún no hay un pedido activo"}</p>
            </div>
            {!uniformItems.length && (
              <button
                type="button"
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                <FaPlus className={styles.iconLeft} />
                Nuevo pedido
              </button>
            )}
          </div>

          {uniformItems.length > 0 && (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Implemento</th>
                    <th>Precio</th>
                    <th>Pago</th>
                    <th>Entrega</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {uniformItems.map((item) => (
                    <tr key={item.id}>
                      <td className={styles.tdName}>{item.name}</td>
                      <td>{money(item.price)}</td>
                      <td>
                        <span className={styles.textMuted}>{paymentStatus}</span>
                      </td>
                      <td>
                        {item.delivered ? (
                          <span className={styles.textDelivered}>Entregado · {item.deliveredAt}</span>
                        ) : (
                          <span className={styles.textPending}>Pendiente</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`${styles.button} ${styles.buttonSm} ${styles.buttonOutline}`}
                          disabled={!item.delivered && paid < item.price}
                        >
                          {item.delivered ? "Revertir entrega" : "Marcar entregado"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.sideHeader}>
            <FaCreditCard className={styles.headerIcon} />
            <h2 className={styles.cardTitle}>Pagos</h2>
          </div>
          <div className={styles.sideBody}>
            <div className={styles.sideRow}>
              <span className={styles.sideLabel}>Total del pedido</span>
              <strong>{money(total)}</strong>
            </div>
            <div className={styles.sideRow}>
              <span className={styles.sideLabel}>Total pagado</span>
              <strong>{money(paid)}</strong>
            </div>
            <div className={`${styles.sideRow} ${styles.sideRowTotal}`}>
              <span className={styles.sideLabel}>Saldo pendiente</span>
              <strong>{money(balance)}</strong>
            </div>
            <div className={styles.statusBox}>
              <p className={styles.sideLabel}>Estado financiero</p>
              <p className={styles.statusValue}>{paymentStatus}</p>
              <p className={`${styles.sideLabel} ${styles.statusLabelSpaced}`}>
                Estado de entrega
              </p>
              <p className={styles.statusValue}>{deliveryStatus}</p>
            </div>

            {uniformItems.length > 0 && balance > 0 && (
              <button
                type="button"
                className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonFull}`}
                onClick={() => setShowPaymentForm(!showPaymentForm)}
              >
                <FaPlus className={styles.iconLeft} />
                Registrar pago
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Formulario completo de pago */}
      {showPaymentForm && (
        <div className={`${styles.card} ${styles.cardSpaced}`}>
          <h2 className={`${styles.cardTitle} ${styles.formTitle}`}>
            Registrar pago
          </h2>
          <div className={styles.formGrid2}>
            <div>
              <label className={styles.fieldLabel}>Monto del pago</label>
              <input
                className={styles.input}
                type="number"
                min="1"
                step="1"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
              />
            </div>
            <div>
              <label className={styles.fieldLabel}>Fecha</label>
              <input
                className={styles.input}
                type="date"
                value={paymentDate}
                onChange={(event) => setPaymentDate(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.cashSection}>
            <h3 className={styles.cashTitle}>Desglose de efectivo recibido</h3>
            <div className={styles.cashGrid}>
              {DENOMINATIONS.map((denomination) => (
                <label key={denomination} className={styles.cashLabel}>
                  Q{denomination}
                  <input
                    className={styles.input}
                    type="number"
                    min="0"
                    step="1"
                    value={receivedCash[denomination] || ""}
                  />
                </label>
              ))}
            </div>
            <p className={styles.cashTotal}>
              Efectivo recibido: <strong>{money(receivedTotal)}</strong>
            </p>
          </div>

          <div className={styles.summaryRow}>
            <span>
              Monto del pago:{" "}
              <strong>{money(Number.isFinite(amount) ? amount : 0)}</strong>
            </span>
            <span>
              Vuelto: <strong>{money(change)}</strong>
            </span>
            {receivedTotal === amount && amount > 0 && (
              <span className={styles.textSuccess}>Pago exacto</span>
            )}
          </div>

          {change > 0 && (
            <div className={styles.cashSection}>
              <h3 className={styles.cashTitle}>Desglose del vuelto</h3>
              <div className={styles.cashGrid}>
                {DENOMINATIONS.map((denomination) => (
                  <label key={denomination} className={styles.cashLabel}>
                    Q{denomination}
                    <input
                      className={styles.input}
                      type="number"
                      min="0"
                      step="1"
                      value={changeCash[denomination] || ""}
                    />
                  </label>
                ))}
              </div>
              <p
                className={`${styles.cashTotal} ${changeTotal === change ? styles.textSuccess : styles.textDanger}`}
              >
                Total vuelto entregado: <strong>{money(changeTotal)}</strong>
              </p>
            </div>
          )}

          <div className={styles.notesBlock}>
            <label className={styles.fieldLabel}>Observaciones</label>
            <input
              className={styles.input}
              value={paymentNotes}
              onChange={(event) => setPaymentNotes(event.target.value)}
            />
          </div>

          {paymentError && (
            <p className={`${styles.formError} ${styles.textDanger}`}>
              {paymentError}
            </p>
          )}

          <div className={styles.formActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonOutline}`}
              onClick={() => setShowPaymentForm(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={addPayment}
            >
              Registrar pago
            </button>
          </div>
        </div>
      )}

      {/* Historial de pagos */}
      {uniformPayments.length > 0 && (
        <div className={styles.card}>
          <h2 className={`${styles.cardTitle} ${styles.formTitle}`}>
            Historial de pagos
          </h2>
          <div>
            {uniformPayments.map((payment, index) => (
              <div
                key={`${payment.date}-${index}`}
                className={styles.historyRow}
              >
                <div>
                  <p className={styles.historyMain}>
                    {payment.date} · Pago de {money(payment.amount)}
                  </p>
                  <p className={styles.historyMeta}>
                    Efectivo recibido: {money(payment.cashReceived)} · Vuelto:{" "}
                    {money(payment.change)}
                  </p>
                  <p className={styles.historyMeta}>
                    {describeCash(payment.receivedDetails) || "Sin desglose"}
                  </p>
                  {payment.change > 0 && (
                    <p className={styles.historyMeta}>
                      Vuelto entregado: {describeCash(payment.changeDetails)}
                    </p>
                  )}
                </div>
                <strong>{money(payment.amount)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vista previa del estado de cuenta (maqueta) */}
      {showStatement && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Vista previa del estado de cuenta"
        >
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.cardTitle}>
                Vista previa del estado de cuenta
              </h2>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonOutline}`}
                >
                  <FaDownload className={styles.iconLeft} />
                  Descargar PDF
                </button>
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonOutline}`}
                  onClick={() => setShowStatement(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
            <iframe
              title="Estado de cuenta de uniforme"
              className={styles.iframe}
              srcDoc="<body style='font-family:sans-serif;color:#6b7280;display:flex;align-items:center;justify-content:center;height:100vh;margin:0'>Aquí se mostraría el PDF del estado de cuenta.</body>"
            />
          </div>
        </div>
      )}
    </div>
  );
};

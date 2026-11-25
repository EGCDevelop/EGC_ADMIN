import styles from "./styles/payment-control-page.module.css";
import { useState } from "react";
import {
  FaArrowLeft,
  FaCreditCard,
  FaDownload,
  FaPlus,
  FaUser,
} from "react-icons/fa6";
import { CustomInput } from "../components/CustomInput";
import { useForm } from "../../hooks/useForm";
import PaymentHistoryDTO, {
  INITIAL_FORM,
} from "../../interfaces/DTOs/PaymentHistoryDTO";
import { CustomDatePicker } from "../components/CustomDatePicker";
import { CustomTextarea } from "../components/CustomTextarea";
import PaymentUtils from "../../utils/paymentUtils";
import { useParams } from "react-router-dom";
import PaymentHistory from "../../interfaces/uniform/PaymentHistory.types";
import PaymentHistoryDetails from "../../interfaces/uniform/PaymentHistoryDetails.types";
import SavePaymentHistory from "../../interfaces/uniform/SavePaymentHistory.types";

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

const BILLS: {
  value: number;
  inKey: keyof PaymentHistoryDTO;
  outKey: keyof PaymentHistoryDTO;
}[] = [
  { value: 1, inKey: "numberOneBills", outKey: "numberOneOutputBills" },
  { value: 5, inKey: "numberFiveBills", outKey: "numberFiveOutputBills" },
  { value: 10, inKey: "numberTenBills", outKey: "numberTenOutputBills" },
  { value: 20, inKey: "numberTwentyBills", outKey: "numberTwentyOutputBills" },
  { value: 50, inKey: "numberFiftyBills", outKey: "numberFiftyOutputBills" },
  {
    value: 100,
    inKey: "numberOneHundredBills",
    outKey: "numberOneHundredOutputBills",
  },
  {
    value: 200,
    inKey: "numberTwoHundredBills",
    outKey: "numberTwoHundredOutputBills",
  },
];

export const PaymentControlPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { formData, onChange, onCustomChange, onTextAreaChange } =
    useForm<PaymentHistoryDTO>(INITIAL_FORM);

  const selectedUser = MOCK_MEMBER;

  const [uniformItems, setUniformItems] = useState<OrderItem[]>(MOCK_ITEMS);
  const [uniformPayments, setUniformPayments] =
    useState<Payment[]>(MOCK_PAYMENTS);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

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

  const deliveredCount = uniformItems.filter((item) => item.delivered).length;
  const deliveryStatus =
    deliveredCount === 0
      ? "Pendiente de entrega"
      : deliveredCount === uniformItems.length
        ? "Entregado completo"
        : "Entrega parcial";

  const amount = PaymentUtils.toNumber(formData.paidAmount);

  const receivedDetails = Object.fromEntries(
    BILLS.map((b) => [b.value, PaymentUtils.toNumber(formData[b.inKey])]),
  ) as Record<number, number>;

  const changeDetails = Object.fromEntries(
    BILLS.map((b) => [b.value, PaymentUtils.toNumber(formData[b.outKey])]),
  ) as Record<number, number>;

  const sumBills = (details: Record<number, number>) =>
    BILLS.reduce((sum, b) => sum + b.value * (details[b.value] || 0), 0);

  const receivedTotal = sumBills(receivedDetails);
  const change = Math.max(0, receivedTotal - amount);
  const changeTotal = sumBills(changeDetails);

  const addPayment = () => {
    setPaymentError("");
    if (!Number.isInteger(amount) || amount <= 0 || amount > balance)
      return setPaymentError(
        "El monto del pago debe ser válido y no superar el saldo pendiente.",
      );

    if (!formData.paidDate) return setPaymentError("Ingresa una fecha de pago");

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

    const dataPaymentHistory: PaymentHistory = {
      id: 0,
      paidAmount: formData.paidAmount,
      cashReceived: receivedTotal,
      chancheMoney: change,
      paidDate: formData.paidDate,
      paymentNumber: 0,
      observations: formData.observations,
      orderId: Number(orderId),
      userReceived: 251,
    };

    const dataInflow: PaymentHistoryDetails = {
      id: 0,
      paymentHistoryId: 0,
      typeMovement: 1,
      numberOneBills: formData.numberOneBills,
      numberFiveBills: formData.numberFiveBills,
      numberTenBills: formData.numberTenBills,
      numberTwentyBills: formData.numberTwentyBills,
      numberFiftyBills: formData.numberFiftyBills,
      numberOneHundredBills: formData.numberOneHundredBills,
      twoHundredBills: formData.numberTwoHundredBills,
    };

    const dataOutflow: PaymentHistoryDetails = {
      id: 0,
      paymentHistoryId: 0,
      typeMovement: 2,
      numberOneBills: formData.numberOneOutputBills,
      numberFiveBills: formData.numberFiveOutputBills,
      numberTenBills: formData.numberTenOutputBills,
      numberTwentyBills: formData.numberTwentyOutputBills,
      numberFiftyBills: formData.numberFiftyOutputBills,
      numberOneHundredBills: formData.numberOneHundredOutputBills,
      twoHundredBills: formData.numberTwoHundredOutputBills,
    };

    // console.log(`dataPaymentHistory == ${JSON.stringify(dataPaymentHistory)}`);
    // console.log(`dataInflow == ${JSON.stringify(dataInflow)}`);
    // console.log(`dataOutflow == ${JSON.stringify(dataOutflow)}`);

    const saveData: SavePaymentHistory = {
      payment: dataPaymentHistory,
      inflow: dataInflow,
      outflow: dataOutflow,
    };

    console.log(`saveData == ${JSON.stringify(saveData)}`);

    //resetForm();
    //setShowPaymentForm(false);
  };

  const resetForm = () => {
    (Object.keys(INITIAL_FORM) as (keyof PaymentHistoryDTO)[]).forEach((key) =>
      onCustomChange(key, INITIAL_FORM[key]),
    );
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
          >
            <FaArrowLeft className={styles.iconLeft} />
            Volver
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
              <p className={styles.cardSub}>
                {uniformItems.length
                  ? "Implementos solicitados"
                  : "Aún no hay un pedido activo"}
              </p>
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
                      <td>{PaymentUtils.getMoney(item.price)}</td>
                      <td>
                        <span className={styles.textMuted}>
                          {/* {paymentStatus} */}
                          {PaymentUtils.paymentStatus(paid, total)}
                        </span>
                      </td>
                      <td>
                        {item.delivered ? (
                          <span className={styles.textDelivered}>
                            Entregado · {item.deliveredAt}
                          </span>
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
                          {item.delivered
                            ? "Revertir entrega"
                            : "Marcar entregado"}
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
              <strong>{PaymentUtils.getMoney(total)}</strong>
            </div>
            <div className={styles.sideRow}>
              <span className={styles.sideLabel}>Total pagado</span>
              <strong>{PaymentUtils.getMoney(paid)}</strong>
            </div>
            <div className={`${styles.sideRow} ${styles.sideRowTotal}`}>
              <span className={styles.sideLabel}>Saldo pendiente</span>
              <strong>{PaymentUtils.getMoney(balance)}</strong>
            </div>
            <div className={styles.statusBox}>
              <p className={styles.sideLabel}>Estado financiero</p>
              <p className={styles.statusValue}>
                {PaymentUtils.paymentStatus(paid, total)}
              </p>
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
            <CustomInput
              key="paidAmount"
              type="number"
              label="Monto del pago"
              name="paidAmount"
              request
              min={1}
              step={1}
              value={formData.paidAmount.toString()}
              onChange={onChange}
            />
            <CustomDatePicker
              key="paidDate"
              name="paidDate"
              label="Fecha de pago"
              request
              value={formData.paidDate}
              onChange={(value) => onCustomChange("paidDate", value)}
            />
          </div>

          <div className={styles.cashSection}>
            <h3 className={styles.cashTitle}>Desglose de efectivo recibido</h3>
            <div className={styles.cashGrid}>
              {BILLS.map((b) => (
                <CustomInput
                  key={b.inKey}
                  type="number"
                  label={`Q${b.value}`}
                  name={b.inKey}
                  min={0}
                  step={1}
                  value={String(formData[b.inKey] ?? 0)}
                  onChange={onChange}
                />
              ))}
            </div>
            <p className={styles.cashTotal}>
              Efectivo recibido:{" "}
              <strong>{PaymentUtils.getMoney(receivedTotal)}</strong>
            </p>
          </div>

          <div className={styles.summaryRow}>
            <span>
              Monto del pago:{" "}
              <strong>
                {PaymentUtils.getMoney(Number.isFinite(amount) ? amount : 0)}
              </strong>
            </span>
            <span>
              Vuelto: <strong>{PaymentUtils.getMoney(change)}</strong>
            </span>
            {receivedTotal === amount && amount > 0 && (
              <span className={styles.textSuccess}>Pago exacto</span>
            )}
          </div>

          {change > 0 && (
            <div className={styles.cashSection}>
              <h3 className={styles.cashTitle}>Desglose del vuelto</h3>
              <div className={styles.cashGrid}>
                {BILLS.map((b) => (
                  <CustomInput
                    key={b.outKey}
                    type="number"
                    label={`Q${b.value}`}
                    name={b.outKey}
                    min={0}
                    step={1}
                    value={String(formData[b.outKey] ?? 0)}
                    onChange={onChange}
                  />
                ))}
              </div>
              <p
                className={`${styles.cashTotal} ${changeTotal === change ? styles.textSuccess : styles.textDanger}`}
              >
                Total vuelto entregado:{" "}
                <strong>{PaymentUtils.getMoney(changeTotal)}</strong>
              </p>
            </div>
          )}

          <div className={styles.notesBlock}>
            <CustomTextarea
              key="observations"
              label="Observaciones"
              name="observations"
              placeholder="Observaciones..."
              value={formData.observations ?? ""}
              onChange={onTextAreaChange}
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
              onClick={() => {
                setShowPaymentForm(false);
                resetForm();
              }}
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
                    {payment.date} · Pago de{" "}
                    {PaymentUtils.getMoney(payment.amount)}
                  </p>
                  <p className={styles.historyMeta}>
                    Efectivo recibido:{" "}
                    {PaymentUtils.getMoney(payment.cashReceived)} · Vuelto:{" "}
                    {PaymentUtils.getMoney(payment.change)}
                  </p>
                  <p className={styles.historyMeta}>
                    {PaymentUtils.describeCash(payment.receivedDetails) ||
                      "Sin desglose"}
                  </p>
                  {payment.change > 0 && (
                    <p className={styles.historyMeta}>
                      Vuelto entregado:{" "}
                      {PaymentUtils.describeCash(payment.changeDetails)}
                    </p>
                  )}
                </div>
                <strong>{PaymentUtils.getMoney(payment.amount)}</strong>
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

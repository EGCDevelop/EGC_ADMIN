import { useState } from "react";
import styles from "./styles/uniform-orders-page.module.css";
import { FaPlus } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { CustomSelect } from "../components/CustomSelect";
import { CustomDatePicker } from "../components/CustomDatePicker";

/* ---------- Tipos ---------- */
type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  delivered?: boolean;
  deliveredQuantity?: number;
};

type Order = {
  id: string;
  code: string;
  userId: number;
  date: string; // YYYY-MM-DD
  description: string;
  status: number;
  items: OrderItem[];
  payments: { amount: number }[];
  cancelReason?: string;
};

/* ---------- Datos ficticios ---------- */
const MOCK_MEMBERS = [
  {
    IdIntegrante: 101,
    Nombres: "Carlos Eduardo",
    Apellidos: "García López",
    EscuadraNombre: "Gastadores",
    EsNuevo: false,
  },
  {
    IdIntegrante: 2,
    Nombres: "Ana Sofía",
    Apellidos: "Morales Hernández",
    EscuadraNombre: "Batonistas",
    EsNuevo: true,
  },
];

const MOCK_CATALOG = [
  { id: "1", name: "Quepi/Ros", price: 100 },
  { id: "2", name: "Guerrera", price: 200 },
  { id: "3", name: "Charreteras", price: 50 },
  { id: "4", name: "Pantalón", price: 100 },
];

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-1",
    code: "#0001",
    userId: 101,
    date: "2026-11-18",
    description: "Pedido de uniforme",
    status: 1,
    items: [
      { id: "2", name: "Guerrera", price: 200, quantity: 1, delivered: false },
      { id: "4", name: "Pantalón", price: 100, quantity: 1, delivered: false },
    ],
    payments: [{ amount: 100 }],
  },
  {
    id: "ORD-2",
    code: "#0002",
    userId: 1,
    date: "2026-11-10",
    description: "Uniforme completo",
    status: 2,
    items: [
      { id: "1", name: "Quepi/Ros", price: 100, quantity: 1, delivered: true },
      { id: "2", name: "Guerrera", price: 200, quantity: 1, delivered: true },
      { id: "3", name: "Charreteras", price: 50, quantity: 1, delivered: true },
    ],
    payments: [{ amount: 350 }],
  },
  {
    id: "ORD-3",
    code: "#0003",
    userId: 1,
    date: "2026-10-28",
    description: "Reposición de quepi",
    status: 1,
    items: [
      {
        id: "1",
        name: "Quepi/Ros",
        price: 100,
        quantity: 2,
        deliveredQuantity: 1,
      },
    ],
    payments: [{ amount: 200 }],
  },
  {
    id: "ORD-4",
    code: "#0004",
    userId: 1,
    date: "2026-10-15",
    description: "Pedido creado por error",
    status: 3,
    items: [
      { id: "2", name: "Guerrera", price: 200, quantity: 1, delivered: false },
    ],
    payments: [],
    cancelReason: "Creado por error",
  },
  {
    id: "ORD-5",
    code: "#0005",
    userId: 1,
    date: "2026-09-30",
    description: "Pantalón adicional",
    status: 1,
    items: [
      { id: "4", name: "Pantalón", price: 100, quantity: 1, delivered: false },
    ],
    payments: [],
  },
  {
    id: "ORD-6",
    code: "#0006",
    userId: 1,
    date: "2026-09-12",
    description: "Charreteras",
    status: 1,
    items: [
      { id: "3", name: "Charreteras", price: 50, quantity: 1, delivered: true },
    ],
    payments: [{ amount: 50 }],
  },
  {
    id: "ORD-7",
    code: "#0007",
    userId: 1,
    date: "2026-08-20",
    description: "Pedido de uniforme",
    status: 1,
    items: [
      { id: "1", name: "Quepi/Ros", price: 100, quantity: 1, delivered: true },
      { id: "4", name: "Pantalón", price: 100, quantity: 1, delivered: true },
    ],
    payments: [{ amount: 200 }],
  },
];

const PAGE_SIZE = 6;
const money = (value: number) => `Q${value.toFixed(2)}`;

const getSummary = (order: Order) => {
  const total = order.items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );
  const paid = order.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const delivered = order.items.reduce(
    (sum, item) =>
      sum +
      (item.deliveredQuantity || (item.delivered ? item.quantity || 1 : 0)),
    0,
  );
  const requested = order.items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );
  const payment =
    paid === 0 ? "Pendiente" : paid >= total ? "Pagado" : "Parcialmente pagado";
  const delivery =
    delivered === 0
      ? "Pendiente"
      : delivered >= requested
        ? "Completa"
        : "Parcial";
  return {
    total,
    paid,
    balance: Math.max(0, total - paid),
    delivered,
    requested,
    payment,
    delivery,
  };
};

interface DataSearch {
  orderState: number;
  orderPaymentState: number;
  orderDeliveryState: number;
  dateFrom: string;
  dateTo: string;
}

export const UniformOrdersPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const { formData, onCustomChange, onSelectChange } = useForm<DataSearch>({
    orderState: 0,
    orderPaymentState: 0,
    orderDeliveryState: 0,
    dateFrom: "",
    dateTo: "",
  });

  const selectedUser = MOCK_MEMBERS.find(
    (member) => member.IdIntegrante === Number(userId),
  );

  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [page, setPage] = useState(1);

  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [newOrderDescription, setNewOrderDescription] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  if (!selectedUser) return null;

  const userOrders = orders.filter(
    (order) => order.userId === selectedUser.IdIntegrante,
  );

  const filtered = userOrders.filter((order) => {
    const summary = getSummary(order);
    console.log(order);
    return summary;
  });
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const active = userOrders.filter((order) => order.status !== 2);
  const completed = active.filter((order) => {
    const summary = getSummary(order);
    return summary.payment === "Pagado" && summary.delivery === "Completa";
  }).length;
  const stats = [
    { label: "Total de pedidos", value: userOrders.length },
    { label: "Pedidos activos", value: active.length },
    {
      label: "Pendientes de pago",
      value: active.filter((order) => getSummary(order).balance > 0).length,
    },
    {
      label: "Pendientes de entrega",
      value: active.filter((order) => getSummary(order).delivery !== "Completa")
        .length,
    },
    { label: "Completados", value: completed },
  ];

  const openNewOrder = () => {
    setSelectedItemIds([]);
    setNewOrderDescription("");
    setShowNewOrderForm(true);
  };
  const toggleItem = (id: string) =>
    setSelectedItemIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );

  const createOrder = () => {
    const items = (
      selectedItemIds.length
        ? MOCK_CATALOG.filter((item) => selectedItemIds.includes(item.id))
        : selectedUser.EsNuevo
          ? MOCK_CATALOG
          : []
    ).map((item) => ({ ...item, quantity: 1, delivered: false }));
    const order: Order = {
      id: `ORD-${Date.now()}`,
      code: `#${String(orders.length + 1).padStart(4, "0")}`,
      userId: selectedUser.IdIntegrante,
      date: new Date().toISOString().slice(0, 10),
      description: newOrderDescription.trim() || "Pedido de uniforme",
      status: 1,
      items,
      payments: [],
    };
    setOrders((current) => [...current, order]);
    setNewOrderDescription("");
    setShowNewOrderForm(false);
  };

  const confirmCancel = () => {
    if (!cancelId || !cancelReason.trim()) return;
    setCancelId(null);
    setCancelReason("");
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Uniformes</p>
          <h1 className={styles.title}>Pedidos de Uniforme</h1>
          <p className={styles.subtitle}>
            Consulta y administra los pedidos de uniforme de este integrante.
          </p>
          <div className={styles.memberBox}>
            <strong>
              {selectedUser.Nombres} {selectedUser.Apellidos}
            </strong>
            <span className={styles.memberMeta}>
              {selectedUser.EscuadraNombre}
            </span>
          </div>
        </div>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={openNewOrder}
        >
          <FaPlus className={styles.iconLeft} />
          Nuevo pedido
        </button>
      </header>

      <section className={styles.stats}>
        {stats.map((card) => (
          <div key={card.label} className={styles.statCard}>
            <p className={styles.statLabel}>{card.label}</p>
            <p className={styles.statValue}>{card.value}</p>
          </div>
        ))}
      </section>

      <section className={styles.filters}>
        <div className={styles.filtersGrid}>
          <CustomSelect
            key="orderState"
            name="orderState"
            label="Estado"
            initValue
            value={formData.orderState}
            dataList={[
              {
                id: 1,
                value: "Proceso",
              },
              {
                id: 2,
                value: "Cancelado",
              },
            ]}
            onChange={onSelectChange}
          />
          <CustomSelect
            key="orderPaymentState"
            name="orderPaymentState"
            label="Pagado"
            initValue
            value={formData.orderPaymentState}
            dataList={[
              {
                id: 1,
                value: "Pendiente",
              },
              {
                id: 2,
                value: "Pagado",
              },
            ]}
            onChange={onSelectChange}
          />
          <CustomSelect
            key="orderDeliveryState"
            name="orderDeliveryState"
            label="Entrega"
            initValue
            value={formData.orderDeliveryState}
            dataList={[
              {
                id: 1,
                value: "Pendiente",
              },
              {
                id: 2,
                value: "Entregado",
              },
            ]}
            onChange={onSelectChange}
          />
          <CustomDatePicker
            key="dateFrom"
            name="dateFrom"
            label="Del"
            value={formData.dateFrom}
            onChange={(value) => {
              onCustomChange("dateFrom", value);
            }}
          />
          <CustomDatePicker
            key="dateTo"
            name="dateTo"
            label="Al"
            value={formData.dateTo}
            onChange={(value) => {
              onCustomChange("dateTo", value);
            }}
          />
        </div>
      </section>

      <section className={styles.orders}>
        {visible.length ? (
          visible.map((order) => {
            const summary = getSummary(order);
            const cancelled = order.status === 3;
            return (
              <article key={order.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.cardTitleRow}>
                      <h2 className={styles.cardTitle}>Pedido {order.code}</h2>
                      <span
                        className={`${styles.pill} ${cancelled ? styles.pillCancelled : styles.pillNeutral}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className={styles.cardText}>
                      {order.date} · {order.description}
                    </p>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.buttonSm} ${styles.buttonOutline}`}
                      onClick={() => navigate(`/paymentControl/${order.id}`)}
                    >
                      Ver pedido
                    </button>
                    {!cancelled && (
                      <button
                        type="button"
                        className={`${styles.button} ${styles.buttonSm} ${styles.buttonGhost} ${styles.buttonDangerText}`}
                        onClick={() => setCancelId(order.id)}
                      >
                        Cancelar pedido
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.summary}>
                  <div>
                    <p className={styles.summaryLabel}>Total</p>
                    <p className={styles.summaryValue}>
                      {money(summary.total)}
                    </p>
                  </div>
                  <div>
                    <p className={styles.summaryLabel}>Pagado</p>
                    <p className={styles.summaryValue}>{money(summary.paid)}</p>
                  </div>
                  <div>
                    <p className={styles.summaryLabel}>Saldo</p>
                    <p className={styles.summaryValue}>
                      {money(summary.balance)}
                    </p>
                  </div>
                  <div>
                    <p className={styles.summaryLabel}>Implementos</p>
                    <p className={styles.summaryValue}>{summary.requested}</p>
                  </div>
                  <div>
                    <p className={styles.summaryLabel}>Entrega</p>
                    <p className={styles.summaryValue}>
                      {summary.delivered}/{summary.requested} ·{" "}
                      {summary.delivery}
                    </p>
                  </div>
                </div>

                <div className={styles.tags}>
                  <span className={styles.tag}>Pago: {summary.payment}</span>
                  <span className={styles.tag}>ID: {order.id}</span>
                </div>
              </article>
            );
          })
        ) : (
          <div className={styles.empty}>
            No hay pedidos que coincidan con los filtros.
          </div>
        )}
      </section>

      <footer className={styles.pagination}>
        <span className={styles.paginationText}>
          {/* Página {currentPage} de {totalPages} */}
          Página 1 de 1
        </span>
        <div className={styles.paginationActions}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSm} ${styles.buttonOutline}`}
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Anterior
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSm} ${styles.buttonOutline}`}
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Siguiente
          </button>
        </div>
      </footer>

      {/* Modal: nuevo pedido */}
      {showNewOrderForm && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Nuevo pedido</h2>
            <p className={styles.modalText}>
              Se creará un pedido independiente para {selectedUser.Nombres}{" "}
              {selectedUser.Apellidos}.
            </p>
            <input
              className={`${styles.input} ${styles.inputSpaced}`}
              placeholder="Descripción opcional"
              value={newOrderDescription}
              onChange={(event) => setNewOrderDescription(event.target.value)}
            />
            <div className={styles.checklist}>
              {MOCK_CATALOG.map((item) => (
                <label key={item.id} className={styles.checkRow}>
                  <span>
                    {item.name} · Q{item.price.toFixed(2)}
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedItemIds.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                  />
                </label>
              ))}
            </div>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonOutline}`}
                onClick={() => setShowNewOrderForm(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={createOrder}
              >
                Crear pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: cancelar pedido */}
      {cancelId && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Cancelar pedido</h2>
            <p className={styles.modalText}>
              El historial de pagos y entregas se conservará.
            </p>
            <input
              className={`${styles.input} ${styles.inputSpaced}`}
              placeholder="Motivo obligatorio"
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
            />
            <div className={styles.modalActions}>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonOutline}`}
                onClick={() => setCancelId(null)}
              >
                Volver
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonDanger}`}
                disabled={!cancelReason.trim()}
                onClick={confirmCancel}
              >
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

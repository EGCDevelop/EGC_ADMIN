import { useEffect, useState } from "react";
import styles from "./styles/uniform-orders-page.module.css";
import { FaPlus } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { CustomSelect } from "../components/CustomSelect";
import FinancialState from "../../interfaces/uniform/FinancialState.types";
import DeliveryState from "../../interfaces/uniform/DeliveryState.types";
import { useOrderStore } from "../../hooks/useOrderStore";
import UniformOrder from "../../interfaces/uniform/UniformOrder.types";
import PaymentUtils from "../../utils/paymentUtils";
import { CustomLoader } from "../components/CustomLoader";
import CustomModal from "../components/CustomModal";
import ErrorData from "../../interfaces/ErrorData.types";
import { CustomAlert } from "../components/CustomAlert";
import { useClosetStore } from "../../hooks/useClosetStore";
import { getSquadId } from "../../utils/getSquadId";
import ClosetDTO from "../../interfaces/DTOs/ClosetDTO.types";
import { useAuthStore } from "../../hooks/useAuthStore";
import UniformOrderDetails from "../../interfaces/uniform/UniformOrderDetails.types";
import SaveOrdenDTO from "../../interfaces/DTOs/SaveOrdenDTO.types";

interface DataSearch {
  orderPaymentState: number;
  orderDeliveryState: number;
}

export const UniformOrdersPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const {
    isLoadingOrderSlice,
    dataListOrderSlice,
    orderCreated,
    errorMessageOrderSlice,
    GetOrderByFilters,
    SaveOrder,
    ResetSave,
  } = useOrderStore();

  const {
    isLoadingClosetSlice,
    dtoDataListClosetSlice,
    errorMessageClosetSlice,
    GetClosetDto,
  } = useClosetStore();

  const { formData, onSelectChange } = useForm<DataSearch>({
    orderPaymentState: 0,
    orderDeliveryState: 0,
  });

  const [alert, setAlert] = useState<ErrorData | null>();
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<ClosetDTO[]>([]);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const openNewOrder = () => {
    setSelectedItemIds([]);
    setShowNewOrderForm(true);
  };
  const toggleItem = (id: ClosetDTO) =>
    setSelectedItemIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );

  const createOrder = () => {
    const grandTotal: number = selectedItemIds.reduce(
      (sum, item) => sum + Number(item.price ?? 0),
      0,
    );

    const dataOrder: UniformOrder = {
      id: 0,
      grandTotal: grandTotal,
      amountPaid: 0,
      amountPending: grandTotal,
      memberId: Number(userId),
      creationDate: new Date().toISOString(),
      fullDeliveryDate: null,
      instructorId: user!.id,
      financialState: 1,
      deliveryState: 1,
    };

    const orderDetails: UniformOrderDetails[] = selectedItemIds.map(
      (item: ClosetDTO) => ({
        id: 0,
        orderId: 0,
        uniformId: item.uniformId,
        deliveryState: 1,
        userDelivery: 0,
        stateActive: 1,
        deliveryDate: null,
        deliveryReversalComments: null,
      }),
    );

    const saveData: SaveOrdenDTO = {
      uniform: dataOrder,
      details: orderDetails,
    };

    SaveOrder(saveData);
    setShowNewOrderForm(false);
  };

  const confirmCancel = () => {
    if (!cancelId || !cancelReason.trim()) return;
    setCancelId(null);
    setCancelReason("");
  };

  useEffect(() => {
    GetOrderByFilters(
      Number(userId),
      formData.orderPaymentState,
      formData.orderDeliveryState,
    );
  }, [formData.orderPaymentState, formData.orderDeliveryState, orderCreated]);

  useEffect(() => {
    if (dataListOrderSlice?.member) {
      const squad = getSquadId(dataListOrderSlice?.member.intescIdEscuadra);
      GetClosetDto(Number(squad), dataListOrderSlice.member.escNombre);
    }
  }, [dataListOrderSlice]);

  useEffect(() => {
    if (errorMessageOrderSlice) {
      setAlert({
        title: "Error",
        message: errorMessageOrderSlice,
        status: "error",
      });
    }

    if (errorMessageClosetSlice) {
      setAlert({
        title: "Error",
        message: errorMessageClosetSlice,
        status: "error",
      });
    }
  }, [errorMessageOrderSlice, errorMessageClosetSlice]);

  useEffect(() => {
    if (orderCreated) {
      setAlert({
        title: "Exito",
        message: "Pedido creado exitosamente",
        status: "success",
      });

      setTimeout(() => {
        ResetSave();
      }, 4000);
    }
  }, [orderCreated]);

  return (
    <>
      {(isLoadingOrderSlice || isLoadingClosetSlice) && <CustomLoader />}
      {alert && (
        <CustomAlert
          title={alert.title}
          message={alert.message}
          status={alert.status}
          onClose={() => setAlert(null)}
        />
      )}
      <CustomModal
        title="Nuevo pedido"
        size="small"
        isOpen={showNewOrderForm}
        onClose={() => setShowNewOrderForm(false)}
      >
        <p className={styles.modalText}>
          Se creará un pedido independiente para{" "}
          <b>
            {dataListOrderSlice?.member.intNombres}{" "}
            {dataListOrderSlice?.member.intApellidos}.
          </b>
        </p>
        <div className={styles.checklist}>
          {dtoDataListClosetSlice.map((item: ClosetDTO) => {
            return (
              <label key={item.id} className={styles.checkRow}>
                <span>
                  {item.name} · Q{item.price.toFixed(2)}
                </span>
                <input
                  type="checkbox"
                  checked={selectedItemIds.includes(item)}
                  onChange={() => toggleItem(item)}
                />
              </label>
            );
          })}
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
      </CustomModal>
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
                {dataListOrderSlice?.member.intNombres}{" "}
                {dataListOrderSlice?.member.intApellidos}
              </strong>
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

        <section className={styles.filters}>
          <div className={styles.filtersGrid}>
            <CustomSelect
              key="orderPaymentState"
              name="orderPaymentState"
              label="Pagado"
              initValue
              value={formData.orderPaymentState}
              dataList={FinancialState}
              onChange={onSelectChange}
            />
            <CustomSelect
              key="orderDeliveryState"
              name="orderDeliveryState"
              label="Entrega"
              initValue
              value={formData.orderDeliveryState}
              dataList={DeliveryState}
              onChange={onSelectChange}
            />
          </div>
        </section>

        <section className={styles.orders}>
          {dataListOrderSlice !== null && dataListOrderSlice?.data.length ? (
            dataListOrderSlice?.data.map((item: UniformOrder) => {
              return (
                <article key={item.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <div>
                      <div className={styles.cardTitleRow}>
                        <h2 className={styles.cardTitle}>Pedido {item.id}</h2>
                        <span
                        //className={`${styles.pill} ${cancelled ? styles.pillCancelled : styles.pillNeutral}`}
                        >
                          {/* {order.status} */}
                          Estado
                        </span>
                      </div>
                      <p className={styles.cardText}>
                        {/* {order.date} · {order.description} */}
                        Fecha y descripcion
                      </p>
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={`${styles.button} ${styles.buttonSm} ${styles.buttonOutline}`}
                        //onClick={() => navigate(`/paymentControl/${order.id}`)}
                      >
                        Ver pedido
                      </button>
                      {/* {!cancelled && (
                    <button
                      type="button"
                      className={`${styles.button} ${styles.buttonSm} ${styles.buttonGhost} ${styles.buttonDangerText}`}
                      onClick={() => setCancelId(order.id)}
                    >
                      Cancelar pedido
                    </button>
                  )} */}
                    </div>
                  </div>

                  <div className={styles.summary}>
                    <div>
                      <p className={styles.summaryLabel}>Total</p>
                      <p className={styles.summaryValue}>
                        {PaymentUtils.getMoney(item.grandTotal)}
                      </p>
                    </div>
                    <div>
                      <p className={styles.summaryLabel}>Pagado</p>
                      <p className={styles.summaryValue}>
                        {PaymentUtils.getMoney(item.amountPaid)}
                      </p>
                    </div>
                    <div>
                      <p className={styles.summaryLabel}>Saldo</p>
                      <p className={styles.summaryValue}>
                        {PaymentUtils.getMoney(item.amountPending)}
                      </p>
                    </div>
                    <div>
                      <p className={styles.summaryLabel}>Implementos</p>
                      {/* <p className={styles.summaryValue}>{summary.requested}</p> */}
                    </div>
                    <div>
                      <p className={styles.summaryLabel}>Entrega</p>
                      <p className={styles.summaryValue}>
                        {/* {summary.delivered}/{summary.requested} · {summary.delivery} */}
                      </p>
                    </div>
                  </div>

                  <div className={styles.tags}>
                    {/* <span className={styles.tag}>Pago: {summary.payment}</span>
                <span className={styles.tag}>ID: {order.id}</span> */}
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
            >
              Anterior
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSm} ${styles.buttonOutline}`}
            >
              Siguiente
            </button>
          </div>
        </footer>

        {/* Modal: cancelar pedido */}
        {/* {cancelId && (
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
      )} */}
      </main>
    </>
  );
};

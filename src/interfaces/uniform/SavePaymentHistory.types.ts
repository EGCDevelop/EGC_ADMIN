import PaymentHistory from "./PaymentHistory.types";
import PaymentHistoryDetails from "./PaymentHistoryDetails.types";
import UniformOrder from "./UniformOrder.types";

type SavePaymentHistory = {
  payment: PaymentHistory;
  inflow: PaymentHistoryDetails;
  outflow?: PaymentHistoryDetails;
  order?: UniformOrder;
};

export default SavePaymentHistory;

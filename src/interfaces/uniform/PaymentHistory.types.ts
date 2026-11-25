type PaymentHistory = {
  id: number;
  paidAmount: number;
  cashReceived: number;
  chancheMoney: number;
  paidDate: string;
  paymentNumber: number;
  observations?: string;
  orderId: number;
  userReceived: number;
};

export default PaymentHistory;

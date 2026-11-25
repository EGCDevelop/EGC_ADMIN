type UniformOrder = {
  id: number;
  grandTotal: number;
  amountPaid: number;
  amountPending: number;
  memberId: number;
  creationDate: string;
  fullDeliveryDate?: string;
  instructorId: number;
  financialState: number; // 1 - awaiting payment | 2 - partial payment | 3 - canceled
  deliveryState: number; // 1 - pending | 2 - partial delivered | 3 - complete
};

export default UniformOrder;

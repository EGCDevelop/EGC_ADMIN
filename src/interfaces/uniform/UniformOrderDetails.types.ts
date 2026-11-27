type UniformOrderDetails = {
  id: number;
  orderId: number;
  uniformId: number;
  deliveryState: number;
  userDelivery: number;
  deliveryDate?: string | undefined | null;
  deliveryReversalComments?: string | undefined | null;
  stateActive: number;
};

export default UniformOrderDetails;

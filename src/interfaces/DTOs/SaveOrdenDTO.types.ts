import UniformOrder from "../uniform/UniformOrder.types";
import UniformOrderDetails from "../uniform/UniformOrderDetails.types";

type SaveOrdenDTO = {
  uniform: UniformOrder;
  details: UniformOrderDetails[];
};

export default SaveOrdenDTO;

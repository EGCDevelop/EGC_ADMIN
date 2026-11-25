interface PaymentHistoryDTO {
  paymentHistoryId: number; // id
  paidAmount: number; // monto pagado
  paidDate: string; // fecha de pago
  numberOneBills: number; // billetes de Q1
  numberFiveBills: number; // billetes de Q5
  numberTenBills: number; // billetes de Q10
  numberTwentyBills: number; // billetes de Q20
  numberFiftyBills: number; // billetes de Q50
  numberOneHundredBills: number; // billetes de Q100
  numberTwoHundredBills: number; // billetes de Q200
  observations?: string; // observaciones

  // OUTPUTS
  numberOneOutputBills: number; // billetes salida Q1
  numberFiveOutputBills: number; // billetes salida Q5
  numberTenOutputBills: number; // billetes salida Q10
  numberTwentyOutputBills: number; // billetes salida Q20
  numberFiftyOutputBills: number; // billetes salida Q50
  numberOneHundredOutputBills: number; // billetes salida Q100
  numberTwoHundredOutputBills: number; // billetes salida Q200
}

export const INITIAL_FORM: PaymentHistoryDTO = {
  paymentHistoryId: 0,
  paidAmount: 0,
  paidDate: "",
  numberOneBills: 0,
  numberFiveBills: 0,
  numberTenBills: 0,
  numberTwentyBills: 0,
  numberFiftyBills: 0,
  numberOneHundredBills: 0,
  numberTwoHundredBills: 0,
  numberOneOutputBills: 0,
  numberFiveOutputBills: 0,
  numberTenOutputBills: 0,
  numberTwentyOutputBills: 0,
  numberFiftyOutputBills: 0,
  numberOneHundredOutputBills: 0,
  numberTwoHundredOutputBills: 0,
  observations: "",
};

export default PaymentHistoryDTO;

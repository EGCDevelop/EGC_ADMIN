class PaymentUtils {
  public static getMoney = (value: number): string => `Q${value.toFixed(2)}`;

  public static toNumber = (value: unknown): number => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  public static paymentStatus = (paid: number, total: number) => {
    return paid === 0
      ? "Pendiente de pago"
      : paid >= total
        ? "Pagado"
        : "Pago parcial";
  };

  public static describeCash = (details?: Record<number, number>) => {
    return Object.entries(details || {})
      .filter(([, quantity]) => Number(quantity) > 0)
      .map(
        ([denomination, quantity]) =>
          `${quantity} × Q${denomination} = ${PaymentUtils.getMoney(Number(denomination) * Number(quantity))}`,
      )
      .join(", ");
  };
}

export default PaymentUtils;

import { Decimal } from "decimal.js";
export const amountToCurrency = (amount) =>
  `${Decimal(amount).div(100).toFixed(2)} €`;

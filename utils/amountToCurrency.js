import { Decimal } from 'decimal.js'
export const amountToCurrency = (amount) =>
  `${new Decimal(amount).div(100).toFixed(2)} €`

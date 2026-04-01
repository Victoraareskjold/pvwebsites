export function calculateKwhCostWithLoan(
  totalProduction30,
  totalCost30,
  loanAmount,
) {
  const annualInterestRate = 0.1;
  const years = 5;
  const monthlyRate = annualInterestRate / 12;
  const numberOfPayments = years * 12;

  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPaidForLoan = monthlyPayment * numberOfPayments;
  const interestCost = totalPaidForLoan - loanAmount;

  const newTotalCost30 = totalCost30 + interestCost;
  const costPerKwhWithLoan = newTotalCost30 / totalProduction30;

  return costPerKwhWithLoan;
}

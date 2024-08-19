const newMortgageForm = document.getElementById("new-mortgage-form");
const newMortgagePrincipal = document.getElementById(
  "new-mortgage-loan-amount"
);
const newMortgageInterestRate = document.getElementById(
  "new-mortgage-interest-rate"
);
const newMortgageLength = document.getElementById("new-mortgage-length");
const newMortgageTaxes = document.getElementById("new-mortgage-taxes");
const newMortgageInsurance = document.getElementById("new-mortgage-insurance");
const newMortgageOutput = document.getElementById("new-mortgage-output");

const existingMortgageForm = document.getElementById("mortgage-payoff-form");
const existingMortgageRemainingBalance = document.getElementById(
  "mortgage-payoff-remaining-loan-amount"
);
const existingMortgageInterestRate = document.getElementById(
  "mortgage-payoff-interest-rate"
);
const existingMortgageMonthlyPayment = document.getElementById(
  "mortgage-payoff-current-payment"
);
const existingMortgageMonthlyEscrow = document.getElementById(
  "mortgage-payoff-current-escrow"
);
const existingMortgageAdditionalPrincipal = document.getElementById(
  "mortgage-payoff-additional-principal"
);
const existingMortgageEstimatedMarketReturn = document.getElementById(
  "mortgage-payoff-estimated-market-rate"
);
const existingMortgageOutput = document.getElementById(
  "existing-mortgage-output"
);
const existingMortgageLumpSum = document.getElementById(
  "mortgage-payoff-lump-sum"
);

newMortgageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  newMortgageOutput.innerText = CalculateNewMortgage() + " per month.";
});

existingMortgageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Calculate amount
  const payoffMonths = CalculatePayoffMonths(true);
  existingMortgageOutput.innerHTML = `${payoffMonths} months / ${payoffMonths / 12.0} years until the mortgage is paid off`

  // detemine if it'd be better to invest or to payoff
  const remainingBalance = CalculateMortgageBalanceAfterMonths(payoffMonths);

const investedAmount = CalculateCompoundInterest(existingMortgageLumpSum.value, payoffMonths, existingMortgageEstimatedMarketReturn.value);

  existingMortgageOutput.innerHTML += `<hr>....but..... if you had invested that lump sum, after ${payoffMonths} months, then the remaining balance would be ${FormatCurrency(remainingBalance)} and the balance invested would be worth ${FormatCurrency(investedAmount)} at ${existingMortgageEstimatedMarketReturn.value}% interest rate`

  if(parseFloat(investedAmount) > parseFloat(remainingBalance)){
    existingMortgageOutput.innerHTML += `<hr>....it makes more sense to invest`
  }
  else{
    existingMortgageOutput.innerHTML += `<hr>....it makes more sense to pay off!`
  }
});

const CalculateNewMortgage = () => {
  const principal = newMortgagePrincipal.value;
  const interest = parseFloat(newMortgageInterestRate.value) / 100 / 12;
  const numberOfPayments = parseInt(newMortgageLength.value) * 12;

  const dividend =
    principal * (interest * Math.pow(1 + interest, numberOfPayments));
  const divisor = Math.pow(1 + interest, numberOfPayments) - 1;
  let monthlyPmt = dividend / divisor;

  const taxes = parseInt(newMortgageTaxes.value) / 12;
  const insurance = parseInt(newMortgageInsurance.value) / 12;

  monthlyPmt += taxes + insurance;
  return FormatCurrency(monthlyPmt);
};

const FormatCurrency = (amount) => {
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return USDollar.format(amount);
};

const CalculatePayoffMonths = (lumpSumFlag) => {
  const totalMonthlyPmt = parseFloat(existingMortgageMonthlyPayment.value);
  const monthlyEscrow = parseFloat(existingMortgageMonthlyEscrow.value);
  const monthlyAdditionalPrincipal = parseFloat(
    existingMortgageAdditionalPrincipal.value
  );
  const monthlyInterestRate =
    parseFloat(existingMortgageInterestRate.value) / 100 / 12;

  let remainingBalance = parseFloat(existingMortgageRemainingBalance.value);
  if(lumpSumFlag){
    remainingBalance -= parseFloat(existingMortgageLumpSum.value ? existingMortgageLumpSum.value : 0);
  } 

  let remainingMonths = 0;

  while(remainingBalance > 0){
    const monthlyInterest = remainingBalance * monthlyInterestRate;
    const monthlyPrincipal = totalMonthlyPmt - monthlyInterest - monthlyEscrow;
    const totalMonthlyPrincipalPayment = monthlyPrincipal + monthlyAdditionalPrincipal;
    remainingBalance -= totalMonthlyPrincipalPayment;
    remainingMonths++;
  }

  return remainingMonths;
};

const CalculateMortgageBalanceAfterMonths = (months) => {
    const totalMonthlyPmt = parseFloat(existingMortgageMonthlyPayment.value);
    const monthlyEscrow = parseFloat(existingMortgageMonthlyEscrow.value);
    const monthlyAdditionalPrincipal = parseFloat(
      existingMortgageAdditionalPrincipal.value
    );
    const monthlyInterestRate =
      parseFloat(existingMortgageInterestRate.value) / 100 / 12;
  
    let remainingBalance = parseFloat(existingMortgageRemainingBalance.value);
  
    let remainingMonths = 0;
  
    while(remainingMonths < parseInt(months)){
      const monthlyInterest = remainingBalance * monthlyInterestRate;
      const monthlyPrincipal = totalMonthlyPmt - monthlyInterest - monthlyEscrow;
      const totalMonthlyPrincipalPayment = monthlyPrincipal + monthlyAdditionalPrincipal;
      remainingBalance -= totalMonthlyPrincipalPayment;
      remainingMonths++;
    }
  
    return remainingBalance;
}

const CalculateCompoundInterest = (balance, time, rate) => {
    const principal = parseFloat(balance);
    console.log("principal = " + principal);
    const annualRate = parseFloat(rate) / 100;
    console.log('annual rate = ' + annualRate);
    const months = parseFloat(time);
    console.log('months = ' + months);

    return (principal * Math.pow(1 + (annualRate / 12), months));
};

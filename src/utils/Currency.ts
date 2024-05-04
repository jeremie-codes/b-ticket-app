export function apiAmount(currencyString: string | number): string {
  const amount = Number(currencyString);

  if (Number.isInteger(amount)) {
    return amount.toFixed(2);
  } else {
    return amount.toString();
  }
}

export function displayedAmount(
  currencyString: string | number,
  currencyCode?: string
): string {
  const amount = Number(currencyString);
  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (currencyCode) {
    const transformedCurrency = `${formattedAmount} ${currencyCode.toLocaleUpperCase()}`;
    return transformedCurrency;
  }

  return formattedAmount;
}

export const formatUGX = (amount: number) => {
  try {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    // Fallback if Intl is not supported
    return `UGX ${amount.toLocaleString()}`;
  }
};

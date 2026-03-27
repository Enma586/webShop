export const useFormatter = () => {
  const formatDateLiteral = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('es-SV', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDaysDiff = (dateString) => {
    const now = new Date();
    const invDate = new Date(dateString);
    return (now - invDate) / (1000 * 60 * 60 * 24);
  };

  return { formatDateLiteral, formatCurrency, getDaysDiff };
};
export const useFormatter = () => {
  const formatDateLiteral = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      // Intentamos crear el objeto Date directamente
      const date = new Date(dateString);
      
      // Si la fecha es inválida (NaN), probamos tu método manual
      if (isNaN(date.getTime())) {
        const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
        const manualDate = new Date(year, month - 1, day);
        if (isNaN(manualDate.getTime())) return "ERR_DATE";
        return new Intl.DateTimeFormat('es-SV', { day: '2-digit', month: 'short' }).format(manualDate);
      }

      return new Intl.DateTimeFormat('es-SV', {
        day: '2-digit',
        month: 'short',
      }).format(date);
    } catch (e) {
      return "N/A";
    }
  };

  const formatCurrency = (amount) => {
    const value = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDaysDiff = (dateString) => {
    if (!dateString) return 0;
    const now = new Date();
    const invDate = new Date(dateString);
    return (now - invDate) / (1000 * 60 * 60 * 24);
  };

  return { formatDateLiteral, formatCurrency, getDaysDiff };
};
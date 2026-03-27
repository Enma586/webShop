import { useMemo } from "react";
import { useFormatter } from "@/hooks/useFormatter";

export const useDashboardStats = (invoices, dateRange) => {
  const { formatDateLiteral } = useFormatter();

  const stats = useMemo(() => {
    const filtered = invoices.filter(inv => {
      if (!dateRange.from || !dateRange.to) return true;
      const invDate = new Date(inv.created_at);
      const start = new Date(dateRange.from);
      const end = new Date(dateRange.to);
      end.setHours(23, 59, 59, 999);
      return invDate >= start && invDate <= end;
    });

    const totalRevenue = filtered.reduce((acc, inv) => acc + parseFloat(inv.total), 0);
    
    const dailyMap = {};
    filtered.forEach(inv => {
      const dayKey = inv.created_at.split('T')[0].split(' ')[0];
      dailyMap[dayKey] = (dailyMap[dayKey] || 0) + parseFloat(inv.total);
    });

    const chartData = Object.keys(dailyMap).sort().map(date => ({
      date: formatDateLiteral(date),
      amount: dailyMap[date]
    }));

    const productSales = {};
    filtered.forEach(inv => {
      inv.order?.items?.forEach(item => {
        productSales[item.product_name] = (productSales[item.product_name] || 0) + item.quantity;
      });
    });

    const topAssets = Object.entries(productSales)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty).slice(0, 3);

    return { totalRevenue, chartData, topAssets, filtered };
  }, [invoices, dateRange]);

  return stats;
};
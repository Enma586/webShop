import { AuthProvider } from './AuthContext';
import { NotificationProvider } from './NotificationContext';
import { CategoryProvider } from './CategoryContext';
import { ProductProvider } from './ProductContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from './CartContext';
import { UserProvider } from './UserContext';
import { OrderProvider } from './OrderContext';
import { InvoiceProvider } from './InvoiceContext';
import { ThemeProvider } from './ThemeContext';
import { AdminProvider } from './AdminContext';
import { AddressProvider } from './AddressContext';
import { BrowserRouter } from 'react-router-dom';

const providers = [
  NotificationProvider,
  ThemeProvider,
  AuthProvider,
  AdminProvider,
  UserProvider,
  CategoryProvider,
  ProductProvider,
  AddressProvider,
  CartProvider,
  InvoiceProvider,
  OrderProvider,
];

export const CombinedProvider = ({ children }) => {
  return (
    <BrowserRouter>
      <TooltipProvider delayDuration={0}>
        {providers.reduceRight((acc, Provider) => {
          return <Provider>{acc}</Provider>;
        }, children)}
      </TooltipProvider>
    </BrowserRouter>
  );
};
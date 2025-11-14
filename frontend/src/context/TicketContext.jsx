// Ticket context for global state management (for future use)
import { createContext, useContext } from 'react';

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  // Implementation can be added later
  return <TicketContext.Provider value={{}}>{children}</TicketContext.Provider>;
};

export const useTicketContext = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicketContext must be used within TicketProvider');
  }
  return context;
};


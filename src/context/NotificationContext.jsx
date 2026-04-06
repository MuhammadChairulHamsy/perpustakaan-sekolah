import { createContext } from "react";
import { useNotificationValue } from "../hooks/useNotification";

export const NotificationContext = createContext(null);
export const  NotificationProvider = ({children}) => {
  const value = useNotificationValue();

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
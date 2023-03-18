import React, { createContext, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface Log {
  temperature: number;
  createdAt: Date;
}
type LogList = Log[];

// Define the shape of the context object
interface StoreContextType {
  userName?: string;
  logList: LogList;
  setUserName: (name: string) => void;
  setLogList: (logs: LogList) => void;
}
interface Props {
  children: any;
}

export const StoreContext = createContext<StoreContextType>({
  userName: '',
  logList: [],
  setUserName: () => {
    throw new Error('setUserName function not implemented');
  },
  setLogList: () => {
    throw new Error('setLogList function not implemented');
  },
});

export const StoreProvider: React.FC<Props> = ({ children }) => {
  const { user } = useAuth0();

  const [userName, setUserName] = useState(user?.name);
  const [logList, setLogList] = useState<LogList>([]);

  const contextValue = {
    userName,
    logList,
    setUserName,
    setLogList,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

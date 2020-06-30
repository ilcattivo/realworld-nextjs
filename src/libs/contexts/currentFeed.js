import { useState, createContext } from "react";

export const CurrentFeedContext = createContext();

export const CurrentFeedProvider = ({ children }) => {
  const [value, setValue] = useState();

  return (
    <CurrentFeedContext.Provider value={[value, setValue]}>
      {children}
    </CurrentFeedContext.Provider>
  );
};

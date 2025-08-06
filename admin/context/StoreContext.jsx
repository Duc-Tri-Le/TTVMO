import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const URL = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setToken(localStorage.getItem("token"));
      setUserId(localStorage.getItem("userId"));
    };
    loadData();
  }, []);
  const ContextValue = {
    URL,
    token,
    userId,
  };

  return (
    <StoreContext.Provider value={ContextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

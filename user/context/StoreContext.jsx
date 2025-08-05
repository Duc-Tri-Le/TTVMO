import { createContext } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const URL = "http://localhost:4000";

    const ContextValues = {
        URL
    }

    return (
        <StoreContext.Provider value={ContextValues}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
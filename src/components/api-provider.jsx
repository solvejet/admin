// src/components/api-provider.jsx
import { Provider } from "react-redux";
import { store } from "../lib/store";

export function ApiProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

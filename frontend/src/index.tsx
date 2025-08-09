import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./i18n";

const root = createRoot(document.body);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

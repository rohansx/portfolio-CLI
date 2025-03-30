import { createRoot } from "react-dom/client";
import App from "./App/App";
import "./index.scss";

const container = document.getElementById("root");
// Type assertion for root element
const root = createRoot(container!);
root.render(<App />);

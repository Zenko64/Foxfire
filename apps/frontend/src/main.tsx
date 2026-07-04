import { createRoot } from "react-dom/client";
import "./assets/css/main.css";
import { Button } from "./components/ui/button";

function App() {
  return <Button>Hello, World!</Button>;
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  throw new Error("The Root Element Does Not Exist.");
}

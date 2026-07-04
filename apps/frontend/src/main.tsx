import { createRoot } from "react-dom/client";
import "./assets/css/main.css"

function App() {
    return (
        <h1 className="text-cyan-400 text-4xl font-bold">
            Hello, World!
        </h1>
    )
}

const rootElement = document.getElementById("root")

if (rootElement) {
    createRoot(rootElement).render(<App />)
} else {
    throw new Error("The Root Element Does Not Exist.")
}
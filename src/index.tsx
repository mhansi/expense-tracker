import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

async function prepare() {
  if (process.env.NODE_ENV === "development") {
    const { worker } = await import("./mocks/browser");
    await worker.start();
  }
}

prepare().then(() => {
  const root = ReactDOM.createRoot(document.getElementById("root")!);
  root.render(<App />);
});

import { useState } from "react";

import CanvasPreview from "./components/CanvasPreview";
import InspectorPanel from "./components/InspectorPanel";

export default function App() {
  const [message, setMessage] = useState("Hello, welcome to your app");

  return (
    <div className="app-shell">
      <header className="app-header">
        <p className="eyebrow">No-code data prototype</p>
        <h1>Design smart text without code</h1>
      </header>

      <div className="workspace" aria-label="Prototype workspace">
        <CanvasPreview message={message} />
        <InspectorPanel message={message} onMessageChange={setMessage} />
      </div>
    </div>
  );
}

import { useState } from 'react';

import { Excalidraw } from "@excalidraw/excalidraw";

function App() {
  const [count, setCount] = useState<number>(0);

  return (

    <div style={{ height: "70vh", width: "90%" }}>
      <Excalidraw theme="dark" />
      <div className="container">
        <h1>Vite + React + TypeScript + Excalidraw</h1>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </div>
    </div>
  );
}

export default App;
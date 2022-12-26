import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((count) => count + 1);
  };

  return (
    <div>
      {"count:" + count}
      <button onClick={handleClick}>click + 1</button>
    </div>
  );
}

export default App;

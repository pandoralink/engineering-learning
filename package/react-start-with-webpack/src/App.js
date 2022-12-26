import { useState } from "react";

function App() {
  let [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(++count);
  };

  return (
    <div>
      {"count:" + count}
      <button onClick={handleClick}>click + 1</button>
    </div>
  );
}

export default App;

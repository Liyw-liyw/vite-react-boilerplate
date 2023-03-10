import { useState } from 'react';
import './App.less';
import { ReactComponent as ReactLogo } from '@/assets/react.svg';
import { appName } from '@/assets/test.json';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div className="flex items-center justify-center gap-4">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="w-8 animate-bounce" alt="Vite logo" />
        </a>
        <ReactLogo className="animate-spin" />
      </div>
      <h1 className="my-8">{appName}</h1>
      <div className="mb-8">
        <button className="mb-4" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className="mb-4">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-[#888] hover:text-black">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;

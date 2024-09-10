import {useState, useEffect} from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {Navbar} from "./components";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className='app-container'>
        {/* Navbar will be at the top */}
        <Navbar />
        <div className='content'>
          <h1>Metamask Testing</h1>
          {/* Any other content can go here */}
        </div>
      </div>
    </>
  );
}

export default App;

import './App.css';
import {Link, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <nav className="p-4 bg-gray-800 text-white">
        <Link to="/" className="mr-4">Главная</Link>
        <Link to="/about">О нас</Link>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;

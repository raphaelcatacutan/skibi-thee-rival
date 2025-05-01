import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React from "react";
import "./App.css";

// routers
import Battle from "./pages/Battle";
import Leaderboards from "./pages/Leaderboards";
import Loading from "./pages/Loading";
import NewChallenger from "./pages/NewChallenger";
import Winner from "./pages/Winner";
import TestPage from "./pages/TestPage";
import TestAnimation from "./pages/TestAnimation";
import CardPreview from "./pages/CardPreview";
import Rivals from "./pages/Rivals";

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        {/* <nav>
          <Link to="/leaderboards">Leaderboards</Link>
          <Link to="/battle">Battle</Link>
        </nav> */}
        <Routes>
          <Route index element={<TestAnimation />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/NewChallenger" element={<NewChallenger />} />
          <Route path="/testPage" element={<TestPage />} />
          <Route path="/testAnimation" element={<TestAnimation />} />
          <Route path="/CardPreview" element={<CardPreview />} />
          <Route path="/Winner" element={<Winner />} />
          <Route path="/Rivals" element={<Rivals />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

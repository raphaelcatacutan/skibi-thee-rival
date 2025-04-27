import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import './App.css';

// routers
import Battle from './pages/Battle';
import Leaderboards from './pages/Leaderboards';

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        {/* <nav>
          <Link to="/leaderboards">Leaderboards</Link>
          <Link to="/battle">Battle</Link>
        </nav> */}
        <Routes>
          <Route index element={<Leaderboards />}/>
          <Route path='/leaderboards' element={<Leaderboards />} />
          <Route path='/battle' element={<Battle />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
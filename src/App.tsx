import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import './App.css';

// routers
import Battle from './pages/Battle';
import Leaderboards from './pages/Leaderboards';
import Loading from './pages/Loading';
import NewChallenger from './pages/NewChallenger';
import Winner from './pages/Winner';


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
          <Route path='/loading' element={<Loading />} />
          <Route path='/NewChallenger' element={<NewChallenger />} />
          <Route path='/Winner' element={<Winner />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
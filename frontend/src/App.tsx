import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { Home, Projects, Leaderboard, XP } from './pages';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="xp" element={<XP />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

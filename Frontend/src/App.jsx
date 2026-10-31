// Frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import QueryDetail from './pages/QueryDetail';
import History from './pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/queries/:id" element={<QueryDetail />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
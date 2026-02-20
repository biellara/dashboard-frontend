import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { UploadPage } from './pages/Upload';
import { MapPin } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface-100">
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const NotFound = () => (
  <div className="min-h-screen bg-surface-100 flex items-center justify-center px-4">
    <div className="text-center animate-fade-in-scale">
      <div className="w-20 h-20 mx-auto mb-6 bg-brand-50 rounded-2xl flex items-center justify-center border-2 border-brand-100">
        <MapPin className="text-brand-500" size={32} />
      </div>
      <h1 className="text-6xl font-bold text-brand-600 font-display mb-2">404</h1>
      <p className="text-ink-400 text-lg mb-8">Página não encontrada</p>
      <Link
        to="/dashboard"
        className="
          inline-flex items-center gap-2 px-6 py-3
          bg-brand-600 text-white rounded-xl font-semibold
          hover:bg-brand-700 active:scale-[0.97]
          transition-all duration-200
          shadow-lg shadow-brand-600/25
        "
      >
        Voltar ao Dashboard
      </Link>
    </div>
  </div>
);

export default App;

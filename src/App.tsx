import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { UploadPage } from './pages/Upload';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <main>
          <Routes>
            {/* Rota principal redireciona para o dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Rota para Upload */}
            <Route path="/upload" element={<UploadPage />} />
            
            {/* Rota 404 */}
            <Route path="*" element={<div className="p-8">Página não encontrada.</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
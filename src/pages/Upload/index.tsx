import { useState, useRef } from 'react';
import { uploadPlanilha } from '../../services/api';

export const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dataVoalle, setDataVoalle] = useState<string>('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Referência para "esconder" e acionar o input de arquivo original
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setStatus(null);
    
    try {
      const result = await uploadPlanilha(file, dataVoalle);
      setStatus({ type: 'success', msg: result.message || 'Arquivo processado com sucesso!' });
      // Limpa após o sucesso
      setFile(null);
      setDataVoalle('');
    } catch (err: unknown) {
      console.error(err);
      const error = err as { response?: { data?: { detail?: string } } };
      setStatus({ 
        type: 'error', 
        msg: error.response?.data?.detail || 'Erro de conexão com o servidor.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Importar Dados do SAC</h1>
      
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center bg-white shadow-sm">
        
        {/* 1. INPUT ORIGINAL ESCONDIDO */}
        <input 
          type="file" 
          accept=".csv, .xlsx" 
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden" 
        />
        
        {/* 2. BOTÃO PARA ABRIR A JANELA DO COMPUTADOR */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-md font-medium hover:bg-slate-50 transition-colors mb-4"
        >
          📁 Escolher Arquivo CSV ou XLSX
        </button>

        {/* Mostra o nome do arquivo selecionado */}
        <p className={`text-sm mb-8 ${file ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>
          {file ? `Selecionado: ${file.name}` : "Nenhum arquivo selecionado"}
        </p>
        
        <hr className="mb-8 border-slate-100" />

        <div className="mt-4 mb-8 max-w-xs mx-auto text-left">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Data do Relatório (Apenas Voalle)
          </label>
          <input
            type="date"
            value={dataVoalle}
            onChange={(e) => setDataVoalle(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-slate-400 mt-1">
            Deixe em branco para Omnichannel/Ligações.
          </p>
        </div>
        
        {/* 3. BOTÃO DE ENVIO (SÓ ATIVA SE TIVER ARQUIVO) */}
        <button 
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="bg-indigo-600 text-white w-full max-w-xs px-8 py-3 rounded-lg font-medium disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors hover:bg-indigo-700"
        >
          {isLoading ? 'Enviando e Processando...' : 'Enviar para o Banco de Dados'}
        </button>

        {status && (
          <div className={`mt-6 p-4 rounded-md text-sm font-medium text-left ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status.msg}
          </div>
        )}
      </div>
    </div>
  );
};
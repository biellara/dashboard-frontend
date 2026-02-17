import { useState, useRef, useEffect } from 'react';
import { uploadPlanilha } from '../../services/api';

export const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dataVoalle, setDataVoalle] = useState<string>('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingText, setProcessingText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const startProgress = () => {
      setProgress(5);
      setProcessingText('📤 Enviando arquivo...');

      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) {
            setProcessingText('📤 Enviando arquivo...');
            return prev + 5;
          }
          if (prev < 60) {
            setProcessingText('⚙️ Processando registros...');
            return prev + 3;
          }
          if (prev < 85) {
            setProcessingText('📊 Inserindo no banco de dados...');
            return prev + 2;
          }
          return prev;
        });
      }, 400);
    };

    startProgress();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoading]);

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const result = await uploadPlanilha(file, dataVoalle);

      if (intervalRef.current) clearInterval(intervalRef.current);

      setProgress(100);
      setProcessingText('✅ Finalizando importação...');

      setTimeout(() => {
        setStatus({ 
          type: 'success', 
          msg: result.message || 'Arquivo processado com sucesso!' 
        });
        setIsLoading(false);
        setFile(null);
        setDataVoalle('');
        setProgress(0);
      }, 800);

    } catch (err: unknown) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      const error = err as { response?: { data?: { detail?: string } } };

      setStatus({ 
        type: 'error', 
        msg: error.response?.data?.detail || 'Erro de conexão com o servidor.' 
      });

      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        Importar Dados do SAC
      </h1>

      <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center bg-white shadow-sm">

        <input 
          type="file" 
          accept=".csv, .xlsx" 
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden" 
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-md font-medium hover:bg-slate-50 transition-colors mb-4 disabled:opacity-50"
        >
          📁 Escolher Arquivo CSV ou XLSX
        </button>

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
            disabled={isLoading}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
          />
          <p className="text-xs text-slate-400 mt-1">
            Deixe em branco para Omnichannel/Ligações.
          </p>
        </div>

        <button 
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="bg-indigo-600 text-white w-full max-w-xs px-8 py-3 rounded-lg font-medium disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors hover:bg-indigo-700"
        >
          {isLoading ? 'Processando...' : 'Enviar para o Banco de Dados'}
        </button>

        {/* 🔥 BARRA DE PROGRESSO */}
        {isLoading && (
          <div className="mt-8 w-full max-w-xs mx-auto">
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-slate-600 mt-3 animate-pulse">
              {processingText}
            </p>
          </div>
        )}

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

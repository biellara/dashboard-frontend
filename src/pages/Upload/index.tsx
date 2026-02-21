import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { uploadPlanilha } from '../../services/api';
import { Toast } from '../../components/ui/Toast';
import type { ToastType } from '../../components/ui/Toast';
import {
  Upload,
  FileSpreadsheet,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  X,
  AlertTriangle,
  Copy,
} from 'lucide-react';

// ── Tipos ──
interface UploadResponse {
  status: 'success' | 'warning' | 'error' | 'duplicate';
  message: string;
  detalhes?: {
    formato_detectado?: string;
    total_linhas_arquivo?: number;
    success_count?: number;
    ignored_count?: number;
    duplicate_count?: number;
    error_count?: number;
    errors?: string[];
  };
}

interface ErroValidacao {
  tipo: string;
  mensagem: string;
  erros: string[];
  total_linhas: number;
}

// ══════════════════════════════════════════
// VALIDAÇÃO DE DATA NO FRONTEND
// ══════════════════════════════════════════

const DATA_MINIMA = new Date(2020, 0, 1); // 01/01/2020

function validarDataVoalle(dataStr: string): string | null {
  if (!dataStr) return null; // campo vazio é permitido

  const partes = dataStr.split('-');
  if (partes.length !== 3) return 'A data informada não é válida. Use o calendário para selecionar.';

  const ano = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10);
  const dia = parseInt(partes[2], 10);

  // Verifica se é uma data real
  const dataObj = new Date(ano, mes - 1, dia);
  if (
    dataObj.getFullYear() !== ano ||
    dataObj.getMonth() !== mes - 1 ||
    dataObj.getDate() !== dia
  ) {
    return 'A data informada não existe. Verifique e tente novamente.';
  }

  // Antes de 2020
  if (dataObj < DATA_MINIMA) {
    return `A data ${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano} é anterior a 01/01/2020. Por favor, insira uma data válida.`;
  }

  // No futuro (tolerância de 1 dia por fuso)
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  amanha.setHours(23, 59, 59, 999);

  if (dataObj > amanha) {
    return `A data ${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano} é uma data no futuro. Por favor, insira uma data válida.`;
  }

  return null; // OK
}

// ══════════════════════════════════════════
// SANITIZAÇÃO DE ERROS DO BACKEND
// ══════════════════════════════════════════

function extrairMensagemErro(err: unknown): { tipo: ToastType; msg: string; errosDetalhe?: string[] } {
  const error = err as {
    response?: {
      status?: number;
      data?: { detail?: string | ErroValidacao };
    };
  };

  const httpStatus = error.response?.status;
  const detail = error.response?.data?.detail;

  // ── 422: Erro de validação estruturado ──
  if (httpStatus === 422 && detail && typeof detail === 'object' && 'tipo' in detail) {
    const validacao = detail as ErroValidacao;
    return {
      tipo: 'error',
      msg: validacao.mensagem || 'A planilha contém dados inválidos.',
      errosDetalhe: validacao.erros,
    };
  }

  // ── 409: Arquivo duplicado ──
  if (httpStatus === 409) {
    const msg = typeof detail === 'string' ? detail : 'Este arquivo já foi importado anteriormente. Envie um arquivo diferente.';
    return { tipo: 'warning', msg };
  }

  // ── 400: Erro de validação simples ──
  if (httpStatus === 400) {
    const msg = typeof detail === 'string' ? detail : 'Erro nos dados enviados. Verifique a planilha.';
    return { tipo: 'error', msg };
  }

  // ── 500 ou qualquer outro: mensagem limpa ──
  if (typeof detail === 'string' && detail.length < 300) {
    return { tipo: 'error', msg: detail };
  }

  // Fallback — nunca mostra SQL ou stack trace
  return {
    tipo: 'error',
    msg: 'Ocorreu um erro ao processar o arquivo. Tente novamente ou entre em contato com o administrador.',
  };
}

// ══════════════════════════════════════════
// COMPONENTE
// ══════════════════════════════════════════

export const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dataVoalle, setDataVoalle] = useState<string>('');
  const [dataVoalleErro, setDataVoalleErro] = useState<string>('');
  const [toast, setToast] = useState<{ type: ToastType; msg: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingText, setProcessingText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errosValidacao, setErrosValidacao] = useState<string[] | null>(null);
  const [mensagemValidacao, setMensagemValidacao] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<number | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // ── Progress simulation ─────────────────────────────
  useEffect(() => {
    if (!isLoading) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const timer = setTimeout(() => {
      setProgress(5);
      setProcessingText('Enviando arquivo...');
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev < 30) { setProcessingText('Enviando arquivo...'); return prev + 5; }
          if (prev < 60) { setProcessingText('Validando dados...'); return prev + 3; }
          if (prev < 85) { setProcessingText('Inserindo no banco de dados...'); return prev + 2; }
          return prev;
        });
      }, 400);
    }, 0);
    return () => { clearTimeout(timer); if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isLoading]);

  // ── Drag and drop ───────────────────────────────────
  const handleDragEnter = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) setIsDragging(false);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      if (ext === 'csv' || ext === 'xlsx') { setFile(droppedFile); setErrosValidacao(null); }
      else setToast({ type: 'error', msg: 'Formato inválido. Selecione um arquivo .csv ou .xlsx' });
    }
  }, []);

  // ── Validação da data ao alterar ────────────────────
  const handleDataChange = (value: string) => {
    setDataVoalle(value);
    if (value) {
      const erro = validarDataVoalle(value);
      setDataVoalleErro(erro || '');
    } else {
      setDataVoalleErro('');
    }
  };

  // ── Upload handler ──────────────────────────────────
  const handleUpload = async () => {
    if (!file) return;

    // ═══ VALIDAÇÃO FRONTEND ANTES DE ENVIAR ═══
    if (dataVoalle) {
      const erroData = validarDataVoalle(dataVoalle);
      if (erroData) {
        setDataVoalleErro(erroData);
        setToast({ type: 'error', msg: erroData });
        return; // NÃO envia ao servidor
      }
    }

    setIsLoading(true);
    setToast(null);
    setErrosValidacao(null);
    setMensagemValidacao('');

    try {
      const result: UploadResponse = await uploadPlanilha(file, dataVoalle);

      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      setProcessingText('Finalizando importação...');

      setTimeout(() => {
        if (result.status === 'success') {
          setToast({ type: 'success', msg: result.message || 'Arquivo processado com sucesso!' });
          setFile(null); setDataVoalle(''); setDataVoalleErro('');
        } else if (result.status === 'duplicate') {
          setToast({ type: 'warning', msg: result.message || 'Todos os registros já existem no banco.' });
          setFile(null); setDataVoalle(''); setDataVoalleErro('');
        } else if (result.status === 'warning') {
          setToast({ type: 'warning', msg: result.message || 'Importação concluída com alertas.' });
          if (result.detalhes?.errors?.length) {
            setErrosValidacao(result.detalhes.errors);
            setMensagemValidacao(`Importação parcial: ${result.detalhes.success_count ?? 0} OK, ${result.detalhes.error_count ?? 0} com erro.`);
          }
          setFile(null); setDataVoalle(''); setDataVoalleErro('');
        } else {
          setToast({ type: 'error', msg: result.message || 'Erro ao processar o arquivo.' });
          if (result.detalhes?.errors?.length) {
            setErrosValidacao(result.detalhes.errors);
            setMensagemValidacao('Detalhes dos erros encontrados:');
          }
        }
        setIsLoading(false); setProgress(0);
      }, 800);

    } catch (err: unknown) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      // ═══ SANITIZAÇÃO — nunca mostra SQL ═══
      const { tipo, msg, errosDetalhe } = extrairMensagemErro(err);
      setToast({ type: tipo, msg });

      if (errosDetalhe?.length) {
        setErrosValidacao(errosDetalhe);
        setMensagemValidacao(msg);
      }

      setIsLoading(false); setProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null); setErrosValidacao(null); setMensagemValidacao('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-surface-100 pb-12">
      {/* ── Background ─── */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-8">
        {/* ── Back ─── */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors animate-fade-in">
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </Link>

        {/* ── Header ─── */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">Importar Dados do SAC</h1>
          <p className="text-brand-200 mt-2 text-sm">Envie a planilha CSV ou XLSX para atualizar o banco de dados</p>
        </div>

        {/* ── Upload card ─── */}
        <div className="bg-white rounded-2xl shadow-lg border border-surface-300 overflow-hidden animate-fade-in-up stagger-2">

          {/* Drop zone */}
          <div
            ref={dropZoneRef}
            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}
            onDragOver={handleDragOver} onDrop={handleDrop}
            className={`relative p-10 text-center border-b border-surface-200 transition-all duration-300 ${isDragging ? 'bg-brand-50 border-brand-300' : 'bg-surface-50'}`}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-brand-50/80 flex items-center justify-center z-10 animate-fade-in rounded-t-2xl border-2 border-dashed border-brand-400">
                <div className="text-center">
                  <Upload className="mx-auto text-brand-500 mb-2 animate-gentle-bounce" size={32} />
                  <p className="text-brand-700 font-semibold">Solte o arquivo aqui</p>
                </div>
              </div>
            )}

            <input
              type="file" accept=".csv,.xlsx" ref={fileInputRef}
              onChange={(e) => { setFile(e.target.files?.[0] || null); setErrosValidacao(null); }}
              className="hidden"
            />

            {!file ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-brand-200">
                  <Upload className="text-brand-400" size={24} />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()} disabled={isLoading}
                  className="bg-white border-2 border-surface-300 text-ink-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                >
                  Escolher Arquivo
                </button>
                <p className="text-xs text-ink-300">ou arraste e solte um arquivo .csv ou .xlsx aqui</p>
              </>
            ) : (
              <div className="animate-fade-in-scale">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-surface-200 max-w-sm mx-auto">
                  <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 flex-shrink-0">
                    <FileSpreadsheet className="text-brand-600" size={22} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">{file.name}</p>
                    <p className="text-[11px] text-ink-400">{getFileSize(file.size)}</p>
                  </div>
                  {!isLoading && (
                    <button onClick={removeFile} className="p-1.5 hover:bg-brand-50 rounded-lg transition-colors text-ink-300 hover:text-brand-600">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form body */}
          <div className="p-8">
            {/* Date field */}
            <div className="mb-8 max-w-xs mx-auto">
              <label className="flex items-center gap-2 text-sm font-semibold text-ink-700 mb-2">
                <Calendar size={14} className="text-ink-400" />
                Data do Relatório (Apenas Voalle)
              </label>
              <input
                type="date"
                value={dataVoalle}
                onChange={(e) => handleDataChange(e.target.value)}
                disabled={isLoading}
                max={new Date().toISOString().split('T')[0]}
                min="2020-01-01"
                className={`
                  w-full border-2 rounded-xl px-4 py-2.5 text-sm text-ink-700
                  focus:outline-none focus:ring-2 transition-all duration-200
                  disabled:bg-surface-100 disabled:text-ink-300
                  ${dataVoalleErro
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-surface-300 focus:border-brand-400 focus:ring-brand-100'
                  }
                `}
              />
              {dataVoalleErro ? (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {dataVoalleErro}
                </p>
              ) : (
                <p className="text-[11px] text-ink-300 mt-1.5">
                  Deixe em branco para Omnichannel/Ligações.
                </p>
              )}
            </div>

            {/* ── Painel de erros de validação ─── */}
            {errosValidacao && errosValidacao.length > 0 && (
              <div className="mb-8 max-w-md mx-auto animate-fade-in-up">
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-red-800">
                        {mensagemValidacao || 'Problemas encontrados na planilha'}
                      </p>
                      <p className="text-xs text-red-600 mt-1">Corrija os itens abaixo e tente novamente.</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-red-100 divide-y divide-red-100 max-h-48 overflow-y-auto">
                    {errosValidacao.map((erro, i) => (
                      <div key={i} className="px-4 py-2.5 text-xs text-red-700 flex items-start gap-2">
                        <span className="text-red-400 font-mono flex-shrink-0">•</span>
                        <span>{erro}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(errosValidacao.join('\n'));
                      setToast({ type: 'info', msg: 'Erros copiados para a área de transferência.' });
                    }}
                    className="mt-3 flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Copy size={12} /> Copiar erros
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleUpload}
              disabled={!file || isLoading || !!dataVoalleErro}
              className={`
                w-full max-w-xs mx-auto flex items-center justify-center gap-2
                px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-200
                disabled:cursor-not-allowed
                ${!file || isLoading || dataVoalleErro
                  ? 'bg-surface-200 text-ink-300'
                  : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.97] shadow-lg shadow-brand-600/25'
                }
              `}
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin-slow" /> Processando...</>
              ) : (
                <><Upload size={18} /> Enviar para o Banco de Dados</>
              )}
            </button>

            {/* Progress */}
            {isLoading && (
              <div className="mt-8 max-w-xs mx-auto animate-fade-in-up">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-ink-500">{processingText}</span>
                  <span className="text-xs font-bold text-brand-600">{progress}%</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-brand-600 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                      style={{ animation: 'shimmer 1.5s ease-in-out infinite' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <StepIndicator active={progress >= 5} done={progress >= 30} label="Envio" />
                  <div className="flex-1 h-px bg-surface-200 mx-1" />
                  <StepIndicator active={progress >= 30} done={progress >= 60} label="Validação" />
                  <div className="flex-1 h-px bg-surface-200 mx-1" />
                  <StepIndicator active={progress >= 60} done={progress >= 100} label="Banco" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}
    </div>
  );
};

/* ─── Sub-component ─── */

const StepIndicator = ({ active, done, label }: { active: boolean; done: boolean; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
      done ? 'bg-brand-600 text-white scale-100' : active ? 'bg-brand-100 text-brand-600 scale-110' : 'bg-surface-200 text-ink-300'
    }`}>
      {done ? <CheckCircle2 size={12} /> : <div className={`w-2 h-2 rounded-full ${active ? 'bg-brand-500 animate-pulse' : 'bg-ink-200'}`} />}
    </div>
    <span className={`text-[10px] font-medium ${done || active ? 'text-brand-600' : 'text-ink-300'}`}>{label}</span>
  </div>
);
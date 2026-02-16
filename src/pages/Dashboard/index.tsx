import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Phone, 
  Clock, 
  Smile, 
  Zap, 
  TrendingUp, 
  Activity, 
  Download, 
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  Menu
} from 'lucide-react';

import { StatCard } from '../../components/cards/StatCard';
import { RankingTable } from '../../components/tables/RankingTable';
import { CanaisChart } from '../../components/charts/CanaisChart';
import { useDashboardData } from '../../hooks/useDashboardData';
import { 
  formatarTempo, 
  formatarPercentual, 
  formatarNumero,
  getCorSLA
} from '../../utils/formatters';

export const Dashboard = () => {
  const { metricas, loading, error } = useDashboardData();

  const renderStatusBadge = (percentual: number) => {
    if (percentual >= 95) return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 mr-1" /> Excelente
      </span>
    );
    if (percentual >= 85) return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        <Activity className="w-3 h-3 mr-1" /> Bom
      </span>
    );
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
        <AlertCircle className="w-3 h-3 mr-1" /> Atenção
      </span>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 w-full">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-slate-100 text-center mx-4">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Falha ao carregar dados</h3>
          <p className="text-slate-500 mb-6">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition duration-200"
          >
            <RefreshCcw size={16} className="mr-2" /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 w-full overflow-x-hidden">
      
      {/* Background Decorativo Superior (Full Width) */}
      <div className="absolute top-0 left-0 w-full h-64 bg-slate-900 z-0 shadow-xl" />

      {/* Container Principal Fluido */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Header Responsivo */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 text-white gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard SAC</h1>
            <p className="text-slate-300 mt-2 flex items-center gap-2 text-sm sm:text-base">
              <Activity size={18} className="text-emerald-400" />
              Monitoramento em tempo real de KPIs e Performance
            </p>
          </div>
          
          <Link 
            to="/upload"
            className="inline-flex items-center justify-center px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-indigo-900/40 border border-indigo-400/20 backdrop-blur-sm w-full md:w-auto"
          >
            <Download size={18} className="mr-2" />
            Importar Dados
          </Link>
        </header>

        {/* 1. KPIs Principais - Grade Fluida */}
        {/* grid-cols-1 (mobile) -> grid-cols-2 (tablet) -> grid-cols-4 (desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard 
            title="Total de Atendimentos" 
            value={loading ? '...' : formatarNumero(metricas?.totalAtendimentos || 0)}
            icon={<Phone className="text-indigo-600" size={24} />} 
            subtitle="Volume total acumulado"
            loading={loading}
          />
          
          <StatCard 
            title="SLA Cumprido" 
            value={loading ? '...' : formatarPercentual(metricas?.slaPercentual || 0)}
            icon={<Clock className={metricas ? getCorSLA(metricas.slaPercentual) : 'text-slate-400'} size={24} />}
            subtitle="Meta Operacional: ≥ 95%"
            valueColor={metricas ? getCorSLA(metricas.slaPercentual) : 'text-slate-900'}
            loading={loading}
          />
          
          <StatCard 
            title="TMA Geral" 
            value={loading ? '...' : formatarTempo(metricas?.tempoMedioAtendimentoSegundos || 0)}
            icon={<BarChart3 className="text-slate-600" size={24} />}
            subtitle="Tempo Médio de Atendimento"
            loading={loading}
          />
          
          <StatCard 
            title="Satisfação (CSAT)" 
            value={loading ? '...' : formatarPercentual(metricas?.taxaSatisfacao || 0)}
            icon={<Smile className="text-emerald-500" size={24} />}
            subtitle="Avaliação dos clientes"
            valueColor={metricas?.taxaSatisfacao && metricas.taxaSatisfacao >= 90 ? 'text-emerald-600' : 'text-slate-900'}
            loading={loading}
          />
        </div>

        {/* 2. Segunda Linha: Métricas de Apoio */}
        {/* Adaptável: 1 col (mob), 2 cols (tab), 3 cols (desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Card: Tempo de Resposta */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tempo 1ª Resposta</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? '...' : formatarTempo(metricas?.tempoMedioRespostaSegundos || 0)}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Zap size={24} />
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full w-[70%] animate-pulse"></div>
              </div>
              <p className="text-xs text-slate-400 mt-2 flex justify-between">
                <span>Média 24h</span>
                <span>Estável</span>
              </p>
            </div>
          </div>

          {/* Card: Volume do Dia */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Volume do Dia</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {loading ? '...' : formatarNumero(metricas?.totalAtendimentos || 0)}
                </h3>
              </div>
              <div className="p-3 bg-violet-50 rounded-xl text-violet-600">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="mt-6 flex items-center text-sm bg-violet-50/50 p-2 rounded-lg">
              <span className="text-emerald-600 font-bold flex items-center mr-2">
                <TrendingUp size={16} className="mr-1" /> Ativo
              </span>
              <span className="text-slate-600">Monitoramento contínuo</span>
            </div>
          </div>

          {/* Card: Status Geral (Expandido em Tablet) */}
          <div className="bg-gradient-to-br from-indigo-600 to-slate-900 rounded-xl p-6 shadow-lg text-white flex flex-col justify-between md:col-span-2 xl:col-span-1 transform transition-all hover:scale-[1.01]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Saúde da Operação</p>
                <h3 className="text-3xl font-bold mt-2">
                  {loading ? '...' : metricas && metricas.slaPercentual >= 95 ? 'Excelente' : 
                   metricas && metricas.slaPercentual >= 85 ? 'Estável' : 'Atenção'}
                </h3>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                <Activity size={24} />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-500/30 flex items-center justify-between">
              <span className="text-indigo-200 text-sm font-medium">Meta SLA: 95%</span>
              {metricas && renderStatusBadge(metricas.slaPercentual)}
            </div>
          </div>
        </div>

        {/* 3. Área de Gráficos e Resumo */}
        {/* Em telas grandes (xl), gráfico ocupa 2 colunas e resumo 1. Em menores, empilha. */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Gráfico */}
          <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="text-slate-400" size={20} />
                Volume por Canal
              </h3>
            </div>
            {/* Altura dinâmica para garantir que o gráfico preencha o espaço */}
            <div className="flex-1 w-full min-h-[350px]">
               <CanaisChart dados={metricas?.atendimentosPorCanal || []} />
            </div>
          </div>
          
          {/* Resumo Executivo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="text-slate-400" size={20} />
              Resumo Executivo
            </h3>
            
            <div className="flex flex-col h-[calc(100%-3rem)] justify-center space-y-8">
              {/* Item SLA */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">SLA Global</span>
                  <span className={`text-base font-bold ${metricas ? getCorSLA(metricas.slaPercentual) : 'text-slate-900'}`}>
                    {formatarPercentual(metricas?.slaPercentual || 0)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${metricas && metricas.slaPercentual >= 95 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(metricas?.slaPercentual || 0, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Item CSAT */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">CSAT (Satisfação)</span>
                  <span className="text-base font-bold text-emerald-600">
                    {formatarPercentual(metricas?.taxaSatisfacao || 0)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${Math.min(metricas?.taxaSatisfacao || 0, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Dados Extras */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <span className="text-xs text-slate-500 uppercase block mb-1">Volume</span>
                  <span className="font-bold text-slate-900 text-lg">{formatarNumero(metricas?.totalAtendimentos || 0)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <span className="text-xs text-slate-500 uppercase block mb-1">TMA</span>
                  <span className="font-bold text-slate-900 text-lg">{formatarTempo(metricas?.tempoMedioAtendimentoSegundos || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Ranking - Full Width */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Menu size={20} className="text-slate-400"/> Performance por Colaborador
            </h3>
            <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm">
              🏆 Top Performers
            </span>
          </div>
          <div className="overflow-x-auto">
            {/* A tabela expande para ocupar 100% do container pai */}
            <div className="min-w-full inline-block align-middle">
               <RankingTable colaboradores={metricas?.rankingColaboradores || []} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
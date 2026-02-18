import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, Phone, Clock, Zap, TrendingUp, Activity,
  Download, AlertCircle, CheckCircle2, RefreshCcw, PhoneMissed,
  MessageSquare, Star
} from 'lucide-react';

import { StatCard } from '../../components/cards/StatCard';
import { RankingTable } from '../../components/tables/RankingTable';
import { CanaisChart } from '../../components/charts/CanaisChart';
import { useDashboardData, Turno } from '../../hooks/useDashboardData';
import { formatarTempo, formatarPercentual, formatarNumero, getCorSLA } from '../../utils/formatters';

const TURNOS: { label: string; value: Turno }[] = [
  { label: 'Todos', value: null },
  { label: '🌙 Madrugada', value: 'Madrugada' },
  { label: '🌅 Manhã', value: 'Manhã' },
  { label: '☀️ Tarde', value: 'Tarde' },
  { label: '🌆 Noite', value: 'Noite' },
];

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

export const Dashboard = () => {
  const [turnoSelecionado, setTurnoSelecionado] = useState<Turno>(null);

  const { metricas, ranking, loading, error, refetch } = useDashboardData(
    undefined,
    undefined,
    turnoSelecionado
  );

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
            onClick={() => refetch()}
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

      {/* Background decorativo */}
      <div className="absolute top-0 left-0 w-full h-64 bg-slate-900 z-0 shadow-xl" />

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-6 text-white gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard SAC</h1>
            <p className="text-slate-300 mt-2 flex items-center gap-2 text-sm sm:text-base">
              <Activity size={18} className="text-emerald-400" />
              Monitoramento em tempo real de KPIs e Performance
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center justify-center px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-indigo-900/40 border border-indigo-400/20 w-full md:w-auto"
          >
            <Download size={18} className="mr-2" />
            Importar Dados
          </Link>
        </header>

        {/* Filtro de Turno */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TURNOS.map((t) => (
            <button
              key={String(t.value)}
              onClick={() => setTurnoSelecionado(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                turnoSelecionado === t.value
                  ? 'bg-white text-slate-900 border-white shadow-md'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 1. KPIs Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total de Atendimentos"
            value={loading ? '...' : formatarNumero(metricas?.totalAtendimentos ?? 0)}
            icon={<Phone className="text-indigo-600" size={24} />}
            subtitle="Ligações atendidas + Omnichannel"
            loading={loading}
          />
          <StatCard
            title="Ligações Perdidas"
            value={loading ? '...' : formatarNumero(metricas?.totalPerdidas ?? 0)}
            icon={<PhoneMissed className="text-rose-500" size={24} />}
            subtitle={`Taxa de abandono: ${formatarPercentual(metricas?.taxaAbandono ?? 0)}`}
            valueColor={metricas && metricas.totalPerdidas > 0 ? 'text-rose-600' : 'text-slate-900'}
            loading={loading}
          />
          <StatCard
            title="SLA Cumprido"
            value={loading ? '...' : formatarPercentual(metricas?.slaPercentual ?? 0)}
            icon={<Clock className={metricas ? getCorSLA(metricas.slaPercentual) : 'text-slate-400'} size={24} />}
            subtitle="Meta operacional: ≥ 95%"
            valueColor={metricas ? getCorSLA(metricas.slaPercentual) : 'text-slate-900'}
            loading={loading}
          />
          <StatCard
            title="Saúde da Operação"
            value={loading ? '...' :
              metricas && metricas.slaPercentual >= 95 ? 'Excelente' :
              metricas && metricas.slaPercentual >= 85 ? 'Estável' : 'Atenção'
            }
            icon={<Activity className="text-emerald-500" size={24} />}
            subtitle={`SLA: ${formatarPercentual(metricas?.slaPercentual ?? 0)}`}
            valueColor={
              metricas && metricas.slaPercentual >= 95 ? 'text-emerald-600' :
              metricas && metricas.slaPercentual >= 85 ? 'text-blue-600' : 'text-amber-600'
            }
            loading={loading}
          />
        </div>

        {/* 2. KPIs por Canal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Ligação */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Phone className="text-indigo-600" size={18} />
              </div>
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Ligação</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">TME</span>
                <span className="font-semibold text-slate-900">
                  {loading ? '...' : formatarTempo(metricas?.tmeLigacaoSegundos ?? 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Nota Média</span>
                <span className={`font-bold text-lg ${
                  (metricas?.notaMediaLigacao ?? 0) >= 4.5 ? 'text-emerald-600' :
                  (metricas?.notaMediaLigacao ?? 0) >= 3.5 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {loading ? '...' : (metricas?.notaMediaLigacao ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Omnichannel */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <MessageSquare className="text-emerald-600" size={18} />
              </div>
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Omnichannel</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">TME</span>
                <span className="font-semibold text-slate-900">
                  {loading ? '...' : formatarTempo(metricas?.tmeOmniSegundos ?? 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Nota Média</span>
                <span className={`font-bold text-lg ${
                  (metricas?.notaMediaOmni ?? 0) >= 4.5 ? 'text-emerald-600' :
                  (metricas?.notaMediaOmni ?? 0) >= 3.5 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {loading ? '...' : (metricas?.notaMediaOmni ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Resumo SLA */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Zap className="text-slate-600" size={18} />
              </div>
              <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">SLA Global</span>
            </div>
            <div className="space-y-3">
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    (metricas?.slaPercentual ?? 0) >= 95 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(metricas?.slaPercentual ?? 0, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Meta: 95%</span>
                <span className="font-semibold">{formatarPercentual(metricas?.slaPercentual ?? 0)}</span>
              </div>
            </div>
          </div>

          {/* Nota Geral */}
          <div className="bg-gradient-to-br from-indigo-600 to-slate-900 rounded-xl p-6 shadow-lg text-white hover:scale-[1.01] transition-all">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Star size={18} />
              </div>
              <span className="text-sm font-semibold text-indigo-200 uppercase tracking-wider">Nota Geral</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-indigo-300">Ligação</span>
                <span className="font-semibold">{loading ? '...' : (metricas?.notaMediaLigacao ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-indigo-300">Omnichannel</span>
                <span className="font-semibold">{loading ? '...' : (metricas?.notaMediaOmni ?? 0).toFixed(2)}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-indigo-500/30 flex justify-between items-center">
                <span className="text-xs text-indigo-200">Status</span>
                {metricas && renderStatusBadge(metricas.slaPercentual)}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Gráficos */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="text-slate-400" size={20} />
                Volume por Canal
              </h3>
            </div>
            <div className="flex-1 w-full min-h-[350px]">
              <CanaisChart dados={metricas?.atendimentosPorCanal ?? []} />
            </div>
          </div>

          {/* Resumo Executivo */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="text-slate-400" size={20} />
              Resumo Executivo
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">SLA Global</span>
                  <span className={`text-base font-bold ${metricas ? getCorSLA(metricas.slaPercentual) : 'text-slate-900'}`}>
                    {formatarPercentual(metricas?.slaPercentual ?? 0)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${metricas && metricas.slaPercentual >= 95 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(metricas?.slaPercentual ?? 0, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600">Taxa de Abandono</span>
                  <span className={`text-base font-bold ${(metricas?.taxaAbandono ?? 0) > 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatarPercentual(metricas?.taxaAbandono ?? 0)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-rose-400 transition-all duration-1000"
                    style={{ width: `${Math.min(metricas?.taxaAbandono ?? 0, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 p-3 rounded-lg text-center">
                  <span className="text-xs text-indigo-500 uppercase block mb-1">TME Ligação</span>
                  <span className="font-bold text-slate-900">{formatarTempo(metricas?.tmeLigacaoSegundos ?? 0)}</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg text-center">
                  <span className="text-xs text-emerald-500 uppercase block mb-1">TME Omni</span>
                  <span className="font-bold text-slate-900">{formatarTempo(metricas?.tmeOmniSegundos ?? 0)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg text-center">
                  <span className="text-xs text-slate-500 uppercase block mb-1">Atendidos</span>
                  <span className="font-bold text-slate-900">{formatarNumero(metricas?.totalAtendimentos ?? 0)}</span>
                </div>
                <div className="bg-rose-50 p-3 rounded-lg text-center">
                  <span className="text-xs text-rose-500 uppercase block mb-1">Perdidas</span>
                  <span className="font-bold text-slate-900">{formatarNumero(metricas?.totalPerdidas ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Ranking */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-slate-400" />
                Performance por Colaborador
              </h3>
              {turnoSelecionado && (
                <p className="text-xs text-slate-500 mt-1">
                  Filtrando por turno: <span className="font-semibold">{turnoSelecionado}</span>
                </p>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm">
              🏆 Ranking por Nota Final
            </span>
          </div>
          <div className="overflow-x-auto">
            <RankingTable colaboradores={ranking} loading={loading} />
          </div>
        </div>

      </div>
    </div>
  );
};